# Audios de COLOR DASH

Ya hay sonidos originales de ejemplo en las carpetas `music/` y `sfx/`.
Puedes reemplazarlos por tus propios archivos usando estos nombres. Vite solo
incorpora los archivos que existan; el juego inicia normalmente si falta alguno.

## Música

Guarda en `music/`:

- `menu-theme.wav` o `menu-theme.mp3`: tema del menú, preparado para repetirse en bucle.
- `game-theme.wav` o `game-theme.mp3`: tema de juego, preparado para repetirse en bucle.

Los temas de ejemplo duran 16 segundos y están hechos como loops originales.
Para versiones más largas, usa 45–90 segundos para el menú y 60–120 para el juego.
Formato recomendado para reemplazos: MP3, 44.1 kHz, estéreo, 128–192 kbps.
Si dejas ambos formatos, se elige el MP3.

## Efectos

Guarda en `sfx/`:

- `button.wav`: clic alegre para los botones, 0.08–0.25 segundos.
- `jump.wav`: salto, 0.25–0.7 segundos.
- `coin.wav`: moneda, 0.15–0.5 segundos.
- `star.wav`: estrella, 0.4–0.9 segundos.
- `collision.wav`: choque suave, 0.3–1.2 segundos.

Formato recomendado: WAV PCM, 16 bits, mono, 44.1 kHz. Recorta el silencio
al principio y final de cada efecto.

Después de copiar los archivos, reinicia o recarga el juego. La música se
reproduce en bucle; el botón de configuración activa o silencia música y
efectos por separado. El clic ya está conectado a todos los botones. Los
efectos de salto, moneda, estrella y choque están listos para las mecánicas futuras.
