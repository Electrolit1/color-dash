import { getAudioPreferences, saveAudioPreferences } from './AudioPreferences.js';

const MUSIC_VOLUME = 0.35;
const DEFAULT_EFFECT_VOLUME = 0.8;

export default class AudioManager {
  constructor(game) {
    this.game = game;
    this.preferences = getAudioPreferences();
    this.currentMusicKey = null;
    this.musicSound = null;
    this.activeEffects = new Set();
    this.pendingEffects = [];
    this.unlockListenerAttached = false;
    this.audioConsent = false;
  }

  getPreferences() {
    return { ...this.preferences };
  }

  setAudioConsent(consented) {
    this.audioConsent = consented;
    if (consented && this.currentMusicKey) {
      this.playMusic(this.currentMusicKey);
    }
  }

  playMusic(key) {
    if (this.currentMusicKey === key && this.musicSound && this.musicSound.isPlaying) {
      return;
    }

    this.stopMusicSound();
    this.currentMusicKey = key;

    if (!this.audioConsent || !this.preferences.music || !this.game.cache.audio.exists(key)) {
      return;
    }

    if (this.game.sound.locked) {
      this.waitForAudioUnlock();
      return;
    }

    this.startMusic(key);
  }

  playSfx(key, volume = DEFAULT_EFFECT_VOLUME) {
    if (!this.audioConsent || !this.preferences.effects || !this.game.cache.audio.exists(key)) {
      return;
    }

    if (this.game.sound.locked) {
      this.pendingEffects.push({ key, volume });
      this.waitForAudioUnlock();
      this.game.sound.unlock();
      return;
    }

    const sound = this.game.sound.add(key, { volume });
    this.activeEffects.add(sound);
    sound.once('complete', () => {
      this.activeEffects.delete(sound);
      sound.destroy();
    });
    sound.play();
  }

  setMusicEnabled(enabled) {
    this.preferences.music = enabled;
    saveAudioPreferences(this.preferences);

    if (this.musicSound) {
      this.musicSound.setMute(!enabled);
    } else if (enabled && this.currentMusicKey) {
      this.playMusic(this.currentMusicKey);
    }
  }

  setEffectsEnabled(enabled) {
    this.preferences.effects = enabled;
    saveAudioPreferences(this.preferences);

    if (!enabled) {
      this.activeEffects.forEach((sound) => {
        sound.stop();
        sound.destroy();
      });
      this.activeEffects.clear();
      this.pendingEffects = [];
    }
  }

  startMusic(key) {
    this.musicSound = this.game.sound.add(key, {
      loop: true,
      volume: MUSIC_VOLUME,
    });
    this.musicSound.play();
  }

  stopMusicSound() {
    if (!this.musicSound) {
      return;
    }

    this.musicSound.stop();
    this.musicSound.destroy();
    this.musicSound = null;
  }

  waitForAudioUnlock() {
    if (this.unlockListenerAttached) {
      return;
    }

    this.unlockListenerAttached = true;
    this.game.sound.once('unlocked', () => {
      this.unlockListenerAttached = false;

      if (this.currentMusicKey && this.preferences.music && !this.musicSound) {
        const key = this.currentMusicKey;
        if (this.game.cache.audio.exists(key)) {
          this.startMusic(key);
        }
      }

      const queuedEffects = this.pendingEffects;
      this.pendingEffects = [];
      queuedEffects.forEach(({ key, volume }) => this.playSfx(key, volume));
    });
  }
}
