const STORAGE_KEY = 'colorDashSelectedOutfit';
const PROGRESS_KEY = 'colorDashUnlockedLevel';
const MAX_LEVEL = 20;

export const OUTFIT_OPTIONS = [
  { id: 'none', label: 'ESTILO ORIGINAL', unlockLevel: 1 },
  { id: 'leaf-crown', label: 'CORONA DE HOJAS', unlockLevel: 3 },
  { id: 'shell-tiara', label: 'TIARA DE CONCHAS', unlockLevel: 6 },
  { id: 'rainbow-glasses', label: 'GAFAS ARCOÍRIS', unlockLevel: 9 },
  { id: 'astronaut-helmet', label: 'CASCO ESPACIAL', unlockLevel: 13 },
  { id: 'dragon-hood', label: 'CAPUCHA DRAGÓN', unlockLevel: 17 },
];

export function getHighestUnlockedLevel() {
  const savedLevel = Number(localStorage.getItem(PROGRESS_KEY) ?? 1);
  return Number.isFinite(savedLevel)
    ? Math.max(1, Math.min(MAX_LEVEL, Math.floor(savedLevel)))
    : 1;
}

export function getSelectedOutfit() {
  const savedOutfit = OUTFIT_OPTIONS.find(({ id }) => id === localStorage.getItem(STORAGE_KEY));
  if (!savedOutfit || savedOutfit.unlockLevel > getHighestUnlockedLevel()) {
    return 'none';
  }

  return savedOutfit.id;
}

export function saveSelectedOutfit(outfitId) {
  const outfit = OUTFIT_OPTIONS.find(({ id }) => id === outfitId);
  if (!outfit) {
    throw new RangeError(`Vestimenta no disponible: ${outfitId}`);
  }
  if (outfit.unlockLevel > getHighestUnlockedLevel()) {
    throw new RangeError(`Completa el nivel ${outfit.unlockLevel - 1} para desbloquear esta vestimenta.`);
  }

  localStorage.setItem(STORAGE_KEY, outfitId);
  return outfitId;
}
