import { coinLine, prepareStageConfig } from './stageConfigUtils.js';

const STAGE_BLUEPRINTS = [
  {
    id: 7,
    name: 'RÍO DE LOS COCODRILOS',
    shortName: 'RÍO',
    difficulty: 'EXPERTO',
    theme: 'river',
    mode: 'day',
    obstacleKinds: ['waterfall', 'rock', 'wave'],
    platformKind: 'water',
    animal: 'crocodile',
    colors: { sky: '#8bdaf0', farHill: 0x75c7a2, nearHill: 0x49a981, grass: 0x29866b, ground: 0x17654f },
  },
  {
    id: 8,
    name: 'SELVA DE LOS MONITOS',
    shortName: 'SELVA',
    difficulty: 'EXPERTO',
    theme: 'jungle',
    mode: 'day',
    obstacleKinds: ['vine', 'spikes', 'rock'],
    platformKind: 'thorn',
    animal: 'monkey',
    colors: { sky: '#92df9a', farHill: 0x62bb68, nearHill: 0x358e50, grass: 0x287446, ground: 0x1b583a },
  },
  {
    id: 9,
    name: 'VOLCÁN DE CARAMELO',
    shortName: 'VOLCÁN',
    difficulty: 'MAESTRO',
    theme: 'volcano',
    mode: 'sunset',
    obstacleKinds: ['lava-rock', 'geyser', 'spikes'],
    platformKind: 'lava',
    animal: 'dragon',
    colors: { sky: '#ed8b72', farHill: 0xc65353, nearHill: 0x943d4c, grass: 0x5d333f, ground: 0x3c2639 },
  },
  {
    id: 10,
    name: 'ISLAS DE LAS NUBES',
    shortName: 'NUBES',
    difficulty: 'MAESTRO',
    theme: 'clouds',
    mode: 'day',
    obstacleKinds: ['overhead', 'windmill', 'spikes'],
    platformKind: 'cloud',
    animal: 'butterfly',
    colors: { sky: '#70c8ff', farHill: 0xc3e7ff, nearHill: 0x91c9ef, grass: 0x719fce, ground: 0x557fb3 },
  },
  {
    id: 11,
    name: 'DESIERTO DE LOS CACTUS',
    shortName: 'DESIERTO',
    difficulty: 'MAESTRO',
    theme: 'desert',
    mode: 'sunset',
    obstacleKinds: ['cactus', 'rock', 'geyser'],
    platformKind: 'thorn',
    animal: 'scorpion',
    colors: { sky: '#ffc47a', farHill: 0xe9a75f, nearHill: 0xc97b45, grass: 0xb9683f, ground: 0x914f37 },
  },
  {
    id: 12,
    name: 'CIUDAD ROBOT',
    shortName: 'ROBOTS',
    difficulty: 'MAESTRO',
    theme: 'robot',
    mode: 'night',
    obstacleKinds: ['laser', 'fan', 'rock'],
    platformKind: 'electric',
    animal: 'robot',
    colors: { sky: '#273767', farHill: 0x6479bc, nearHill: 0x465b9b, grass: 0x35467a, ground: 0x26345e },
  },
  {
    id: 13,
    name: 'LAGUNA DE MEDUSAS',
    shortName: 'LAGUNA',
    difficulty: 'MAESTRO',
    theme: 'deep-ocean',
    mode: 'night',
    obstacleKinds: ['coral', 'waterfall', 'spikes'],
    platformKind: 'electric',
    animal: 'jellyfish',
    animalY: 270,
    colors: { sky: '#1e4f78', farHill: 0x357f9d, nearHill: 0x28627f, grass: 0x1e526e, ground: 0x163c5a },
  },
  {
    id: 14,
    name: 'PLANETA DE LOS ANILLOS',
    shortName: 'ANILLOS',
    difficulty: 'LEYENDA',
    theme: 'planet',
    mode: 'night',
    obstacleKinds: ['rock', 'laser', 'lava-rock'],
    platformKind: 'meteor',
    animal: 'alien',
    colors: { sky: '#211b55', farHill: 0x7563be, nearHill: 0x514b9c, grass: 0x393d7f, ground: 0x292c61 },
  },
  {
    id: 15,
    name: 'BOSQUE DE HOJAS BAILARINAS',
    shortName: 'OTOÑO',
    difficulty: 'LEYENDA',
    theme: 'autumn',
    mode: 'sunset',
    obstacleKinds: ['vine', 'cactus', 'rock'],
    platformKind: 'thorn',
    animal: 'fox',
    colors: { sky: '#f4a16f', farHill: 0xd98259, nearHill: 0xb7604d, grass: 0x8d493f, ground: 0x693a3a },
  },
  {
    id: 16,
    name: 'CUEVA DE CRISTALES',
    shortName: 'CRISTALES',
    difficulty: 'LEYENDA',
    theme: 'crystal',
    mode: 'night',
    obstacleKinds: ['crystal', 'icicle', 'spikes'],
    platformKind: 'crystal',
    animal: 'bat',
    colors: { sky: '#30275f', farHill: 0x856dc4, nearHill: 0x604e9f, grass: 0x483d7d, ground: 0x332d60 },
  },
  {
    id: 17,
    name: 'CATARATAS SALTARINAS',
    shortName: 'CATARATA',
    difficulty: 'LEYENDA',
    theme: 'waterfall',
    mode: 'day',
    obstacleKinds: ['waterfall', 'wave', 'rock'],
    platformKind: 'water',
    animal: 'frog',
    colors: { sky: '#83d7ef', farHill: 0x73c5ad, nearHill: 0x47a88e, grass: 0x287c71, ground: 0x1c5e5e },
  },
  {
    id: 18,
    name: 'BASE LUNAR',
    shortName: 'LUNA',
    difficulty: 'LEYENDA',
    theme: 'moon',
    mode: 'night',
    obstacleKinds: ['laser', 'lava-rock', 'fan'],
    platformKind: 'electric',
    animal: 'penguin',
    colors: { sky: '#202c53', farHill: 0x7183ad, nearHill: 0x52658e, grass: 0x3e4c70, ground: 0x2a3658 },
  },
  {
    id: 19,
    name: 'ARCOÍRIS SOBRE LAS NUBES',
    shortName: 'ARCOÍRIS',
    difficulty: 'CAMPEÓN',
    theme: 'rainbow',
    mode: 'day',
    obstacleKinds: ['overhead', 'windmill', 'spikes'],
    platformKind: 'cloud',
    animal: 'butterfly',
    colors: { sky: '#8edaff', farHill: 0xf3b5d7, nearHill: 0xb19be6, grass: 0x6ab8be, ground: 0x468d9d },
  },
  {
    id: 20,
    name: 'FIESTA GALÁCTICA',
    shortName: 'FIESTA',
    difficulty: 'CAMPEÓN',
    theme: 'galaxy',
    mode: 'night',
    obstacleKinds: ['lava-rock', 'laser', 'crystal'],
    platformKind: 'electric',
    animal: 'dragon',
    colors: { sky: '#21194f', farHill: 0x875cb6, nearHill: 0x5a4b9b, grass: 0x3a3b78, ground: 0x292a5c },
  },
];

