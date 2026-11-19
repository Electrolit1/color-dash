import Phaser from 'phaser';

export default function createStageControl(
  scene,
  { x, label, color, onPress, onRelease, width = 148 },
) {
  const height = 58;
  const button = scene.add.container(x - width / 2, 405 - height / 2);
  const graphics = scene.add.graphics();

  graphics.fillStyle(0x30264a, 0.26);
  graphics.fillRoundedRect(0, 5, width, height, 17);
  graphics.fillStyle(color);
  graphics.fillRoundedRect(0, 0, width, height - 5, 17);
  graphics.lineStyle(3, 0xffffff, 0.92);
  graphics.strokeRoundedRect(0, 0, width, height - 5, 17);
  graphics.fillStyle(0xffffff, 0.18);
  graphics.fillRoundedRect(8, 5, width - 16, 11, 6);

  const text = scene.add.text(width / 2, height / 2 - 2, label, {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    fontSize: '16px',
    fontStyle: 'bold',
    color: '#ffffff',
    stroke: '#3e3260',
    strokeThickness: 3,
  }).setOrigin(0.5);

  button.add([graphics, text]);
  button.setSize(width, height);
  button.setInteractive(
    new Phaser.Geom.Rectangle(0, 0, width, height),
    Phaser.Geom.Rectangle.Contains,
  );
  button.input.cursor = 'pointer';

  button.on('pointerdown', () => {
    button.setScale(0.96);
    onPress();
  });
  button.on('pointerup', () => {
    button.setScale(1);
    onRelease();
  });
  button.on('pointerout', () => {
    button.setScale(1);
    onRelease();
  });

  return button;
}
