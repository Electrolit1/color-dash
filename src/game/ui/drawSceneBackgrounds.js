export function drawResultBackground(scene, outcome) {
  const victorious = outcome === 'victory';
  const skyColor = victorious ? 0x9be8d5 : 0x9cb5ed;
  const farColor = victorious ? 0x72c9a1 : 0x8294d3;
  const nearColor = victorious ? 0x42ae83 : 0x6874b7;

  scene.cameras.main.setBackgroundColor(skyColor);

  const sky = scene.add.graphics().setDepth(-20);
  sky.fillStyle(skyColor);
  sky.fillRect(0, 0, 800, 450);
  sky.fillStyle(victorious ? 0xffe58b : 0xf0f0ff, 0.9);
  sky.fillCircle(690, 70, victorious ? 43 : 31);

  if (victorious) {
    const confetti = scene.add.graphics().setDepth(-12);
    const colors = [0xff7185, 0xffc857, 0x68d4bf, 0x8877e8, 0xfff5a1];
    for (let index = 0; index < 38; index += 1) {
      const x = (index * 137 + 41) % 790 + 5;
      const y = (index * 71 + 18) % 105 + 8;
      confetti.fillStyle(colors[index % colors.length], 0.82);
      if (index % 2 === 0) {
        confetti.fillCircle(x, y, 3 + (index % 3));
      } else {
        confetti.fillRoundedRect(x, y, 5, 10, 2);
      }
    }
    scene.tweens.add({
      targets: confetti,
      alpha: 0.55,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  } else {
    const nightDetails = scene.add.graphics().setDepth(-12);
    for (let index = 0; index < 34; index += 1) {
      const x = (index * 173 + 29) % 785 + 8;
      const y = (index * 89 + 16) % 130 + 8;
      nightDetails.fillStyle(0xffffff, index % 3 === 0 ? 0.95 : 0.58);
      nightDetails.fillCircle(x, y, index % 5 === 0 ? 2 : 1.4);
    }
    nightDetails.lineStyle(3, 0xf6e9a1, 0.65);
    nightDetails.strokeCircle(690, 70, 40);
  }

  const hills = scene.add.graphics().setDepth(-10);
  hills.fillStyle(farColor);
  hills.fillEllipse(120, 402, 410, 105);
  hills.fillEllipse(690, 399, 440, 118);
  hills.fillStyle(nearColor);
  hills.fillEllipse(350, 425, 480, 100);
  hills.fillRect(0, 420, 800, 30);
}

export function drawSettingsBackground(scene) {
  scene.cameras.main.setBackgroundColor(0x26366c);

  const background = scene.add.graphics().setDepth(-20);
  background.fillStyle(0x26366c);
  background.fillRect(0, 0, 800, 450);
  background.fillStyle(0x334986, 0.9);
  background.fillCircle(100, 70, 170);
  background.fillStyle(0x46428e, 0.8);
  background.fillCircle(732, 118, 195);
  background.fillStyle(0x315c87, 0.8);
  background.fillEllipse(400, 432, 870, 180);

  const stars = scene.add.graphics().setDepth(-12);
  for (let index = 0; index < 48; index += 1) {
    const x = (index * 163 + 23) % 790 + 5;
    const y = (index * 97 + 17) % 350 + 8;
    stars.fillStyle(index % 4 === 0 ? 0xffe58b : 0xc4e4ff, 0.75);
    stars.fillCircle(x, y, index % 6 === 0 ? 2.4 : 1.3);
  }

  const soundWaves = scene.add.graphics().setDepth(-11);
  [42, 66, 90].forEach((radius, index) => {
    soundWaves.lineStyle(3, index === 1 ? 0x9fe5ee : 0xc3b9ff, 0.34);
    soundWaves.strokeCircle(400, 232, radius);
  });

  const equalizer = scene.add.graphics().setDepth(-10);
  [0, 1, 2, 3, 4].forEach((index) => {
    const height = 28 + (index % 3) * 13;
    equalizer.fillStyle(index % 2 === 0 ? 0xffd17a : 0x91e4df, 0.42);
    equalizer.fillRoundedRect(60 + index * 13, 332 - height, 7, height, 4);
    equalizer.fillRoundedRect(675 + index * 13, 332 - height, 7, height, 4);
  });
}
