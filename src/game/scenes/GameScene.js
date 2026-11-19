import Phaser from 'phaser';
import createMenuButton from '../ui/createMenuButton.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create(data = {}) {
    const levelId = Number.isInteger(data.levelId) && data.levelId > 0
      ? data.levelId
      : 1;

    this.registry.get('audioManager').playMusic('gameMusic');

    const sky = this.add.graphics();
    sky.fillStyle(0xffdf72);
    sky.fillCircle(704, 78, 42);

    const clouds = this.add.graphics();
    clouds.fillStyle(0xffffff, 0.88);
    clouds.fillCircle(130, 102, 24);
    clouds.fillCircle(158, 91, 32);
    clouds.fillCircle(192, 104, 22);
    clouds.fillCircle(505, 78, 18);
    clouds.fillCircle(529, 69, 25);
    clouds.fillCircle(555, 81, 18);

    this.tweens.add({
      targets: clouds,
      x: 16,
      duration: 3600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });

    const scenery = this.add.graphics();
    scenery.fillStyle(0x86dc88);
    scenery.fillEllipse(120, 338, 300, 100);
    scenery.fillEllipse(678, 340, 330, 112);
    scenery.fillStyle(0x58c978);
    scenery.fillRect(0, 340, 800, 110);
    scenery.fillStyle(0x45b967);
    scenery.fillRect(0, 340, 800, 8);

    this.add.text(400, 150, `NIVEL ${levelId}`, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 9,
    }).setOrigin(0.5);

    this.add.text(400, 207, 'La aventura de este nivel está en preparación.', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#3e3260',
    }).setOrigin(0.5);

    const status = this.add.graphics();
    status.fillStyle(0xffffff, 0.88);
    status.fillRoundedRect(277, 266, 246, 42, 21);

    this.add.text(400, 287, 'ESCENA DE JUEGO PROVISIONAL', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#6942ac',
      letterSpacing: 1,
    }).setOrigin(0.5);

    createMenuButton(this, {
      x: 400,
      y: 385,
      width: 238,
      height: 54,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 16,
      onClick: () => this.scene.start('MenuScene'),
    });
  }
}
