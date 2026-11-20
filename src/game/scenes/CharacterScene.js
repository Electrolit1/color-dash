import Phaser from 'phaser';
import createCharacterArt from '../ui/createCharacterArt.js';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';
import {
  CHARACTER_OPTIONS,
  getSelectedCharacter,
  saveSelectedCharacter,
} from '../systems/CharacterPreferences.js';

const CARD_POSITIONS = [130, 310, 490, 670];
const CARD_COLORS = [0xffe6bd, 0xffedc9, 0xf7e5ff, 0xe4f4ed];

export default class CharacterScene extends Phaser.Scene {
  constructor() {
    super('CharacterScene');
  }

  create() {
    this.registry.get('audioManager').playMusic('menuMusic');
    this.selectedCharacter = getSelectedCharacter();
    drawColorfulBackground(this);

    this.add.text(400, 64, 'PERSONAJES', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 112, 'Elige a tu compañero: todos tienen las mismas habilidades', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    this.cardViews = [];
    CHARACTER_OPTIONS.forEach(({ id, label }, index) => {
      const x = CARD_POSITIONS[index];
      const color = CARD_COLORS[index];
      const card = this.add.graphics();
      createCharacterArt(this, id, x, 222, 0.72);
      this.add.text(x, 297, label, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        color: '#5528a8',
      }).setOrigin(0.5);

      const selectButton = createMenuButton(this, {
        x,
        y: 339,
        width: 126,
        height: 38,
        label: '',
        color: 0x48b968,
        fontSize: 12,
        onClick: () => {
          saveSelectedCharacter(id);
          this.selectedCharacter = id;
          this.updateCharacterCards();
        },
      });
      this.cardViews.push({ card, color, id, x, selectButton });
    });

    this.updateCharacterCards();

    createMenuButton(this, {
      x: 400,
      y: 418,
      width: 238,
      height: 46,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 16,
      onClick: () => this.scene.start('MenuScene'),
    });
  }

  updateCharacterCards() {
    this.cardViews.forEach(({ card, color, id, x, selectButton }) => {
      const selected = id === this.selectedCharacter;
      card.clear();
      card.fillStyle(color, 0.9);
      card.fillRoundedRect(x - 72, 136, 144, 235, 22);
      card.lineStyle(selected ? 5 : 3, selected ? 0x48b968 : 0xffffff, 0.98);
      card.strokeRoundedRect(x - 72, 136, 144, 235, 22);
      selectButton.setLabel(selected ? 'SELECCIONADO' : 'SELECCIONAR');
      selectButton.button.setScale(selected ? 1.03 : 1);
    });
  }
}
