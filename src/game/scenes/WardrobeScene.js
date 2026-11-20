import Phaser from 'phaser';
import createCharacterArt from '../ui/createCharacterArt.js';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';
import { getSelectedCharacter } from '../systems/CharacterPreferences.js';
import {
  getHighestUnlockedLevel,
  getSelectedOutfit,
  OUTFIT_OPTIONS,
  saveSelectedOutfit,
} from '../systems/OutfitPreferences.js';

const CARD_POSITIONS = [
  { x: 368, y: 190 },
  { x: 510, y: 190 },
  { x: 652, y: 190 },
  { x: 368, y: 292 },
  { x: 510, y: 292 },
  { x: 652, y: 292 },
];

export default class WardrobeScene extends Phaser.Scene {
  constructor() {
    super('WardrobeScene');
  }

  create() {
    this.registry.get('audioManager').playMusic('menuMusic');
    this.selectedOutfit = getSelectedOutfit();
    this.unlockedLevel = getHighestUnlockedLevel();
    drawColorfulBackground(this);

    this.add.text(400, 49, 'ARMARIO DE AVENTURAS', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 88, `DESBLOQUEA ESTILOS AL LLEGAR A NUEVOS NIVELES · ${this.unlockedLevel}/20`, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    createCharacterArt(
      this,
      getSelectedCharacter(),
      143,
      237,
      1.02,
      false,
      this.selectedOutfit,
    );
    this.add.text(143, 313, 'TU COMPAÑERO', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#5528a8',
    }).setOrigin(0.5);
    this.add.text(143, 344, 'El estilo elegido\nte acompaña al jugar', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '12px',
      color: '#3e6380',
      align: 'center',
    }).setOrigin(0.5);

    this.messageText = this.add.text(400, 375, '', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#5528a8',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 6 },
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    this.createOutfitCards();
    createMenuButton(this, {
      x: 400,
      y: 422,
      width: 230,
      height: 46,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 15,
      onClick: () => this.scene.start('MenuScene'),
    });
  }

  createOutfitCards() {
    OUTFIT_OPTIONS.forEach((outfit, index) => {
      const { x, y } = CARD_POSITIONS[index];
      const unlocked = outfit.unlockLevel <= this.unlockedLevel;
      const selected = outfit.id === this.selectedOutfit;
      const card = this.add.graphics();
      card.fillStyle(unlocked ? 0xfff8e9 : 0xe0e3e8, 0.96);
      card.fillRoundedRect(x - 64, y - 43, 128, 86, 15);
      card.lineStyle(selected ? 4 : 2, selected ? 0x48b968 : 0xffffff, 0.98);
      card.strokeRoundedRect(x - 64, y - 43, 128, 86, 15);

      createCharacterArt(
        this,
        getSelectedCharacter(),
        x,
        y - 17,
        0.25,
        false,
        outfit.id,
      );
      this.add.text(x, y + 8, outfit.label, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '9px',
        fontStyle: 'bold',
        color: unlocked ? '#5528a8' : '#687b88',
        align: 'center',
        wordWrap: { width: 118 },
      }).setOrigin(0.5);
      this.add.text(x, y + 28, selected ? 'EQUIPADO' : unlocked ? 'DESBLOQUEADO' : `NIVEL ${outfit.unlockLevel}`, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '9px',
        fontStyle: 'bold',
        color: selected ? '#358b4d' : '#687b88',
      }).setOrigin(0.5);

      const hitArea = this.add.zone(x, y, 128, 86).setInteractive();
      hitArea.input.cursor = 'pointer';
      hitArea.on('pointerup', () => {
        this.registry.get('audioManager').playSfx('button');
        if (!unlocked) {
          this.showMessage(`¡Casi! Llega al nivel ${outfit.unlockLevel} para ganar este estilo.`);
          return;
        }

        if (selected) {
          return;
        }

        saveSelectedOutfit(outfit.id);
        this.registry.get('audioManager').playSfx('unlock');
        this.scene.restart();
      });
    });
  }

  showMessage(message) {
    this.messageText.setText(message).setAlpha(1);
    this.tweens.killTweensOf(this.messageText);
    this.tweens.add({
      targets: this.messageText,
      alpha: 0,
      delay: 1900,
      duration: 300,
    });
  }
}
