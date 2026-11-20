import Phaser from 'phaser';
import createMenuButton from '../ui/createMenuButton.js';
import { drawResultBackground } from '../ui/drawSceneBackgrounds.js';
import { OUTFIT_OPTIONS } from '../systems/OutfitPreferences.js';
import { STAGE_CONFIGS } from './stages/stageConfigs.js';

const BEST_SCORE_KEY = 'colorDashBestScore';
const LEVEL_COUNT = STAGE_CONFIGS.length;
const DEFEAT_MESSAGES = {
  animal: [
    '¡Un amigo veloz te sorprendió! ¡Inténtalo otra vez!',
    '¡Ese animal conoce atajos! Tú puedes alcanzarlo.',
  ],
  bird: [
    '¡Un pajarito cruzó el camino! Prueba otro salto.',
    '¡Vaya vuelo! Respira y vuelve a correr.',
  ],
  electric: [
    '¡Chispas en el camino! Busca un momento seguro para saltar.',
    '¡La plataforma eléctrica te ganó esta vez! ¡Vamos de nuevo!',
  ],
  gap: [
    '¡El salto se quedó cortito! Prueba con un doble salto.',
    '¡Uy, ese hueco era más ancho! ¡Tú puedes!',
  ],
  lava: [
    '¡Piso calentito! Salta el peligro y vuelve a intentarlo.',
    '¡La lava bloqueó el camino! Tu próxima carrera llegará más lejos.',
  ],
  obstacle: [
    '¡Ups! Un obstáculo se cruzó. ¡La siguiente carrera será mejor!',
    '¡Casi lo logras! Prueba otra vez y sigue sumando monedas.',
  ],
  platform: [
    '¡La plataforma era peligrosa! Busca un salto seguro.',
    '¡Esa plataforma te sorprendió! Ya sabes qué buscar.',
  ],
  water: [
    '¡La corriente te empujó! Intenta saltar en el momento justo.',
    '¡Chapuzón! Vuelve a correr y sigue el camino de burbujas.',
  ],
};

export default class StageResultScene extends Phaser.Scene {
  constructor() {
    super('StageResultScene');
  }

