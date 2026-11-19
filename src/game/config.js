import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelSelectScene from './scenes/LevelSelectScene.js';
import GameScene from './scenes/GameScene.js';
import StageScene from './scenes/StageScene.js';
import StageResultScene from './scenes/StageResultScene.js';
import PauseOverlayScene from './scenes/PauseOverlayScene.js';
import CharacterScene from './scenes/CharacterScene.js';
import WardrobeScene from './scenes/WardrobeScene.js';
import RecordsScene from './scenes/RecordsScene.js';
import SettingsScene from './scenes/SettingsScene.js';

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 450,
  backgroundColor: '#a9e7ff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    LevelSelectScene,
    GameScene,
    StageScene,
    StageResultScene,
    PauseOverlayScene,
    CharacterScene,
    WardrobeScene,
    RecordsScene,
    SettingsScene,
  ],
};

export default gameConfig;
