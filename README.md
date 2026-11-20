# COLOR DASH

Videojuego arcade COLOR DASH desarrollado con Phaser 3 y Vite. Incluye veinte pistas
con progresión, mundos temáticos, coleccionables, fauna y peligros caricaturescos.

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
- El juego conserva la proporción 16:9 y queda centrado en pantallas de cualquier tamaño.
- Antes de abrirlo, la pantalla de inicio permite elegir música y efectos. En navegadores
  móviles también se puede solicitar pantalla completa y orientación horizontal; el navegador
  puede denegar esas solicitudes. No se requieren permisos del sistema para el sonido.
- La app Android bloquea la orientación horizontal y oculta las barras del sistema.
- El canvas mantiene las dimensiones calculadas por Phaser para alinear correctamente
  las zonas táctiles y admite varios dedos a la vez.
- Escenas: `BootScene` inicia `PreloadScene`, que lleva a `MenuScene`.
- El menú incluye accesos a selección de niveles, personajes, récords y configuración.
- Al elegir **JUGAR**, se abre el mapa de veinte pistas en cuatro páginas de cinco niveles.
  El nivel 1 está desbloqueado inicialmente; cada victoria desbloquea el siguiente y permite
  continuar directamente.
- `GameScene` pasa el nivel elegido a `StageScene`; las pistas 1–6 tienen configuraciones propias
  y las pistas 7–20 se crean con `stage7To20Configs.js`.
- Los mundos recorren praderas, dulces, nieve, playa, espacio, océano, ríos, selva, volcán,
  nubes, desierto, ciudad robot, lagunas, planetas, bosques, cuevas y cataratas.
- Cada pista dura aproximadamente 49 segundos y contiene tres tramos, monedas, peligros y una
  meta. Las plataformas de agua, lava, electricidad, espinas, nubes y cristales son obstáculos
  letales que se pueden saltar.
- Los animales nuevos incluyen tortugas, delfines, tiburones, cocodrilos, monos, dragones,
  mariposas, escorpiones, robots, medusas, zorros, ranas y pingüinos.
- Los niveles 2, 3 y 5 ocurren de noche; el 4 usa un ambiente de atardecer. Los murciélagos,
  búhos y criaturas nocturnas emiten una llamada original al pasar junto al jugador.
- En todos los niveles se puede saltar, hacer un doble salto en el aire y agacharse, con
  teclado o controles táctiles. Cada salto consume energía, que se recupera al tocar el suelo;
  las baterías de energía ayudan a recargarla.
- Los escudos protegen de un choque; rocas, pinchos, olas, carámbanos, láseres, aves y meteoros
  tienen colisiones propias. Los huecos aparecen desde el nivel 2; el nivel inicial no tiene.
- En **PERSONAJES** se puede elegir gato, perro, conejo o panda. La selección se guarda en
  `colorDashSelectedCharacter` y aparece al jugar.
- La pantalla de configuración tiene una ambientación visual inspirada en música y conserva por separado las
  preferencias de música y efectos.
- La escena de carga muestra el avance de los recursos y usa una música propia; el botón
  de música silencia o reactiva la canción y conserva la preferencia.
- **VESTIMENTA** permite equipar estilos que aparecen en el personaje durante el juego:
  corona de hojas (nivel 3), tiara de conchas (nivel 6), gafas arcoíris (nivel 9),
  casco espacial (nivel 13) y capucha de dragón (nivel 17). El estilo original está disponible
  desde el inicio.
- Las monedas aumentan la puntuación y los orbes de color duplican temporalmente los puntos
  de distancia. La mejor puntuación se guarda en `colorDashBestScore`.
- Al completar un nivel se obtiene una estrella; las otras dependen de la proporción de monedas
  y de terminar sin golpes. Cada recorrido configura sus propios umbrales. Se puede reintentar
  para mejorar la marca; las estrellas por nivel y el progreso se guardan localmente.
- Las estrellas se guardan en `colorDashLevel1Stars` a `colorDashLevel20Stars`;
  `colorDashUnlockedLevel` puede llegar a 20 y `colorDashBestScore` sigue siendo global.
- Cada tipo de choque muestra un mensaje de ánimo distinto. Completar el nivel 20 cierra la
  aventura. Las pantallas de victoria y derrota usan fondos, resumen de resultados y sonidos
  diferentes. **PAUSAR**, `Esc` o `P` funciona en
  todos los niveles y permite reanudar, reiniciar, cambiar música/efectos o volver al menú.
- Las preferencias de música y efectos se guardan bajo `colorDashAudioPreferences`.
- `AudioManager` elige música ambiental de agua, bosque o espacio según el mundo, además de la
  música de menú y juego.
- Hay efectos originales de chapuzón, descarga, llamada animal, victoria, derrota y desbloqueo,
  además de los sonidos de salto, moneda, botón, colisión y fauna nocturna.
- Consulta `src/assets/audio/README.md` para nombres, formatos y duraciones recomendados.
- La pantalla de récords consulta `colorDashBestScore`; hasta implementar puntuación,
  mostrará 0 si no existe un récord guardado.
- Los personajes decorativos son ilustraciones vectoriales creadas con Phaser.

### Formato de una pista

Las pistas 2–6 exportan una configuración desde `stageNConfig.js` y la pasan por
`prepareStageConfig`; las pistas 7–20 se crean con `createStageConfig` desde
`stage7To20Configs.js`. El helper aplana los eventos de los tramos, los ordena por distancia
y calcula `totalCoins`. La pista 1 mantiene esa preparación escrita directamente.

