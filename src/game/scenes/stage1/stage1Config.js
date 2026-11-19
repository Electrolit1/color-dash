const coinLine = (distances, y) => distances.map((distance) => ({
  type: 'coin',
  distance,
  y,
}));

export const STAGE1_CONFIG = {
  id: 1,
  name: 'PRADERA SOLEADA',
  speed: 230,
  finishDistance: 11000,
  floorY: 350,
  gravity: 1450,
  jumpVelocity: -520,
  starCoinRatio: 0.7,
  threeStarCoinRatio: 0.9,
  bonusDuration: 5,
  colors: {
    sky: '#a9e7ff',
    farHill: 0x9fe49b,
    nearHill: 0x72d27c,
    grass: 0x54bd69,
    ground: 0x48a955,
  },
  segments: [
    {
      name: 'CALENTAMIENTO',
      endDistance: 3667,
      events: [
        ...coinLine([350, 440, 530], 338),
        { type: 'coin', distance: 1050, y: 295 },
        { type: 'coin', distance: 1140, y: 260 },
        { type: 'coin', distance: 1230, y: 295 },
        { type: 'obstacle', kind: 'ground', distance: 1800 },
        ...coinLine([2160, 2250, 2340], 338),
        { type: 'gap', distance: 2700, width: 120 },
        { type: 'coin', distance: 2910, y: 295 },
        { type: 'coin', distance: 3000, y: 260 },
        { type: 'coin', distance: 3090, y: 295 },
        { type: 'bird', distance: 3400, y: 304, speed: 300 },
      ],
    },
    {
      name: 'AGACHARSE',
      endDistance: 7334,
      events: [
        ...coinLine([4210, 4300, 4390], 338),
        { type: 'obstacle', kind: 'overhead', distance: 4300 },
        { type: 'bird', distance: 4900, y: 303, speed: 330 },
        { type: 'coin', distance: 5190, y: 295 },
        { type: 'coin', distance: 5280, y: 260 },
        { type: 'coin', distance: 5370, y: 295 },
        { type: 'obstacle', kind: 'ground', distance: 5600 },
        { type: 'gap', distance: 5900, width: 112 },
        ...coinLine([6310, 6400, 6490], 338),
        { type: 'obstacle', kind: 'overhead', distance: 6400 },
        { type: 'obstacle', kind: 'ground', distance: 7040 },
      ],
    },
    {
      name: 'META',
      endDistance: 11000,
      events: [
        { type: 'coin', distance: 7580, y: 295 },
        { type: 'coin', distance: 7670, y: 260 },
        { type: 'coin', distance: 7760, y: 295 },
        { type: 'obstacle', kind: 'ground', distance: 8050 },
        { type: 'gap', distance: 8420, width: 116 },
        { type: 'orb', distance: 8600, y: 250 },
        ...coinLine([9060, 9150, 9240], 338),
        { type: 'obstacle', kind: 'overhead', distance: 9150 },
        { type: 'coin', distance: 9910, y: 295 },
        { type: 'coin', distance: 10000, y: 260 },
        { type: 'coin', distance: 10090, y: 295 },
        { type: 'bird', distance: 10200, y: 304, speed: 350 },
        { type: 'obstacle', kind: 'ground', distance: 10500 },
        { type: 'orb', distance: 10660, y: 250 },
        { type: 'finish', distance: 10880 },
      ],
    },
  ],
};

STAGE1_CONFIG.events = STAGE1_CONFIG.segments
  .flatMap((segment) => segment.events)
  .sort((a, b) => a.distance - b.distance);

STAGE1_CONFIG.totalCoins = STAGE1_CONFIG.events
  .filter((event) => event.type === 'coin')
  .length;

export function calculateStage1Stars({ completed, collectedCoins, hits }) {
  if (!completed) {
    return 0;
  }

  const coinRatio = collectedCoins / STAGE1_CONFIG.totalCoins;
  return 1
    + Number(coinRatio >= STAGE1_CONFIG.starCoinRatio)
    + Number(coinRatio >= STAGE1_CONFIG.threeStarCoinRatio && hits === 0);
}
