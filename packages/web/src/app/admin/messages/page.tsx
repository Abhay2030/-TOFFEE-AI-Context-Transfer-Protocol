/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getContactMessages } from "@/lib/api";
import { auth } from "@/utils/firebase/firebase";
import { Mail, Clock, Shield, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      setTimeout(() => {
        setError("Authentication service is not available.");
        setLoading(false);
      }, 0);
      return;
    }

    // Wait for Firebase auth to initialize
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.email === 'abhaydonde2007@gmail.com') {
          setIsAuthorized(true);
          fetchMessages();
        } else {
          setError("Access Denied: You do not have administrator privileges.");
          setLoading(false);
        }
      } else {
        // Not logged in, redirect to login or show error
        setError("You must be logged in as an administrator to view this page.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // fetchMessages moved above useEffect

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-toffee-500/20 border-t-toffee-500 rounded-full animate-spin"></div>
          <p className="text-navy-400 font-medium animate-pulse">Verifying Security Credentials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy-950 pt-32 px-4 flex justify-center">
        <div className="max-w-md w-full glass-card p-8 border-red-500/20 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-navy-300 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Inbox className="w-8 h-8 text-toffee-500" />
              Admin Inbox
            </h1>
            <p className="text-navy-300 mt-2">Manage all incoming contact inquiries.</p>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2 border-toffee-500/20 rounded-full">
            <Shield className="w-4 h-4 text-toffee-500" />
            <span className="text-sm font-medium text-white">Admin Secure View</span>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="glass-card p-12 text-center border-dashed border-navy-700">
            <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-navy-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Inbox is empty</h3>
            <p className="text-navy-400">No contact messages have been received yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className="glass-card p-6 border-navy-700/50 hover:border-toffee-500/30 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-navy-800 border border-navy-700 text-xs font-medium text-toffee-400">
                        {msg.topic}
                      </span>
                    </div>
                    <a href={`mailto:${msg.email}`} className="text-sm text-navy-400 hover:text-toffee-400 transition-colors">
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-navy-500 bg-navy-900/50 px-3 py-1.5 rounded-lg shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(msg.created_at).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div className="p-4 bg-navy-900/50 rounded-xl border border-navy-800/50">
                  <p className="text-navy-100 whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
