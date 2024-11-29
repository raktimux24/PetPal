import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db, storage } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
  gender?: string;
  color?: string;
  microchipId?: string;
  medicalNotes?: string;
  photo?: string;
  status?: 'healthy' | 'warning' | 'attention';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface PetContextType {
  pets: Pet[];
  loading: boolean;
  addPet: (petData: Omit<Pet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePet: (id: string, petData: Partial<Omit<Pet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPet: (id: string) => Pet | undefined;
  updatePetPhoto: (petId: string, photo: File) => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setPets([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'pets'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const petsData: Pet[] = [];
      snapshot.forEach((doc) => {
        petsData.push({ id: doc.id, ...doc.data() } as Pet);
      });
      setPets(petsData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const uploadPetPhoto = async (file: File): Promise<string> => {
    if (!currentUser) throw new Error('No authenticated user');

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `pets/${currentUser.uid}/${fileName}`);

    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) throw new Error('No authenticated user');

    const petId = uuidv4();
    const timestamp = new Date().toISOString();

    const newPet: Pet = {
      ...petData,
      id: petId,
      userId: currentUser.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'healthy'
    };

    const petRef = doc(db, 'pets', petId);
    await setDoc(petRef, newPet);
  };

  const updatePet = async (
    id: string,
    petData: Partial<Omit<Pet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    const petRef = doc(db, 'pets', id);
    await setDoc(petRef, {
      ...petData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const deletePet = async (id: string) => {
    if (!currentUser) return;

    const pet = pets.find(p => p.id === id);
    if (pet?.photo) {
      try {
        const photoRef = ref(storage, pet.photo);
        await deleteObject(photoRef);
      } catch (error) {
        console.error('Error deleting pet photo:', error);
      }
    }

    await deleteDoc(doc(db, 'pets', id));
  };

  const updatePetPhoto = async (petId: string, photo: File) => {
    if (!currentUser) return;

    const photoURL = await uploadPetPhoto(photo);
    const petRef = doc(db, 'pets', petId);
    await setDoc(petRef, {
      photo: photoURL,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const getPet = (id: string) => {
    return pets.find(pet => pet.id === id);
  };

  return (
    <PetContext.Provider value={{ 
      pets, 
      loading, 
      addPet,
      updatePet,
      deletePet, 
      getPet, 
      updatePetPhoto 
    }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}