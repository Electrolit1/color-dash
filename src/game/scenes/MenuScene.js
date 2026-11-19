import Phaser from 'phaser';
import createCharacterArt from '../ui/createCharacterArt.js';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.registry.get('audioManager').playMusic('menuMusic');
    drawColorfulBackground(this);

    this.add.text(400, 48, 'COLOR DASH', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '49px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 9,
    }).setOrigin(0.5);

    this.add.text(400, 98, '¡Corre, salta y llena el día de color!', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    createCharacterArt(this, 'cat', 257, 204, 0.88);
    createCharacterArt(this, 'dog', 400, 204, 0.9);
    createCharacterArt(this, 'rabbit', 543, 204, 0.88);

    const buttons = [
      {
        x: 276,
        y: 286,
        label: 'JUGAR',
        color: 0xf07832,
        onClick: () => this.scene.start('LevelSelectScene'),
      },
      {
        x: 524,
        y: 286,
        label: 'PERSONAJES',
        color: 0x48b968,
        fontSize: 17,
        onClick: () => this.scene.start('CharacterScene'),
      },
      {
        x: 276,
        y: 354,
        label: 'RÉCORDS',
        color: 0x6f50d7,
        onClick: () => this.scene.start('RecordsScene'),
      },
      {
        x: 524,
        y: 354,
        label: 'CONFIGURACIÓN',
        color: 0xe75d99,
        fontSize: 16,
        onClick: () => this.scene.start('SettingsScene'),
      },
    ];

    buttons.forEach((button) => {
      createMenuButton(this, { ...button, width: 224, height: 58 });
    });

    this.add.text(400, 420, 'Toca un botón para comenzar', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#31844b',
      strokeThickness: 4,
    }).setOrigin(0.5);
  }
}
