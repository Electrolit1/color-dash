# COLOR DASH

Videojuego arcade COLOR DASH desarrollado con Phaser 3 y Vite. Incluye cinco
niveles jugables con progresión, puntuación, coleccionables, peligros y final de aventura.

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
- Al elegir **JUGAR**, se abre el mapa de cinco mundos. El nivel 1 está desbloqueado
  inicialmente; cada victoria desbloquea el siguiente y permite continuar directamente.
- `GameScene` usa `StageScene` y configuraciones independientes para los cinco recorridos:
  Pradera Soleada, Mundo de Dulces, Reino de Nieve, Playa Tropical y Mundo Espacial.
- Cada recorrido dura aproximadamente 48–50 segundos, contiene tres tramos, coleccionables,
  peligros y una meta. La velocidad y los peligros aumentan en cada nivel.
- Los niveles 2, 3 y 5 ocurren de noche; el 4 usa un ambiente de atardecer. Los murciélagos,
  búhos y criaturas nocturnas emiten una llamada original al pasar junto al jugador.
- En todos los niveles se puede saltar, hacer un doble salto en el aire y agacharse, con
  teclado o controles táctiles. Cada salto consume energía, que se recupera al tocar el suelo;
  las baterías de energía ayudan a recargarla.
- Los escudos protegen de un choque; rocas, pinchos, olas, carámbanos, láseres, aves y meteoros
  tienen colisiones propias. Los huecos aparecen desde el nivel 2; el nivel inicial no tiene.
- En **PERSONAJES** se puede elegir gato, perro o conejo. La selección se guarda en
  `colorDashSelectedCharacter` y aparece al jugar.
- La escena de carga muestra el avance de los recursos y usa una música propia; el botón
  de música silencia o reactiva la canción y conserva la preferencia.
- **VESTIMENTA** abre una pantalla provisional para futuros gorros, gafas y accesorios.
- Las monedas aumentan la puntuación y los orbes de color duplican temporalmente los puntos
  de distancia. La mejor puntuación se guarda en `colorDashBestScore`.
- Al completar un nivel se obtiene una estrella; las otras dependen de la proporción de monedas
  y de terminar sin golpes. Cada recorrido configura sus propios umbrales. Se puede reintentar
  para mejorar la marca; las estrellas por nivel y el progreso se guardan localmente.
- Completar el nivel 5 muestra el cierre de la aventura. **PAUSAR**, `Esc` o `P` funciona en
  todos los niveles y permite reanudar, reiniciar, cambiar música/efectos o volver al menú.
- Las preferencias de música y efectos se guardan bajo `colorDashAudioPreferences`.
- `AudioManager` reproduce los archivos compatibles agregados en `src/assets/audio/`.
- Consulta `src/assets/audio/README.md` para nombres, formatos y duraciones recomendados.
- La pantalla de récords consulta `colorDashBestScore`; hasta implementar puntuación,
  mostrará 0 si no existe un récord guardado.
- Los personajes decorativos son ilustraciones vectoriales creadas con Phaser.

## Probar los niveles

1. Ejecuta `npm run dev` y abre la dirección local indicada por Vite. La carga muestra su
   barra y un control para silenciar/reactivar la música de carga.
2. Desde el menú, abre **PERSONAJES**, selecciona gato, perro o conejo y vuelve al menú.
3. Pulsa **JUGAR** y selecciona el nivel 1; los demás se desbloquean al completar cada etapa.
4. Usa **PAUSAR**, `Esc` o `P` en cualquier nivel para probar pausa, reinicio, audio y menú.
5. Pulsa **SALTAR** o usa `Espacio` / `Flecha Arriba`; pulsa de nuevo en el aire para el doble
   salto. La energía se recupera en el suelo. Mantén **AGACHARSE** o `Flecha Abajo` bajo
   obstáculos elevados.
6. Recoge monedas, orbes, energía y escudos; evita los peligros propios de cada mundo.
   Completa los cinco niveles para ver el final y reintenta para mejorar las estrellas.
7. Abre **VESTIMENTA** para ver el espacio provisional de futuros accesorios.
8. Ejecuta `npm run build` para comprobar la compilación de producción.

## Estructura

- `src/main.js`: punto de entrada de Phaser.
- `src/style.css`: estilos adaptables para el contenedor del juego.
- `src/game/config.js`: configuración central del motor.
- `src/game/scenes/`: escenas de inicio, carga, menú, selección, resultados y juego.
- `src/game/scenes/StageScene.js`: motor reutilizable de movimiento, colisiones y puntuación.
- `src/game/scenes/stage1/stage1Config.js` y `src/game/scenes/stages/`: recorridos y dificultad.
- `src/game/ui/drawStageBackground.js`: fondos temáticos de día, noche y atardecer.
- `src/game/ui/createStageControl.js`: controles táctiles reutilizables.
- `src/game/scenes/StageResultScene.js`: resultados genéricos de victoria y derrota.
- `src/game/scenes/PauseOverlayScene.js`: pausa reutilizable para las escenas de juego.
- `src/game/scenes/WardrobeScene.js`: pantalla provisional de vestimenta.
- `src/game/ui/`: botones, fondo y gráficos vectoriales reutilizables.
- `src/game/systems/AudioPreferences.js`: lectura y guardado de preferencias de sonido.
- `src/game/systems/CharacterPreferences.js`: personaje seleccionado y opciones válidas.
- `src/game/systems/AudioManager.js`: reproducción, volumen y preferencias de audio.
- `src/game.js`: archivo previo conservado; no forma parte del punto de entrada actual.
- `assets/images/` y `assets/sounds/`: recursos ya presentes.

