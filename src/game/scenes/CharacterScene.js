import Phaser from 'phaser';
import createCharacterArt from '../ui/createCharacterArt.js';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';

export default class CharacterScene extends Phaser.Scene {
  constructor() {
    super('CharacterScene');
  }

  create() {
    drawColorfulBackground(this);

    this.add.text(400, 64, 'PERSONAJES', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 112, 'Pronto podrás elegir a tu compañero de aventuras', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    const cards = [
      { x: 220, label: 'GATO', kind: 'cat', color: 0xffe6bd },
      { x: 400, label: 'PERRO', kind: 'dog', color: 0xffedc9 },
      { x: 580, label: 'CONEJO', kind: 'rabbit', color: 0xf7e5ff },
    ];

    cards.forEach(({ x, label, kind, color }) => {
      const card = this.add.graphics();
      card.fillStyle(color, 0.88);
      card.fillRoundedRect(x - 70, 145, 140, 202, 22);
      card.lineStyle(3, 0xffffff, 0.95);
      card.strokeRoundedRect(x - 70, 145, 140, 202, 22);
      createCharacterArt(this, kind, x, 232, 0.94);
      this.add.text(x, 319, label, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        color: '#5528a8',
      }).setOrigin(0.5);
    });

    createMenuButton(this, {
      x: 400,
      y: 391,
      width: 238,
      height: 54,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 16,
      onClick: () => this.scene.start('MenuScene'),
    });
  }
}
