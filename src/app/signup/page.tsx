'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';

export default function Signup() {
  const [userType, setUserType] = useState<'jobseeker' | 'recruiter'>('jobseeker');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (userType === 'recruiter' && !formData.company.trim()) {
      setError('Company name is required for recruiters');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp({
        email: formData.email,
        password: formData.password,
        user_type: userType,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: userType === 'recruiter' ? formData.company : undefined,
      });

      if (error) {
        const errorMessage = (error as any)?.message || 'An error occurred during signup';
        setError(errorMessage);
        return;
      }

      setSuccess(true);
      // Don't redirect immediately - user needs to confirm email first

    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-purple-600 to-indigo-700 items-center justify-center p-16">
        <div className="max-w-2xl text-center">
          {userType === 'recruiter' ? (
            // Recruiter Image
            <div className="mb-8">
              <div className="relative w-[500px] h-[500px] mx-auto mb-8">
                <Image
                  src="/woman-doing-job-vacancies-marketing-13293068-10845245.webp"
                  alt="Woman doing job vacancies marketing"
                  fill
                  className="object-contain rounded-2xl"
                />
              </div>
            </div>
          ) : (
            // Job Seeker Image
            <div className="mb-8">
              <div className="relative w-[500px] h-[500px] mx-auto mb-8">
                <Image
                  src="/employment-provide-company-2161931-1816237.png"
                  alt="Employment and job opportunities"
                  fill
                  className="object-contain rounded-2xl"
                />
              </div>
            </div>
          )}
          
          <h2 className="text-4xl font-bold text-white mb-6">
            {userType === 'recruiter' ? 'Start Hiring Today!' : 'Start Your Journey!'}
          </h2>
          <p className="text-purple-100 text-xl leading-relaxed">
            {userType === 'recruiter' 
              ? 'Join thousands of companies who have found their perfect candidates through CareerBridge.'
              : 'Join thousands of professionals who have found their dream careers through CareerBridge.'
            }
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white">
        <div className="max-w-sm w-full space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-indigo-600">CareerBridge</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                <div className="font-medium mb-1">Account created successfully!</div>
                <div>Please check your email and click the confirmation link to activate your account.</div>
                <div className="mt-2">
                  <Link href="/login" className="text-indigo-600 hover:text-indigo-500 underline">
                    Go to login page
                  </Link>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUserType('jobseeker')}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    userType === 'jobseeker'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-6 h-6 mx-auto mb-1 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="font-medium text-sm">Job Seeker</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('recruiter')}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    userType === 'recruiter'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-6 h-6 mx-auto mb-1 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="font-medium text-sm">Recruiter</div>
                </button>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Conditional Fields Based on User Type */}
            {userType === 'recruiter' && (
              <>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company name
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your company name"
                  />
                </div>
              </>
            )}

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  `Create ${userType === 'jobseeker' ? 'Job Seeker' : 'Recruiter'} Account`
                )}
              </button>
            </div>
          </form>


          </div>
        </div>
      </div>
    </div>
  );
}