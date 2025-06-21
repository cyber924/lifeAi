// This file serves as a barrel file for Firebase exports
// For client-side usage, import from '@/lib/firebase-client'
// For server-side usage, import from '@/lib/firebase-admin'

export * from './firebase-client';

// Re-export types for backward compatibility
export type { FirebaseApp } from 'firebase/app';
export type { Firestore, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
