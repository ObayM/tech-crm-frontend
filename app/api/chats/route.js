// app/api/chats/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '10');
  const limit = parseInt(searchParams.get('limit') || '50');
  
  // Ensure valid parameters
  const validatedPage = isNaN(page) ? 0 : Math.max(0, page);
  const validatedLimit = isNaN(limit) ? 20 : Math.min(Math.max(1, limit), 100);
  
  try {
    // Call your backend API
    const apiUrl = new URL(process.env.BACKEND_API_URL || 'http://localhost:8000/');
    apiUrl.pathname = '/chats/';
    apiUrl.searchParams.set('page', validatedPage.toString());
    apiUrl.searchParams.set('limit', validatedLimit.toString());
    
    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Content-Type': 'application/json'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch chats: ${response.status}`);
    }
    
    const chats = await response.json();
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error in chats API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' }, 
      { status: 500 }
    );
  }
}