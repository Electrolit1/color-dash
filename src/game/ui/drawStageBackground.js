function createCloud(scene, x, y, scale, duration, color) {
  const cloud = scene.add.graphics().setPosition(x, y).setScale(scale);
  cloud.fillStyle(color, 0.82);
  cloud.fillCircle(-25, 4, 19);
  cloud.fillCircle(0, -8, 25);
  cloud.fillCircle(25, 4, 18);

  scene.tweens.add({
    targets: cloud,
    x: x - 24,
    y: y - 4,
    duration,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.inOut',
  });
}

function drawNightSky(scene, stageConfig) {
  const stars = scene.add.graphics().setDepth(-10);
  for (let index = 0; index < 38; index += 1) {
    const x = (index * 197 + 41) % 790 + 5;
    const y = (index * 83 + 27) % 205 + 18;
    const radius = index % 7 === 0 ? 2 : 1;
    stars.fillStyle(0xffffff, index % 3 === 0 ? 0.9 : 0.6);
    stars.fillCircle(x, y, radius);
  }

  const moon = scene.add.graphics().setDepth(-9);
  moon.fillStyle(0xe9f0ff, 0.2);
  moon.fillCircle(704, 78, 48);
  moon.fillStyle(stageConfig.theme === 'space' ? 0x9be8ff : 0xfff1b3);
  moon.fillCircle(704, 78, 34);
  moon.fillStyle(stageConfig.colors.sky);
  moon.fillCircle(718, 68, 29);

  if (stageConfig.theme === 'snow') {
    const aurora = scene.add.graphics().setDepth(-8);
    aurora.lineStyle(16, 0x58f0d1, 0.12);
    aurora.beginPath();
    aurora.moveTo(20, 162);
    aurora.lineTo(180, 118);
    aurora.lineTo(330, 160);
    aurora.lineTo(490, 112);
    aurora.lineTo(650, 155);
    aurora.lineTo(790, 122);
    aurora.strokePath();
  }
}

