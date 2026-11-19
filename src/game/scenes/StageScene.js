import Phaser from 'phaser';
import createCharacterArt from '../ui/createCharacterArt.js';
import createMenuButton from '../ui/createMenuButton.js';
import createStageControl from '../ui/createStageControl.js';
import drawStageBackground from '../ui/drawStageBackground.js';
import { getSelectedCharacter } from '../systems/CharacterPreferences.js';
import { calculateStageStars, getStageConfig } from './stages/stageConfigs.js';

const PLAYER_X = 155;
const PLAYER_WIDTH = 36;
const PLAYER_HEIGHT = 54;
const CROUCH_HEIGHT = 30;
const COIN_RADIUS = 12;

export default class StageScene extends Phaser.Scene {
  constructor() {
    super('StageScene');
  }

  create(data = {}) {
    this.stageConfig = getStageConfig(data.levelId);
    this.levelId = this.stageConfig.id;
    this.audio = this.registry.get('audioManager');
    this.audio.playMusic('gameMusic');
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
        this.audio.playSfx('collision');
        this.finishLevel(false);
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
    if (event.type === 'bird') {
      this.drawFlyingHazard(graphics, event.variant);
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

    if (event.kind === 'overhead') {
      graphics.fillStyle(0x664a9f);
      graphics.fillRoundedRect(-39, this.stageConfig.floorY - 83, 78, 20, 9);
      graphics.fillStyle(0x9a74d9);
      graphics.fillRoundedRect(-32, this.stageConfig.floorY - 78, 64, 10, 5);
      graphics.fillStyle(0x664a9f);
      graphics.fillRoundedRect(-25, this.stageConfig.floorY - 63, 50, 30, 7);
      graphics.fillStyle(0x6ebc5c);
      graphics.fillCircle(-28, this.stageConfig.floorY - 83, 8);
      graphics.fillCircle(25, this.stageConfig.floorY - 84, 9);
      graphics.setDepth(4);
      return { event, object: graphics, width: 76, top: this.stageConfig.floorY - 83, bottom: this.stageConfig.floorY - 33 };
    }

    if (event.kind === 'icicle' || event.kind === 'laser') {
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

    if (event.kind === 'rock') {
      graphics.fillStyle(0x596a84);
      graphics.fillTriangle(-36, this.stageConfig.floorY, -27, this.stageConfig.floorY - 35, -4, this.stageConfig.floorY - 45);
      graphics.fillTriangle(-27, this.stageConfig.floorY - 35, 18, this.stageConfig.floorY - 43, 35, this.stageConfig.floorY);
      graphics.fillStyle(0x9aaec8);
      graphics.fillTriangle(-23, this.stageConfig.floorY - 33, -4, this.stageConfig.floorY - 45, 7, this.stageConfig.floorY - 34);
      graphics.setDepth(6);
      return { event, object: graphics, width: 66, top: this.stageConfig.floorY - 45, bottom: this.stageConfig.floorY };
    }

    if (event.kind === 'spikes') {
      graphics.fillStyle(0xf07832);
      for (let spike = 0; spike < 3; spike += 1) {
        const x = -30 + spike * 22;
        graphics.fillTriangle(x, this.stageConfig.floorY, x + 11, this.stageConfig.floorY - 38, x + 22, this.stageConfig.floorY);
      }
      graphics.setDepth(6);
      return { event, object: graphics, width: 66, top: this.stageConfig.floorY - 38, bottom: this.stageConfig.floorY };
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

  updateEntities(seconds) {
    for (let index = this.entities.length - 1; index >= 0; index -= 1) {
      const entity = this.entities[index];
      if (entity.event.type === 'bird') {
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
        const birdY = entity.event.y + Math.sin(entity.birdAge * 8) * 9;
        entity.object.setPosition(entity.birdX, birdY);
        if (
          entity.event.nightSound
          && previousBirdX < PLAYER_X
          && entity.birdX >= PLAYER_X
        ) {
          this.audio.playSfx('nightBird', 0.45);
        }

        if (this.playerHitsBird(entity.birdX, birdY)) {
          if (this.handleHazardHit()) {
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
      } else if (entity.event.type === 'obstacle') {
        if (this.playerHitsObstacle(entity, x)) {
          if (this.handleHazardHit()) {
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

  handleHazardHit() {
    this.hits += 1;
    this.audio.playSfx('collision');
    if (this.shieldRemaining > 0) {
      this.shieldRemaining = 0;
      this.showPowerMessage('¡ESCUDO PROTEGIÓ!');
      return false;
    }

    this.finishLevel(false);
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

  finishLevel(completed) {
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
