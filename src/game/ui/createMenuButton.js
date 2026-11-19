import Phaser from 'phaser';

export default function createMenuButton(
  scene,
  { x, y, width, height, label, color, onClick, fontSize = 19 },
) {
  const button = scene.add.container(x - width / 2, y - height / 2);
  const graphics = scene.add.graphics();
  const text = scene.add.text(width / 2, height / 2, label, {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    fontSize: `${fontSize}px`,
    fontStyle: 'bold',
    color: '#ffffff',
    stroke: '#3e3260',
    strokeThickness: 3,
    align: 'center',
    wordWrap: { width: width - 24 },
  }).setOrigin(0.5);

  graphics.fillStyle(0x30264a, 0.2);
  graphics.fillRoundedRect(0, 5, width, height, 18);
  graphics.fillStyle(color);
  graphics.fillRoundedRect(0, 0, width, height - 5, 18);
  graphics.lineStyle(3, 0xffffff, 0.9);
  graphics.strokeRoundedRect(0, 0, width, height - 5, 18);
  graphics.fillStyle(0xffffff, 0.16);
  graphics.fillRoundedRect(8, 5, width - 16, 12, 7);

  button.add([graphics, text]);
  button.setSize(width, height);
  button.setInteractive(
    new Phaser.Geom.Rectangle(0, 0, width, height),
    Phaser.Geom.Rectangle.Contains,
  );
  button.input.cursor = 'pointer';

  const animateScale = (scale) => {
    scene.tweens.killTweensOf(button);
    scene.tweens.add({
      targets: button,
      scaleX: scale,
      scaleY: scale,
      duration: 130,
      ease: 'Back.Out',
    });
  };

  button.on('pointerover', () => animateScale(1.045));
  button.on('pointerout', () => animateScale(1));
  button.on('pointerdown', () => animateScale(0.96));
  button.on('pointerup', () => {
    animateScale(1.045);
    scene.registry.get('audioManager').playSfx('button');
    onClick();
  });

  return {
    button,
    setLabel(value) {
      text.setText(value);
    },
  };
}
