import Phaser from 'phaser';
import createMenuButton from '../ui/createMenuButton.js';
import { drawSettingsBackground } from '../ui/drawSceneBackgrounds.js';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create() {
    drawSettingsBackground(this);

    this.add.text(400, 66, 'CONFIGURACIÓN', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 119, 'Activa o desactiva tus preferencias de sonido', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#f5f4ff',
      stroke: '#28366b',
      strokeThickness: 2,
    }).setOrigin(0.5);

    const audioManager = this.registry.get('audioManager');
    const preferences = audioManager.getPreferences();
    const musicButton = createMenuButton(this, {
      x: 400,
      y: 202,
      width: 330,
      height: 62,
      label: this.getPreferenceLabel('MÚSICA', preferences.music),
      color: 0x4c9fe8,
      fontSize: 18,
      onClick: () => {
        preferences.music = !preferences.music;
        audioManager.setMusicEnabled(preferences.music);
        musicButton.setLabel(this.getPreferenceLabel('MÚSICA', preferences.music));
      },
    });

    const effectsButton = createMenuButton(this, {
      x: 400,
      y: 280,
      width: 330,
      height: 62,
      label: this.getPreferenceLabel('EFECTOS', preferences.effects),
      color: 0xe75d99,
      fontSize: 18,
      onClick: () => {
        preferences.effects = !preferences.effects;
        audioManager.setEffectsEnabled(preferences.effects);
        effectsButton.setLabel(this.getPreferenceLabel('EFECTOS', preferences.effects));
      },
    });

    this.add.text(400, 337, 'Las preferencias quedan guardadas en este dispositivo.', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '13px',
      color: '#f5f4ff',
      stroke: '#28366b',
      strokeThickness: 2,
      align: 'center',
    }).setOrigin(0.5);

    createMenuButton(this, {
      x: 400,
      y: 395,
      width: 238,
      height: 54,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 16,
      onClick: () => this.scene.start('MenuScene'),
    });
  }

  getPreferenceLabel(name, enabled) {
    return `${name}: ${enabled ? 'ACTIVADA' : 'DESACTIVADA'}`;
  }
}
