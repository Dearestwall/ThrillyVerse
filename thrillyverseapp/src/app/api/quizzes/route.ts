// src/app/api/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');

    let q = query(
      collection(db, 'quizzes'),
      orderBy('createdAt', 'desc')
    );

    if (subject && subject !== 'all') {
      q = query(q, where('subject', '==', subject));
    }

    if (difficulty && difficulty !== 'all') {
      q = query(q, where('difficulty', '==', difficulty));
    }

    const snapshot = await getDocs(q);
    const quizzes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: quizzes,
      count: quizzes.length
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}