- La configuración raíz contiene `id`, `name`, `shortName`, `difficulty`, `theme`, `mode`,
  `speed`, `finishDistance`, `floorY`, `gravity`, `jumpVelocity`, `doubleJumpVelocity`,
  `jumpFatiguePerJump`, `jumpFatigueRecovery`, `jumpFatigueMax`, `energyPickup`,
  `starCoinRatio`, `threeStarCoinRatio`, `bonusDuration`, `colors` y `segments`.
- `colors` define `sky`, `farHill`, `nearHill`, `grass` y `ground`. `segments` es una lista
  ordenada de `{ name, endDistance, events }`; el último `endDistance` debe coincidir con
  `finishDistance`.
- Cada evento lleva `type` y `distance` en unidades del recorrido. Los eventos que tienen
  altura usan `y` en coordenadas del juego (800 × 450). Formas que entiende `StageScene`:

```js
{ type: 'coin', distance: 500, y: 338 }
{ type: 'obstacle', kind: 'overhead', distance: 900 }
{ type: 'obstacle', kind: 'rock', distance: 1300 }
{ type: 'bird', variant: 'owl', distance: 1800, y: 296, speed: 360, nightSound: true }
{ type: 'gap', distance: 2300, width: 120 }
{ type: 'energy', distance: 2800, y: 280 }
{ type: 'shield', distance: 3300, y: 286, duration: 4 }
{ type: 'orb', distance: 3800, y: 250 }
{ type: 'finish', distance: 15880 }
{ type: 'animal', variant: 'dolphin', distance: 4300, y: 275, speed: 300 }
{ type: 'platform', kind: 'electric', distance: 4900, width: 108 }
```

- Los tipos de obstáculo reconocidos incluyen `overhead`, `icicle`, `laser`, `rock`, `spikes`,
  `wave`, `candy`, `lollipop`, `coral`, `vine`, `cactus`, `waterfall`, `geyser`, `windmill`,
  `fan`, `crystal` y `lava-rock`. Las plataformas mortales aceptan `water`, `electric`, `lava`,
  `meteor`, `thorn`, `cloud` y `crystal`. Las variantes de ave incluyen `bird`, `bat`, `owl`,
  `parrot`, `meteor` y `alien`; los animales usan `type: 'animal'`.
- `coinLine([500, 590, 680])` genera monedas a `y: 338`. Mantén las distancias de eventos dentro
  del tramo correspondiente y coloca el evento `finish` un poco antes de `finishDistance`: la
  victoria se activa al alcanzar `finishDistance`.
- La cantidad de monedas y los umbrales `starCoinRatio` / `threeStarCoinRatio` determinan las
  estrellas. Para añadir un tipo nuevo de obstáculo o animal, agrega también su dibujo y colisión
  en `StageScene.js`.

## Probar los niveles

1. Ejecuta `npm run dev` y abre la dirección local indicada por Vite. Antes de cargar el menú,
   elige las opciones de sonido. En un teléfono, acepta la solicitud de pantalla completa y
   orientación horizontal si el navegador lo permite.
2. Desde el menú, abre **PERSONAJES**, selecciona gato, perro o conejo y vuelve al menú.
3. Pulsa **JUGAR** y selecciona el nivel 1; los demás se desbloquean al completar cada etapa.
4. Usa **PAUSAR**, `Esc` o `P` en cualquier nivel para probar pausa, reinicio, audio y menú.
5. Pulsa **SALTAR** o usa `Espacio` / `Flecha Arriba`; pulsa de nuevo en el aire para el doble
   salto. La energía se recupera en el suelo. Mantén **AGACHARSE** o `Flecha Abajo` bajo
   obstáculos elevados.
6. Recoge monedas, orbes, energía y escudos; evita los peligros propios de cada mundo.
   Completa los veinte niveles para ver el final y reintenta para mejorar las estrellas.
7. Abre **VESTIMENTA** para ver los estilos disponibles y el nivel necesario para desbloquearlos.
8. Ejecuta `npm run build` para comprobar la compilación de producción.

## Estructura

- `src/main.js`: punto de entrada de Phaser.
- `src/style.css`: estilos adaptables para el contenedor del juego.
- `src/game/config.js`: configuración central del motor.
- `src/game/scenes/`: escenas de inicio, carga, menú, selección, resultados y juego.
- `src/game/scenes/StageScene.js`: motor reutilizable de movimiento, colisiones y puntuación.
- `src/game/scenes/stage1/stage1Config.js` y `src/game/scenes/stages/`: recorridos y dificultad.
- `src/game/scenes/stages/stage6Config.js` y `stage7To20Configs.js`: pistas oceánicas y mundos 7–20;
  `stageConfigs.js` los registra para selector, motor y progresión.
- `src/game/ui/drawStageBackground.js`: fondos temáticos de día, noche y atardecer.
- `src/game/ui/createStageControl.js`: controles táctiles reutilizables.
- `src/game/scenes/StageResultScene.js`: resultados genéricos de victoria y derrota.
- `src/game/scenes/PauseOverlayScene.js`: pausa reutilizable para las escenas de juego.
- `src/game/scenes/WardrobeScene.js`: vestuario y estilos desbloqueables.
- `src/game/ui/`: botones, fondo y gráficos vectoriales reutilizables.
- `src/game/systems/AudioPreferences.js`: lectura y guardado de preferencias de sonido.
- `src/game/systems/CharacterPreferences.js`: personaje seleccionado y opciones válidas.
- `src/game/systems/AudioManager.js`: reproducción, volumen y preferencias de audio.
- `src/game.js`: archivo previo conservado; no forma parte del punto de entrada actual.
- `assets/images/` y `assets/sounds/`: recursos ya presentes.

