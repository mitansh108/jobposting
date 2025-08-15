'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, resendConfirmation, getCurrentUserProfile } from '@/lib/auth';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

export default function Login() {
    const [userType, setUserType] = useState<'jobseeker' | 'recruiter'>('jobseeker');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResendConfirmation, setShowResendConfirmation] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await signIn(email, password);

            if (error) {
                const errorMessage = (error as any)?.message || 'An error occurred during login';
                setError(errorMessage);

                // Show resend confirmation option if email not confirmed
                if (errorMessage.includes('Email not confirmed') || errorMessage.includes('check your email')) {
                    setShowResendConfirmation(true);
                }
                return;
            }

            if (data?.user) {
                // Get user profile to determine redirect
                const { data: profile } = await getCurrentUserProfile();
                if (profile?.user_type === 'recruiter') {
                    router.push('/recruiter-dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        setLoading(true);
        const { error } = await resendConfirmation(email);

        if (error) {
            setError('Failed to resend confirmation email');
        } else {
            setError(null);
            setShowResendConfirmation(false);
            alert('Confirmation email sent! Please check your inbox.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-16">
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
                        {userType === 'recruiter' ? 'Welcome Back, Recruiter!' : 'Welcome Back!'}
                    </h2>
                    <p className="text-indigo-100 text-xl leading-relaxed">
                        {userType === 'recruiter'
                            ? 'Find the perfect candidates for your team and grow your company with top talent.'
                            : 'Connect with opportunities and take the next step in your career journey.'
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
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up here
                            </Link>
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                    {showResendConfirmation && (
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                onClick={handleResendConfirmation}
                                                className="text-indigo-600 hover:text-indigo-500 underline text-sm"
                                                disabled={loading}
                                            >
                                                Resend confirmation email
                                            </button>
                                        </div>
                                    )}
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
                                        className={`p-3 rounded-lg border-2 transition-all text-sm ${userType === 'jobseeker'
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
                                        className={`p-3 rounded-lg border-2 transition-all text-sm ${userType === 'recruiter'
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your password"
                                />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </div>
                                    ) : (
                                        `Sign in as ${userType === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}`
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Social Login Options */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="ml-2">Google</span>
                                </button>

                                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="ml-2">Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </div>
    );
}