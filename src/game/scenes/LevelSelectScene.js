import Phaser from 'phaser';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';
import { STAGE_CONFIGS } from './stages/stageConfigs.js';

const LEVEL_COUNT = STAGE_CONFIGS.length;
const LEVELS_PER_PAGE = 5;
const LEVEL_POSITIONS = [88, 244, 400, 556, 712];
const STAR_POSITIONS = [-20, 0, 20];

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    this.registry.get('audioManager').playMusic('menuMusic');
    this.currentPage = 0;
    const storedUnlockedLevel = Number(localStorage.getItem('colorDashUnlockedLevel') ?? 1);
    this.highestUnlockedLevel = Number.isFinite(storedUnlockedLevel)
      ? Phaser.Math.Clamp(Math.floor(storedUnlockedLevel), 1, LEVEL_COUNT)
      : 1;
    drawColorfulBackground(this);

    this.add.text(400, 61, 'SELECCIONA UN NIVEL', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 109, `${LEVEL_COUNT} pistas, peligros y dificultad creciente`, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    this.levelContents = this.add.container(0, 0);

    this.lockedMessage = this.add.text(400, 350, '', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#5528a8',
      backgroundColor: '#ffffff',
      padding: { x: 12, y: 8 },
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    this.pageText = this.add.text(400, 388, '', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#5528a8',
    }).setOrigin(0.5);
    this.previousPageButton = createMenuButton(this, {
      x: 230,
      y: 388,
      width: 144,
      height: 42,
      label: 'ANTERIOR',
      color: 0x6f50d7,
      fontSize: 13,
      onClick: () => this.changePage(-1),
    });
    this.nextPageButton = createMenuButton(this, {
      x: 570,
      y: 388,
      width: 144,
      height: 42,
      label: 'SIGUIENTE',
      color: 0x48b968,
      fontSize: 13,
      onClick: () => this.changePage(1),
    });
    this.createLevelNodes();

    createMenuButton(this, {
      x: 400,
      y: 428,
      width: 224,
      height: 40,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 14,
      onClick: () => this.scene.start('MenuScene'),
    });
  }

  createLevelNodes() {
    this.levelContents.removeAll(true);
    const firstLevel = this.currentPage * LEVELS_PER_PAGE + 1;
    const lastLevel = Math.min(LEVEL_COUNT, firstLevel + LEVELS_PER_PAGE - 1);

    for (let levelId = firstLevel; levelId <= lastLevel; levelId++) {
      const unlocked = levelId <= this.highestUnlockedLevel;
      const stageConfig = STAGE_CONFIGS[levelId - 1];
      const savedStars = Number(localStorage.getItem(`colorDashLevel${levelId}Stars`) ?? 0);
      const earnedStars = unlocked && Number.isFinite(savedStars)
        ? Phaser.Math.Clamp(Math.floor(savedStars), 0, 3)
        : 0;
      const x = LEVEL_POSITIONS[(levelId - 1) % LEVELS_PER_PAGE];
      const y = 218;
      const node = this.add.container(x - 43, y - 43);
      const graphics = this.add.graphics();

      graphics.fillStyle(0x30264a, 0.18);
      graphics.fillCircle(43, 48, 43);
      graphics.fillStyle(unlocked ? 0xf07832 : 0x9eabb7);
      graphics.fillCircle(43, 43, 40);
      graphics.lineStyle(4, 0xffffff, 0.95);
      graphics.strokeCircle(43, 43, 40);

      if (unlocked) {
        this.addLevelNumber(node, levelId);
      } else {
        this.addLockIcon(node);
      }

      node.add(graphics);
      node.sendToBack(graphics);
      node.setSize(86, 86);
      this.levelContents.add(node);
      const hitArea = this.add.zone(x, y, 86, 86);
      hitArea.setInteractive(
        new Phaser.Geom.Circle(43, 43, 43),
        Phaser.Geom.Circle.Contains,
      );
      hitArea.input.cursor = 'pointer';

      hitArea.on('pointerover', () => this.animateNode(node, 1.06));
      hitArea.on('pointerout', () => this.animateNode(node, 1));
      hitArea.on('pointerdown', () => this.animateNode(node, 0.95));
      hitArea.on('pointerup', () => {
        this.animateNode(node, 1.06);
        this.registry.get('audioManager').playSfx('button');
        if (unlocked) {
          this.scene.start('GameScene', { levelId });
          return;
        }

        this.showLockedMessage(levelId);
      });

      this.levelContents.add(hitArea);
      this.levelContents.add(this.add.text(x, 274, `NIVEL ${levelId}`, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: unlocked ? '#5528a8' : '#687b88',
      }).setOrigin(0.5));

      this.levelContents.add(this.add.text(x, 293, stageConfig.shortName, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: unlocked ? '#3e6380' : '#687b88',
      }).setOrigin(0.5));

      STAR_POSITIONS.forEach((offset, index) => {
        const star = this.add.star(x + offset, 316, 5, 5, 11, 0xffc83d)
          .setStrokeStyle(1, 0x9d8042, 0.7)
          .setAlpha(index < earnedStars ? 1 : 0.42);
        this.levelContents.add(star);
      });

      this.levelContents.add(this.add.text(x, 338, `${stageConfig.difficulty}${stageConfig.mode === 'night' ? ' · NOCHE' : ''}`, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '9px',
        fontStyle: 'bold',
        color: stageConfig.mode === 'night' ? '#4c4a83' : '#3e6380',
      }).setOrigin(0.5));
    }

    if (this.pageText && this.previousPageButton && this.nextPageButton) {
      this.updatePageControls();
    }
  }

  changePage(direction) {
    const pageCount = Math.ceil(LEVEL_COUNT / LEVELS_PER_PAGE);
    this.currentPage = Phaser.Math.Clamp(this.currentPage + direction, 0, pageCount - 1);
    this.lockedMessage.setAlpha(0);
    this.createLevelNodes();
  }

  updatePageControls() {
    const pageCount = Math.ceil(LEVEL_COUNT / LEVELS_PER_PAGE);
    const firstLevel = this.currentPage * LEVELS_PER_PAGE + 1;
    const lastLevel = Math.min(LEVEL_COUNT, firstLevel + LEVELS_PER_PAGE - 1);
    this.pageText.setText(`PISTAS ${firstLevel}–${lastLevel} · PÁGINA ${this.currentPage + 1}/${pageCount}`);
    this.previousPageButton.button.setVisible(this.currentPage > 0);
    this.nextPageButton.button.setVisible(this.currentPage < pageCount - 1);
  }

  addLevelNumber(node, levelId) {
    const number = this.add.text(43, 43, String(levelId), {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#9e451a',
      strokeThickness: 4,
    }).setOrigin(0.5);
    node.add(number);
  }

  addLockIcon(node) {
    const lock = this.add.graphics();
    lock.lineStyle(4, 0xffffff, 0.95);
    lock.strokeCircle(43, 35, 11);
    lock.fillStyle(0x586776);
    lock.fillRoundedRect(29, 35, 28, 23, 5);
    lock.lineStyle(2, 0xffffff, 0.85);
    lock.strokeRoundedRect(29, 35, 28, 23, 5);
    lock.fillStyle(0xffffff, 0.9);
    lock.fillCircle(43, 44, 2.5);
    lock.fillRoundedRect(41.5, 45, 3, 6, 1);
    node.add(lock);
  }

  animateNode(node, scale) {
    this.tweens.killTweensOf(node);
    this.tweens.add({
      targets: node,
      scaleX: scale,
      scaleY: scale,
      duration: 130,
      ease: 'Back.Out',
    });
  }

  showLockedMessage(levelId) {
    this.lockedMessage
      .setText(`Completa el nivel ${levelId - 1} para desbloquear este nivel.`)
      .setAlpha(1);
    this.tweens.killTweensOf(this.lockedMessage);
    this.tweens.add({
      targets: this.lockedMessage,
      alpha: 0,
      delay: 1700,
      duration: 450,
    });
  }
}
