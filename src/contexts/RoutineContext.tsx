import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface Routine {
  id: string;
  petId: string;
  title: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  customDays?: string[];
  monthlyDate?: number;
  yearlyMonth?: string;
  yearlyDate?: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoutineContextType {
  routines: Routine[];
  loading: boolean;
  addRoutine: (petId: string, routine: Omit<Routine, 'id' | 'petId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  toggleRoutineCompletion: (id: string) => Promise<void>;
  getRoutinesForPet: (petId: string) => Routine[];
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export function RoutineProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setRoutines([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'routines'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const routinesData: Routine[] = [];
      snapshot.forEach((doc) => {
        routinesData.push({ id: doc.id, ...doc.data() } as Routine);
      });
      setRoutines(routinesData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addRoutine = async (
    petId: string,
    routineData: Omit<Routine, 'id' | 'petId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    const routineId = uuidv4();
    const timestamp = new Date().toISOString();

    // Create a clean routine object without undefined values
    const cleanRoutineData = {
      ...routineData,
      customDays: routineData.frequency === 'custom' ? routineData.customDays : [],
      monthlyDate: routineData.frequency === 'monthly' ? routineData.monthlyDate : null,
      yearlyMonth: routineData.frequency === 'yearly' ? routineData.yearlyMonth : null,
      yearlyDate: routineData.frequency === 'yearly' ? routineData.yearlyDate : null,
    };

    const newRoutine: Routine & { userId: string } = {
      ...cleanRoutineData,
      id: routineId,
      petId,
      userId: currentUser.uid,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const routineRef = doc(db, 'routines', routineId);
    await setDoc(routineRef, newRoutine);
  };

  const deleteRoutine = async (id: string) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'routines', id));
  };

  const toggleRoutineCompletion = async (id: string) => {
    if (!currentUser) return;

    const routine = routines.find(r => r.id === id);
    if (!routine) return;

    const routineRef = doc(db, 'routines', id);
    await setDoc(routineRef, {
      completed: !routine.completed,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const getRoutinesForPet = (petId: string) => {
    return routines.filter(routine => routine.petId === petId);
  };

  return (
    <RoutineContext.Provider value={{
      routines,
      loading,
      addRoutine,
      deleteRoutine,
      toggleRoutineCompletion,
      getRoutinesForPet
    }}>
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutines() {
  const context = useContext(RoutineContext);
  if (context === undefined) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
}