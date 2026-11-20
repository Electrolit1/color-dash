import Phaser from 'phaser';
import createCharacterArt from '../ui/createCharacterArt.js';
import createMenuButton from '../ui/createMenuButton.js';
import createStageControl from '../ui/createStageControl.js';
import drawStageBackground from '../ui/drawStageBackground.js';
import { getSelectedCharacter } from '../systems/CharacterPreferences.js';
import { getSelectedOutfit } from '../systems/OutfitPreferences.js';
import { calculateStageStars, getStageConfig } from './stages/stageConfigs.js';

const PLAYER_X = 155;
const PLAYER_WIDTH = 36;
const PLAYER_HEIGHT = 54;
const CROUCH_HEIGHT = 30;
const COIN_RADIUS = 12;
const WATER_THEMES = new Set(['ocean', 'deep-ocean', 'river', 'waterfall']);
const FOREST_THEMES = new Set(['jungle', 'autumn', 'meadow', 'tropical']);
const SPACE_THEMES = new Set(['space', 'planet', 'moon', 'galaxy', 'robot', 'crystal']);

function getStageMusicKey(theme) {
  if (WATER_THEMES.has(theme)) {
    return 'waterMusic';
  }
  if (FOREST_THEMES.has(theme)) {
    return 'forestMusic';
  }
  if (SPACE_THEMES.has(theme)) {
    return 'spaceMusic';
  }
  return 'gameMusic';
}

export default class StageScene extends Phaser.Scene {
  constructor() {
    super('StageScene');
  }

  create(data = {}) {
    this.stageConfig = getStageConfig(data.levelId);
    this.levelId = this.stageConfig.id;
    this.audio = this.registry.get('audioManager');
    this.audio.playMusic(getStageMusicKey(this.stageConfig.theme));
    this.background = drawStageBackground(this, this.stageConfig);
    this.worldDistance = 0;
    this.playerFeetY = this.stageConfig.floorY;
    this.playerVelocityY = 0;
    this.isGrounded = true;
    this.isFalling = false;
    this.isCrouching = false;
    this.airJumpsUsed = 0;
    this.jumpFatigue = 0;
    this.shieldRemaining = 0;
    this.powerMessageRemaining = 0;
    this.crouchHeld = false;
    this.hasEnded = false;
    this.pauseOpen = false;
    this.collectedCoins = 0;
    this.collectedOrbs = 0;
    this.hits = 0;
    this.score = 0;
    this.scoreFraction = 0;
    this.bonusRemaining = 0;
    this.entities = [];
    this.nextEventIndex = 0;

    this.keys = this.input.keyboard.addKeys({
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      jumpUp: Phaser.Input.Keyboard.KeyCodes.UP,
      crouch: Phaser.Input.Keyboard.KeyCodes.DOWN,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
      pauseP: Phaser.Input.Keyboard.KeyCodes.P,
    });
    this.events.on(Phaser.Scenes.Events.RESUME, () => {
      this.pauseOpen = false;
    });

    this.playerArt = createCharacterArt(
      this,
      getSelectedCharacter(),
      PLAYER_X,
      this.stageConfig.floorY - 30,
      0.58,
      false,
      getSelectedOutfit(),
    ).setDepth(10);
    this.playerShield = this.add.graphics().setDepth(11);

    this.createHud();
    this.createControls();
  }

