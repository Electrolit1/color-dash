const outlines = {
  cat: 0x874c32,
  dog: 0x8c633d,
  rabbit: 0x77718b,
};

const furColors = {
  cat: 0xffad52,
  dog: 0xe9bd7a,
  rabbit: 0xfffbf4,
};

export default function createCharacterArt(scene, kind, x, y, scale = 1, floating = true) {
  if (!Object.prototype.hasOwnProperty.call(outlines, kind)) {
    throw new TypeError(`Personaje decorativo desconocido: ${kind}`);
  }

  const graphics = scene.add.graphics();
  const fur = furColors[kind];
  const outline = outlines[kind];

  graphics.lineStyle(3, outline);
  graphics.fillStyle(fur);

  if (kind === 'cat') {
    graphics.lineStyle(9, fur);
    graphics.beginPath();
    graphics.moveTo(20, 25);
    graphics.lineTo(37, 10);
    graphics.lineTo(34, -8);
    graphics.strokePath();

    graphics.fillStyle(fur);
    graphics.fillTriangle(-25, -29, -21, -52, -5, -34);
    graphics.fillTriangle(25, -29, 21, -52, 5, -34);
    graphics.lineStyle(3, outline);
    graphics.strokeTriangle(-25, -29, -21, -52, -5, -34);
    graphics.strokeTriangle(25, -29, 21, -52, 5, -34);
    graphics.fillStyle(0xf48fa4);
    graphics.fillTriangle(-20, -34, -19, -46, -11, -35);
    graphics.fillTriangle(20, -34, 19, -46, 11, -35);
  } else if (kind === 'dog') {
    graphics.fillStyle(0xb87943);
    graphics.fillEllipse(-24, -18, 19, 38);
    graphics.fillEllipse(24, -18, 19, 38);
    graphics.lineStyle(3, outline);
    graphics.strokeEllipse(-24, -18, 19, 38);
    graphics.strokeEllipse(24, -18, 19, 38);
  } else {
    graphics.fillStyle(fur);
    graphics.fillEllipse(-12, -48, 17, 47);
    graphics.fillEllipse(12, -48, 17, 47);
    graphics.lineStyle(3, outline);
    graphics.strokeEllipse(-12, -48, 17, 47);
    graphics.strokeEllipse(12, -48, 17, 47);
    graphics.fillStyle(0xf3a4bb);
    graphics.fillEllipse(-12, -48, 7, 32);
    graphics.fillEllipse(12, -48, 7, 32);
  }

  graphics.fillStyle(fur);
  graphics.fillEllipse(0, 27, 45, 54);
  graphics.lineStyle(3, outline);
  graphics.strokeEllipse(0, 27, 45, 54);
  graphics.fillStyle(0xffffff, 0.7);
  graphics.fillEllipse(-8, 48, 11, 12);
  graphics.fillEllipse(8, 48, 11, 12);

  graphics.fillStyle(fur);
  graphics.fillCircle(0, -17, 28);
  graphics.lineStyle(3, outline);
  graphics.strokeCircle(0, -17, 28);

  if (kind === 'dog') {
    graphics.fillStyle(0xf8e8ce);
    graphics.fillEllipse(0, -7, 29, 22);
    graphics.fillStyle(0x684433);
    graphics.fillEllipse(0, -15, 10, 7);
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(-10, -23, 8);
    graphics.fillCircle(10, -23, 8);
  } else {
    graphics.fillStyle(0xffffff);
    graphics.fillEllipse(0, -7, 22, 16);
    graphics.fillStyle(0x392d3e);
    graphics.fillEllipse(-9, -22, 5, 8);
    graphics.fillEllipse(9, -22, 5, 8);
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(-10, -24, 2);
    graphics.fillCircle(8, -24, 2);
    graphics.fillStyle(0xf48fa4);
    graphics.fillCircle(-17, -8, 4);
    graphics.fillCircle(17, -8, 4);
    if (kind === 'rabbit') {
      graphics.fillStyle(0xf18ca5);
      graphics.fillTriangle(0, -7, -4, -11, 4, -11);
      graphics.fillStyle(0xffffff);
      graphics.fillRect(-2, -3, 4, 8);
      graphics.lineStyle(1, 0xd5a8b7);
      graphics.strokeRect(-2, -3, 4, 8);
    } else {
      graphics.fillStyle(0x8c493f);
      graphics.fillTriangle(0, -6, -4, -10, 4, -10);
    }
  }

  if (kind === 'dog') {
    graphics.fillStyle(0x392d3e);
    graphics.fillEllipse(-10, -23, 5, 8);
    graphics.fillEllipse(10, -23, 5, 8);
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(-11, -25, 2);
    graphics.fillCircle(9, -25, 2);
    graphics.fillStyle(0xf08f92);
    graphics.fillCircle(-18, -9, 4);
    graphics.fillCircle(18, -9, 4);
  }

  const character = scene.add.container(x, y, [graphics]);
  character.setScale(scale);
  if (floating) {
    scene.tweens.add({
      targets: character,
      y: y - 5,
      duration: 1050 + Math.round(x),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  return character;
}
