import { STAGE1_CONFIG } from '../stage1/stage1Config.js';
import { STAGE2_CONFIG } from './stage2Config.js';
import { STAGE3_CONFIG } from './stage3Config.js';
import { STAGE4_CONFIG } from './stage4Config.js';
import { STAGE5_CONFIG } from './stage5Config.js';

export const STAGE_CONFIGS = [
  STAGE1_CONFIG,
  STAGE2_CONFIG,
  STAGE3_CONFIG,
  STAGE4_CONFIG,
  STAGE5_CONFIG,
];

export function getStageConfig(levelId) {
  return STAGE_CONFIGS.find((config) => config.id === levelId) ?? STAGE1_CONFIG;
}

export function calculateStageStars(stageConfig, { completed, collectedCoins, hits }) {
  if (!completed) {
    return 0;
  }

  const coinRatio = collectedCoins / stageConfig.totalCoins;
  return 1
    + Number(coinRatio >= stageConfig.starCoinRatio)
    + Number(coinRatio >= stageConfig.threeStarCoinRatio && hits === 0);
}
