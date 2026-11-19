const STORAGE_KEY = 'colorDashAudioPreferences';
const DEFAULT_PREFERENCES = {
  music: true,
  effects: true,
};

export function getAudioPreferences() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    return { ...DEFAULT_PREFERENCES };
  }

  const parsed = JSON.parse(saved);
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new TypeError('Las preferencias de sonido guardadas no son válidas.');
  }

  return {
    music: typeof parsed.music === 'boolean' ? parsed.music : true,
    effects: typeof parsed.effects === 'boolean' ? parsed.effects : true,
  };
}

export function saveAudioPreferences(preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}
