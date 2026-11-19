import Phaser from 'phaser';
import './style.css';
import gameConfig from './game/config.js';
import AudioManager from './game/systems/AudioManager.js';

const game = new Phaser.Game(gameConfig);
game.registry.set('audioManager', new AudioManager(game));

if (import.meta.hot) {
  import.meta.hot.dispose(() => game.destroy(true));
}