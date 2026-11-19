export default function drawColorfulBackground(scene) {
  scene.cameras.main.setBackgroundColor('#a9e7ff');

  const sun = scene.add.graphics().setDepth(-10);
  sun.fillStyle(0xffdf72);
  sun.fillCircle(704, 78, 42);

  const clouds = scene.add.graphics().setDepth(-9);
  clouds.fillStyle(0xffffff, 0.9);
  clouds.fillCircle(130, 102, 24);
  clouds.fillCircle(158, 91, 32);
  clouds.fillCircle(192, 104, 22);
  clouds.fillCircle(505, 78, 18);
  clouds.fillCircle(529, 69, 25);
  clouds.fillCircle(555, 81, 18);
  clouds.fillCircle(334, 115, 15);
  clouds.fillCircle(354, 105, 23);
  clouds.fillCircle(379, 116, 16);

  scene.tweens.add({
    targets: clouds,
    x: 18,
    duration: 4200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.inOut',
  });

  const hills = scene.add.graphics().setDepth(-8);
  hills.fillStyle(0x86dc88);
  hills.fillEllipse(116, 382, 350, 130);
  hills.fillEllipse(694, 374, 400, 140);
  hills.fillStyle(0x58c978);
  hills.fillRect(0, 372, 800, 78);
  hills.fillStyle(0x45b967);
  hills.fillRect(0, 372, 800, 7);
}
