import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzePetBehavior(behavior: string, context: string): Promise<string> {
  try {
    const prompt = `As a veterinary behavior expert, analyze the following pet behavior and provide professional insights, possible causes, and recommendations. Please format your response in clear sections.

Behavior Description:
${behavior}

Additional Context:
${context}

Please provide:
1. Behavior Analysis
2. Possible Causes
3. Recommendations
4. When to Seek Professional Help (if applicable)`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional veterinary behavior expert with extensive experience in pet behavior analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || 'No analysis available';
  } catch (error: any) {
    console.error('Error analyzing pet behavior:', error);
    
    if (error?.error?.type === 'insufficient_quota') {
      throw new Error('The AI service is currently unavailable. Please try again later or contact support for assistance.');
    }
    
    throw new Error('Failed to analyze pet behavior. Please try again later.');
  }
}