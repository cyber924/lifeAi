import { Timestamp, GeoPoint, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';

// Type guards for Firestore native types
const isTimestamp = (value: any): value is Timestamp => 
  value && typeof value.toDate === 'function';

const isGeoPoint = (value: any): value is GeoPoint => 
  value && typeof value.latitude === 'number' && typeof value.longitude === 'number';

const isDocumentReference = (value: any): boolean => 
  value && typeof value.id === 'string' && typeof value.path === 'string';

/**
 * Converts Firestore data to a plain JavaScript object
 * Handles Timestamp, GeoPoint, and DocumentReference
 */
export const convertFirestoreData = <T = any>(data: any): T => {
  // Handle null/undefined
  if (data === null || data === undefined) {
    return data as T;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => convertFirestoreData(item)) as unknown as T;
  }

  // Handle Firestore Timestamp
  if (isTimestamp(data)) {
    return data.toDate().toISOString() as unknown as T;
  }

  // Handle Firestore GeoPoint
  if (isGeoPoint(data)) {
    return { 
      lat: data.latitude, 
      lng: data.longitude 
    } as unknown as T;
  }

  // Handle DocumentReference
  if (isDocumentReference(data)) {
    return data.path as unknown as T;
  }

  // Handle plain objects
  if (typeof data === 'object' && data !== null) {
    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = convertFirestoreData(data[key]);
      }
    }
    return result as T;
  }

  // Return primitives as is
  return data as T;
};

/**
 * Converts a Firestore document to a plain JavaScript object
 */
export const convertDocumentData = <T = DocumentData>(
  doc: QueryDocumentSnapshot
): T => {
  if (!doc.exists()) {
    throw new Error('Document does not exist');
  }
  
  return convertFirestoreData<T>({
    id: doc.id,
    ...doc.data()
  });
};

/**
 * Converts multiple Firestore documents to plain JavaScript objects
 */
export const convertQuerySnapshot = <T = DocumentData>(
  snapshot: FirebaseFirestore.QuerySnapshot
): T[] => {
  return snapshot.docs.map(doc => convertDocumentData<T>(doc));
};
