import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pet } from '../contexts/PetContext';
import { differenceInYears, parseISO } from 'date-fns';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const getPetContext = (pet: Pet) => {
  let context = `Pet Information:
- Species: ${pet.species}
${pet.breed ? `- Breed: ${pet.breed}` : ''}
${pet.color ? `- Color/Markings: ${pet.color}` : ''}`;

  if (pet.dateOfBirth) {
    const age = differenceInYears(new Date(), parseISO(pet.dateOfBirth));
    context += `\n- Age: ${age} years old
- Date of Birth: ${pet.dateOfBirth}`;
  }

  return context;
};

const createPrompt = (pet: Pet, behavior: string, context: string, hasImage: boolean = false) => {
  const petContext = getPetContext(pet);
  
  let prompt = `As a veterinary behavior expert, analyze the following pet behavior considering the pet's specific characteristics. Please provide professional insights, possible causes, and recommendations.

${petContext}

Behavior Description:
${behavior}

Additional Context:
${context}`;

  if (hasImage) {
    prompt += `\n\nI'm also providing an image of the behavior. Please include any relevant observations from the image in your analysis.`;
  }

  prompt += `\n\nPlease provide your analysis in the following format:

Behavior Analysis:
[Your detailed analysis of the behavior, taking into account the pet's species, breed, age, and other characteristics]

Possible Causes:
[List the potential causes, considering breed-specific tendencies and age-related factors]

Recommendations:
[Provide actionable recommendations tailored to this specific pet]

When to Seek Professional Help:
[Specify situations that require veterinary attention]`;

  return prompt;
};

function formatResponse(response: string): string {
  return response
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function analyzeWithOpenAI(pet: Pet, behavior: string, context: string): Promise<string> {
  try {
    const prompt = createPrompt(pet, behavior, context);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional veterinary behavior expert. Provide clear, concise analysis without using markdown formatting or special characters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response received from OpenAI');
    }

    return formatResponse(response.choices[0].message.content);
  } catch (error: any) {
    if (error?.error?.type === 'insufficient_quota') {
      throw new Error('OpenAI service quota exceeded. Trying alternative service...');
    }
    throw new Error(`OpenAI service error: ${error.message || 'Unknown error occurred'}`);
  }
}

async function processImage(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      if (!base64Data) {
        reject(new Error('Failed to process image'));
        return;
      }
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(imageFile);
  });
}

async function analyzeWithGemini(
  pet: Pet,
  behavior: string,
  context: string,
  imageFile: File | null = null
): Promise<string> {
  try {
    const prompt = createPrompt(pet, behavior, context, !!imageFile);
    let model;
    let parts: any[] = [{ text: prompt }];

    if (imageFile) {
      try {
        model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        // Process image
        const base64Data = await processImage(imageFile);
        
        // Add image to parts array
        parts.push({
          inlineData: {
            mimeType: imageFile.type,
            data: base64Data
          }
        });
      } catch (imageError) {
        console.error('Image processing error:', imageError);
        throw new Error('Failed to process the image. Please try again with a different image or without an image.');
      }
    } else {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    // Generate content with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();
        
        if (!text) {
          throw new Error('Empty response received');
        }
        
        return formatResponse(text);
      } catch (error: any) {
        lastError = error;
        attempts++;
        
        // If it's a specific error that we know won't be resolved by retrying
        if (error.message?.includes('Image processing failed') || 
            error.message?.includes('PERMISSION_DENIED')) {
          throw error;
        }
        
        // Wait before retrying
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }

    throw new Error(`Failed after ${maxAttempts} attempts: ${lastError?.message || 'Unknown error'}`);
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error occurred';
    
    // Handle specific error cases
    if (errorMessage.includes('PERMISSION_DENIED')) {
      throw new Error('API key validation failed. Please try again later.');
    }
    if (errorMessage.includes('Image processing failed')) {
      throw new Error('Failed to process the image. Please try a different image or proceed without one.');
    }
    
    throw new Error(`Gemini service error: ${errorMessage}`);
  }
}

export async function analyzePetBehavior(
  pet: Pet,
  behavior: string,
  context: string,
  imageFile: File | null = null
): Promise<string> {
  // Validate inputs
  if (!pet) throw new Error('Pet information is required');
  if (!behavior.trim()) throw new Error('Behavior description is required');
  
  // Validate image if provided
  if (imageFile) {
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image file.');
    }
  }

  let error: Error | null = null;

  // If there's an image, try Gemini first
  if (imageFile) {
    try {
      return await analyzeWithGemini(pet, behavior, context, imageFile);
    } catch (e: any) {
      error = e;
      console.error('Gemini image analysis error:', e);
      
      // If it's a specific error that should be shown to the user
      if (e.message.includes('API key') || 
          e.message.includes('Image processing failed') ||
          e.message.includes('size should be less than')) {
        throw e;
      }
    }
  }

  // Try OpenAI for text analysis
  try {
    return await analyzeWithOpenAI(pet, behavior, context);
  } catch (e: any) {
    error = e;
    console.error('OpenAI error:', e);

    // If OpenAI fails, try Gemini as fallback (without image)
    try {
      return await analyzeWithGemini(pet, behavior, context);
    } catch (geminiError: any) {
      console.error('Gemini fallback error:', geminiError);
      
      // If both services fail, throw a user-friendly error
      throw new Error(
        'We are currently experiencing technical difficulties with our AI analysis service. ' +
        'Please try again in a few moments. If the problem persists, consider the following:\n\n' +
        '1. Try a shorter, more focused behavior description\n' +
        '2. Remove any special characters or formatting\n' +
        '3. If using an image, ensure it is clear and under 5MB\n\n' +
        'For immediate assistance with urgent behavioral concerns, please consult your veterinarian.'
      );
    }
  }
}