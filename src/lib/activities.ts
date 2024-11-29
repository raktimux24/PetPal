import { Pet } from '../contexts/PetContext';

export interface ActivityType {
  id: string;
  label: string;
  availableFor: string[];
}

export const ACTIVITY_TYPES: ActivityType[] = [
  {
    id: 'walk',
    label: 'Walk',
    availableFor: ['Dog', 'Cat', 'Horse', 'Elephant']
  },
  {
    id: 'training',
    label: 'Training',
    availableFor: ['Dog', 'Cat', 'Horse', 'Bird', 'Elephant']
  },
  {
    id: 'playtime',
    label: 'Playtime',
    availableFor: ['Dog', 'Cat', 'Bird', 'Reptile', 'Horse', 'Elephant']
  },
  {
    id: 'grooming',
    label: 'Grooming',
    availableFor: ['Dog', 'Cat', 'Horse', 'Cow', 'Elephant', 'Bird']
  },
  {
    id: 'feeding',
    label: 'Feeding',
    availableFor: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Cow', 'Horse', 'Elephant', 'Others']
  },
  {
    id: 'medication',
    label: 'Medication',
    availableFor: ['Dog', 'Cat', 'Bird', 'Fish', 'Cow', 'Reptile', 'Horse', 'Elephant', 'Others']
  },
  {
    id: 'vet_visit',
    label: 'Vet Visit',
    availableFor: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Cow', 'Horse', 'Elephant', 'Others']
  },
  {
    id: 'tank_cleaning',
    label: 'Tank Cleaning',
    availableFor: ['Fish']
  },
  {
    id: 'water_change',
    label: 'Water Change',
    availableFor: ['Fish']
  },
  {
    id: 'other',
    label: 'Other',
    availableFor: ['Dog', 'Cat', 'Bird', 'Fish', 'Cow', 'Reptile', 'Horse', 'Elephant', 'Others']
  }
];

export function getAvailableActivityTypes(pet: Pet): ActivityType[] {
  return ACTIVITY_TYPES.filter(activity => 
    activity.availableFor.includes(pet.species)
  );
}