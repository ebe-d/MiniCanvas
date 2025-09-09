'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import { useAuth } from './AuthContext';
import {
  Palette,
  LogOut,
  User,
  Home,
  Plus,
  Users,
  Settings,
  Menu,
  X
} from 'lucide-react';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  const isAuthenticated = !!user;
  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const isHomePage = pathname === '/';

  // Don't show navigation on auth pages
  if (isAuthPage) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    ...(isAuthenticated ? [
      { href: '/rooms', label: 'Rooms', icon: Users },
    ] : [])
  ];

  return (
    <nav className="bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MiniCanvas</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-400 bg-indigo-500/10'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-neutral-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-neutral-300 hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-400 bg-indigo-500/10'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-neutral-800 mt-4 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2 text-neutral-300">
                      <User className="w-5 h-5" />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 w-full text-left text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 bg-gradient-primary text-white rounded-md transition-colors"
                    >
                      <span>Get Started</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}