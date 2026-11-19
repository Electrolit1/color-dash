# COLOR DASH

Base del proyecto de videojuego COLOR DASH. Vite sirve la aplicación y Phaser 3
renderiza el menú principal y escenas provisionales adaptables.

## Requisitos

- Node.js 20.19+ (o 22.12+)
- npm
- Phaser 3.90

## Desarrollo

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que indique Vite.

## Comprobación de producción

```bash
npm run build
npm run preview
```

## Juego

- Resolución lógica: 800 x 450.
- Escalado: `FIT` con centrado automático, manteniendo la proporción 16:9.
- Escenas: `BootScene` inicia `PreloadScene`, que lleva a `MenuScene`.
- El menú incluye accesos a selección de niveles, personajes, récords y configuración.
- Al elegir **JUGAR**, se abre una fila horizontal con cinco niveles. El nivel 1 está
  desbloqueado inicialmente; los niveles 2–5 indican que hay que completar el nivel anterior.
- Al seleccionar el nivel 1, se abre `GameScene`, que por ahora muestra una pantalla
  provisional con el número del nivel y una opción para volver al menú.
- Cada nivel muestra tres estrellas como indicadores visuales. La puntuación por estrellas,
  el progreso y el desbloqueo de niveles todavía no están implementados.
- Las preferencias de música y efectos se guardan bajo `colorDashAudioPreferences`.
- `AudioManager` reproduce los archivos compatibles agregados en `src/assets/audio/`.
- Consulta `src/assets/audio/README.md` para nombres, formatos y duraciones recomendados.
- La pantalla de récords consulta `colorDashBestScore`; hasta implementar puntuación,
  mostrará 0 si no existe un récord guardado.
- Los personajes decorativos son ilustraciones vectoriales creadas con Phaser.

## Probar la selección de niveles

1. Ejecuta `npm run dev` y abre la dirección local indicada por Vite.
2. En el menú, pulsa **JUGAR**.
3. Selecciona el nivel 1 para abrir la escena provisional; usa **VOLVER AL MENÚ** para regresar.
4. Selecciona uno de los niveles 2–5 para ver el aviso de que está bloqueado.
5. Ejecuta `npm run build` para comprobar la compilación de producción.

## Estructura

- `src/main.js`: punto de entrada de Phaser.
- `src/style.css`: estilos adaptables para el contenedor del juego.
- `src/game/config.js`: configuración central del motor.
- `src/game/scenes/`: escenas de inicio, carga, menú, niveles, juego, personajes, récords y configuración.
- `src/game/ui/`: botones, fondo y gráficos vectoriales reutilizables.
- `src/game/systems/AudioPreferences.js`: lectura y guardado de preferencias de sonido.
- `src/game/systems/AudioManager.js`: reproducción, volumen y preferencias de audio.
- `src/game.js`: archivo previo conservado; no forma parte del punto de entrada actual.
- `assets/images/` y `assets/sounds/`: recursos ya presentes.

