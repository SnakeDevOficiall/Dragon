"use strict";

const screen = document.getElementById("screen");
const fireContainer = document.getElementById("fireContainer");
const fireOverlay = document.getElementById("fireOverlay");
const fireStatus = document.getElementById("fireStatus");
const statusLight = fireStatus.querySelector(".status-light");
const statusText = fireStatus.querySelector("span");
const toggleSoundBtn = document.getElementById("toggleSound");

// Elementos de audio
const fireSound = document.getElementById("fireSound");
const roarSound = document.getElementById("roarSound");

const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

const viewBoxWidth = 300;
const viewBoxHeight = 300;
const viewBoxXMin = -150;
const viewBoxYMin = -150;

// Variables de fuego
let isFiring = false;
let fireEndTime = 0;
let fireParticles = [];
let fireAnimationId = null;

// Variables de sonido
let soundEnabled = true;
let lastRoarTime = 0;
const ROAR_INTERVAL = 7000; // 7 segundos

// Mapear coordenadas de píxeles a coordenadas SVG
const mapToSvgCoords = (pixelX, pixelY) => {
  const svgX = (pixelX / window.innerWidth) * viewBoxWidth + viewBoxXMin;
  const svgY = (pixelY / window.innerHeight) * viewBoxHeight + viewBoxYMin;
  return { x: svgX, y: svgY };
};

// Inicializar sonidos
function initSounds() {
  // Configurar volumen
  fireSound.volume = 0.6;
  roarSound.volume = 0.7;
  
  // Configurar eventos de error
  fireSound.onerror = () => console.warn("Error al cargar sonido de fuego");
  roarSound.onerror = () => console.warn("Error al cargar sonido de rugido");
  
  // Configurar botón de sonido
  toggleSoundBtn.addEventListener("click", toggleSound);
  updateSoundButton();
}

// Alternar sonido
function toggleSound() {
  soundEnabled = !soundEnabled;
  updateSoundButton();
}

// Actualizar botón de sonido
function updateSoundButton() {
  if (soundEnabled) {
    toggleSoundBtn.classList.remove("muted");
    toggleSoundBtn.title = "Silenciar sonidos";
  } else {
    toggleSoundBtn.classList.add("muted");
    toggleSoundBtn.title = "Activar sonidos";
  }
}

// Reproducir sonido de fuego
function playFireSound() {
  if (!soundEnabled) return;
  
  try {
    fireSound.currentTime = 0;
    fireSound.play().catch(e => console.warn("Error reproduciendo fuego:", e));
  } catch (e) {
    console.warn("Error con sonido de fuego:", e);
  }
}

// Reproducir sonido de rugido
function playRoarSound() {
  if (!soundEnabled) return;
  
  try {
    roarSound.currentTime = 0;
    roarSound.play().catch(e => console.warn("Error reproduciendo rugido:", e));
  } catch (e) {
    console.warn("Error con sonido de rugido:", e);
  }
}

// Verificar si es tiempo de rugir
function checkRoarTime() {
  const now = Date.now();
  if (now - lastRoarTime >= ROAR_INTERVAL) {
    playRoarSound();
    lastRoarTime = now;
  }
}

// Seguir el cursor
window.addEventListener(
  "pointermove",
  (e) => {
    const svgCoords = mapToSvgCoords(e.clientX, e.clientY);
    pointer.x = svgCoords.x;
    pointer.y = svgCoords.y;
    rad = 0;
  },
  false
);

// Disparar fuego al hacer clic
window.addEventListener("click", () => {
  if (!isFiring) {
    startFire();
  }
});

const resize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
};

let width, height;
window.addEventListener("resize", () => resize(), false);
resize();

const prepend = (use, i) => {
  const elem = document.createElementNS(xmlns, "use");
  elems[i].use = elem;
  elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
  screen.prepend(elem);
};

const N = 30;
const elems = [];
for (let i = 0; i < N; i++) {
  const svgCoords = mapToSvgCoords(width / 2, height / 2);
  elems[i] = { use: null, x: svgCoords.x, y: svgCoords.y };
}

const pointerSvgCoords = mapToSvgCoords(width / 2, height / 2);
const pointer = { x: pointerSvgCoords.x, y: pointerSvgCoords.y };
const radm = Math.min(viewBoxWidth, viewBoxHeight) / 6 - 20;
let frm = Math.random();
let rad = 0;

// Inicializar elementos del dragón
for (let i = 1; i < N; i++) {
  if (i === 1) prepend("Cabeza", i);
  else if (i === 6 || i === 13) prepend("Aletas", i);
  else prepend("Espina", i);
}

// Inicializar sonidos
initSounds();

// Iniciar fuego
function startFire() {
  if (isFiring) return;
  
  isFiring = true;
  fireEndTime = Date.now() + 3000; // 3 segundos
  
  // Reproducir sonido de fuego
  playFireSound();
  
  // Actualizar interfaz
  statusLight.style.backgroundColor = "#f00";
  statusLight.style.boxShadow = "0 0 12px #f00";
  statusText.textContent = "Fire: FIRING";
  fireOverlay.style.opacity = "0.3";
  
  // Iniciar animación de fuego
  animateFire();
  
  // Actualizar estado del fuego
  updateFireStatus();
}

