import Phaser from 'phaser';
import { Capacitor } from '@capacitor/core';
import './style.css';
import gameConfig from './game/config.js';
import AudioManager from './game/systems/AudioManager.js';

const game = new Phaser.Game(gameConfig);
const audioManager = new AudioManager(game);
game.registry.set('audioManager', audioManager);

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const musicOption = document.getElementById('music-option');
const effectsOption = document.getElementById('effects-option');
const immersiveOption = document.getElementById('immersive-option');
const displayOption = document.getElementById('display-option');
const nativeApp = Capacitor.isNativePlatform();
const mobileBrowser = !nativeApp && window.matchMedia('(pointer: coarse)').matches;

if (!startScreen || !startButton || !musicOption || !effectsOption || !immersiveOption || !displayOption) {
  throw new Error('No se pudo preparar la pantalla de inicio de COLOR DASH.');
}

const savedAudioPreferences = audioManager.getPreferences();
musicOption.checked = savedAudioPreferences.music;
effectsOption.checked = savedAudioPreferences.effects;
displayOption.hidden = !mobileBrowser;

startButton.addEventListener('click', () => {
  audioManager.setMusicEnabled(musicOption.checked);
  audioManager.setEffectsEnabled(effectsOption.checked);
  audioManager.setAudioConsent(true);
  game.sound.unlock();
  startScreen.hidden = true;

  if (mobileBrowser && immersiveOption.checked) {
    void requestImmersiveDisplay();
  }
});

async function requestImmersiveDisplay() {
  const root = document.documentElement;

  if (!document.fullscreenElement && typeof root.requestFullscreen === 'function') {
    try {
      await root.requestFullscreen();
    } catch (error) {
      console.info('Este navegador no permitió activar la pantalla completa.', error);
    }
  }

  if (screen.orientation && typeof screen.orientation.lock === 'function') {
    try {
      await screen.orientation.lock('landscape');
    } catch (error) {
      console.info('Este navegador no permitió fijar la orientación horizontal.', error);
    }
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => game.destroy(true));
}