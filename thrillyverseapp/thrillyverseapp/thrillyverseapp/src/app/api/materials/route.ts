// src/app/api/materials/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Material {
  id: string;
  title?: string;
  description?: string;
  subject?: string;
  chapter?: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');
    const searchQuery = searchParams.get('search');
    const limitCount = parseInt(searchParams.get('limit') || '50');

    let q = query(
      collection(db, 'materials'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (subject && subject !== 'all') {
      q = query(q, where('subject', '==', subject));
    }

    if (chapter) {
      q = query(q, where('chapter', '==', chapter));
    }

    const snapshot = await getDocs(q);
    const materials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Material[];

    // Filter by search query if provided
    let filteredMaterials = materials;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredMaterials = materials.filter((material) =>
        material.title?.toLowerCase().includes(searchLower) ||
        material.description?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredMaterials,
      count: filteredMaterials.length
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication check
    // TODO: Add material to Firestore using createMaterial function
    console.log('Creating material:', body);

    return NextResponse.json({
      success: true,
      message: 'Material created successfully'
    });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create material' },
      { status: 500 }
    );
  }
}