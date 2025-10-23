import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const subject = searchParams.get('subject') || '';
  const limit = searchParams.get('limit') || '6';
  
  const baseUrl = process.env.NEXT_PUBLIC_BOOKS_API_URL || 'https://openlibrary.org/subjects/'
  
  
  try {
    const response = await fetch(
      `${baseUrl}${subject}.json?limit=${limit}`
    );
    
    if (!response.ok) {
      return NextResponse.json({ works: [] }, { status: 200 });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ works: [] }, { status: 200 });
  }
}