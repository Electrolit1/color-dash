import { coinLine, prepareStageConfig } from './stageConfigUtils.js';

export const STAGE6_CONFIG = prepareStageConfig({
  id: 6,
  name: 'OCÉANO DE CORALES',
  shortName: 'OCÉANO',
  difficulty: 'EXPERTO',
  theme: 'ocean',
  mode: 'day',
  speed: 330,
  finishDistance: 16000,
  floorY: 350,
  gravity: 1580,
  jumpVelocity: -555,
  doubleJumpVelocity: -505,
  jumpFatiguePerJump: 45,
  jumpFatigueRecovery: 30,
  jumpFatigueMax: 100,
  energyPickup: 65,
  starCoinRatio: 0.6,
  threeStarCoinRatio: 0.8,
  bonusDuration: 5,
  colors: {
    sky: '#57cfe4',
    farHill: 0x78dfd7,
    nearHill: 0x38b7b0,
    grass: 0x278e8c,
    ground: 0x176f78,
  },
  segments: [
    {
      name: 'ARRECIFE DE COLORES',
      endDistance: 5333,
      events: [
        ...coinLine([420, 510, 600]),
        { type: 'obstacle', kind: 'coral', distance: 1450 },
        { type: 'animal', variant: 'turtle', distance: 2150, y: 295, speed: 280 },
        { type: 'platform', kind: 'water', distance: 3250, width: 116 },
        { type: 'energy', distance: 4420, y: 280 },
      ],
    },
    {
      name: 'CORRIENTES SECRETAS',
      endDistance: 10666,
      events: [
        ...coinLine([5700, 5790, 5880]),
        { type: 'obstacle', kind: 'wave', distance: 6800 },
        { type: 'animal', variant: 'dolphin', distance: 7650, y: 275, speed: 300 },
        { type: 'gap', distance: 8750, width: 126 },
        { type: 'platform', kind: 'electric', distance: 9800, width: 108 },
        { type: 'shield', distance: 10300, y: 282, duration: 4 },
      ],
    },
    {
      name: 'BAHÍA DE LA META',
      endDistance: 16000,
      events: [
        ...coinLine([11200, 11290, 11380]),
        { type: 'animal', variant: 'shark', distance: 12400, y: 290, speed: 320 },
        { type: 'obstacle', kind: 'coral', distance: 13400 },
        { type: 'platform', kind: 'water', distance: 14500, width: 124 },
        { type: 'orb', distance: 15100, y: 250 },
        { type: 'finish', distance: 15880 },
      ],
    },
  ],
});

export default STAGE6_CONFIG;
