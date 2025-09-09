'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoomCanvas } from "@/components/RoomCanvas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/AuthContext";
import {
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function CanvasPage({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [roomId, setRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
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
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.roomId);

        if (isNaN(id) || id <= 0) {
          setError('Invalid room ID');
          return;
        }

        setRoomId(id);
      } catch (err) {
        setError('Failed to load room');
      } finally {
        setLoading(false);
      }
    };

    // Only load params if user is authenticated and not on mobile
    if (!authLoading && user && token && !isMobile) {
      loadParams();
    } else if (!authLoading && (!user || !token)) {
      router.push('/signin');
    }
  }, [params, router, user, token, authLoading, isMobile]);

  // Mobile blocking UI
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Animated Canvas Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
            <Link href="/rooms">
              <Button variant="primary" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rooms
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading Canvas</h2>
          <p className="text-neutral-300">Preparing your collaborative workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6">
        <Card variant="glass" className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Room</h2>
          <p className="text-neutral-300 mb-6">{error}</p>
          <div className="space-y-3">
            <Link href="/rooms">
              <Button variant="primary" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rooms
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!roomId) {
    return null;
  }

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      margin: 0,
      padding: 0,
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0
    }}>
      <RoomCanvas roomId={roomId} onConnectionChange={setIsConnected} />

      {/* Connection Status Overlay */}
      {!isConnected && (
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fbbf24" }}>
            <Loader2 style={{ width: "16px", height: "16px" }} className="animate-spin" />
            <span style={{ fontSize: "14px" }}>Connecting...</span>
          </div>
        </div>
      )}
    </div>
  );
}