  createHud() {
    const panel = this.add.graphics().setDepth(20);
    panel.fillStyle(0x30264a, 0.14);
    panel.fillRoundedRect(20, 12, 760, 53, 16);
    panel.fillStyle(0xffffff, 0.87);
    panel.fillRoundedRect(20, 8, 760, 53, 16);

    const textStyle = {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#5528a8',
    };

    this.scoreText = this.add.text(40, 35, 'PUNTOS 0', textStyle)
      .setOrigin(0, 0.5)
      .setDepth(21);
    this.coinsText = this.add.text(400, 35, `MONEDAS 0/${this.stageConfig.totalCoins}`, textStyle)
      .setOrigin(0.5)
      .setDepth(21);
    this.timeText = this.add.text(760, 35, '00:00', textStyle)
      .setOrigin(1, 0.5)
      .setDepth(21);

    this.progressTrack = this.add.graphics().setDepth(20);
    this.progressTrack.fillStyle(0xffffff, 0.8);
    this.progressTrack.fillRoundedRect(30, 71, 740, 10, 5);
    this.progressBar = this.add.graphics().setDepth(21);

    this.segmentText = this.add.text(400, 97, 'TRAMO 1/3', {
      ...textStyle,
      fontSize: '13px',
      color: '#35744b',
    }).setOrigin(0.5).setDepth(21);
    this.add.text(192, 124, 'ENERGÍA', {
      ...textStyle,
      fontSize: '11px',
    }).setOrigin(1, 0.5).setDepth(21);
    const energyTrack = this.add.graphics().setDepth(20);
    energyTrack.fillStyle(0x30264a, 0.22);
    energyTrack.fillRoundedRect(203, 117, 140, 14, 7);
    energyTrack.lineStyle(2, 0xffffff, 0.9);
    energyTrack.strokeRoundedRect(203, 117, 140, 14, 7);
    this.jumpEnergyBar = this.add.graphics().setDepth(21);
    createMenuButton(this, {
      x: 714,
      y: 97,
      width: 108,
      height: 36,
      label: 'PAUSAR',
      color: 0x6f50d7,
      fontSize: 13,
      onClick: () => this.openPause(),
    }).button.setDepth(22);
    this.bonusText = this.add.text(550, 124, '', {
      ...textStyle,
      fontSize: '14px',
      color: '#a54fce',
      stroke: '#ffffff',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(21).setAlpha(0);
    this.powerMessageText = this.add.text(550, 145, '', {
      ...textStyle,
      fontSize: '12px',
      color: '#347dce',
      stroke: '#ffffff',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(21).setAlpha(0);
    this.updateJumpEnergyHud();
  }

  createControls() {
    createStageControl(this, {
      x: 122,
      label: 'AGACHARSE',
      color: 0x48b968,
      onPress: () => {
        this.crouchHeld = true;
      },
      onRelease: () => {
        this.crouchHeld = false;
      },
      width: 158,
    }).setDepth(25);

    createStageControl(this, {
      x: 680,
      label: 'SALTAR',
      color: 0xf07832,
      onPress: () => this.tryJump(),
      onRelease: () => {},
      width: 142,
    }).setDepth(25);
  }

  update(_time, delta) {
    if (this.hasEnded) {
      return;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.pause)
      || Phaser.Input.Keyboard.JustDown(this.keys.pauseP)
    ) {
      this.openPause();
      return;
    }

    const seconds = Math.min(delta / 1000, 0.05);
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.jump)
      || Phaser.Input.Keyboard.JustDown(this.keys.jumpUp);

    this.isCrouching = this.isGrounded && (this.crouchHeld || this.keys.crouch.isDown);
    if (jumpPressed) {
      this.tryJump();
    }

    this.worldDistance = Math.min(
      this.stageConfig.finishDistance,
      this.worldDistance + this.stageConfig.speed * seconds,
    );
    this.updatePlayer(seconds);
    if (this.hasEnded) {
      return;
    }
    this.updateBackground(seconds);
    this.spawnUpcomingEvents();
    this.updateEntities(seconds);
    if (this.hasEnded) {
      return;
    }

    this.bonusRemaining = Math.max(0, this.bonusRemaining - seconds);
    this.shieldRemaining = Math.max(0, this.shieldRemaining - seconds);
    this.powerMessageRemaining = Math.max(0, this.powerMessageRemaining - seconds);
    this.scoreFraction += this.stageConfig.speed * seconds
      * (this.bonusRemaining > 0 ? 2 : 1) / 10;
    this.score = Math.floor(this.scoreFraction);
    this.updateHud();

    if (this.worldDistance >= this.stageConfig.finishDistance) {
      this.finishLevel(true);
    }
  }

  tryJump() {
    const fatigueAfterJump = this.jumpFatigue + this.stageConfig.jumpFatiguePerJump;
    if (
      this.isCrouching
      || this.hasEnded
      || fatigueAfterJump > this.stageConfig.jumpFatigueMax
    ) {
      return;
    }

    if (this.isGrounded) {
      this.isGrounded = false;
      this.isFalling = false;
      this.airJumpsUsed = 0;
      this.playerVelocityY = this.stageConfig.jumpVelocity;
    } else if (!this.isFalling && this.airJumpsUsed === 0) {
      this.airJumpsUsed = 1;
      this.playerVelocityY = this.stageConfig.doubleJumpVelocity;
    } else {
      return;
    }

    this.jumpFatigue = fatigueAfterJump;
    this.audio.playSfx('jump');
  }

  openPause() {
    if (this.pauseOpen || this.hasEnded) {
      return;
    }

    this.pauseOpen = true;
    this.scene.pause();
    this.scene.launch('PauseOverlayScene', {
      returnSceneKey: this.sys.settings.key,
      levelId: this.stageConfig.id,
    });
  }

  updatePlayer(seconds) {
    const overGap = this.isPlayerOverGap();
    if (this.isGrounded && overGap) {
      this.isGrounded = false;
      this.isFalling = true;
      this.playerVelocityY = 80;
    }

    if (!this.isGrounded) {
      this.playerVelocityY += this.stageConfig.gravity * seconds;
      this.playerFeetY += this.playerVelocityY * seconds;
      if (this.isFalling && this.playerFeetY > this.stageConfig.floorY + 50) {
        this.hits += 1;
        this.audio.playSfx('splash');
        this.finishLevel(false, 'gap');
        return;
      }

      if (!this.isFalling && this.playerFeetY >= this.stageConfig.floorY) {
        this.playerFeetY = this.stageConfig.floorY;
        this.playerVelocityY = 0;
        if (overGap) {
          this.isFalling = true;
          this.playerVelocityY = 80;
        } else {
          this.isGrounded = true;
          this.airJumpsUsed = 0;
        }
      }
    }

    if (this.isGrounded) {
      this.jumpFatigue = Math.max(
        0,
        this.jumpFatigue - this.stageConfig.jumpFatigueRecovery * seconds,
      );
    }

    const bodyHeight = this.isCrouching ? CROUCH_HEIGHT : PLAYER_HEIGHT;
    const runningBob = this.isGrounded && !this.isCrouching
      ? Math.sin(this.worldDistance * 0.07) * 1.7
      : 0;
    const artScaleY = this.isCrouching ? 0.3 : 0.58;
    const artOffsetY = this.isCrouching ? 15 : 30;

    this.playerShield.clear();
    if (this.shieldRemaining > 0) {
      this.playerShield.lineStyle(4, 0x55e6f4, 0.8);
      this.playerShield.strokeCircle(
        PLAYER_X,
        this.playerFeetY - 28,
        34 + Math.sin(this.worldDistance * 0.04) * 2,
      );
    }

    this.playerArt
      .setPosition(PLAYER_X, this.playerFeetY - artOffsetY + runningBob)
      .setScale(0.58, artScaleY);
    this.playerBounds = {
      left: PLAYER_X - PLAYER_WIDTH / 2,
      right: PLAYER_X + PLAYER_WIDTH / 2,
      top: this.playerFeetY - bodyHeight,
      bottom: this.playerFeetY,
    };
  }

  isPlayerOverGap() {
    const playerLeft = this.worldDistance - PLAYER_WIDTH / 2;
    const playerRight = this.worldDistance + PLAYER_WIDTH / 2;
    return this.stageConfig.events.some((event) => {
      if (event.type !== 'gap') {
        return false;
      }

      const openingHalfWidth = Math.max(0, event.width - 12) / 2;
      return playerLeft < event.distance + openingHalfWidth
        && playerRight > event.distance - openingHalfWidth;
    });
  }

  updateBackground(seconds) {
    const scroll = this.stageConfig.speed * seconds * 0.38;
    this.background.marks.forEach((mark) => {
      mark.x -= scroll;
      if (mark.x < -15) {
        mark.x += 814;
      }
    });
  }

  spawnUpcomingEvents() {
    const events = this.stageConfig.events;
    while (
      this.nextEventIndex < events.length
      && events[this.nextEventIndex].distance <= this.worldDistance + 820
    ) {
      const event = events[this.nextEventIndex];
      this.entities.push(this.createEntity(event));
      this.nextEventIndex += 1;
    }
  }

  createEntity(event) {
    if (event.type === 'coin') {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xd98b24, 0.32);
      graphics.fillCircle(2, 3, COIN_RADIUS);
      graphics.fillStyle(0xffcb38);
      graphics.fillCircle(0, 0, COIN_RADIUS);
      graphics.lineStyle(2, 0xfff3a5, 0.95);
      graphics.strokeCircle(0, 0, COIN_RADIUS - 1);
      graphics.fillStyle(0xfff5bd, 0.95);
      graphics.fillEllipse(-3, -4, 5, 8);
      graphics.setDepth(5);
      return { event, object: graphics, radius: COIN_RADIUS };
    }

    const graphics = this.add.graphics();
    if (event.type === 'bird' || event.type === 'animal') {
      if (event.type === 'animal') {
        this.drawAnimalHazard(graphics, event.variant);
      } else {
        this.drawFlyingHazard(graphics, event.variant);
      }
      graphics.setDepth(8).setVisible(false);
      return {
        event,
        object: graphics,
        birdActive: false,
        birdX: -45,
        birdAge: 0,
      };
    }

    if (event.type === 'energy') {
      graphics.lineStyle(4, 0xffffff, 0.55);
      graphics.strokeCircle(0, 0, 19);
      graphics.fillStyle(0x3bd7dd);
      graphics.fillCircle(0, 0, 15);
      graphics.fillStyle(0xffffff);
      graphics.fillTriangle(-2, -12, 8, -2, 2, 1);
      graphics.fillTriangle(2, 0, -7, 11, -1, 1);
      graphics.setDepth(6);
      return { event, object: graphics, radius: 20 };
    }

    if (event.type === 'shield') {
      graphics.lineStyle(4, 0xc6f8ff, 0.95);
      graphics.strokeCircle(0, 0, 19);
      graphics.fillStyle(0x327fe7, 0.9);
      graphics.fillTriangle(0, -16, 15, -9, 12, 7);
      graphics.fillTriangle(12, 7, 0, 17, -12, 7);
      graphics.fillTriangle(-12, 7, -15, -9, 0, -16);
      graphics.fillStyle(0xffffff, 0.9);
      graphics.fillCircle(-5, -6, 3);
      graphics.setDepth(6);
      return { event, object: graphics, radius: 21 };
    }

    if (event.type === 'gap') {
      graphics.fillStyle(0x274a37, 0.6);
      graphics.fillEllipse(0, this.stageConfig.floorY + 3, event.width + 16, 29);
      graphics.fillStyle(0x4a3837);
      graphics.fillRoundedRect(
        -event.width / 2,
        this.stageConfig.floorY - 2,
        event.width,
        29,
        4,
      );
      graphics.fillStyle(0x282b35);
      graphics.fillRect(
        -event.width / 2 + 6,
        this.stageConfig.floorY + 2,
        event.width - 12,
        20,
      );
      graphics.setDepth(7);
      return { event, object: graphics };
    }

    if (event.type === 'orb') {
      graphics.lineStyle(5, 0xffffff, 0.45);
      graphics.strokeCircle(0, 0, 17);
      graphics.fillStyle(0xab5bd1);
      graphics.fillCircle(0, 0, 13);
      graphics.fillStyle(0x68e4e6);
      graphics.fillTriangle(0, -11, 10, 1, -3, 5);
      graphics.fillStyle(0xffdc58);
      graphics.fillTriangle(0, 11, -10, -1, 3, -5);
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(-4, -5, 3);
      graphics.setDepth(6);
      return { event, object: graphics, radius: 19 };
    }

    if (event.type === 'finish') {
      graphics.fillStyle(0xffa93b);
      graphics.fillRoundedRect(-35, this.stageConfig.floorY - 112, 12, 112, 6);
      graphics.fillStyle(0x6f50d7);
      graphics.fillRoundedRect(23, this.stageConfig.floorY - 112, 12, 112, 6);
      graphics.fillStyle(0xffffff);
      graphics.fillRoundedRect(-34, this.stageConfig.floorY - 114, 70, 18, 8);
      graphics.fillStyle(0xffc83d);
      graphics.fillTriangle(-17, this.stageConfig.floorY - 111, 0, this.stageConfig.floorY - 93, 17, this.stageConfig.floorY - 111);
      graphics.setDepth(4);
      return { event, object: graphics };
    }

    if (event.type === 'platform') {
      return this.createHazardPlatform(event, graphics);
    }

    if (event.kind === 'overhead' || event.kind === 'vine') {
      if (event.kind === 'vine') {
        graphics.fillStyle(0x347e50);
        graphics.fillRoundedRect(-39, this.stageConfig.floorY - 83, 78, 20, 9);
        graphics.lineStyle(5, 0x7ccf69);
        graphics.beginPath();
        graphics.moveTo(-26, this.stageConfig.floorY - 63);
        graphics.lineTo(-26, this.stageConfig.floorY - 32);
        graphics.moveTo(20, this.stageConfig.floorY - 63);
        graphics.lineTo(20, this.stageConfig.floorY - 32);
        graphics.strokePath();
      } else {
      graphics.fillStyle(0x664a9f);
      graphics.fillRoundedRect(-39, this.stageConfig.floorY - 83, 78, 20, 9);
      graphics.fillStyle(0x9a74d9);
      graphics.fillRoundedRect(-32, this.stageConfig.floorY - 78, 64, 10, 5);
      graphics.fillStyle(0x664a9f);
      graphics.fillRoundedRect(-25, this.stageConfig.floorY - 63, 50, 30, 7);
      graphics.fillStyle(0x6ebc5c);
      graphics.fillCircle(-28, this.stageConfig.floorY - 83, 8);
      graphics.fillCircle(25, this.stageConfig.floorY - 84, 9);
      }
      graphics.setDepth(4);
      return { event, object: graphics, width: 76, top: this.stageConfig.floorY - 83, bottom: this.stageConfig.floorY - 33 };
    }

    if (event.kind === 'icicle' || event.kind === 'laser' || event.kind === 'fan') {
      if (event.kind === 'fan') {
        graphics.fillStyle(0x465b86);
        graphics.fillRoundedRect(-42, this.stageConfig.floorY - 48, 84, 46, 8);
        graphics.fillStyle(0xa9d8ff);
        graphics.fillCircle(0, this.stageConfig.floorY - 26, 19);
        graphics.lineStyle(5, 0x496a9a);
        graphics.beginPath();
        graphics.moveTo(0, this.stageConfig.floorY - 26);
        graphics.lineTo(-11, this.stageConfig.floorY - 39);
        graphics.moveTo(0, this.stageConfig.floorY - 26);
        graphics.lineTo(14, this.stageConfig.floorY - 27);
        graphics.moveTo(0, this.stageConfig.floorY - 26);
        graphics.lineTo(-2, this.stageConfig.floorY - 10);
        graphics.strokePath();
        graphics.setDepth(6);
        return { event, object: graphics, width: 74, top: this.stageConfig.floorY - 48, bottom: this.stageConfig.floorY };
      }
      const laser = event.kind === 'laser';
      graphics.fillStyle(laser ? 0x7d76ff : 0x81dff4);
      graphics.fillRoundedRect(-42, this.stageConfig.floorY - 82, 84, 15, 7);
      graphics.fillStyle(laser ? 0xd8d5ff : 0xe9fbff);
      graphics.fillTriangle(-31, this.stageConfig.floorY - 67, -16, this.stageConfig.floorY - 67, -23, this.stageConfig.floorY - 35);
      graphics.fillTriangle(-8, this.stageConfig.floorY - 67, 8, this.stageConfig.floorY - 67, 0, this.stageConfig.floorY - 30);
      graphics.fillTriangle(17, this.stageConfig.floorY - 67, 32, this.stageConfig.floorY - 67, 25, this.stageConfig.floorY - 35);
      graphics.setDepth(4);
      return {
        event,
        object: graphics,
        width: 76,
        top: this.stageConfig.floorY - 82,
        bottom: this.stageConfig.floorY - 30,
      };
    }

    if (event.kind === 'rock' || event.kind === 'lava-rock') {
      const lavaRock = event.kind === 'lava-rock';
      graphics.fillStyle(lavaRock ? 0x593e4b : 0x596a84);
      graphics.fillTriangle(-36, this.stageConfig.floorY, -27, this.stageConfig.floorY - 35, -4, this.stageConfig.floorY - 45);
      graphics.fillTriangle(-27, this.stageConfig.floorY - 35, 18, this.stageConfig.floorY - 43, 35, this.stageConfig.floorY);
      graphics.fillStyle(lavaRock ? 0xff9a52 : 0x9aaec8);
      graphics.fillTriangle(-23, this.stageConfig.floorY - 33, -4, this.stageConfig.floorY - 45, 7, this.stageConfig.floorY - 34);
      graphics.setDepth(6);
      return { event, object: graphics, width: 66, top: this.stageConfig.floorY - 45, bottom: this.stageConfig.floorY };
    }

    if (event.kind === 'spikes' || event.kind === 'cactus') {
      graphics.fillStyle(event.kind === 'cactus' ? 0x38985a : 0xf07832);
      if (event.kind === 'cactus') {
        graphics.fillRoundedRect(-11, this.stageConfig.floorY - 68, 22, 68, 10);
        graphics.fillRoundedRect(-29, this.stageConfig.floorY - 47, 19, 12, 6);
        graphics.fillRoundedRect(-29, this.stageConfig.floorY - 56, 10, 21, 6);
        graphics.fillRoundedRect(10, this.stageConfig.floorY - 35, 20, 12, 6);
        graphics.fillRoundedRect(20, this.stageConfig.floorY - 47, 10, 24, 6);
      } else {
        for (let spike = 0; spike < 3; spike += 1) {
          const x = -30 + spike * 22;
          graphics.fillTriangle(x, this.stageConfig.floorY, x + 11, this.stageConfig.floorY - 38, x + 22, this.stageConfig.floorY);
        }
      }
      graphics.setDepth(6);
      return {
        event,
        object: graphics,
        width: event.kind === 'cactus' ? 58 : 66,
        top: this.stageConfig.floorY - (event.kind === 'cactus' ? 68 : 38),
        bottom: this.stageConfig.floorY,
      };
    }

    if (event.kind === 'waterfall' || event.kind === 'geyser') {
      const geyser = event.kind === 'geyser';
      graphics.fillStyle(geyser ? 0xff8d48 : 0x62e1f3, 0.9);
      graphics.fillRoundedRect(-24, this.stageConfig.floorY - 78, 48, 78, 12);
      graphics.fillStyle(geyser ? 0xffdd76 : 0xe9ffff, 0.9);
      graphics.fillEllipse(0, this.stageConfig.floorY - 76, 48, 17);
      graphics.fillCircle(-10, this.stageConfig.floorY - 88, 6);
      graphics.fillCircle(8, this.stageConfig.floorY - 93, 5);
      graphics.setDepth(6);
      return { event, object: graphics, width: 48, top: this.stageConfig.floorY - 88, bottom: this.stageConfig.floorY };
    }

    if (event.kind === 'windmill') {
      graphics.fillStyle(0x8b5a48);
      graphics.fillRoundedRect(-6, this.stageConfig.floorY - 74, 12, 74, 5);
      graphics.fillStyle(0xf58a54);
      graphics.fillTriangle(0, this.stageConfig.floorY - 74, -12, this.stageConfig.floorY - 107, 12, this.stageConfig.floorY - 107);
      graphics.fillTriangle(0, this.stageConfig.floorY - 74, -33, this.stageConfig.floorY - 61, -33, this.stageConfig.floorY - 86);
      graphics.fillTriangle(0, this.stageConfig.floorY - 74, 12, this.stageConfig.floorY - 41, -12, this.stageConfig.floorY - 41);
      graphics.fillTriangle(0, this.stageConfig.floorY - 74, 33, this.stageConfig.floorY - 61, 33, this.stageConfig.floorY - 86);
      graphics.setDepth(6);
      return { event, object: graphics, width: 64, top: this.stageConfig.floorY - 107, bottom: this.stageConfig.floorY };
    }

    if (event.kind === 'crystal') {
      graphics.fillStyle(0x9cecff);
      graphics.fillTriangle(-34, this.stageConfig.floorY, 0, this.stageConfig.floorY - 76, 34, this.stageConfig.floorY);
      graphics.fillStyle(0xffffff, 0.82);
      graphics.fillTriangle(-5, this.stageConfig.floorY - 16, 0, this.stageConfig.floorY - 76, 8, this.stageConfig.floorY - 14);
      graphics.setDepth(6);
      return { event, object: graphics, width: 64, top: this.stageConfig.floorY - 76, bottom: this.stageConfig.floorY };
    }

    if (event.kind === 'wave') {
      graphics.fillStyle(0x278ed1);
      graphics.fillEllipse(0, this.stageConfig.floorY - 7, 88, 42);
      graphics.fillStyle(0xa8efff, 0.9);
      graphics.fillEllipse(-20, this.stageConfig.floorY - 21, 33, 15);
      graphics.fillEllipse(18, this.stageConfig.floorY - 18, 40, 13);
      graphics.setDepth(6);
      return { event, object: graphics, width: 84, top: this.stageConfig.floorY - 31, bottom: this.stageConfig.floorY };
    }

    if (event.kind === 'candy' || event.kind === 'lollipop') {
      graphics.fillStyle(event.kind === 'lollipop' ? 0xea6fae : 0x8e5ce6);
      graphics.fillRoundedRect(-28, this.stageConfig.floorY - 47, 56, 45, 16);
      graphics.fillStyle(0xffe58b);
      graphics.fillCircle(-12, this.stageConfig.floorY - 35, 7);
      graphics.fillCircle(9, this.stageConfig.floorY - 20, 6);
      if (event.kind === 'lollipop') {
        graphics.fillStyle(0xfff0a8);
        graphics.fillRect(-3, this.stageConfig.floorY - 70, 6, 26);
        graphics.fillStyle(0xf07832);
        graphics.fillCircle(0, this.stageConfig.floorY - 73, 17);
        graphics.lineStyle(3, 0xffffff, 0.9);
        graphics.strokeCircle(0, this.stageConfig.floorY - 73, 12);
      }
      graphics.setDepth(6);
      return { event, object: graphics, width: 58, top: this.stageConfig.floorY - 47, bottom: this.stageConfig.floorY };
    }

    if (event.kind === 'coral') {
      graphics.lineStyle(10, 0xe66b8a, 0.95);
      graphics.beginPath();
      graphics.moveTo(0, this.stageConfig.floorY);
      graphics.lineTo(0, this.stageConfig.floorY - 34);
      graphics.lineTo(-18, this.stageConfig.floorY - 49);
      graphics.moveTo(0, this.stageConfig.floorY - 34);
      graphics.lineTo(19, this.stageConfig.floorY - 55);
      graphics.moveTo(-14, this.stageConfig.floorY - 46);
      graphics.lineTo(-23, this.stageConfig.floorY - 60);
      graphics.strokePath();
      graphics.setDepth(6);
      return { event, object: graphics, width: 54, top: this.stageConfig.floorY - 60, bottom: this.stageConfig.floorY };
    }

    graphics.fillStyle(0x356f43, 0.3);
    graphics.fillRoundedRect(-30, this.stageConfig.floorY - 43, 60, 45, 12);
    graphics.fillStyle(0x62b957);
    graphics.fillRoundedRect(-31, this.stageConfig.floorY - 48, 62, 43, 12);
    graphics.fillStyle(0x8bd66c);
    graphics.fillEllipse(-15, this.stageConfig.floorY - 42, 17, 15);
    graphics.fillEllipse(8, this.stageConfig.floorY - 45, 19, 17);
    graphics.setDepth(6);
    return { event, object: graphics, width: 62, top: this.stageConfig.floorY - 48, bottom: this.stageConfig.floorY };
  }

  createHazardPlatform(event, graphics) {
    const palette = {
      water: { base: 0x237eb6, top: 0x8ef0fa, detail: 0xffffff },
      electric: { base: 0x454577, top: 0xe4e66f, detail: 0xffffff },
      lava: { base: 0x633743, top: 0xff754f, detail: 0xffd66e },
      meteor: { base: 0x4d426e, top: 0xff9958, detail: 0xffdb77 },
      thorn: { base: 0x34784d, top: 0x9add69, detail: 0xe9ffab },
      cloud: { base: 0x677eac, top: 0xc4e6ff, detail: 0xffffff },
      crystal: { base: 0x594a91, top: 0x9cecff, detail: 0xffffff },
    };
    const colors = palette[event.kind] ?? palette.electric;
    const width = event.width ?? 112;
    const height = event.height ?? 34;
    const top = this.stageConfig.floorY - height;

    graphics.fillStyle(0x30264a, 0.25);
    graphics.fillRoundedRect(-width / 2, top + 5, width, height, 8);
    graphics.fillStyle(colors.base);
    graphics.fillRoundedRect(-width / 2, top, width, height, 8);
    graphics.fillStyle(colors.top);
    graphics.fillRoundedRect(-width / 2 + 5, top + 3, width - 10, 9, 5);

    if (event.kind === 'electric' || event.kind === 'cloud') {
      graphics.lineStyle(4, colors.detail, 0.95);
      graphics.beginPath();
      graphics.moveTo(-13, top + 12);
      graphics.lineTo(-4, top + 20);
      graphics.lineTo(-10, top + 27);
      graphics.lineTo(10, top + 18);
      graphics.strokePath();
    } else if (event.kind === 'thorn' || event.kind === 'crystal') {
      graphics.fillStyle(colors.detail);
      for (let point = -width / 2 + 14; point < width / 2 - 8; point += 24) {
        graphics.fillTriangle(point - 7, top + 5, point, top - 8, point + 7, top + 5);
      }
    } else {
      graphics.fillStyle(colors.detail, 0.9);
      graphics.fillCircle(-width / 4, top + 21, 4);
      graphics.fillCircle(width / 4, top + 22, 5);
    }

    graphics.setDepth(6);
    return {
      event,
      object: graphics,
      width,
      top: top - (event.kind === 'thorn' || event.kind === 'crystal' ? 8 : 0),
      bottom: this.stageConfig.floorY,
    };
  }

  updateEntities(seconds) {
    for (let index = this.entities.length - 1; index >= 0; index -= 1) {
      const entity = this.entities[index];
      if (entity.event.type === 'bird' || entity.event.type === 'animal') {
        if (!entity.birdActive && this.worldDistance < entity.event.distance) {
          continue;
        }

        if (!entity.birdActive) {
          entity.birdActive = true;
          entity.object.setVisible(true);
        }
        entity.birdAge += seconds;
        const previousBirdX = entity.birdX;
        entity.birdX += entity.event.speed * seconds;
        const hazardY = entity.event.y + Math.sin(entity.birdAge * 8) * 9;
        entity.object.setPosition(entity.birdX, hazardY);
        if (previousBirdX < PLAYER_X && entity.birdX >= PLAYER_X) {
          if (entity.event.type === 'animal') {
            this.audio.playSfx('animalCall', 0.45);
          } else if (entity.event.nightSound) {
            this.audio.playSfx('nightBird', 0.45);
          }
        }

        if (this.playerHitsBird(entity.birdX, hazardY)) {
          if (this.handleHazardHit(entity.event)) {
            return;
          }
          entity.object.destroy();
          this.entities.splice(index, 1);
          continue;
        }
        if (entity.birdX > 850) {
          entity.object.destroy();
          this.entities.splice(index, 1);
        }
        continue;
      }

      const x = PLAYER_X + entity.event.distance - this.worldDistance;
      const y = entity.event.y ?? 0;
      entity.object.setPosition(x, y);

      if (entity.event.type === 'orb' || entity.event.type === 'energy' || entity.event.type === 'shield') {
        entity.object.rotation += seconds * 1.8;
      }

      if (
        entity.event.type === 'coin'
        || entity.event.type === 'orb'
        || entity.event.type === 'energy'
        || entity.event.type === 'shield'
      ) {
        if (this.circleOverlapsPlayer(x, y, entity.radius)) {
          this.collectEntity(entity);
          entity.object.destroy();
          this.entities.splice(index, 1);
          continue;
        }
      } else if (entity.event.type === 'obstacle' || entity.event.type === 'platform') {
        if (this.playerHitsObstacle(entity, x)) {
          if (this.handleHazardHit(entity.event)) {
            return;
          }
          entity.object.destroy();
          this.entities.splice(index, 1);
          continue;
        }
      }

      if (x < -100) {
        entity.object.destroy();
        this.entities.splice(index, 1);
      }
    }
  }

  circleOverlapsPlayer(x, y, radius) {
    const nearestX = Phaser.Math.Clamp(x, this.playerBounds.left, this.playerBounds.right);
    const nearestY = Phaser.Math.Clamp(y, this.playerBounds.top, this.playerBounds.bottom);
    return Phaser.Math.Distance.Between(x, y, nearestX, nearestY) <= radius;
  }

  playerHitsObstacle(entity, x) {
    const left = x - entity.width / 2;
    const right = x + entity.width / 2;
    return this.playerBounds.left < right
      && this.playerBounds.right > left
      && this.playerBounds.top < entity.bottom
      && this.playerBounds.bottom > entity.top;
  }

  playerHitsBird(x, y) {
    const halfWidth = 22;
    const halfHeight = 12;
    return this.playerBounds.left < x + halfWidth
      && this.playerBounds.right > x - halfWidth
      && this.playerBounds.top < y + halfHeight
      && this.playerBounds.bottom > y - halfHeight;
  }

  drawAnimalHazard(graphics, variant) {
    if (variant === 'bat' || variant === 'alien') {
      this.drawFlyingHazard(graphics, variant);
      return;
    }

    if (variant === 'fish' || variant === 'shark' || variant === 'dolphin' || variant === 'turtle' || variant === 'whale') {
      const aquaticColors = {
        fish: { body: 0xffae55, fin: 0xff6d82 },
        shark: { body: 0x729cc5, fin: 0x456b98 },
        dolphin: { body: 0x72d9e8, fin: 0x3da9c3 },
        turtle: { body: 0x63b96f, fin: 0x3b8b65 },
        whale: { body: 0x597cbb, fin: 0x3b588f },
      };
      const colors = aquaticColors[variant];
      graphics.fillStyle(colors.fin);
      graphics.fillTriangle(-22, 0, -39, -15, -37, 15);
      graphics.fillEllipse(-1, 0, 49, 29);
      graphics.fillStyle(colors.body);
      graphics.fillEllipse(2, -3, 42, 22);
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(12, -6, 4);
      graphics.fillStyle(0x30264a);
      graphics.fillCircle(13, -6, 2);

      if (variant === 'shark') {
        graphics.fillStyle(colors.fin);
        graphics.fillTriangle(-5, -12, 4, -30, 12, -12);
        graphics.fillStyle(0xffffff);
        graphics.fillTriangle(16, 5, 23, 8, 17, 11);
      } else if (variant === 'dolphin' || variant === 'whale') {
        graphics.fillStyle(colors.fin);
        graphics.fillTriangle(16, 0, 36, 5, 20, 10);
        graphics.fillTriangle(-7, -13, 0, -24, 6, -12);
      } else if (variant === 'turtle') {
        graphics.fillStyle(0x8c6b3f);
        graphics.fillEllipse(-3, 0, 27, 24);
        graphics.fillStyle(colors.body);
        graphics.fillEllipse(-4, 1, 18, 15);
        graphics.fillStyle(colors.fin);
        graphics.fillEllipse(-13, 14, 14, 7);
        graphics.fillEllipse(4, 14, 14, 7);
      }
      return;
    }

    if (variant === 'jellyfish') {
      graphics.fillStyle(0xff9ed5, 0.9);
      graphics.fillEllipse(0, -5, 44, 34);
      graphics.fillStyle(0xffd5ec, 0.9);
      graphics.fillEllipse(-8, -9, 10, 12);
      graphics.lineStyle(4, 0xe875c2);
      for (let tentacle = -2; tentacle <= 2; tentacle += 1) {
        graphics.beginPath();
        graphics.moveTo(tentacle * 8, 8);
        graphics.lineTo(tentacle * 8 + 4, 22);
        graphics.strokePath();
      }
      graphics.fillStyle(0x402c64);
      graphics.fillCircle(-8, 0, 2);
      graphics.fillCircle(8, 0, 2);
      return;
    }

    if (variant === 'frog') {
      graphics.fillStyle(0x57b963);
      graphics.fillEllipse(0, 6, 44, 28);
      graphics.fillCircle(-13, -7, 9);
      graphics.fillCircle(13, -7, 9);
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(-13, -8, 5);
      graphics.fillCircle(13, -8, 5);
      graphics.fillStyle(0x30264a);
      graphics.fillCircle(-13, -8, 2);
      graphics.fillCircle(13, -8, 2);
      graphics.lineStyle(3, 0x267748);
      graphics.beginPath();
      graphics.arc(0, 5, 12, 0.2, Math.PI - 0.2);
      graphics.strokePath();
      return;
    }

    if (variant === 'crocodile') {
      graphics.fillStyle(0x4ca65c);
      graphics.fillEllipse(-2, 0, 37, 24);
      graphics.fillTriangle(-17, 1, -40, -8, -32, 12);
      graphics.fillStyle(0x77ca68);
      graphics.fillRoundedRect(7, -7, 29, 15, 6);
      graphics.fillStyle(0xffffff);
      graphics.fillTriangle(12, 7, 17, 7, 14, 12);
      graphics.fillTriangle(24, 7, 29, 7, 26, 12);
      graphics.fillStyle(0x30264a);
      graphics.fillCircle(11, -7, 3);
      graphics.fillStyle(0xf5c85a);
      graphics.fillEllipse(-6, 13, 12, 6);
      return;
    }

    if (variant === 'otter') {
      graphics.fillStyle(0x98664d);
      graphics.fillEllipse(-1, 2, 39, 27);
      graphics.fillStyle(0xd7b28a);
      graphics.fillEllipse(12, 4, 19, 16);
      graphics.fillCircle(-15, -12, 8);
      graphics.fillCircle(5, -12, 8);
      graphics.fillStyle(0xfff3df);
      graphics.fillCircle(-15, -12, 4);
      graphics.fillCircle(5, -12, 4);
      graphics.fillStyle(0x30264a);
      graphics.fillCircle(-14, -12, 2);
      graphics.fillCircle(6, -12, 2);
      graphics.fillStyle(0x47343c);
      graphics.fillEllipse(16, 1, 7, 5);
      graphics.lineStyle(4, 0x98664d);
      graphics.beginPath();
      graphics.arc(-19, 0, 15, Math.PI / 2, Math.PI * 1.5);
      graphics.strokePath();
      return;
    }

    if (variant === 'monkey' || variant === 'fox' || variant === 'scorpion' || variant === 'penguin') {
      const animalColors = {
        monkey: { body: 0x9a6544, face: 0xf5d19c },
        fox: { body: 0xef8949, face: 0xffe6bd },
        scorpion: { body: 0xc36a4a, face: 0xf6c466 },
        penguin: { body: 0x465b86, face: 0xf6f6ff },
      };
      const colors = animalColors[variant];
      graphics.fillStyle(colors.body);
      graphics.fillEllipse(-2, 1, 36, 29);
      graphics.fillStyle(colors.face);
      graphics.fillEllipse(8, 2, 19, 17);
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(5, -9, 7);
      graphics.fillStyle(0x30264a);
      graphics.fillCircle(7, -10, 3);
      if (variant === 'monkey') {
        graphics.lineStyle(5, colors.body);
        graphics.beginPath();
        graphics.arc(-12, -10, 14, Math.PI / 2, Math.PI * 1.8);
        graphics.strokePath();
      } else if (variant === 'fox') {
        graphics.fillStyle(colors.body);
        graphics.fillTriangle(-14, -8, -11, -28, 1, -12);
        graphics.fillTriangle(5, -12, 18, -28, 20, -5);
      } else if (variant === 'scorpion') {
        graphics.lineStyle(5, colors.body);
        graphics.beginPath();
        graphics.arc(-19, -10, 17, Math.PI, Math.PI * 1.7);
        graphics.strokePath();
        graphics.fillStyle(0xf6c466);
        graphics.fillCircle(-31, -23, 5);
      } else {
        graphics.fillTriangle(17, 1, 30, 6, 17, 10);
      }
      return;
    }

    if (variant === 'robot') {
      graphics.fillStyle(0x68c8cf);
      graphics.fillRoundedRect(-21, -19, 42, 38, 9);
      graphics.lineStyle(3, 0x367b9b);
      graphics.strokeRoundedRect(-21, -19, 42, 38, 9);
      graphics.fillStyle(0xfff18b);
      graphics.fillCircle(-9, -5, 5);
      graphics.fillCircle(9, -5, 5);
      graphics.fillStyle(0x3a587c);
      graphics.fillRoundedRect(-8, 7, 16, 4, 2);
      graphics.lineStyle(3, 0xaaf2e5);
      graphics.beginPath();
      graphics.moveTo(0, -19);
      graphics.lineTo(0, -28);
      graphics.strokePath();
      graphics.fillCircle(0, -30, 4);
      return;
    }

    if (variant === 'butterfly') {
      graphics.fillStyle(0xff86bf);
      graphics.fillEllipse(-14, -5, 23, 29);
      graphics.fillEllipse(14, -5, 23, 29);
      graphics.fillStyle(0x7f6ce5);
      graphics.fillEllipse(-13, 10, 18, 20);
      graphics.fillEllipse(13, 10, 18, 20);
      graphics.fillStyle(0x684433);
      graphics.fillRoundedRect(-3, -17, 6, 35, 3);
      graphics.lineStyle(2, 0x684433);
      graphics.beginPath();
      graphics.moveTo(-2, -15);
      graphics.lineTo(-8, -25);
      graphics.moveTo(2, -15);
      graphics.lineTo(8, -25);
      graphics.strokePath();
      return;
    }

    if (variant === 'dragon') {
      graphics.fillStyle(0x67bd73);
      graphics.fillEllipse(0, 3, 41, 28);
      graphics.fillStyle(0x9fdf83);
      graphics.fillCircle(10, -8, 15);
      graphics.fillStyle(0x5c9d5b);
      graphics.fillTriangle(-4, -2, -32, -25, -24, 11);
      graphics.fillTriangle(2, -1, 31, -26, 25, 12);
      graphics.fillStyle(0xffe27a);
      graphics.fillTriangle(4, -18, 7, -30, 12, -16);
      graphics.fillTriangle(15, -17, 22, -28, 22, -13);
      graphics.fillStyle(0x30264a);
      graphics.fillCircle(14, -10, 2);
      return;
    }

    this.drawFlyingHazard(graphics, 'bird');
  }

  drawFlyingHazard(graphics, variant = 'bird') {
    if (variant === 'meteor') {
      graphics.fillStyle(0xf07832, 0.72);
      graphics.fillTriangle(-10, -5, -34, -18, -24, 5);
      graphics.fillStyle(0xdb553f);
      graphics.fillCircle(0, 0, 15);
      graphics.fillStyle(0xffd05e);
      graphics.fillCircle(-4, -5, 5);
      return;
    }

    const palette = {
      bat: { body: 0x382c5b, wing: 0x7552a6, eye: 0xffe870 },
      owl: { body: 0x7787a7, wing: 0xb5c9e8, eye: 0xffd975 },
      alien: { body: 0x5fce9a, wing: 0x3a9e97, eye: 0x30264a },
      parrot: { body: 0xf27a58, wing: 0x54bd69, eye: 0xffffff },
      bird: { body: 0x6a496f, wing: 0xa85c72, eye: 0xffffff },
    };
    const colors = palette[variant] ?? palette.bird;
    graphics.fillStyle(colors.wing);
    graphics.fillTriangle(-4, 1, -28, -18, -20, 8);
    graphics.fillTriangle(5, 1, 28, -17, 19, 8);
    graphics.fillStyle(colors.body);
    graphics.fillEllipse(-2, 1, 34, 24);
    graphics.fillStyle(colors.eye);
    graphics.fillCircle(5, -3, 4);
    graphics.fillStyle(0x2c2440);
    graphics.fillCircle(6, -3, 1.6);
    if (variant === 'bat') {
      graphics.fillTriangle(-8, -7, -12, -22, -1, -11);
      graphics.fillTriangle(2, -10, 10, -23, 10, -5);
    } else {
      graphics.fillStyle(0xffc857);
      graphics.fillTriangle(13, 0, 29, 5, 13, 9);
    }
  }

  handleHazardHit(event) {
    this.hits += 1;
    let deathCause = 'obstacle';
    let soundKey = 'collision';

    if (event.type === 'gap') {
      deathCause = 'gap';
      soundKey = 'splash';
    } else if (event.type === 'animal') {
      deathCause = 'animal';
      soundKey = 'animalCall';
    } else if (event.type === 'bird') {
      deathCause = 'bird';
    } else {
      const kind = event.kind;
      if (kind === 'water' || kind === 'wave' || kind === 'waterfall') {
        deathCause = 'water';
        soundKey = 'splash';
      } else if (kind === 'lava' || kind === 'lava-rock' || kind === 'geyser' || kind === 'meteor') {
        deathCause = 'lava';
      } else if (kind === 'electric' || kind === 'laser' || kind === 'fan' || kind === 'cloud') {
        deathCause = 'electric';
        soundKey = 'electric';
      } else if (event.type === 'platform') {
        deathCause = 'platform';
      }
    }

    this.audio.playSfx(soundKey);
    if (this.shieldRemaining > 0) {
      this.shieldRemaining = 0;
      this.showPowerMessage('¡ESCUDO PROTEGIÓ!');
      return false;
    }

    this.finishLevel(false, deathCause);
    return true;
  }

  showPowerMessage(message) {
    this.powerMessageText.setText(message).setAlpha(1);
    this.powerMessageRemaining = 1.8;
  }

  collectEntity(entity) {
    if (entity.event.type === 'coin') {
      this.collectedCoins += 1;
      this.scoreFraction += 15;
      this.audio.playSfx('coin');
      return;
    }

    if (entity.event.type === 'energy') {
      this.jumpFatigue = Math.max(
        0,
        this.jumpFatigue - this.stageConfig.energyPickup,
      );
      this.scoreFraction += 20;
      this.audio.playSfx('star');
      this.showPowerMessage('¡ENERGÍA RECARGADA!');
      return;
    }

    if (entity.event.type === 'shield') {
      this.shieldRemaining = entity.event.duration ?? 5;
      this.audio.playSfx('star');
      this.showPowerMessage('¡ESCUDO ACTIVADO!');
      return;
    }

    this.collectedOrbs += 1;
    this.bonusRemaining = this.stageConfig.bonusDuration;
    this.scoreFraction += 50;
    this.audio.playSfx('star');
    this.bonusText.setText('BONUS DE COLOR x2').setAlpha(1);
  }

  updateHud() {
    this.scoreText.setText(`PUNTOS ${this.score.toLocaleString('es')}`);
    this.coinsText.setText(`MONEDAS ${this.collectedCoins}/${this.stageConfig.totalCoins}`);
    const elapsed = Math.floor(this.worldDistance / this.stageConfig.speed);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    this.timeText.setText(`${minutes}:${seconds}`);

    const progress = this.worldDistance / this.stageConfig.finishDistance;
    this.progressBar.clear();
    this.progressBar.fillStyle(0x6f50d7);
    this.progressBar.fillRoundedRect(30, 71, Math.max(8, 740 * progress), 10, 5);

    const segmentIndex = this.stageConfig.segments.findIndex(
      (segment) => this.worldDistance <= segment.endDistance,
    );
    const currentSegment = this.stageConfig.segments[Math.max(0, segmentIndex)];
    this.segmentText.setText(
      `${Math.max(0, segmentIndex) + 1}/${this.stageConfig.segments.length} · ${currentSegment.name}`,
    );
    this.bonusText.setAlpha(this.bonusRemaining > 0 ? 1 : 0);
    this.powerMessageText.setAlpha(this.powerMessageRemaining > 0 ? 1 : 0);
    this.updateJumpEnergyHud();
  }

  updateJumpEnergyHud() {
    const energy = 1 - this.jumpFatigue / this.stageConfig.jumpFatigueMax;
    this.jumpEnergyBar.clear();
    if (energy <= 0) {
      return;
    }

    this.jumpEnergyBar.fillStyle(energy > 0.5 ? 0x48b968 : 0xf07832);
    this.jumpEnergyBar.fillRoundedRect(206, 120, 134 * energy, 8, 4);
  }

  finishLevel(completed, deathCause = 'obstacle') {
    if (this.hasEnded) {
      return;
    }
    this.hasEnded = true;

    const stars = calculateStageStars(this.stageConfig, {
      completed,
      collectedCoins: this.collectedCoins,
      hits: this.hits,
    });
    const distance = Math.floor(this.worldDistance);

    this.scene.start('StageResultScene', {
      levelId: this.stageConfig.id,
      stageName: this.stageConfig.name,
      outcome: completed ? 'victory' : 'defeat',
      deathCause,
      score: Math.floor(this.scoreFraction),
      distance,
      elapsedSeconds: Math.floor(distance / this.stageConfig.speed),
      collectedCoins: this.collectedCoins,
      totalCoins: this.stageConfig.totalCoins,
      collectedOrbs: this.collectedOrbs,
      hits: this.hits,
      stars,
    });
  }
}
