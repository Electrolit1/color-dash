import Phaser from 'phaser';
import createMenuButton from '../ui/createMenuButton.js';

export default class PauseOverlayScene extends Phaser.Scene {
  constructor() {
    super('PauseOverlayScene');
  }

  create(data = {}) {
    this.returnSceneKey = typeof data.returnSceneKey === 'string'
      ? data.returnSceneKey
      : 'Stage1Scene';
    this.levelId = Number.isInteger(data.levelId) && data.levelId > 0
      ? data.levelId
      : 1;
    this.audio = this.registry.get('audioManager');

    const veil = this.add.graphics().setDepth(100);
    veil.fillStyle(0x241a3e, 0.72);
    veil.fillRect(0, 0, 800, 450);

    const panel = this.add.graphics().setDepth(101);
    panel.fillStyle(0x30264a, 0.22);
    panel.fillRoundedRect(151, 49, 502, 358, 28);
    panel.fillStyle(0xfffcff, 0.98);
    panel.fillRoundedRect(150, 42, 500, 358, 28);
    panel.lineStyle(4, 0xffffff, 0.98);
    panel.strokeRoundedRect(150, 42, 500, 358, 28);

    this.add.text(400, 86, 'PAUSA', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(102);

    createMenuButton(this, {
      x: 400,
      y: 145,
      width: 270,
      height: 48,
      label: 'REANUDAR',
      color: 0x48b968,
      fontSize: 17,
      onClick: () => this.resumeGame(),
    });
    createMenuButton(this, {
      x: 400,
      y: 205,
      width: 270,
      height: 48,
      label: 'REINICIAR NIVEL',
      color: 0xf07832,
      fontSize: 16,
      onClick: () => this.restartLevel(),
    });

    this.musicButton = createMenuButton(this, {
      x: 284,
      y: 274,
      width: 220,
      height: 46,
      label: '',
      color: 0x6f50d7,
      fontSize: 14,
      onClick: () => {
        this.audio.setMusicEnabled(!this.audio.getPreferences().music);
        this.updateAudioLabels();
      },
    });
    this.effectsButton = createMenuButton(this, {
      x: 516,
      y: 274,
      width: 220,
      height: 46,
      label: '',
      color: 0xe75d99,
      fontSize: 14,
      onClick: () => {
        this.audio.setEffectsEnabled(!this.audio.getPreferences().effects);
        this.updateAudioLabels();
      },
    });

    createMenuButton(this, {
      x: 400,
      y: 347,
      width: 270,
      height: 48,
      label: 'VOLVER AL MENÚ',
      color: 0x58728f,
      fontSize: 16,
      onClick: () => this.returnToMenu(),
    });
    this.updateAudioLabels();

    this.input.keyboard.on('keydown-ESC', this.resumeGame, this);
    this.input.keyboard.on('keydown-P', this.resumeGame, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard.off('keydown-ESC', this.resumeGame, this);
      this.input.keyboard.off('keydown-P', this.resumeGame, this);
    });
  }

  updateAudioLabels() {
    const preferences = this.audio.getPreferences();
    this.musicButton.setLabel(`MÚSICA: ${preferences.music ? 'SÍ' : 'NO'}`);
    this.effectsButton.setLabel(`EFECTOS: ${preferences.effects ? 'SÍ' : 'NO'}`);
  }

  resumeGame() {
    this.scene.stop();
    this.scene.resume(this.returnSceneKey);
  }

  restartLevel() {
    this.scene.stop(this.returnSceneKey);
    this.scene.start('GameScene', { levelId: this.levelId });
  }

  returnToMenu() {
    this.scene.stop(this.returnSceneKey);
    this.scene.start('MenuScene');
  }
}
