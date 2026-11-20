import Phaser from 'phaser';
import createCharacterArt from '../ui/createCharacterArt.js';
import createMenuButton from '../ui/createMenuButton.js';
import drawColorfulBackground from '../ui/drawColorfulBackground.js';

const AUDIO_URLS = import.meta.glob('/src/assets/audio/**/*.{mp3,wav}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const AUDIO_KEYS = new Map([
  ['/src/assets/audio/music/loading-theme.mp3', 'loadingMusic'],
  ['/src/assets/audio/music/loading-theme.wav', 'loadingMusic'],
  ['/src/assets/audio/music/menu-theme.mp3', 'menuMusic'],
  ['/src/assets/audio/music/menu-theme.wav', 'menuMusic'],
  ['/src/assets/audio/music/game-theme.mp3', 'gameMusic'],
  ['/src/assets/audio/music/game-theme.wav', 'gameMusic'],
  ['/src/assets/audio/music/water-ambient.wav', 'waterMusic'],
  ['/src/assets/audio/music/forest-ambient.wav', 'forestMusic'],
  ['/src/assets/audio/music/space-ambient.wav', 'spaceMusic'],
  ['/src/assets/audio/sfx/button.wav', 'button'],
  ['/src/assets/audio/sfx/jump.wav', 'jump'],
  ['/src/assets/audio/sfx/coin.wav', 'coin'],
  ['/src/assets/audio/sfx/star.wav', 'star'],
  ['/src/assets/audio/sfx/collision.wav', 'collision'],
  ['/src/assets/audio/sfx/night-bird.wav', 'nightBird'],
  ['/src/assets/audio/sfx/splash.wav', 'splash'],
  ['/src/assets/audio/sfx/electric.wav', 'electric'],
  ['/src/assets/audio/sfx/animal-call.wav', 'animalCall'],
  ['/src/assets/audio/sfx/unlock.wav', 'unlock'],
  ['/src/assets/audio/sfx/victory.wav', 'victory'],
  ['/src/assets/audio/sfx/oops.wav', 'oops'],
]);

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.audio = this.registry.get('audioManager');
    this.availableAssets = this.resolveAudioAssets();
    const availableKeys = new Set(this.availableAssets.map(({ key }) => key));
    const missingAssets = [...new Set(AUDIO_KEYS.values())]
      .filter((key) => !availableKeys.has(key));

    if (missingAssets.length > 0) {
      console.info(`Audios pendientes: ${missingAssets.join(', ')}`);
    }

    this.createLoadingScreen();
    this.updateMusicToggle();
    const loadingMusic = this.availableAssets.find(({ key }) => key === 'loadingMusic');
    if (loadingMusic) {
      this.load.audio(loadingMusic.key, loadingMusic.url);
    }

    this.load.on('progress', this.updateProgress, this);
    this.load.on('loaderror', (file) => {
      console.error(`No se pudo cargar el archivo de audio ${file.src}.`);
    });
  }

  create() {
    this.audio = this.registry.get('audioManager');
    this.audio.playMusic('loadingMusic');
    this.updateMusicToggle();

    const remainingAssets = this.availableAssets.filter(({ key }) => (
      key !== 'loadingMusic' && !this.game.cache.audio.exists(key)
    ));

    if (remainingAssets.length === 0) {
      this.updateProgress(1);
      this.scene.start('MenuScene');
      return;
    }

    remainingAssets.forEach(({ key, url }) => this.load.audio(key, url));
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.updateProgress(1);
      this.scene.start('MenuScene');
    });
    this.load.start();
  }

  resolveAudioAssets() {
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
    return [...availableByKey.values()];
  }

  createLoadingScreen() {
    drawColorfulBackground(this);

    this.add.text(400, 55, 'CARGANDO COLOR DASH', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#5528a8',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 101, 'Preparando la aventura...', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#3e6380',
    }).setOrigin(0.5);

    createCharacterArt(this, 'cat', 400, 193, 0.78);

    const track = this.add.graphics();
    track.fillStyle(0x30264a, 0.18);
    track.fillRoundedRect(159, 279, 482, 30, 15);
    track.fillStyle(0xffffff, 0.94);
    track.fillRoundedRect(160, 275, 480, 28, 14);
    track.lineStyle(3, 0x6f50d7, 0.9);
    track.strokeRoundedRect(160, 275, 480, 28, 14);

    this.progressFill = this.add.graphics();
    this.progressText = this.add.text(400, 326, '0%', {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#5528a8',
    }).setOrigin(0.5);

    this.musicToggle = createMenuButton(this, {
      x: 400,
      y: 393,
      width: 236,
      height: 48,
      label: 'MÚSICA: ACTIVADA',
      color: 0x6f50d7,
      fontSize: 15,
      onClick: () => {
        const enabled = !this.audio.getPreferences().music;
        this.audio.setMusicEnabled(enabled);
        this.updateMusicToggle();
      },
    });
  }

  updateProgress(value) {
    const progress = Phaser.Math.Clamp(value, 0, 1);
    this.progressFill.clear();
    this.progressFill.fillStyle(0x48b968);
    this.progressFill.fillRoundedRect(166, 281, 468 * progress, 16, 8);
    this.progressText.setText(`${Math.floor(progress * 100)}%`);
  }

  updateMusicToggle() {
    if (!this.musicToggle || !this.audio) {
      return;
    }
    this.musicToggle.setLabel(
      this.audio.getPreferences().music ? 'MÚSICA: ACTIVADA' : 'MÚSICA: SILENCIADA',
    );
  }
}
