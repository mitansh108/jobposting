'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function CompleteProfile() {
  const [userType, setUserType] = useState<'jobseeker' | 'recruiter'>('jobseeker');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // First get the authenticated user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          router.push('/login');
          return;
        }

        // Try to get existing profile
        const { data: profile } = await getCurrentUserProfile();
        
        if (profile) {
          setUser(profile);
          // If user already has a type, redirect them
          if (profile.user_type) {
            if (profile.user_type === 'recruiter') {
              router.push('/recruiter-dashboard');
            } else {
              router.push('/dashboard');
            }
          }
        } else {
          // No profile exists, create one for Google OAuth users
          const { error } = await supabase
            .from('users')
            .insert([
              {
                id: authUser.id,
                email: authUser.email,
                first_name: authUser.user_metadata?.full_name?.split(' ')[0] || authUser.user_metadata?.name?.split(' ')[0] || '',
                last_name: authUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || authUser.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
              }
            ]);

          if (error) {
            console.error('Profile creation error:', error);
            // If there's a unique constraint error, the user might already exist
            if (!error.message.includes('duplicate key')) {
              alert('Error creating profile. Please try again.');
              return;
            }
          }

          // Set the user data for the form
          setUser({
            id: authUser.id,
            email: authUser.email,
            first_name: authUser.user_metadata?.full_name?.split(' ')[0] || authUser.user_metadata?.name?.split(' ')[0] || '',
            last_name: authUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || authUser.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
          });
        }
      } catch (error) {
        console.error('Check user error:', error);
        router.push('/login');
      }
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile with selected type
      const { error } = await supabase
        .from('users')
        .update({
          user_type: userType,
          company: userType === 'recruiter' ? company : null,
        })
        .eq('id', user.id);

      if (error) {
        alert('Failed to update profile');
        return;
      }

      // Redirect based on user type
      if (userType === 'recruiter') {
        router.push('/recruiter-dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">🌉 CareerBridge</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">Tell us how you'll be using CareerBridge</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('jobseeker')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    userType === 'jobseeker'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">Job Seeker</div>
                      <div className="text-sm opacity-75">Looking for job opportunities</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('recruiter')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    userType === 'recruiter'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">Recruiter</div>
                      <div className="text-sm opacity-75">Hiring for my company</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {userType === 'recruiter' && (
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  id="company"
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter your company name"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (userType === 'recruiter' && !company)}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing Profile...
                </div>
              ) : (
                'Complete Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}