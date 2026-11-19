import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create(data = {}) {
    const levelId = Number.isInteger(data.levelId) && data.levelId > 0
      ? data.levelId
      : 1;
    this.scene.start('StageScene', { levelId });
  }
}
