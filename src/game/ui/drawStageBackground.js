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
  const markColor = stageConfig.theme === 'meadow'
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
