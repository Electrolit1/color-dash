import Phaser from 'phaser';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';
import { STAGE_CONFIGS } from './stages/stageConfigs.js';

const BEST_SCORE_KEY = 'colorDashBestScore';
const LEVEL_COUNT = STAGE_CONFIGS.length;

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
    const stars = outcome === 'victory'
      ? Phaser.Math.Clamp(this.safeCount(data.stars), 1, 3)
      : 0;
    const oldBest = this.safeCount(localStorage.getItem(BEST_SCORE_KEY));
    const bestScore = Math.max(oldBest, score);
    const starsKey = `colorDashLevel${levelId}Stars`;
    const oldStars = this.safeCount(localStorage.getItem(starsKey));
    const bestStars = Math.max(oldStars, stars);

    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
    if (outcome === 'victory') {
      localStorage.setItem(starsKey, String(bestStars));
      const oldUnlockedLevel = Math.max(
        1,
        this.safeCount(localStorage.getItem('colorDashUnlockedLevel')),
      );
      localStorage.setItem(
        'colorDashUnlockedLevel',
        String(Math.min(LEVEL_COUNT, Math.max(oldUnlockedLevel, levelId + 1))),
      );
      this.registry.get('audioManager').playSfx('star');
    }

    drawColorfulBackground(this);
    const title = outcome === 'victory'
      ? levelId === LEVEL_COUNT ? '¡AVENTURA COMPLETADA!' : '¡NIVEL COMPLETADO!'
      : '¡FIN DE LA CARRERA!';
    this.add.text(400, 63, title, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: outcome === 'victory' && levelId === LEVEL_COUNT ? '31px' : '34px',
      fontStyle: 'bold',
      color: outcome === 'victory' ? '#358b4d' : '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    const subtitle = outcome === 'victory'
      ? levelId === LEVEL_COUNT ? '¡LOS CINCO MUNDOS ESTÁN A SALVO!' : stageName
      : '¡INTÉNTALO OTRA VEZ!';
    this.add.text(400, 108, subtitle, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    for (let index = 0; index < 3; index += 1) {
      const earned = index < stars;
      this.add.star(340 + index * 60, 164, 5, 20, 42, earned ? 0xffc83d : 0xaeb9c4)
        .setStrokeStyle(3, earned ? 0xf29d24 : 0x8795a1, 0.9)
        .setAlpha(earned ? 1 : 0.55);
    }

    this.add.text(400, 194, `MEJOR RESULTADO: ${bestStars}/3 ESTRELLAS`, {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#5528a8',
    }).setOrigin(0.5);

    const coinRatio = totalCoins > 0 ? Math.floor((coins / totalCoins) * 100) : 0;
    const details = [
      `PUNTOS: ${score.toLocaleString('es')}`,
      `MONEDAS: ${coins}/${totalCoins} (${coinRatio}%)`,
      `GOLPES: ${hits}`,
      `MEJOR PUNTUACIÓN: ${bestScore.toLocaleString('es')}`,
    ];
    details.forEach((line, index) => {
      this.add.text(400, 220 + index * 26, line, {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#493b67',
      }).setOrigin(0.5);
    });

    createMenuButton(this, {
      x: 245,
      y: 354,
      width: 218,
      height: 54,
      label: 'REINTENTAR',
      color: 0xf07832,
      fontSize: 17,
      onClick: () => this.scene.start('GameScene', { levelId }),
    });
    createMenuButton(this, {
      x: 555,
      y: 354,
      width: 218,
      height: 54,
      label: outcome === 'victory' && levelId < LEVEL_COUNT
        ? 'SIGUIENTE NIVEL'
        : 'MAPA DE NIVELES',
      color: 0x48b968,
      fontSize: 16,
      onClick: () => {
        if (outcome === 'victory' && levelId < LEVEL_COUNT) {
          this.scene.start('GameScene', { levelId: levelId + 1 });
          return;
        }
        this.scene.start('LevelSelectScene');
      },
    });
    createMenuButton(this, {
      x: 400,
      y: 420,
      width: 220,
      height: 48,
      label: 'MENÚ PRINCIPAL',
      color: 0x6f50d7,
      fontSize: 15,
      onClick: () => this.scene.start('MenuScene'),
    });
  }

  safeCount(value) {
    const count = Number(value);
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
  }
}