// Actualizar estado del fuego
function updateFireStatus() {
  if (isFiring) {
    const timeLeft = fireEndTime - Date.now();
    
    if (timeLeft <= 0) {
      // Terminar fuego
      stopFire();
    } else {
      // Actualizar opacidad del fuego (parpadea al final)
      let opacity = 0.3;
      if (timeLeft < 1000) {
        opacity = 0.15 + 0.15 * Math.sin(Date.now() / 100); // Parpadeo
      }
      fireOverlay.style.opacity = opacity.toString();
      
      // Actualizar texto con tiempo restante
      statusText.textContent = `Fire: ${(timeLeft/1000).toFixed(1)}s`;
      
      // Continuar actualización
      setTimeout(updateFireStatus, 50);
    }
  }
}

// Detener fuego
function stopFire() {
  isFiring = false;
  fireStatus.style.backgroundColor = "#0f0";
  statusLight.style.backgroundColor = "#0f0";
  statusLight.style.boxShadow = "0 0 8px #0f0";
  statusText.textContent = "Fire: READY";
  fireOverlay.style.opacity = "0";
  
  // Limpiar partículas de fuego
  clearFire();
}

// Crear una partícula de fuego
function createFireParticle(x, y) {
  const particle = document.createElementNS(xmlns, "circle");
  
  // Posición inicial (en la boca del dragón)
  const headPos = elems[1] || { x: pointer.x - 20, y: pointer.y };
  const angle = Math.atan2(pointer.y - headPos.y, pointer.x - headPos.x);
  
  // Calcular posición inicial ajustada para que salga de la boca
  const mouthX = headPos.x + Math.cos(angle) * 15;
  const mouthY = headPos.y + Math.sin(angle) * 15;
  
  // Propiedades aleatorias para efecto natural
  const size = Math.random() * 8 + 3;
  const speed = Math.random() * 15 + 10;
  const life = Math.random() * 40 + 30; // frames de vida
  
  // Dirección del fuego (hacia donde apunta el dragón)
  const fireAngle = angle + (Math.random() - 0.5) * 0.5;
  
  particle.setAttribute("cx", mouthX);
  particle.setAttribute("cy", mouthY);
  particle.setAttribute("r", size);
  particle.setAttribute("fill", "url(#fireGradient)");
  particle.setAttribute("filter", "url(#fireGlow)");
  particle.setAttribute("opacity", "0.9");
  
  fireContainer.appendChild(particle);
  
  return {
    element: particle,
    x: mouthX,
    y: mouthY,
    vx: Math.cos(fireAngle) * speed,
    vy: Math.sin(fireAngle) * speed,
    life: life,
    maxLife: life,
    size: size
  };
}

// Animar el fuego
function animateFire() {
  if (!isFiring) return;
  
  // Crear nuevas partículas (más cuando empieza, menos después)
  const particleCount = Math.random() < 0.7 ? 2 : 1;
  for (let i = 0; i < particleCount; i++) {
    fireParticles.push(createFireParticle());
  }
  
  // Actualizar partículas existentes
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    const p = fireParticles[i];
    
    // Reducir vida
    p.life--;
    
    if (p.life <= 0) {
      // Eliminar partícula muerta
      if (p.element.parentNode) {
        fireContainer.removeChild(p.element);
      }
      fireParticles.splice(i, 1);
      continue;
    }
    
    // Actualizar posición
    p.x += p.vx / 2;
    p.y += p.vy / 2;
    
    // Añadir gravedad y resistencia
    p.vy += 0.2;
    p.vx *= 0.98;
    p.vy *= 0.98;
    
    // Actualizar tamaño (se reduce con la vida)
    const scale = p.life / p.maxLife;
    p.element.setAttribute("r", p.size * scale);
    
    // Actualizar opacidad
    p.element.setAttribute("opacity", scale * 0.8);
    
    // Actualizar posición en SVG
    p.element.setAttribute("cx", p.x);
    p.element.setAttribute("cy", p.y);
  }
  
  // Continuar animación
  fireAnimationId = requestAnimationFrame(animateFire);
}

// Limpiar todas las partículas de fuego
function clearFire() {
  if (fireAnimationId) {
    cancelAnimationFrame(fireAnimationId);
    fireAnimationId = null;
  }
  
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    const p = fireParticles[i];
    if (p.element.parentNode) {
      fireContainer.removeChild(p.element);
    }
  }
  
  fireParticles = [];
}

// Bucle principal de animación del dragón
const run = () => {
  requestAnimationFrame(run);
  
  let e = elems[0];
  const ax = (Math.cos(3 * frm) * rad * viewBoxWidth) / viewBoxHeight;
  const ay = (Math.sin(4 * frm) * rad * viewBoxHeight) / viewBoxWidth;
  
  e.x += (ax + pointer.x - e.x) / 10;
  e.y += (ay + pointer.y - e.y) / 10;
  
  for (let i = 1; i < N; i++) {
    let e = elems[i];
    let ep = elems[i - 1];
    const a = Math.atan2(e.y - ep.y, e.x - ep.x);
    
    e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 22) / 4;
    e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 22) / 4;
    
    const s = (162 + 4 * (1 - i)) / 300;
    
    if (e.use) {
      e.use.setAttributeNS(
        null,
        "transform",
        `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${
          (180 / Math.PI) * a
        }) translate(0,0) scale(${s},${s})`
      );
    }
  }
  
  if (rad < radm) rad++;
  frm += 0.003;
  
  if (rad > 60) {
    pointer.x += (0 - pointer.x) * 0.05;
    pointer.y += (0 - pointer.y) * 0.05;
  }
  
  // Verificar si es tiempo de rugir (cada 7 segundos)
  checkRoarTime();
};

// Iniciar todo
run();

// Reproducir un rugido inicial después de 2 segundos
setTimeout(() => {
  if (soundEnabled) {
    playRoarSound();
    lastRoarTime = Date.now();
  }
}, 2000);