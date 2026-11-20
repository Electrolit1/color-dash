const outlines = {
  cat: 0x874c32,
  dog: 0x8c633d,
  rabbit: 0x77718b,
  panda: 0x44404e,
};

const furColors = {
  cat: 0xffad52,
  dog: 0xe9bd7a,
  rabbit: 0xfffbf4,
  panda: 0xf8f5ef,
};

const OUTFIT_IDS = new Set([
  'none',
  'leaf-crown',
  'shell-tiara',
  'rainbow-glasses',
  'astronaut-helmet',
  'dragon-hood',
]);

function drawOutfit(graphics, outfitId) {
  if (!OUTFIT_IDS.has(outfitId)) {
    throw new TypeError(`Vestimenta decorativa desconocida: ${outfitId}`);
  }
  if (outfitId === 'none') {
    return;
  }

  if (outfitId === 'leaf-crown') {
    graphics.fillStyle(0x49a85e);
    graphics.fillTriangle(-23, -39, -15, -59, -5, -39);
    graphics.fillTriangle(-10, -40, 0, -63, 10, -40);
    graphics.fillTriangle(5, -39, 17, -58, 24, -39);
    graphics.fillRoundedRect(-24, -40, 48, 7, 4);
    return;
  }

  if (outfitId === 'shell-tiara') {
    graphics.fillStyle(0xf0a85e);
    graphics.fillRoundedRect(-24, -43, 48, 8, 4);
    graphics.fillStyle(0xffe59a);
    graphics.fillCircle(-16, -48, 7);
    graphics.fillCircle(-5, -52, 8);
    graphics.fillCircle(7, -52, 8);
    graphics.fillCircle(18, -48, 7);
    graphics.lineStyle(2, 0xe58085, 0.9);
    graphics.strokeCircle(-5, -52, 5);
    graphics.strokeCircle(7, -52, 5);
    return;
  }

  if (outfitId === 'rainbow-glasses') {
    graphics.lineStyle(4, 0x7d50bd);
    graphics.strokeCircle(-12, -22, 10);
    graphics.strokeCircle(12, -22, 10);
    graphics.beginPath();
    graphics.moveTo(-2, -22);
    graphics.lineTo(2, -22);
    graphics.strokePath();
    graphics.lineStyle(2, 0xff7c91);
    graphics.strokeCircle(-12, -22, 7);
    graphics.lineStyle(2, 0x54b8e9);
    graphics.strokeCircle(12, -22, 7);
    return;
  }

  if (outfitId === 'astronaut-helmet') {
    graphics.fillStyle(0xbdeeff, 0.2);
    graphics.fillCircle(0, -17, 35);
    graphics.lineStyle(4, 0xcdf6ff, 0.95);
    graphics.strokeCircle(0, -17, 35);
    graphics.fillStyle(0xffffff, 0.7);
    graphics.fillEllipse(-16, -37, 7, 13);
    return;
  }

  graphics.fillStyle(0x55a866);
  graphics.fillTriangle(-24, -28, -22, -56, -5, -35);
  graphics.fillTriangle(24, -28, 22, -56, 5, -35);
  graphics.lineStyle(3, 0x367b4a);
  graphics.beginPath();
  graphics.moveTo(-24, -40);
  graphics.lineTo(0, -47);
  graphics.lineTo(24, -40);
  graphics.strokePath();
}

export default function createCharacterArt(
  scene,
  kind,
  x,
  y,
  scale = 1,
  floating = true,
  outfitId = 'none',
) {
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
  } else if (kind === 'rabbit') {
    graphics.fillStyle(fur);
    graphics.fillEllipse(-12, -48, 17, 47);
    graphics.fillEllipse(12, -48, 17, 47);
    graphics.lineStyle(3, outline);
    graphics.strokeEllipse(-12, -48, 17, 47);
    graphics.strokeEllipse(12, -48, 17, 47);
    graphics.fillStyle(0xf3a4bb);
    graphics.fillEllipse(-12, -48, 7, 32);
    graphics.fillEllipse(12, -48, 7, 32);
  } else {
    graphics.fillStyle(0x302d38);
    graphics.fillCircle(-20, -35, 12);
    graphics.fillCircle(20, -35, 12);
    graphics.lineStyle(3, outline);
    graphics.strokeCircle(-20, -35, 12);
    graphics.strokeCircle(20, -35, 12);
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
  } else if (kind === 'panda') {
    graphics.fillStyle(0x302d38);
    graphics.fillEllipse(-10, -22, 14, 18);
    graphics.fillEllipse(10, -22, 14, 18);
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(-11, -23, 3.5);
    graphics.fillCircle(9, -23, 3.5);
    graphics.fillStyle(0x30264a);
    graphics.fillCircle(-10, -23, 1.8);
    graphics.fillCircle(10, -23, 1.8);
    graphics.fillStyle(0xffffff);
    graphics.fillEllipse(0, -6, 20, 15);
    graphics.fillStyle(0x302d38);
    graphics.fillEllipse(0, -10, 7, 5);
    graphics.fillStyle(0xf0a3ae);
    graphics.fillCircle(-18, -7, 3);
    graphics.fillCircle(18, -7, 3);
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

  drawOutfit(graphics, outfitId);

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
