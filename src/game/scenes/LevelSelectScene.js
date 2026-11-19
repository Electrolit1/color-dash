import Phaser from 'phaser';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';

const LEVEL_COUNT = 5;
const LEVEL_POSITIONS = [88, 244, 400, 556, 712];
const STAR_POSITIONS = [-20, 0, 20];

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    this.registry.get('audioManager').playMusic('menuMusic');
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

    this.add.text(400, 109, 'Completa cada nivel para desbloquear el siguiente', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    this.createLevelNodes();

    this.lockedMessage = this.add.text(400, 350, '', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#5528a8',
      backgroundColor: '#ffffff',
      padding: { x: 12, y: 8 },
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    createMenuButton(this, {
      x: 400,
      y: 408,
      width: 238,
      height: 50,
      label: 'VOLVER AL MENÚ',
      color: 0x6f50d7,
      fontSize: 16,
      onClick: () => this.scene.start('MenuScene'),
    });
  }

  createLevelNodes() {
    for (let levelId = 1; levelId <= LEVEL_COUNT; levelId++) {
      const unlocked = levelId <= this.highestUnlockedLevel;
      const savedStars = Number(localStorage.getItem(`colorDashLevel${levelId}Stars`) ?? 0);
      const earnedStars = unlocked && Number.isFinite(savedStars)
        ? Phaser.Math.Clamp(Math.floor(savedStars), 0, 3)
        : 0;
      const x = LEVEL_POSITIONS[levelId - 1];
      const y = 218;
      const node = this.add.container(x, y);
      const graphics = this.add.graphics();

      graphics.fillStyle(0x30264a, 0.18);
      graphics.fillCircle(0, 5, 43);
      graphics.fillStyle(unlocked ? 0xf07832 : 0x9eabb7);
      graphics.fillCircle(0, 0, 40);
      graphics.lineStyle(4, 0xffffff, 0.95);
      graphics.strokeCircle(0, 0, 40);

      if (unlocked) {
        this.addLevelNumber(node, levelId);
      } else {
        this.addLockIcon(node);
      }

      node.add(graphics);
      node.sendToBack(graphics);
      node.setSize(86, 86);
      node.setInteractive(
        new Phaser.Geom.Circle(0, 0, 43),
        Phaser.Geom.Circle.Contains,
      );
      node.input.cursor = 'pointer';

      node.on('pointerover', () => this.animateNode(node, 1.06));
      node.on('pointerout', () => this.animateNode(node, 1));
      node.on('pointerdown', () => this.animateNode(node, 0.95));
      node.on('pointerup', () => {
        this.animateNode(node, 1.06);
        this.registry.get('audioManager').playSfx('button');
        if (unlocked) {
          this.scene.start('GameScene', { levelId });
          return;
        }

        this.showLockedMessage(levelId);
      });

      this.add.text(x, 278, `NIVEL ${levelId}`, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: unlocked ? '#5528a8' : '#687b88',
      }).setOrigin(0.5);

      STAR_POSITIONS.forEach((offset, index) => {
        this.add.star(x + offset, 310, 5, 5, 11, 0xffc83d)
          .setStrokeStyle(1, 0x9d8042, 0.7)
          .setAlpha(index < earnedStars ? 1 : 0.42);
      });
    }
  }

  addLevelNumber(node, levelId) {
    const number = this.add.text(0, 0, String(levelId), {
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
    lock.strokeCircle(0, -8, 11);
    lock.fillStyle(0x586776);
    lock.fillRoundedRect(-14, -8, 28, 23, 5);
    lock.lineStyle(2, 0xffffff, 0.85);
    lock.strokeRoundedRect(-14, -8, 28, 23, 5);
    lock.fillStyle(0xffffff, 0.9);
    lock.fillCircle(0, 1, 2.5);
    lock.fillRoundedRect(-1.5, 2, 3, 6, 1);
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
