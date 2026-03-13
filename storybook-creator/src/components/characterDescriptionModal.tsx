'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { characterDescription } from '@/store/useBookStore';
import { useBookStore } from '@/store/useBookStore';

interface CharacterModalProps {
  keyword: string;
  isOpen: boolean;
  closeModal: () => void;
}

const getPrompt = (
  character: string,
  age: string,
  hairColor: { name: string; hex: string },
  skinColor: { name: string; hex: string }
) => {
  return `A ${character} ${age} that has ${skinColor.name} skin color (hex value: ${skinColor.hex}) and ${hairColor.name} hair color (hex value: ${hairColor.hex}).`;
};

const CharacterModal: React.FC<CharacterModalProps> = ({ isOpen, closeModal, keyword }) => {
  const [character, setCharacter] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<'baby' | 'child' | 'teenager' | 'adult' | 'old'>('child');

const hairColors = [
  { name: 'Platinum Blonde', hex: '#F0E2C6' },
  { name: 'Ash Blonde', hex: '#E6D3B3' },
  { name: 'Golden Blonde', hex: '#F5DEB3' },
  { name: 'Honey Blonde', hex: '#E0AC69' },
  { name: 'Strawberry Blonde', hex: '#F4A460' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Light Auburn', hex: '#D2691E' },
  { name: 'Dark Auburn', hex: '#8B2500' },
  { name: 'Chestnut Brown', hex: '#964B00' },
  { name: 'Medium Brown', hex: '#8B4513' },
  { name: 'Dark Brown', hex: '#5C4033' },
  { name: 'Espresso', hex: '#3B2F2F' },
  { name: 'Black', hex: '#000000' },
  { name: 'Jet Black', hex: '#1A1A1A' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Steel Gray', hex: '#A9A9A9' },
  { name: 'Charcoal Gray', hex: '#555555' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#228B22' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Lavender', hex: '#E6E6FA' },
];

const skinColors = [
  { name: 'Porcelain', hex: '#FFF0DC' },
  { name: 'Ivory', hex: '#FFEDDC' },
  { name: 'Fair', hex: '#FAD7B5' },
  { name: 'Warm Beige', hex: '#D9A066' },
  { name: 'Medium', hex: '#E0AC69' },
  { name: 'Olive', hex: '#C49E65' },
  { name: 'Tan', hex: '#C68642' },
  { name: 'Bronze', hex: '#A9746E' },
  { name: 'Caramel', hex: '#A0522D' },
  { name: 'Golden Brown', hex: '#8B5A2B' },
  { name: 'Amber', hex: '#7B4A12' },
  { name: 'Rich Brown', hex: '#6F4E37' },
  { name: 'Deep Brown', hex: '#5C4033' },
  { name: 'Mocha', hex: '#4B3621' },
  { name: 'Espresso', hex: '#3B2F2F' },
  { name: 'Ebony', hex: '#2C1B0C' },
  { name: 'Very Deep Brown', hex: '#1C0A00' },
  { name: 'Cool Brown', hex: '#704214' },
  { name: 'Neutral Brown', hex: '#8D5524' },
  { name: 'Dark Black', hex: '#000000' },
];

  const [hairColor, setHairColor] = useState(hairColors[4]); // Default to Brown
  const [skinColor, setSkinColor] = useState(skinColors[3]); // Default to Tan

  const ageTypes = ['baby', 'child', 'teenager', 'adult', 'old'] as const;
  const genders = ['male', 'female'] as const;

  const saveCharacter = () => {
    const charDesc: characterDescription = {keyword: keyword, description: getPrompt(character, age, hairColor, skinColor)}
    console.log(`Keyword '${keyword}' = `, getPrompt(character, age, hairColor, skinColor));
    useBookStore.getState().saveCharacterDescription(charDesc);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-[#0A0A23] text-white rounded-xl p-6 w-[400px] relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Human Character</h2>
        </div>

        {/* Gender */}
        <div className="mb-4">
          <p className="mb-2">Character</p>
          <div className="flex justify-start">
            {genders.map((i) => (
              <div className="w-16" key={i}>
                <button
                  onClick={() => setCharacter(i)}
                  className={`rounded flex justify-center items-center w-full h-full ${
                    character === i ? 'bg-blue-800 border border-blue-500' : ''
                  }`}
                >
                  <Image
                    src={`/assets/char_descriptor_${i}.png`}
                    alt={i}
                    width={100}
                    height={75}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Age */}
        <div className="mb-4">
          <p className="mb-2">Age</p>
          <div className="flex justify-between">
            {ageTypes.map((i) => (
              <div className="w-16" key={i}>
                <button
                  onClick={() => setAge(i)}
                  className={`rounded flex justify-center items-center w-full h-full ${
                    age === i ? 'bg-blue-800 border border-blue-500' : ''
                  }`}
                >
                  <Image
                    src={`/assets/age_descriptor_${i}.png`}
                    alt={i}
                    width={100}
                    height={75}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hair Color */}
        <div className="mb-4">
          <p className="mb-2">Hair Color</p>
          <div className="grid grid-cols-7 gap-2">
            {hairColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setHairColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  hairColor.hex === color.hex ? 'border-blue-500' : 'border-white'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Skin Color */}
        <div className="mb-4">
          <p className="mb-2">Skin Color</p>
          <div className="grid grid-cols-5 gap-2">
            {skinColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setSkinColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  skinColor.hex === color.hex ? 'border-blue-500' : 'border-white'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <button
          onClick={saveCharacter}
          className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-300 w-full"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default CharacterModal;
