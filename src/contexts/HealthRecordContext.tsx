import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface HealthRecord {
  id: string;
  petId: string;
  type: 'vaccination' | 'medication' | 'visit';
  title: string;
  date: string;
  nextDue?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface HealthRecordContextType {
  records: HealthRecord[];
  loading: boolean;
  addRecord: (petId: string, record: Omit<HealthRecord, 'id' | 'petId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  getRecordsForPet: (petId: string) => HealthRecord[];
}

const HealthRecordContext = createContext<HealthRecordContextType | undefined>(undefined);

export function HealthRecordProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'healthRecords'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordsData: HealthRecord[] = [];
      snapshot.forEach((doc) => {
        recordsData.push({ id: doc.id, ...doc.data() } as HealthRecord);
      });
      setRecords(recordsData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addRecord = async (
    petId: string,
    recordData: Omit<HealthRecord, 'id' | 'petId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    const recordId = uuidv4();
    const timestamp = new Date().toISOString();

    const newRecord: HealthRecord & { userId: string } = {
      ...recordData,
      id: recordId,
      petId,
      userId: currentUser.uid,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const recordRef = doc(db, 'healthRecords', recordId);
    await setDoc(recordRef, newRecord);
  };

  const deleteRecord = async (id: string) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'healthRecords', id));
  };

  const getRecordsForPet = (petId: string) => {
    return records.filter(record => record.petId === petId);
  };

  return (
    <HealthRecordContext.Provider value={{
      records,
      loading,
      addRecord,
      deleteRecord,
      getRecordsForPet
    }}>
      {children}
    </HealthRecordContext.Provider>
  );
}

export function useHealthRecords() {
  const context = useContext(HealthRecordContext);
  if (context === undefined) {
    throw new Error('useHealthRecords must be used within a HealthRecordProvider');
  }
  return context;
}