function drawThemeDetails(scene, stageConfig) {
  const details = scene.add.graphics().setDepth(-9);

  if (stageConfig.theme === 'snow') {
    details.fillStyle(0xeaf5ff, 0.9);
    details.fillTriangle(95, 303, 185, 143, 280, 303);
    details.fillTriangle(500, 300, 625, 115, 755, 300);
    details.fillStyle(0xffffff, 0.96);
    details.fillTriangle(160, 188, 185, 143, 213, 190);
    details.fillTriangle(593, 163, 625, 115, 661, 165);
  } else if (stageConfig.theme === 'tropical') {
    [66, 740].forEach((x, index) => {
      const baseY = 314;
      details.lineStyle(8, 0x77513d, 0.85);
      details.beginPath();
      details.moveTo(x, baseY);
      details.lineTo(x + (index === 0 ? 6 : -6), 218);
      details.strokePath();
      details.lineStyle(6, 0x247951, 0.9);
      for (let frond = -2; frond <= 2; frond += 1) {
        details.beginPath();
        details.moveTo(x, 221);
        details.lineTo(x + frond * 25, 195 + Math.abs(frond) * 7);
        details.strokePath();
      }
    });
  } else if (stageConfig.theme === 'space') {
    details.lineStyle(5, 0xcbbcff, 0.7);
    details.strokeCircle(656, 165, 46);
    details.fillStyle(0x9f87e7, 0.92);
    details.fillCircle(656, 165, 30);
    details.fillStyle(0xffc7ec, 0.72);
    details.fillCircle(646, 154, 7);
    details.fillCircle(670, 174, 5);
  } else if (stageConfig.theme === 'candy') {
    details.lineStyle(5, 0xffe6f4, 0.82);
    details.strokeCircle(689, 153, 27);
    details.lineStyle(3, 0xffffff, 0.9);
    details.beginPath();
    details.moveTo(669, 153);
    details.lineTo(709, 153);
    details.strokePath();
  } else if (['ocean', 'deep-ocean', 'river', 'waterfall'].includes(stageConfig.theme)) {
    const waterColor = stageConfig.theme === 'deep-ocean' ? 0x7be8ff : 0xe7ffff;
    details.lineStyle(5, waterColor, 0.7);
    for (let wave = 0; wave < 4; wave += 1) {
      const y = 178 + wave * 20;
      details.beginPath();
      details.moveTo(20, y);
      details.lineTo(92, y - 10);
      details.lineTo(158, y + 4);
      details.lineTo(222, y - 8);
      details.strokePath();
    }

    for (let bubble = 0; bubble < 7; bubble += 1) {
      details.strokeCircle(62 + bubble * 105, 78 + (bubble % 3) * 28, 4 + (bubble % 2) * 2);
    }

    if (stageConfig.theme === 'ocean' || stageConfig.theme === 'deep-ocean') {
      details.lineStyle(8, 0xff8ca8, 0.9);
      details.beginPath();
      details.moveTo(676, 304);
      details.lineTo(676, 260);
      details.lineTo(654, 240);
      details.moveTo(676, 278);
      details.lineTo(700, 250);
      details.moveTo(700, 250);
      details.lineTo(714, 232);
      details.strokePath();
    } else {
      details.fillStyle(0xffffff, 0.6);
      details.fillTriangle(620, 280, 686, 150, 752, 280);
      details.fillStyle(0xa7efff, 0.7);
      details.fillRect(675, 160, 20, 118);
    }
  } else if (stageConfig.theme === 'jungle') {
    [65, 725].forEach((x) => {
      details.fillStyle(0x76513b);
      details.fillRoundedRect(x - 9, 176, 18, 147, 8);
      details.fillStyle(0x43a85a);
      details.fillCircle(x - 18, 176, 29);
      details.fillCircle(x + 16, 164, 34);
      details.fillCircle(x + 3, 140, 27);
    });
  } else if (stageConfig.theme === 'volcano') {
    details.fillStyle(0x653d58);
    details.fillTriangle(388, 302, 526, 106, 668, 302);
    details.fillStyle(0xffa05a);
    details.fillTriangle(486, 164, 526, 106, 570, 164);
    details.fillStyle(0xffd66e, 0.85);
    details.fillTriangle(504, 157, 526, 120, 547, 157);
  } else if (stageConfig.theme === 'clouds' || stageConfig.theme === 'rainbow') {
    if (stageConfig.theme === 'rainbow') {
      [0xff7185, 0xffc45d, 0xffeb68, 0x7edc9a, 0x73caff, 0xb085f5].forEach((color, index) => {
        details.lineStyle(8, color, 0.9);
        details.strokeCircle(400, 318, 156 - index * 11);
      });
    } else {
      [105, 330, 585].forEach((x, index) => {
        const y = 164 + (index % 2) * 34;
        details.fillStyle(0xffffff, 0.86);
        details.fillCircle(x - 25, y, 24);
        details.fillCircle(x + 2, y - 12, 31);
        details.fillCircle(x + 32, y, 23);
      });
    }
  } else if (stageConfig.theme === 'desert') {
    [640, 714].forEach((x, index) => {
      details.lineStyle(12, 0x4f9855, 0.9);
      details.beginPath();
      details.moveTo(x, 310);
      details.lineTo(x, 214 + index * 12);
      details.moveTo(x, 270);
      details.lineTo(x - 20, 250);
      details.moveTo(x, 284);
      details.lineTo(x + 20, 264);
      details.strokePath();
    });
  } else if (stageConfig.theme === 'robot') {
    [90, 170, 660, 728].forEach((x, index) => {
      const height = 88 + (index % 2) * 35;
      details.fillStyle(0x374b86, 0.9);
      details.fillRoundedRect(x - 25, 300 - height, 50, height, 7);
      details.fillStyle(0x8ff3df, 0.85);
      for (let row = 0; row < 3; row += 1) {
        details.fillRoundedRect(x - 15, 225 - height + row * 26, 10, 12, 3);
        details.fillRoundedRect(x + 5, 225 - height + row * 26, 10, 12, 3);
      }
    });
  } else if (stageConfig.theme === 'planet' || stageConfig.theme === 'moon' || stageConfig.theme === 'galaxy') {
    details.lineStyle(7, 0xd7c5ff, 0.78);
    details.strokeEllipse(658, 184, 142, 42);
    details.fillStyle(stageConfig.theme === 'moon' ? 0xc3d0e7 : 0x9f87e7, 0.95);
    details.fillCircle(658, 184, 42);
    details.fillStyle(0x554f8a, 0.72);
    details.fillCircle(646, 174, 8);
    details.fillCircle(673, 192, 6);
    if (stageConfig.theme === 'galaxy') {
      details.fillStyle(0xffd35e);
      details.fillTriangle(510, 117, 504, 130, 516, 130);
      details.fillTriangle(510, 143, 504, 130, 516, 130);
      details.fillTriangle(497, 130, 510, 124, 510, 136);
      details.fillTriangle(523, 130, 510, 124, 510, 136);
      details.fillTriangle(572, 193, 567, 204, 577, 204);
      details.fillTriangle(572, 215, 567, 204, 577, 204);
      details.fillTriangle(561, 204, 572, 199, 572, 209);
      details.fillTriangle(583, 204, 572, 199, 572, 209);
    }
  } else if (stageConfig.theme === 'autumn') {
    [120, 220, 585, 694].forEach((x, index) => {
      details.fillStyle(index % 2 === 0 ? 0xf3a34f : 0xd75c4c, 0.9);
      details.fillEllipse(x, 174 + (index % 2) * 22, 18, 10);
      details.fillEllipse(x + 26, 203, 15, 9);
    });
  } else if (stageConfig.theme === 'crystal') {
    [115, 680, 732].forEach((x, index) => {
      const height = 64 + index * 18;
      details.fillStyle(index % 2 === 0 ? 0x8de9ff : 0xc1a7ff, 0.8);
      details.fillTriangle(x - 22, 307, x, 307 - height, x + 23, 307);
      details.fillStyle(0xffffff, 0.72);
      details.fillTriangle(x - 4, 292, x, 307 - height, x + 4, 292);
    });
  }

  details.setDepth(-9);
}