function createStageConfig(blueprint) {
  const difficultyIndex = blueprint.id - 6;
  const speed = 330 + difficultyIndex * 4;
  const finishDistance = speed * 49;
  const segmentEnds = [
    Math.floor(finishDistance / 3),
    Math.floor((finishDistance * 2) / 3),
    finishDistance,
  ];
  const segmentNames = ['PRIMERA AVENTURA', 'NUEVOS AMIGOS', 'GRAN FINAL'];
  let segmentStart = 0;

  const segments = segmentEnds.map((segmentEnd, segmentIndex) => {
    const span = segmentEnd - segmentStart;
    const at = (progress) => Math.round(segmentStart + span * progress);
    const events = [
      ...coinLine([at(0.08), at(0.095), at(0.11)]),
      { type: 'obstacle', kind: blueprint.obstacleKinds[segmentIndex], distance: at(0.25) },
      {
        type: 'animal',
        variant: blueprint.id === 7 && segmentIndex === 2 ? 'otter' : blueprint.animal,
        distance: at(0.42),
        y: blueprint.animalY ?? 292,
        speed: 260 + difficultyIndex * 4,
        nightSound: blueprint.mode === 'night',
      },
      {
        type: 'platform',
        kind: blueprint.platformKind,
        distance: at(0.6),
        width: 106 + (segmentIndex % 2) * 16,
      },
      segmentIndex === 1
        ? { type: 'gap', distance: at(0.76), width: 112 + difficultyIndex * 2 }
        : { type: 'energy', distance: at(0.76), y: 280 },
      segmentIndex === 2
        ? { type: 'orb', distance: at(0.88), y: 250 }
        : { type: 'shield', distance: at(0.88), y: 282, duration: 4 },
    ];

    if (segmentIndex === 2) {
      events.push({ type: 'finish', distance: finishDistance - 120 });
    }

    segmentStart = segmentEnd;
    return {
      name: `${segmentIndex + 1}. ${segmentNames[segmentIndex]}`,
      endDistance: segmentEnd,
      events,
    };
  });

  return prepareStageConfig({
    ...blueprint,
    speed,
    finishDistance,
    floorY: 350,
    gravity: 1580 + difficultyIndex * 7,
    jumpVelocity: -555 - difficultyIndex * 1.5,
    doubleJumpVelocity: -505 - difficultyIndex * 1.3,
    jumpFatiguePerJump: 45,
    jumpFatigueRecovery: Math.max(24, 30 - Math.floor(difficultyIndex / 4)),
    jumpFatigueMax: 100,
    energyPickup: 65,
    starCoinRatio: 0.6,
    threeStarCoinRatio: 0.8,
    bonusDuration: 5,
    segments,
  });
}

export const STAGE7_TO_20_CONFIGS = STAGE_BLUEPRINTS.map(createStageConfig);
