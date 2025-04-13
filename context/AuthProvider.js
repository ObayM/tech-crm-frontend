// src/context/AuthProvider.js
"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/utils/supabaseClient'; 
import { useRouter } from 'next/navigation';

// Create Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes (signIn, signOut)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth Event:", event); // Optional: for debugging
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, [router]); // Include router if using it for redirects

  // Value provided to consuming components
  const value = {
    session,
    user,
    loading,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when loading is complete */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};