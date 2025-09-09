'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../components/AuthContext';
import {
  Palette,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const router = useRouter();
  const { user, signUp, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/rooms');
    }
  }, [user, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter, one uppercase letter, and one number');
      return false;
    }
    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    if (formData.name.length > 50) {
      setError('Name must be less than 50 characters long');
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      setError('Name can only contain letters, spaces, hyphens, and apostrophes');
      return false;
    }
    if (formData.email.length > 254) {
      setError('Email address is too long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await signUp(formData.name, formData.email, formData.password);
      setSuccess(true);
      // Redirect will happen automatically due to useEffect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card variant="glass" className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-neutral-300 mb-6">
              Welcome to MiniCanvas! Redirecting you to sign in...
            </p>
            <div className="spinner mx-auto" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MiniCanvas</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-neutral-300">Join the creative community</p>
        </div>

        {/* Sign Up Form */}
        <Card variant="glass" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={<User className="w-4 h-4" />}
              required
              maxLength={50}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon={<Mail className="w-4 h-4" />}
              required
              maxLength={254}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                icon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                icon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-400">
              Already have an account?{' '}
              <Link href="/signin" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        {/* Benefits */}
        <div className="mt-8">
          <Card variant="gradient" className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">What you'll get:</h3>
            </div>
            <ul className="space-y-2 text-neutral-300">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                <span>Unlimited collaborative canvases</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                <span>Real-time collaboration with your team</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                <span>Advanced drawing tools and features</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                <span>Secure private rooms</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}