import Phaser from 'phaser';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';

export default class RecordsScene extends Phaser.Scene {
  constructor() {
    super('RecordsScene');
  }

  create() {
    drawColorfulBackground(this);

    const storedScore = Number(localStorage.getItem('colorDashBestScore') ?? 0);
    const bestScore = Number.isFinite(storedScore) && storedScore > 0
      ? Math.floor(storedScore)
      : 0;

    this.add.text(400, 76, 'RÉCORDS', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    const card = this.add.graphics();
    card.fillStyle(0xffffff, 0.9);
    card.fillRoundedRect(270, 140, 260, 154, 28);
    card.lineStyle(3, 0xffffff);
    card.strokeRoundedRect(270, 140, 260, 154, 28);

    this.add.star(400, 178, 5, 15, 29, 0xffc83d)
      .setStrokeStyle(3, 0xf3a62d);
    this.add.text(400, 221, 'RÉCORD ACTUAL', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#6942ac',
      letterSpacing: 1,
    }).setOrigin(0.5);
    this.add.text(400, 260, bestScore.toLocaleString('es'), {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#f07832',
    }).setOrigin(0.5);

    this.add.text(400, 327, 'Tu mejor puntuación se guarda en este dispositivo.', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '15px',
      color: '#3e6380',
      align: 'center',
    }).setOrigin(0.5);

    createMenuButton(this, {
      x: 400,
      y: 390,
      width: 238,
      height: 54,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 16,
      onClick: () => this.scene.start('MenuScene'),
    });
  }
}
