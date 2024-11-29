import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dog, Heart, Calendar, Activity, Shield, ChevronRight, Facebook, Twitter, Instagram, ArrowRight, Brain, Save, Sparkles, DollarSign, PieChart, Wallet, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Dog className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">PetPal</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#features" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Features</a>
                <a href="#ai-analysis" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">AI Analysis</a>
                <a href="#expense-tracking" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Expense Tracking</a>
                <a href="#contact" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Contact</a>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Log in</Link>
              <Link to="/signup" className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg">Sign up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        <div className="mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                AI-Powered Pet Care & Finance Management
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
                Transform your pet care with advanced AI behavior analysis, smart health tracking, comprehensive activity monitoring, and intelligent expense management.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link to="/signup" className="inline-flex px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600">
                  Get Started
                </Link>
                <a href="#ai-analysis" className="inline-flex px-6 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-50">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative mt-12">
              <div className="relative mx-auto max-w-4xl">
                <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80"
                  alt="Pet care dashboard"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div id="ai-analysis" className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-blue-500 mr-2" />
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Advanced AI Behavior Analysis</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Powered by OpenAI and Google's Gemini AI for comprehensive pet behavior understanding
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white mb-4">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">AI Behavior Analysis</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get expert insights into your pet's behavior patterns with advanced AI analysis.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white mb-4">
                  <Image className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">AI Image Analysis</h3>
                <p className="mt-2 text-base text-gray-500">
                  Upload images for enhanced behavior analysis and visual insights.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white mb-4">
                  <Save className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Save Analysis History</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track behavior changes over time with saved analysis records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Tracking Section */}
      <div id="expense-tracking" className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-green-500 mr-2" />
              <PieChart className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Smart Expense Management</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Track, analyze, and optimize your pet care expenses with intelligent budgeting tools
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white mb-4">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Expense Tracking</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track all pet-related expenses including food, medical care, grooming, and more.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white mb-4">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Budget Management</h3>
                <p className="mt-2 text-base text-gray-500">
                  Set and monitor budgets for different expense categories with smart alerts.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white mb-4">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Expense Analytics</h3>
                <p className="mt-2 text-base text-gray-500">
                  Visualize spending patterns and trends with detailed analytics and reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Complete Pet Care Solution</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to provide the best care for your beloved pets.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Health Management</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track vaccinations, vet visits, and medical records effortlessly.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Routine Scheduling</h3>
                <p className="mt-2 text-base text-gray-500">
                  Set up feeding times, walks, and grooming sessions with reminders.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Activity Logging</h3>
                <p className="mt-2 text-base text-gray-500">
                  Monitor your pet's activities and behavior changes over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-100">Experience AI-powered pet care today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-lg shadow">
              <Link to="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50">
                Get started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#about" className="text-base text-gray-500 hover:text-gray-900">About</a>
                </li>
                <li>
                  <a href="#blog" className="text-base text-gray-500 hover:text-gray-900">Blog</a>
                </li>
                <li>
                  <a href="#careers" className="text-base text-gray-500 hover:text-gray-900">Careers</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#help" className="text-base text-gray-500 hover:text-gray-900">Help Center</a>
                </li>
                <li>
                  <a href="#privacy" className="text-base text-gray-500 hover:text-gray-900">Privacy</a>
                </li>
                <li>
                  <a href="#terms" className="text-base text-gray-500 hover:text-gray-900">Terms</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#facebook" className="text-base text-gray-500 hover:text-gray-900 flex items-center">
                    <Facebook className="w-5 h-5 mr-2" /> Facebook
                  </a>
                </li>
                <li>
                  <a href="#instagram" className="text-base text-gray-500 hover:text-gray-900 flex items-center">
                    <Instagram className="w-5 h-5 mr-2" /> Instagram
                  </a>
                </li>
                <li>
                  <a href="#twitter" className="text-base text-gray-500 hover:text-gray-900 flex items-center">
                    <Twitter className="w-5 h-5 mr-2" /> Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="mailto:support@petpal.com" className="text-base text-gray-500 hover:text-gray-900">
                    support@petpal.com
                  </a>
                </li>
                <li>
                  <span className="text-base text-gray-500">
                    1234 Pet Street<br />
                    San Francisco, CA 94105
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              © 2024 PetPal. All rights reserved | Powered by OpenAI & Gemini AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}