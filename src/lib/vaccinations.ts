import { Pet } from '../contexts/PetContext';

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  type: 'core' | 'non-core';
  species: string[];
}

export const VACCINES: Vaccine[] = [
  // Dog Vaccines
  { id: 'dog_rabies', name: 'Rabies', description: 'Protects against the fatal rabies virus', type: 'core', species: ['Dog'] },
  { id: 'dog_distemper', name: 'Canine Distemper', description: 'Guards against a severe and often fatal viral disease', type: 'core', species: ['Dog'] },
  { id: 'dog_adenovirus', name: 'Canine Adenovirus (Hepatitis)', description: 'Prevents infectious canine hepatitis', type: 'core', species: ['Dog'] },
  { id: 'dog_parvovirus', name: 'Canine Parvovirus', description: 'Shields against a highly contagious and potentially deadly virus', type: 'core', species: ['Dog'] },
  { id: 'dog_bordetella', name: 'Bordetella bronchiseptica (Kennel Cough)', description: 'Protects against a common cause of kennel cough', type: 'non-core', species: ['Dog'] },
  { id: 'dog_leptospirosis', name: 'Leptospirosis', description: 'Guards against a bacterial infection that can affect both dogs and humans', type: 'non-core', species: ['Dog'] },
  { id: 'dog_lyme', name: 'Lyme Disease', description: 'Prevents Lyme disease transmitted by ticks', type: 'non-core', species: ['Dog'] },
  { id: 'dog_influenza', name: 'Canine Influenza', description: 'Protects against canine flu viruses', type: 'non-core', species: ['Dog'] },
  { id: 'dog_parainfluenza', name: 'Canine Parainfluenza', description: 'Helps prevent respiratory infections', type: 'non-core', species: ['Dog'] },

  // Cat Vaccines
  { id: 'cat_rabies', name: 'Rabies', description: 'Protects against the fatal rabies virus', type: 'core', species: ['Cat'] },
  { id: 'cat_herpesvirus', name: 'Feline Herpesvirus (Rhinotracheitis)', description: 'Prevents respiratory infections', type: 'core', species: ['Cat'] },
  { id: 'cat_calicivirus', name: 'Feline Calicivirus', description: 'Guards against a common respiratory virus', type: 'core', species: ['Cat'] },
  { id: 'cat_panleukopenia', name: 'Feline Panleukopenia (Distemper)', description: 'Shields against a severe and often fatal disease', type: 'core', species: ['Cat'] },
  { id: 'cat_felv', name: 'Feline Leukemia Virus (FeLV)', description: 'Protects against a serious viral infection', type: 'non-core', species: ['Cat'] },
  { id: 'cat_chlamydophila', name: 'Chlamydophila felis', description: 'Prevents conjunctivitis and respiratory issues', type: 'non-core', species: ['Cat'] },
  { id: 'cat_bordetella', name: 'Bordetella bronchiseptica', description: 'Guards against respiratory infections', type: 'non-core', species: ['Cat'] },
  { id: 'cat_fiv', name: 'Feline Immunodeficiency Virus (FIV)', description: 'Protects against an immune system-affecting virus', type: 'non-core', species: ['Cat'] },
  { id: 'cat_fip', name: 'Feline Infectious Peritonitis (FIP)', description: 'Generally experimental and not widely used', type: 'non-core', species: ['Cat'] },

  // Bird Vaccines
  { id: 'bird_newcastle', name: 'Newcastle Disease', description: 'Protects against a highly contagious viral disease in poultry', type: 'core', species: ['Bird'] },
  { id: 'bird_influenza', name: 'Avian Influenza', description: 'Guards against various strains of bird flu', type: 'core', species: ['Bird'] },
  { id: 'bird_polyomavirus', name: 'Polyomavirus', description: 'Prevents polyomavirus infections', type: 'non-core', species: ['Bird'] },
  { id: 'bird_mareks', name: "Marek's Disease", description: 'Protects against a viral disease affecting poultry', type: 'non-core', species: ['Bird'] },

  // Fish Vaccines
  { id: 'fish_vibriosis', name: 'Vibriosis', description: 'Protect against Vibrio species', type: 'core', species: ['Fish'] },
  { id: 'fish_ihnv', name: 'Infectious Hematopoietic Necrosis Virus (IHNV)', description: 'Guards against a viral infection in salmonids', type: 'core', species: ['Fish'] },
  { id: 'fish_khv', name: 'Koi Herpesvirus (KHV)', description: 'Prevents herpesvirus in koi and common carp', type: 'core', species: ['Fish'] },
  { id: 'fish_columnaris', name: 'Flavobacterium columnaris', description: 'Protects against columnaris disease', type: 'non-core', species: ['Fish'] },
  { id: 'fish_furunculosis', name: 'Aeromonas salmonicida (Furunculosis)', description: 'Shields against furunculosis in salmonids', type: 'non-core', species: ['Fish'] },

  // Cow Vaccines
  { id: 'cow_rabies', name: 'Rabies', description: 'Protects against the fatal rabies virus', type: 'core', species: ['Cow'] },
  { id: 'cow_bvd', name: 'Bovine Viral Diarrhea (BVD)', description: 'Guards against a viral infection affecting multiple body systems', type: 'core', species: ['Cow'] },
  { id: 'cow_brsv', name: 'Bovine Respiratory Syncytial Virus (BRSV)', description: 'Prevents respiratory infections', type: 'core', species: ['Cow'] },
  { id: 'cow_ibr', name: 'Infectious Bovine Rhinotracheitis (IBR)', description: 'Shields against a respiratory disease', type: 'core', species: ['Cow'] },
  { id: 'cow_pi3', name: 'Parainfluenza-3 (PI-3)', description: 'Protects against a viral respiratory pathogen', type: 'core', species: ['Cow'] },
  { id: 'cow_fmd', name: 'Foot-and-Mouth Disease (FMD)', description: 'Prevents a severe viral disease affecting cloven-hoofed animals', type: 'core', species: ['Cow'] },
  { id: 'cow_lepto', name: 'Leptospirosis', description: 'Guards against a bacterial infection affecting kidneys and liver', type: 'core', species: ['Cow'] },
  { id: 'cow_clostridial', name: 'Clostridial Vaccines', description: 'Protect against various bacterial toxins', type: 'core', species: ['Cow'] },
  { id: 'cow_brucellosis', name: 'Brucellosis', description: 'Protects against a bacterial infection, varies by region', type: 'non-core', species: ['Cow'] },
  { id: 'cow_anthrax', name: 'Anthrax', description: 'Prevents a serious bacterial disease', type: 'non-core', species: ['Cow'] },
  { id: 'cow_mannheimia', name: 'Mannheimia haemolytica', description: 'Guards against respiratory infections', type: 'non-core', species: ['Cow'] },
  { id: 'cow_tb', name: 'Mycobacterium bovis (TB Control)', description: 'Used in specific regions for tuberculosis control', type: 'non-core', species: ['Cow'] },

  // Horse Vaccines
  { id: 'horse_rabies', name: 'Rabies', description: 'Protects against the fatal rabies virus', type: 'core', species: ['Horse'] },
  { id: 'horse_tetanus', name: 'Tetanus', description: 'Guards against the toxin-producing bacterium Clostridium tetani', type: 'core', species: ['Horse'] },
  { id: 'horse_eee_wee', name: 'Eastern and Western Equine Encephalomyelitis', description: 'Prevents viral infections causing encephalitis', type: 'core', species: ['Horse'] },
  { id: 'horse_wnv', name: 'West Nile Virus', description: 'Shields against a mosquito-borne viral disease', type: 'core', species: ['Horse'] },
  { id: 'horse_influenza', name: 'Influenza', description: 'Protects against equine influenza viruses', type: 'core', species: ['Horse'] },
  { id: 'horse_eia', name: 'Equine Infectious Anemia (EIA)', description: 'Prevents a viral blood disease', type: 'non-core', species: ['Horse'] },
  { id: 'horse_strangles', name: 'Strangles (Streptococcus equi)', description: 'Guards against a highly contagious bacterial infection', type: 'non-core', species: ['Horse'] },
  { id: 'horse_phf', name: 'Potomac Horse Fever', description: 'Protects against an intestinal bacterial disease', type: 'non-core', species: ['Horse'] },
  { id: 'horse_rhino', name: 'Rhinopneumonitis (Equine Herpesvirus)', description: 'Prevents respiratory and neurological infections', type: 'non-core', species: ['Horse'] },
  { id: 'horse_botulism', name: 'Botulism Toxoid', description: 'Shields against botulism poisoning', type: 'non-core', species: ['Horse'] },
  { id: 'horse_rotavirus', name: 'Rotavirus', description: 'Protects foals against viral diarrhea', type: 'non-core', species: ['Horse'] },

  // Elephant Vaccines
  { id: 'elephant_anthrax', name: 'Anthrax', description: 'Protects against Bacillus anthracis infection', type: 'core', species: ['Elephant'] },
  { id: 'elephant_tb', name: 'Tuberculosis', description: 'Experimental approaches for TB prevention', type: 'non-core', species: ['Elephant'] },
  { id: 'elephant_eehv', name: 'Elephant Endotheliotropic Herpesvirus (EEHV)', description: 'No widely available vaccine; research ongoing', type: 'non-core', species: ['Elephant'] }
];

export function getAvailableVaccines(pet: Pet): Vaccine[] {
  return VACCINES.filter(vaccine => 
    vaccine.species.includes(pet.species)
  ).sort((a, b) => {
    // Sort core vaccines first, then by name
    if (a.type === 'core' && b.type !== 'core') return -1;
    if (a.type !== 'core' && b.type === 'core') return 1;
    return a.name.localeCompare(b.name);
  });
}