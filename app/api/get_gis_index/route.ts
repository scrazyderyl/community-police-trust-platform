import { getAllGisData } from '@/lib/jurisdiction';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getAllGisData();
    
    if (data) {
      return NextResponse.json(data);
    } else {
      return new NextResponse(null, { status: 404 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}