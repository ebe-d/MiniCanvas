'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../components/AuthContext';
import { HTTP_BACKEND } from '../config';
import {
  Palette,
  Plus,
  Users,
  ArrowRight,
  LogOut,
  Search,
  Sparkles,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';

interface Room {
  id: number;
  slug: string;
  adminId: string;
  createdAt: string;
}

interface CreateRoomFormData {
  roomName: string;
}

interface JoinRoomFormData {
  roomSlug: string;
}

export default function Rooms() {
  const router = useRouter();
  const { user, token, signOut, loading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [joinRoomSlug, setJoinRoomSlug] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
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

  useEffect(() => {
    if (!authLoading) {
      if (!user || !token) {
        router.push('/signin');
        return;
      }
      setLoading(false);
    }
  }, [user, token, authLoading, router]);

  const handleLogout = () => {
    signOut();
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    setCreateLoading(true);
    setError('');

    try {
      const response = await fetch(`${HTTP_BACKEND}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          Roomname: newRoomName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the new room
        router.push(`/canvas/${data.id}`);
      } else {
        setError(data.message || 'Failed to create room');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinRoomSlug.trim()) return;

    setJoinLoading(true);
    setError('');

    try {
      const response = await fetch(`${HTTP_BACKEND}/rooms/${joinRoomSlug}`);
      const data = await response.json();

      if (response.ok && data.room) {
        // Redirect to the room
        router.push(`/canvas/${data.room.id}`);
      } else {
        setError(data.message || 'Room not found. Please check the room name.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  // Mobile blocking UI
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Animated Canvas Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Desktop Experience Required</h1>

          <p className="text-gray-300 mb-6 leading-relaxed">
            MiniCanvas is designed for the best collaborative drawing experience on desktop and tablet devices.
            Please access this application from a computer or tablet for the full creative experience.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Why Desktop?</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Room management and navigation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Advanced canvas controls</span>
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
            <Link href="/">
              <Button variant="primary" className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <p className="text-xs text-gray-400">
              Having trouble? Try rotating your device or using a desktop browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
   
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Creative
            <span className="text-gradient"> Workspace</span>
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Create a new canvas or join an existing room to start collaborating with your team.
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-8 max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Create Room */}
          <Card variant="glass" interactive className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Create New Room</h2>
              <p className="text-neutral-300 mb-6">
                Start a fresh canvas and invite your team to collaborate in real-time.
              </p>
              
              {!showCreateForm ? (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setShowCreateForm(true)}
                  className="group"
                >
                  Create Room
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <Input
                    placeholder="Enter room name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                    maxLength={30}
                  />
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={createLoading}
                      className="flex-1"
                    >
                      Create
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewRoomName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>

          {/* Join Room */}
          <Card variant="glass" interactive className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Join Existing Room</h2>
              <p className="text-neutral-300 mb-6">
                Enter a room name to join an existing collaborative session.
              </p>
              
              {!showJoinForm ? (
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => setShowJoinForm(true)}
                  className="group"
                >
                  Join Room
                  <Search className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              ) : (
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <Input
                    placeholder="Enter room name"
                    value={joinRoomSlug}
                    onChange={(e) => setJoinRoomSlug(e.target.value)}
                    required
                    maxLength={30}
                  />
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      variant="secondary"
                      loading={joinLoading}
                      className="flex-1"
                    >
                      Join
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowJoinForm(false);
                        setJoinRoomSlug('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center">
          <Card variant="gradient" className="p-8">
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Powerful Collaboration Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <Clock className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Real-time Sync</h4>
                <p className="text-neutral-300 text-sm">
                  See changes instantly as your team draws and creates together.
                </p>
              </div>
              <div className="text-center">
                <User className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Multi-user Support</h4>
                <p className="text-neutral-300 text-sm">
                  Invite unlimited team members to collaborate on your canvas.
                </p>
              </div>
              <div className="text-center">
                <Palette className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Rich Tools</h4>
                <p className="text-neutral-300 text-sm">
                  Access pencil, shapes, text, eraser, and advanced drawing tools.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}