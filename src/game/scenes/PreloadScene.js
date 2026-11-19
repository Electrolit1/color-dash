import Phaser from 'phaser';

const AUDIO_URLS = import.meta.glob('/src/assets/audio/**/*.{mp3,wav}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const AUDIO_KEYS = new Map([
  ['/src/assets/audio/music/menu-theme.mp3', 'menuMusic'],
  ['/src/assets/audio/music/menu-theme.wav', 'menuMusic'],
  ['/src/assets/audio/music/game-theme.mp3', 'gameMusic'],
  ['/src/assets/audio/music/game-theme.wav', 'gameMusic'],
  ['/src/assets/audio/sfx/button.wav', 'button'],
  ['/src/assets/audio/sfx/jump.wav', 'jump'],
  ['/src/assets/audio/sfx/coin.wav', 'coin'],
  ['/src/assets/audio/sfx/star.wav', 'star'],
  ['/src/assets/audio/sfx/collision.wav', 'collision'],
]);

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const availableByKey = new Map();
    Object.entries(AUDIO_URLS).forEach(([path, url]) => {
      const key = AUDIO_KEYS.get(path);
      if (!key) {
        return;
      }

      const priority = path.endsWith('.mp3') ? 1 : 0;
      const current = availableByKey.get(key);
      if (!current || priority > current.priority) {
        availableByKey.set(key, { key, url, priority });
      }
    });

    const availableAssets = [...availableByKey.values()];
    const availablePaths = new Set(availableByKey.keys());
    const missingAssets = [...AUDIO_KEYS.values()]
      .filter((key) => !availablePaths.has(key));

    if (missingAssets.length > 0) {
      console.info(`Audios pendientes: ${missingAssets.join(', ')}`);
    }

    availableAssets.forEach(({ key, url }) => this.load.audio(key, url));
    this.load.on('loaderror', (file) => {
      console.error(`No se pudo cargar el archivo de audio ${file.src}.`);
    });
  }

  create() {
    this.scene.start('MenuScene');
  }
}