  create(data = {}) {
    const outcome = data.outcome === 'victory' ? 'victory' : 'defeat';
    const levelId = Number.isInteger(data.levelId) && data.levelId > 0
      ? data.levelId
      : 1;
    const stageName = typeof data.stageName === 'string'
      ? data.stageName
      : (STAGE_CONFIGS[levelId - 1]?.name ?? 'COLOR DASH');
    const score = this.safeCount(data.score);
    const coins = this.safeCount(data.collectedCoins);
    const totalCoins = this.safeCount(data.totalCoins);
    const hits = this.safeCount(data.hits);
    const deathCause = typeof data.deathCause === 'string' ? data.deathCause : 'obstacle';
    const stars = outcome === 'victory'
      ? Phaser.Math.Clamp(this.safeCount(data.stars), 1, 3)
      : 0;
    const oldBest = this.safeCount(localStorage.getItem(BEST_SCORE_KEY));
    const bestScore = Math.max(oldBest, score);
    const starsKey = `colorDashLevel${levelId}Stars`;
    const oldStars = this.safeCount(localStorage.getItem(starsKey));
    const bestStars = Math.max(oldStars, stars);
    const oldUnlockedLevel = Math.min(
      LEVEL_COUNT,
      Math.max(1, this.safeCount(localStorage.getItem('colorDashUnlockedLevel'))),
    );
    const unlockedLevel = Math.min(LEVEL_COUNT, Math.max(oldUnlockedLevel, levelId + 1));
    const newlyUnlockedOutfit = outcome === 'victory'
      ? OUTFIT_OPTIONS.find(({ unlockLevel }) => (
        unlockLevel > oldUnlockedLevel && unlockLevel <= unlockedLevel
      ))
      : undefined;

    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
    if (outcome === 'victory') {
      localStorage.setItem(starsKey, String(bestStars));
      localStorage.setItem('colorDashUnlockedLevel', String(unlockedLevel));
    }

    const audio = this.registry.get('audioManager');
    audio.playMusic('menuMusic');
    drawResultBackground(this, outcome);
    audio.playSfx(outcome === 'victory'
      ? newlyUnlockedOutfit ? 'unlock' : 'victory'
      : 'oops');

    const title = outcome === 'victory'
      ? levelId === LEVEL_COUNT ? '¡CAMPEÓN COLOR DASH!' : '¡NIVEL COMPLETADO!'
      : '¡CASI LO LOGRAS!';
    this.add.text(400, 63, title, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: outcome === 'victory' && levelId === LEVEL_COUNT ? '30px' : '34px',
      fontStyle: 'bold',
      color: outcome === 'victory' ? '#227a57' : '#493985',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    const defeatMessages = DEFEAT_MESSAGES[deathCause] ?? DEFEAT_MESSAGES.obstacle;
    const defeatMessage = defeatMessages[(levelId + hits) % defeatMessages.length];
    const subtitle = outcome === 'victory'
      ? levelId === LEVEL_COUNT
        ? '¡TODOS LOS MUNDOS ESTÁN A SALVO!'
        : newlyUnlockedOutfit
          ? `¡NUEVO ESTILO DESBLOQUEADO: ${newlyUnlockedOutfit.label}!`
          : `¡SUPERASTE ${stageName}!`
      : defeatMessage;
    this.add.text(400, 108, subtitle, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: outcome === 'victory' ? '#267254' : '#465a86',
      stroke: '#ffffff',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const resultPanel = this.add.graphics();
    resultPanel.fillStyle(0x283963, 0.2);
    resultPanel.fillRoundedRect(58, 137, 688, 215, 25);
    resultPanel.fillStyle(0xffffff, 0.94);
    resultPanel.fillRoundedRect(58, 130, 688, 215, 25);

    for (let index = 0; index < 3; index += 1) {
      const earned = index < stars;
      this.add.star(340 + index * 60, 170, 5, 17, 34, earned ? 0xffc83d : 0xc3cbd3)
        .setStrokeStyle(3, earned ? 0xe89925 : 0x97a4b0, 0.9)
        .setAlpha(earned ? 1 : 0.55);
    }

    this.add.text(400, 203, `ESTRELLAS: ${stars}/3  ·  MEJOR: ${bestStars}/3`, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#5528a8',
    }).setOrigin(0.5);

    const coinRatio = totalCoins > 0 ? Math.floor((coins / totalCoins) * 100) : 0;
    const details = [
      { label: 'PUNTOS', value: score.toLocaleString('es'), x: 190 },
      { label: 'MONEDAS', value: `${coins}/${totalCoins} · ${coinRatio}%`, x: 400 },
      { label: 'GOLPES', value: String(hits), x: 610 },
    ];
    details.forEach(({ label, value, x }) => {
      const statCard = this.add.graphics();
      statCard.fillStyle(outcome === 'victory' ? 0xe6f7ed : 0xeaf0ff, 0.95);
      statCard.fillRoundedRect(x - 88, 225, 176, 62, 14);
      this.add.text(x, 241, label, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#52657c',
      }).setOrigin(0.5);
      this.add.text(x, 263, value, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        color: '#493b67',
      }).setOrigin(0.5);
    });

    this.add.text(400, 318, `RÉCORD PERSONAL: ${bestScore.toLocaleString('es')} PUNTOS`, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#5528a8',
    }).setOrigin(0.5);

    createMenuButton(this, {
      x: 135,
      y: 398,
      width: 194,
      height: 48,
      label: outcome === 'victory' ? 'JUGAR OTRA VEZ' : 'INTENTAR DE NUEVO',
      color: 0xf07832,
      fontSize: 12,
      onClick: () => this.scene.start('GameScene', { levelId }),
    });
    createMenuButton(this, {
      x: 400,
      y: 398,
      width: 194,
      height: 48,
      label: outcome === 'victory' && levelId < LEVEL_COUNT ? 'SIGUIENTE NIVEL' : 'MAPA DE NIVELES',
      color: 0x48b968,
      fontSize: 13,
      onClick: () => {
        if (outcome === 'victory' && levelId < LEVEL_COUNT) {
          this.scene.start('GameScene', { levelId: levelId + 1 });
          return;
        }
        this.scene.start('LevelSelectScene');
      },
    });
    createMenuButton(this, {
      x: 665,
      y: 398,
      width: 194,
      height: 48,
      label: 'MENÚ PRINCIPAL',
      color: 0x6f50d7,
      fontSize: 13,
      onClick: () => this.scene.start('MenuScene'),
    });
  }

  safeCount(value) {
    const count = Number(value);
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
  }
}
