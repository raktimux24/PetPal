import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File, path: string): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const fullPath = `${path}/${fileName}`;
  const storageRef = ref(storage, fullPath);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
  return uploadImage(file, `users/${userId}/profile`);
}

export async function uploadPetPhoto(userId: string, petId: string, file: File): Promise<string> {
  return uploadImage(file, `users/${userId}/pets/${petId}`);
}