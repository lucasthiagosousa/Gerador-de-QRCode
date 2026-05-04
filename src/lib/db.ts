import { collection, query, where, orderBy, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { GeneratedCode } from '../types';
import { handleFirestoreError, OperationType } from './firestoreUtils';

export async function getCodes(userId: string): Promise<GeneratedCode[]> {
  try {
    const q = query(collection(db, 'codes'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as GeneratedCode);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'codes');
    return [];
  }
}

export async function saveCode(code: GeneratedCode): Promise<void> {
  try {
    await setDoc(doc(db, 'codes', code.id), code);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `codes/${code.id}`);
  }
}

export async function updateCode(code: GeneratedCode): Promise<void> {
  try {
    // using setDoc with merge or updateDoc
    // @ts-ignore
    await updateDoc(doc(db, 'codes', code.id), {
      title: code.title,
      qr_content: code.qr_content,
      barcode_content: code.barcode_content || null,
      barcode_type: code.barcode_type || 'code128',
      qr_size: code.qr_size || 400,
      updatedAt: code.updatedAt
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `codes/${code.id}`);
  }
}

export async function deleteCode(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'codes', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `codes/${id}`);
  }
}
