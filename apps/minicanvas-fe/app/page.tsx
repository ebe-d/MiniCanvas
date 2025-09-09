'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Palette,
  Users,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Brush,
  MousePointer,
  Type,
  Eraser,
  Hand,
  RotateCcw,
  Monitor,
  Smartphone
} from 'lucide-react';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const features = [
    {
      icon: <Brush className="w-6 h-6" />,
      title: 'Free Drawing',
      description: 'Express your creativity with smooth pencil strokes and intuitive drawing tools.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time. See changes instantly as others draw.'
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: 'Text & Shapes',
      description: 'Add text, rectangles, circles, and more to create comprehensive diagrams.'
    },
    {
      icon: <Hand className="w-6 h-6" />,
      title: 'Pan & Zoom',
      description: 'Navigate large canvases with smooth panning and zooming controls.'
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: 'Undo/Redo',
      description: 'Never lose your work with comprehensive undo and redo functionality.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Rooms',
      description: 'Create private rooms for your team with secure authentication.'
    }
  ];

  const tools = [
    { icon: <Brush className="w-5 h-5" />, name: 'Pencil' },
    { icon: <Eraser className="w-5 h-5" />, name: 'Eraser' },
    { icon: <Type className="w-5 h-5" />, name: 'Text' },
    { icon: <MousePointer className="w-5 h-5" />, name: 'Shapes' },
    { icon: <Hand className="w-5 h-5" />, name: 'Pan' },
    { icon: <RotateCcw className="w-5 h-5" />, name: 'Undo' }
  ];

  // Mobile blocking UI
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Animated Canvas Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Palette className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Welcome to MiniCanvas</h1>

          <p className="text-gray-300 mb-6 leading-relaxed">
            MiniCanvas is designed for the best collaborative drawing experience on desktop and tablet devices.
            Please access this application from a computer or tablet for the full creative experience.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Why Desktop?</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Precision drawing tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Advanced zoom and pan controls</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Real-time collaboration features</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Full-screen creative workspace</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-green-400" />
                <span className="text-sm">Desktop</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-red-400" />
                <span className="text-sm">Mobile</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Having trouble? Try rotating your device or using a desktop browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
  

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Create, Collaborate,
              <span className="text-gradient block">Innovate</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto">
              The modern collaborative drawing platform that brings your ideas to life. 
              Draw, design, and brainstorm with your team in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button variant="primary" size="xl" className="group">
                  Start Drawing Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" size="xl">
                  Join Existing Room
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Tools Preview */}
          <div className="mt-16 relative">
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto animate-slide-up">
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {tools.map((tool, index) => (
                  <div
                    key={tool.name}
                    className="flex items-center space-x-2 bg-neutral-800/50 rounded-lg px-4 py-2 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-indigo-400">
                      {tool.icon}
                    </div>
                    <span className="text-sm text-neutral-300">{tool.name}</span>
                  </div>
                ))}
              </div>
              <div className="h-64 bg-neutral-900/50 rounded-xl border border-neutral-700 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-float" />
                  <p className="text-neutral-400">Your canvas awaits...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need to
              <span className="text-gradient"> create amazing things</span>
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Powerful tools designed for modern teams who want to collaborate seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="glass"
                interactive
                className="animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card variant="gradient" className="p-12">
            <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to start creating?
            </h2>
            <p className="text-xl text-neutral-300 mb-8">
              Join thousands of teams already using MiniCanvas to bring their ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="group">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">MiniCanvas</span>
          </div>
          
        </div>
      </footer>
    </div>
  );
}