export default function drawStageBackground(scene, stageConfig) {
  const { colors, floorY, mode } = stageConfig;
  scene.cameras.main.setBackgroundColor(colors.sky);

  if (mode === 'night') {
    drawNightSky(scene, stageConfig);
  } else {
    const sun = scene.add.graphics().setDepth(-10);
    sun.fillStyle(mode === 'sunset' ? 0xffbc75 : 0xffdf72);
    sun.fillCircle(704, 70, 38);
  }

  const farHills = scene.add.graphics();
  farHills.fillStyle(colors.farHill);
  farHills.fillEllipse(120, floorY - 6, 360, 134);
  farHills.fillEllipse(420, floorY - 3, 380, 142);
  farHills.fillEllipse(740, floorY - 7, 360, 130);
  farHills.setDepth(-9);

  const nearHills = scene.add.graphics();
  nearHills.fillStyle(colors.nearHill);
  nearHills.fillEllipse(70, floorY + 10, 290, 106);
  nearHills.fillEllipse(565, floorY + 9, 400, 118);
  nearHills.setDepth(-8);

  scene.tweens.add({
    targets: farHills,
    x: -12,
    duration: 5400,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.inOut',
  });
  scene.tweens.add({
    targets: nearHills,
    x: 14,
    duration: 4100,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.inOut',
  });

  drawThemeDetails(scene, stageConfig);
  if (mode !== 'night') {
    const cloudColor = mode === 'sunset' ? 0xffe2d5 : 0xffffff;
    createCloud(scene, 95, 105, 0.9, 5200, cloudColor);
    createCloud(scene, 365, 82, 0.72, 6100, cloudColor);
    createCloud(scene, 590, 122, 0.82, 4700, cloudColor);
  }

  const ground = scene.add.graphics();
  ground.fillStyle(colors.grass);
  ground.fillRect(0, floorY, 800, 100);
  ground.fillStyle(colors.ground);
  ground.fillRect(0, floorY, 800, 8);

  const marks = [];
  const markColor = ['ocean', 'deep-ocean', 'river', 'waterfall'].includes(stageConfig.theme)
    ? 0xa5f3ed
    : stageConfig.theme === 'meadow'
      ? 0x358e4a
      : stageConfig.theme === 'snow'
        ? 0x6d91b8
        : 0x263e50;
  for (let x = 20; x < 820; x += 74) {
    const mark = scene.add.graphics().setPosition(x, floorY + 31);
    mark.lineStyle(3, markColor, 0.52);
    mark.beginPath();
    mark.moveTo(-7, 0);
    mark.lineTo(-2, -5);
    mark.moveTo(4, 2);
    mark.lineTo(9, -4);
    mark.strokePath();
    marks.push(mark);
  }

  return { marks };
}
