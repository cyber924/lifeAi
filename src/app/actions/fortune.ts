'use server';

import { db } from '@/lib/firebase-admin';

export interface FortuneData {
  date: string;
  message: string;
  luckyItem: string;
  luckyColor: string;
}

export async function getTodaysFortune() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const fortuneDoc = await db.collection('fortunes').doc(today).get();
    
    if (!fortuneDoc.exists) {
      return null;
    }
    
    const data = fortuneDoc.data();
    return {
      date: today,
      message: data?.message || '',
      luckyItem: data?.luckyItem || '',
      luckyColor: data?.luckyColor || ''
    };
  } catch (error) {
    console.error('Error fetching fortune:', error);
    return null;
  }
}
