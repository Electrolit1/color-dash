# COLOR DASH

Base del proyecto de videojuego COLOR DASH. Vite sirve la aplicación y Phaser 3
renderiza el menú, la selección de niveles y el Nivel 1 jugable.

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
- Al seleccionar el nivel 1, `GameScene` deriva a `Stage1Scene`, con un recorrido de unos
  48 segundos dividido en tres tramos y una meta.
- Completar un nivel desbloquea el siguiente y ofrece una transición directa. Los niveles
  2–5 aún muestran una escena provisional hasta que tengan su propio contenido.
- El Nivel 1 permite saltar, hacer un doble salto en el aire y agacharse; cuenta con
  controles táctiles y teclado. Cada salto consume energía, que se recupera al tocar el suelo.
- En **PERSONAJES** se puede elegir gato, perro o conejo. La selección se guarda en
  `colorDashSelectedCharacter` y aparece al jugar.
- La escena de carga muestra el avance de los recursos y usa una música propia; el botón
  de música silencia o reactiva la canción y conserva la preferencia.
- **VESTIMENTA** abre una pantalla provisional para futuros gorros, gafas y accesorios.
- Las monedas aumentan la puntuación y los orbes de color duplican temporalmente los puntos
  de distancia. La mejor puntuación se guarda en `colorDashBestScore`.
- Al completar el nivel se otorga una estrella; se obtiene otra con al menos un 70% de las
  monedas; la tercera requiere al menos un 90% y terminar sin golpes. Se puede reintentar
  para mejorar la marca; completar el nivel desbloquea el siguiente aunque no se obtengan
  tres estrellas. Las marcas se guardan en `colorDashLevel1Stars` y el nivel desbloqueado en
  `colorDashUnlockedLevel`.
- Los choques con obstáculos o aves que vuelan en sentido contrario terminan la carrera.
  El Nivel 1 no contiene huecos; el sistema de huecos queda disponible para etapas futuras.
- Durante el Nivel 1, **PAUSAR**, `Esc` o `P` abre la pausa para reanudar, reiniciar, cambiar
  música/efectos o volver al menú.
- Las preferencias de música y efectos se guardan bajo `colorDashAudioPreferences`.
- `AudioManager` reproduce los archivos compatibles agregados en `src/assets/audio/`.
- Consulta `src/assets/audio/README.md` para nombres, formatos y duraciones recomendados.
- La pantalla de récords consulta `colorDashBestScore`; hasta implementar puntuación,
  mostrará 0 si no existe un récord guardado.
- Los personajes decorativos son ilustraciones vectoriales creadas con Phaser.

## Probar el Nivel 1

1. Ejecuta `npm run dev` y abre la dirección local indicada por Vite. La carga muestra su
   barra y un control para silenciar/reactivar la música de carga.
2. Desde el menú, abre **PERSONAJES**, selecciona gato, perro o conejo y vuelve al menú.
3. Pulsa **JUGAR** y selecciona el nivel 1; debe aparecer el personaje elegido.
4. Usa **PAUSAR**, `Esc` o `P` para abrir la pausa; prueba reanudar, reiniciar y los controles
   de música y efectos.
5. Pulsa **SALTAR** o usa `Espacio` / `Flecha Arriba` para saltar; vuelve a pulsar en el aire
   para usar el doble salto. Espera a que se recupere la energía para volver a usar ambos saltos.
   Mantén **AGACHARSE** o `Flecha Abajo` para agacharte bajo los obstáculos elevados.
6. Recoge monedas y orbes, evita obstáculos y aves. Completa el nivel para desbloquear
   el siguiente; revisa las estrellas y reintenta si quieres mejorar tu resultado.
7. Abre **VESTIMENTA** para ver el espacio provisional de futuros accesorios.
8. Ejecuta `npm run build` para comprobar la compilación de producción.

## Estructura

- `src/main.js`: punto de entrada de Phaser.
- `src/style.css`: estilos adaptables para el contenedor del juego.
- `src/game/config.js`: configuración central del motor.
- `src/game/scenes/`: escenas de inicio, carga, menú, niveles, juego, personajes, récords y configuración.
- `src/game/scenes/stage1/`: escena, datos de recorrido, controles y fondo del Nivel 1.
- `src/game/scenes/StageResultScene.js`: resultados genéricos de victoria y derrota.
- `src/game/scenes/PauseOverlayScene.js`: pausa reutilizable para las escenas de juego.
- `src/game/scenes/WardrobeScene.js`: pantalla provisional de vestimenta.
- `src/game/ui/`: botones, fondo y gráficos vectoriales reutilizables.
- `src/game/systems/AudioPreferences.js`: lectura y guardado de preferencias de sonido.
- `src/game/systems/CharacterPreferences.js`: personaje seleccionado y opciones válidas.
- `src/game/systems/AudioManager.js`: reproducción, volumen y preferencias de audio.
- `src/game.js`: archivo previo conservado; no forma parte del punto de entrada actual.
- `assets/images/` y `assets/sounds/`: recursos ya presentes.

