# Dragon


📁 Estructura del Proyecto
text

dragon-esqueleto/
│
├── index.html          # Archivo principal HTML
├── style.css          # Estilos CSS
├── script.js          # Lógica JavaScript
│
├── README.md          # Este archivo
└── (no dependencias externas)

🎯 Funcionalidades Técnicas
Animación del Dragón

    Movimiento basado en física para un seguimiento suave del cursor

    Cada hueso se mueve independientemente creando un efecto de cadena

    Rotación automática según la dirección del movimiento

Sistema de Fuego

    Generación procedural de partículas de fuego

    Física aplicada a cada partícula (gravedad, resistencia)

    Gradientes SVG para efectos de llama realistas

    Temporizador preciso de 3 segundos

Sistema de Sonido

    Audio optimizado con pre-carga

    Control de volumen independiente

    Temporizador de rugidos automáticos

    Interfaz para silenciar/activar sonidos

🎨 Personalización

Puedes modificar los siguientes parámetros en script.js:
javascript

// Tiempo de disparo de fuego (milisegundos)
const FIRE_DURATION = 3000;

// Intervalo entre rugidos (milisegundos)
const ROAR_INTERVAL = 7000;

// Volumen de los efectos de sonido
fireSound.volume = 0.6;
roarSound.volume = 0.7;

// Velocidad de seguimiento del cursor
const FOLLOW_SPEED = 0.05;

🌐 Compatibilidad
Navegador	Compatibilidad	Notas
Chrome	✅ Excelente	Versión 60+
Firefox	✅ Excelente	Versión 55+
Safari	✅ Buena	Versión 11+
Edge	✅ Excelente	Versión 79+
🤝 Contribuir


📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.
🙏 Agradecimientos

    Sonidos: Pixabay por los efectos de audio gratuitos

    Inspiración: Concepto de dragones esqueléticos de la fantasía medieval

    SVG: Gráficos vectoriales optimizados para rendimiento

📧 Contacto

Tu Nombre - @SnakeDev - snakegameoficiall2025@gmail.com

Enlace del Proyecto: https://github.com/tu-usuario/dragon-esqueleto
