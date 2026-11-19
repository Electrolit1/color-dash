export const coinLine = (distances, y = 338) => distances.map((distance) => ({
  type: 'coin',
  distance,
  y,
}));

export function prepareStageConfig(config) {
  const events = config.segments
    .flatMap((segment) => segment.events)
    .sort((left, right) => left.distance - right.distance);

  return {
    ...config,
    events,
    totalCoins: events.filter((event) => event.type === 'coin').length,
  };
}
