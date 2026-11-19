import { STAGE1_CONFIG } from './stage1Config.js';

function createCloud(scene, x, y, scale, duration) {
  const cloud = scene.add.graphics().setPosition(x, y).setScale(scale);
  cloud.fillStyle(0xffffff, 0.88);
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

export default function drawStage1Background(scene) {
  const { colors, floorY } = STAGE1_CONFIG;
  scene.cameras.main.setBackgroundColor(colors.sky);

  const sun = scene.add.graphics();
  sun.fillStyle(0xffdf72);
  sun.fillCircle(704, 70, 38);
  sun.setDepth(-10);

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

  createCloud(scene, 95, 105, 0.9, 5200);
  createCloud(scene, 365, 82, 0.72, 6100);
  createCloud(scene, 590, 122, 0.82, 4700);

  const ground = scene.add.graphics();
  ground.fillStyle(colors.grass);
  ground.fillRect(0, floorY, 800, 100);
  ground.fillStyle(colors.ground);
  ground.fillRect(0, floorY, 800, 8);

  const marks = [];
  for (let x = 20; x < 820; x += 74) {
    const mark = scene.add.graphics().setPosition(x, floorY + 31);
    mark.lineStyle(3, 0x358e4a, 0.52);
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
