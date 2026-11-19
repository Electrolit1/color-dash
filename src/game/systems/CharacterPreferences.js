export const CHARACTER_OPTIONS = [
  { id: 'cat', label: 'GATO' },
  { id: 'dog', label: 'PERRO' },
  { id: 'rabbit', label: 'CONEJO' },
];

const STORAGE_KEY = 'colorDashSelectedCharacter';
const CHARACTER_IDS = new Set(CHARACTER_OPTIONS.map(({ id }) => id));

export function getSelectedCharacter() {
  const savedCharacter = localStorage.getItem(STORAGE_KEY);
  return CHARACTER_IDS.has(savedCharacter) ? savedCharacter : 'cat';
}

export function saveSelectedCharacter(characterId) {
  if (!CHARACTER_IDS.has(characterId)) {
    throw new RangeError(`Personaje no disponible: ${characterId}`);
  }

  localStorage.setItem(STORAGE_KEY, characterId);
  return characterId;
}
