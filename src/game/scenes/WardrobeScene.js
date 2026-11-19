import Phaser from 'phaser';
import createCharacterArt from '../ui/createCharacterArt.js';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';
import { getSelectedCharacter } from '../systems/CharacterPreferences.js';

const ACCESSORIES = [
  { x: 442, label: 'GORROS', color: 0xffe6bd },
  { x: 574, label: 'GAFAS', color: 0xe0f3ff },
  { x: 706, label: 'ACCESORIOS', color: 0xf7e5ff },
];

export default class WardrobeScene extends Phaser.Scene {
  constructor() {
    super('WardrobeScene');
  }

  create() {
    this.registry.get('audioManager').playMusic('menuMusic');
    drawColorfulBackground(this);

    this.add.text(400, 60, 'VESTIMENTA', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 111, 'Personaliza a tu compañero con nuevos estilos', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    createCharacterArt(this, getSelectedCharacter(), 205, 244, 1.15);

    ACCESSORIES.forEach(({ x, label, color }) => {
      const card = this.add.graphics();
      card.fillStyle(color, 0.9);
      card.fillRoundedRect(x - 57, 169, 114, 166, 20);
      card.lineStyle(3, 0xffffff, 0.95);
      card.strokeRoundedRect(x - 57, 169, 114, 166, 20);

      const icon = this.add.graphics();
      icon.lineStyle(5, 0x704c9f, 0.75);
      if (label === 'GORROS') {
        icon.strokeRoundedRect(x - 24, 211, 48, 29, 10);
        icon.beginPath();
        icon.moveTo(x - 32, 240);
        icon.lineTo(x + 32, 240);
        icon.strokePath();
        icon.strokeCircle(x + 18, 209, 6);
      } else if (label === 'GAFAS') {
        icon.strokeCircle(x - 13, 229, 12);
        icon.strokeCircle(x + 13, 229, 12);
        icon.beginPath();
        icon.moveTo(x - 1, 229);
        icon.lineTo(x + 1, 229);
        icon.strokePath();
      } else {
        icon.strokeCircle(x, 227, 24);
        icon.beginPath();
        icon.moveTo(x - 13, 227);
        icon.lineTo(x + 13, 227);
        icon.moveTo(x, 214);
        icon.lineTo(x, 240);
        icon.strokePath();
      }

      this.add.text(x, 278, label, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#5528a8',
      }).setOrigin(0.5);
      this.add.text(x, 307, 'PRÓXIMAMENTE', {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#687b88',
      }).setOrigin(0.5);
    });

    createMenuButton(this, {
      x: 400,
      y: 402,
      width: 238,
      height: 50,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 16,
      onClick: () => this.scene.start('MenuScene'),
    });
  }
}
