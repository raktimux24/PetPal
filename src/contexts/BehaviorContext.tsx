import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface BehaviorAnalysis {
  id: string;
  petId: string;
  behavior: string;
  context: string;
  analysis: string;
  createdAt: string;
  updatedAt: string;
}

interface BehaviorContextType {
  analyses: BehaviorAnalysis[];
  loading: boolean;
  addAnalysis: (petId: string, data: { behavior: string; context: string; analysis: string }) => Promise<void>;
  getAnalysesForPet: (petId: string) => BehaviorAnalysis[];
}

const BehaviorContext = createContext<BehaviorContextType | undefined>(undefined);

export function BehaviorProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [analyses, setAnalyses] = useState<BehaviorAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setAnalyses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'behaviorAnalyses'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const analysesData: BehaviorAnalysis[] = [];
      snapshot.forEach((doc) => {
        analysesData.push({ id: doc.id, ...doc.data() } as BehaviorAnalysis);
      });
      setAnalyses(analysesData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addAnalysis = async (
    petId: string,
    data: { behavior: string; context: string; analysis: string }
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    const analysisId = uuidv4();
    const timestamp = new Date().toISOString();

    const newAnalysis: BehaviorAnalysis & { userId: string } = {
      id: analysisId,
      petId,
      behavior: data.behavior,
      context: data.context,
      analysis: data.analysis,
      userId: currentUser.uid,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const analysisRef = doc(db, 'behaviorAnalyses', analysisId);
    await setDoc(analysisRef, newAnalysis);
  };

  const getAnalysesForPet = (petId: string) => {
    return analyses.filter(analysis => analysis.petId === petId);
  };

  return (
    <BehaviorContext.Provider value={{
      analyses,
      loading,
      addAnalysis,
      getAnalysesForPet
    }}>
      {children}
    </BehaviorContext.Provider>
  );
}

export function useBehavior() {
  const context = useContext(BehaviorContext);
  if (context === undefined) {
    throw new Error('useBehavior must be used within a BehaviorProvider');
  }
  return context;
}