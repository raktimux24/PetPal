import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface Activity {
  id: string;
  petId: string;
  type: string;
  duration: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ActivityContextType {
  activities: Activity[];
  loading: boolean;
  addActivity: (petId: string, activity: Omit<Activity, 'id' | 'petId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  getActivitiesForPet: (petId: string) => Activity[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'activities'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activitiesData: Activity[] = [];
      snapshot.forEach((doc) => {
        activitiesData.push({ id: doc.id, ...doc.data() } as Activity);
      });
      setActivities(activitiesData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addActivity = async (
    petId: string,
    activityData: Omit<Activity, 'id' | 'petId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    const activityId = uuidv4();
    const timestamp = new Date().toISOString();

    const newActivity: Activity & { userId: string } = {
      ...activityData,
      id: activityId,
      petId,
      userId: currentUser.uid,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const activityRef = doc(db, 'activities', activityId);
    await setDoc(activityRef, newActivity);
  };

  const deleteActivity = async (id: string) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'activities', id));
  };

  const getActivitiesForPet = (petId: string) => {
    return activities.filter(activity => activity.petId === petId);
  };

  return (
    <ActivityContext.Provider value={{
      activities,
      loading,
      addActivity,
      deleteActivity,
      getActivitiesForPet
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}