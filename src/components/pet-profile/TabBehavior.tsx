import React, { useState } from 'react';
import { Brain, Send, AlertCircle, ExternalLink, Clock, Save, ChevronDown, ChevronUp, Upload, X, Image } from 'lucide-react';
import { analyzePetBehavior } from '../../lib/ai';
import { useBehavior } from '../../contexts/BehaviorContext';
import { usePets } from '../../contexts/PetContext';
import { useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

interface AnalysisAccordionProps {
  analysis: {
    id: string;
    behavior: string;
    context: string;
    analysis: string;
    createdAt: string;
    imageUrl?: string;
  };
}

function AnalysisAccordion({ analysis }: AnalysisAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncate = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">{truncate(analysis.behavior)}</p>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {format(parseISO(analysis.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h6 className="text-sm font-medium text-gray-700 mb-2">Behavior Description</h6>
            <p className="text-gray-600 text-sm whitespace-pre-line">{analysis.behavior}</p>
          </div>

          {analysis.imageUrl && (
            <div className="mt-4">
              <h6 className="text-sm font-medium text-gray-700 mb-2">Behavior Image</h6>
              <img 
                src={analysis.imageUrl} 
                alt="Pet behavior" 
                className="rounded-lg max-h-64 object-cover"
              />
            </div>
          )}

          {analysis.context && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h6 className="text-sm font-medium text-gray-700 mb-2">Additional Context</h6>
              <p className="text-gray-600 text-sm whitespace-pre-line">{analysis.context}</p>
            </div>
          )}

          <div className="prose prose-blue max-w-none">
            <h6 className="text-sm font-medium text-gray-700 mb-2">Analysis</h6>
            <p className="text-gray-600 text-sm whitespace-pre-line">{analysis.analysis}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function TabBehavior() {
  const { id: petId } = useParams();
  const { getPet } = usePets();
  const { addAnalysis, getAnalysesForPet } = useBehavior();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [behavior, setBehavior] = useState('');
  const [context, setContext] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const pet = petId ? getPet(petId) : null;
  const analyses = petId ? getAnalysesForPet(petId) : [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId || !pet) {
      setError('Pet information not found');
      return;
    }

    if (!behavior.trim()) {
      setError('Please provide a behavior description');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const result = await analyzePetBehavior(pet, behavior, context, imageFile);
      setCurrentAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!petId || !currentAnalysis) return;

    try {
      setSaving(true);
      await addAnalysis(petId, {
        behavior,
        context,
        analysis: currentAnalysis,
        imageUrl: imagePreview
      });

      // Clear form after successful save
      setBehavior('');
      setContext('');
      setCurrentAnalysis(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError('Failed to save analysis. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!pet) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Pet information not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Introduction Section */}
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">AI Behavior Analysis for {pet.name}</h3>
        </div>
        <p className="text-gray-600">
          Describe your pet's behavior and get insights from our AI assistant. The more details you provide,
          the more accurate the analysis will be.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Note: This analysis is for informational purposes only and should not replace professional veterinary advice.
          </p>
        </div>
      </div>

      {/* Analysis Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behavior Description *
          </label>
          <textarea
            value={behavior}
            onChange={(e) => setBehavior(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Provide specifics about what ${pet.name} is doing. Include details such as the frequency, time of occurrence, and any environmental triggers.`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Context
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share if there have been recent changes, like:
• A new pet, person, or routine
• Changes in diet, environment, or schedule
• Any other relevant information"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image (optional)
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Upload image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            <div className="text-sm text-gray-500">
              <p>Supported formats: JPG, PNG</p>
              <p>Max file size: 5MB</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !behavior.trim()}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Get Analysis
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center text-red-700 mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
          <p className="text-sm text-red-600">
            In the meantime, consider consulting with a veterinary professional for immediate assistance.
            You can find a qualified veterinarian through:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-red-600">
            <li className="flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              <a
                href="https://www.avma.org/resources-tools/pet-owners/yourvet/finding-veterinarian"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                American Veterinary Medical Association
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Current Analysis */}
      {currentAnalysis && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <h5 className="font-medium text-gray-900">Current Analysis</h5>
            </div>
            <button
              onClick={handleSaveAnalysis}
              disabled={saving}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Analysis
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h6 className="text-sm font-medium text-gray-700 mb-2">Behavior Description</h6>
            <p className="text-gray-600 text-sm whitespace-pre-line">{behavior}</p>
          </div>

          {imagePreview && (
            <div className="mt-4">
              <h6 className="text-sm font-medium text-gray-700 mb-2">Behavior Image</h6>
              <img 
                src={imagePreview} 
                alt="Pet behavior" 
                className="rounded-lg max-h-64 object-cover"
              />
            </div>
          )}

          {context && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h6 className="text-sm font-medium text-gray-700 mb-2">Additional Context</h6>
              <p className="text-gray-600 text-sm whitespace-pre-line">{context}</p>
            </div>
          )}

          <div className="prose prose-blue max-w-none">
            <h6 className="text-sm font-medium text-gray-700 mb-2">Analysis</h6>
            <p className="text-gray-600 text-sm whitespace-pre-line">{currentAnalysis}</p>
          </div>
        </div>
      )}

      {/* Previous Analyses */}
      {analyses.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Saved Analyses</h4>
          <div className="space-y-2">
            {analyses.map((analysis) => (
              <AnalysisAccordion key={analysis.id} analysis={analysis} />
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-medium text-gray-900 mb-4">Tips for Better Analysis</h4>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Be specific about behaviors you observe
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Include timing and frequency of behaviors
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Mention any recent changes in environment or routine
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Describe any patterns you've noticed
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Add clear images of the behavior when possible
          </li>
        </ul>
      </div>
    </div>
  );
}