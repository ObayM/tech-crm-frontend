"use client";
import { useAuth } from '@/context/AuthProvider';
import AuthForm from '@/components/AuthForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if NOT loading AND the user exists
    if (!loading && user) {
      router.push('/dashboard');
    }
    // Add loading and router to dependencies as they are used in the effect
  }, [user, loading, router]);

  // --- CONDITIONAL RENDERING (Early returns are fine here) ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // If not loading and no user, show the login form
    return <AuthForm />;
  }

  // --- RENDER FOR LOGGED-IN USER (if redirect hasn't happened yet) ---
  // This part might briefly render before the useEffect causes the redirect.
  // Alternatively, you could return null or a minimal loading indicator here too
  // if you want to strictly avoid showing this content before the redirect.
  // For example: if (!loading && user) return null; // Or a small loader
  // However, the current setup is common and usually fine.

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-2">Welcome, {user.email}!</h1>
      <p className="text-gray-600 mb-6">You are logged in.</p>

      <div className="flex flex-col gap-4">
        {/* Dashboard Button in Arabic */}
        <Link href="/dashboard" className="text-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          الذهاب إلى لوحة التحكم
        </Link>

        {/* Logout Button */}
        <button
          onClick={signOut}
          className="py-3 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}