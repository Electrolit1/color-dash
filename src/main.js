import Phaser from 'phaser';
import { Capacitor } from '@capacitor/core';
import './style.css';
import gameConfig from './game/config.js';
import AudioManager from './game/systems/AudioManager.js';

const game = new Phaser.Game(gameConfig);
game.registry.set('audioManager', new AudioManager(game));

if (!Capacitor.isNativePlatform() && window.matchMedia('(pointer: coarse)').matches) {
  document.addEventListener('pointerdown', () => {
    const root = document.documentElement;
    if (document.fullscreenElement || typeof root.requestFullscreen !== 'function') {
      return;
    }

    void root.requestFullscreen().catch((error) => {
      console.info('Este navegador no permitió activar la pantalla completa.', error);
    });
  }, { once: true, passive: true });
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => game.destroy(true));
}