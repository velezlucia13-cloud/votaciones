// ==========================
// VARIABLES GLOBALES
// ==========================

// Estado de la TV: true = encendida, false = apagada
let tvEncendida = true;

// Variable para llevar el control del video actual que se está reproduciendo
let current = 1;

// Referencia al elemento de video principal en el HTML
const player = document.getElementById('introVideo');

// ==========================
// INICIALIZACIÓN Y CONFIGURACIÓN
// ==========================

// Esperar a que el DOM (Document Object Model) esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Permitir que el video reproduzca sonido al hacer clic en cualquier parte de la página
    // Esto es necesario porque algunos navegadores bloquean el autoplay con sonido
    document.addEventListener('click', function() {
        // Quitar el silencio del video
        player.muted = false;
        // Si la TV está encendida y el video está pausado, reproducirlo
        if (tvEncendida && player.paused) {
            player.play().catch(e => console.log("Auto-play bloqueado:", e));
        }
    });

    // Inicializar todos los sistemas cuando la página carga
    inicializarSistemaEncendido();  // Configurar el botón de power
    actualizarContadores();         // Mostrar los votos actuales
    actualizarDiagramaBarras();     // Actualizar el gráfico de voto.s
});

// ==========================
// SISTEMA DE ENCENDIDO/APAGADO MEJORADO
// ==========================

// Función para configurar todo el sistema de encendido/apagado
function inicializarSistemaEncendido() {
    // Obtener el elemento que muestra el estado de la TV, o crearlo si no existe
    const estadoTv = document.getElementById('estado-tv') || crearElementoEstadoTV();
    
    // Agregar evento click al botón de power
    document.getElementById('power').addEventListener('click', () => {
        // Cambiar el estado de la TV (toggle)
        tvEncendida = !tvEncendida;
        
        // Crear objetos de audio para los sonidos de encendido/apagado
        const sonidoEncendido = new Audio("click.mp3");
        const sonidoApagado = new Audio("click.mp3");

        // Si la TV se está encendiendo
        if (tvEncendida) {
            // Reproducir sonido de encendido (ignorar errores si no 
            // se puede reproducir)
            sonidoEncendido.play().catch(() => {});
            encenderSistema();  // Activar todos los elementos
            estadoTv.textContent = "🟢 TV ENCENDIDA";
            estadoTv.style.background = "rgba(40, 167, 69, 0.8)";  // Verde
            mostrarToast("Sistema encendido 🌟");
        } else {


            sonidoApagado.play().catch(() => {});
            apagarSistema();  // Desactivar todos los elementos
            estadoTv.textContent = "🔴 TV APAGADA";
            estadoTv.style.background = "rgba(220, 53, 69, 0.8)";  // Rojo
            mostrarToast("Sistema apagado 💤");
        }
        
    });
    

}

// Función para crear el elemento que muestra el estado de la TV
function crearElementoEstadoTV() {
    // Crear un nuevo elemento div
    const estado = document.createElement('div');
    estado.id = 'estado-tv';  // Asignar ID para poder referenciarlo después
    
    // Aplicar estilos CSS directamente
    estado.style.cssText = `
        position: fixed;           /* Posición fija en la pantalla */
        top: 20px;                /* 20px desde la parte superior */
        right: 20px;              /* 20px desde la derecha */
        background: rgba(40, 167, 69, 0.8);  /* Fondo verde semitransparente */
        color: white;             /* Texto blanco */
        padding: 10px 15px;       /* Espaciado interno */
        border-radius: 25px;      /* Bordes redondeados */
        font-size: 12px;          /* Tamaño de fuente */
        font-weight: bold;        /* Texto en negrita */
        z-index: 10000;           /* Asegurar que esté por encima de todo */
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);  /* Sombra blanca */
    `;
    
    // Agregar el elemento al cuerpo del documento
    document.body.appendChild(estado);
    return estado;  // Devolver la referencia al elemento creado
}

// Función para encender todos los elementos del sistema
function encenderSistema() {
    // VIDEO Y CONTENEDORES
    player.style.display = "block";  // Mostrar el video
    player.play().catch(e => console.log("Auto-play bloqueado:", e));  // Reproducir video
    
    // Hacer visible el contenedor del video
    document.querySelector('.video-container').style.opacity = "1";
    
    // ELEMENTOS INTERACTIVOS
    // Seleccionar todos los elementos interactivos y activarlos
    document.querySelectorAll('.video-item, .num, .flecha, .ok-btn, .vol-btn, .ch-btn, .btn-voto').forEach(element => {
        element.style.opacity = "1";           // Hacer completamente visibles
        element.style.pointerEvents = "auto";  // Permitir interacción con el mouse
        if (element.tagName === 'BUTTON') element.disabled = false;  // Habilitar botones
    });
    
    // EFECTOS VISUALES
    // Aplicar sombra azul al control remoto
    document.querySelector('.control-remote').style.boxShadow = "0 0 20px rgba(20, 187, 225, 0.687)";
    
    // Reactivar la animación del título
    document.querySelector('.impressive-title').style.animation = "glowing 1.5s ease-in-out infinite alternate";
    document.querySelector('.impressive-title').style.opacity = "1";  // Título completamente visible
}

// Función para apagar todos los elementos del sistema
function apagarSistema() {
    // VIDEO Y CONTENEDORES
    player.pause();              // Pausar el video
    player.style.display = "none";  // Ocultar el video
    
    // Hacer el contenedor del video semitransparente
    document.querySelector('.video-container').style.opacity = "0.3";
    
    // ELEMENTOS INTERACTIVOS
    // Seleccionar todos los elementos interactivos y desactivarlos
    document.querySelectorAll('.video-item, .num, .flecha, .ok-btn, .vol-btn, .ch-btn, .btn-voto').forEach(element => {
        element.style.opacity = "0.4";           // Hacer semitransparentes
        element.style.pointerEvents = "none";    // Deshabilitar interacción con el mouse
        if (element.tagName === 'BUTTON') element.disabled = true;  // Deshabilitar botones
    });
    
    // EFECTOS VISUALES
    // Cambiar a sombra gris en el control remoto
    document.querySelector('.control-remote').style.boxShadow = "0 0 10px rgba(128, 128, 128, 0.5)";
    
    // Detener la animación del título y hacerlo semitransparente
    document.querySelector('.impressive-title').style.animation = "none";
    document.querySelector('.impressive-title').style.opacity = "0.6";
}

// ==========================
// SISTEMA DE VIDEOS
// ==========================

// Mapa que relaciona números de botón con archivos de video
const mapaVideos = {
    "0": "videointro.mp4",           // Botón 0 -> Video introductorio
    "1": "videoBTS.mp4",             // Botón 1 -> Video de BTS
    "2": "videos/videoGOLDEN.mp4",   // Botón 2 -> Video de Golden
    "3": "videoSODA.mp4"             // Botón 3 -> Video de Soda Stereo
};

// Array con información detallada de cada video
const videos = [
    { title: "Introductorio", file: "videointro.mp4" },                    // Video 0
    { title: "BTS - Dynamite", file: "videoBTS.mp4" },                     // Video 1  
    { title: "Golden - Lights", file: "videos/videoGOLDEN.mp4" },          // Video 2
    { title: "Soda Stereo", file: "videoSODA.mp4" }                      // Video 3
];

// Función para abrir video desde las imágenes de la izquierda
function openVideo(videoSrc, videoName, songTitle) {
    // Verificar que la TV esté encendida
    if (!tvEncendida) {
        mostrarToast("🔴 Enciende la TV primero");
        return;  // Salir de la función si la TV está apagada
    }

    // Cambiar la fuente del video
    player.src = videoSrc;
    player.style.display = "block";  // Asegurar que el video sea visible
    
    // Intentar reproducir el video
    player.play().catch(e => console.log("Error play:", e));
    
    // Mostrar mensaje informativo
    mostrarToast(`Reproduciendo: ${videoName}`);
}

// Función para cargar video (usada por los botones numéricos y flechas)
function cargarVideo(videoIndex) {
    // Verificar que la TV esté encendida
    if (!tvEncendida) return;
    
    // Obtener la ruta del archivo de video
    const videoSrc = videos[videoIndex].file;
    
    // Cambiar la fuente del video y reproducir
    player.src = videoSrc;
    player.play().catch(e => console.log("Error play:", e));
    
    // Actualizar el video actual y mostrar mensaje
    current = videoIndex;
    mostrarToast("Reproduciendo: " + videos[videoIndex].title);
}

// ==========================
// CONTROL REMOTO - EVENT LISTENERS
// ==========================

// CONFIGURACIÓN DE TECLADO NUMÉRICO
// Agregar evento click a todos los botones numéricos
document.querySelectorAll(".num").forEach(btn => {
    btn.addEventListener("click", () => {
        // Verificar que la TV esté encendida
        if (!tvEncendida) {
            mostrarToast("🔴 Enciende la TV primero");
            return;
        }

        // Obtener el número del botón presionado
        const n = btn.dataset.num;
        
        // Buscar el archivo de video correspondiente
        const src = mapaVideos[n];

        // Si no hay video asignado a ese número, mostrar error
        if (!src) {
            mostrarToast("Botón " + n + " sin video asignado");
            return;
        }

        // Cambiar y reproducir el video
        player.src = src;
        player.style.display = "block";
        player.play().catch(e => console.log("Error play:", e));
        
        // Mostrar mensaje del canal seleccionado
        mostrarToast("Canal " + n);
    });
});

// BOTÓN OK - PLAY/PAUSE
document.getElementById("ok-btn").addEventListener("click", () => {
    // Verificar que la TV esté encendida
    if (!tvEncendida) {
        mostrarToast("🔴 Enciende la TV primero");
        return;
    }

    // Alternar entre play y pause
    if (player.paused) {
        player.play();
        mostrarToast("▶ Play");
    } else {
        player.pause();
        mostrarToast("⏸ Pausa");
    }
});

// FLECHA IZQUIERDA - RETROCEDER 5 SEGUNDOS
document.getElementById("flecha-left").addEventListener("click", () => {
    if (!tvEncendida) return;  // Salir si TV apagada
    
    // Retroceder 5 segundos, pero no menos de 0
    player.currentTime = Math.max(0, player.currentTime - 5);
    mostrarToast("⏪ -5s");
});

// FLECHA DERECHA - ADELANTAR 5 SEGUNDOS  
document.getElementById("flecha-right").addEventListener("click", () => {
    if (!tvEncendida) return;
    
    // Adelantar 5 segundos, pero no más allá de la duración del video
    player.currentTime = Math.min(player.duration, player.currentTime + 5);
    mostrarToast("⏩ +5s");
});

// FLECHA ARRIBA - CANAL SIGUIENTE
document.getElementById("flecha-up").addEventListener("click", () => {
    if (!tvEncendida) return;
    
    // Calcular siguiente canal (cíclico: después del 3 vuelve al 1)
    const next = current === 3 ? 1 : current + 1;
    cargarVideo(next);
    mostrarToast("Canal ↑");
});

// FLECHA ABAJO - CANAL ANTERIOR
document.getElementById("flecha-down").addEventListener("click", () => {
    if (!tvEncendida) return;
    
    // Calcular canal anterior (cíclico: antes del 1 va al 3)
    const prev = current === 1 ? 3 : current - 1;
    cargarVideo(prev);
    mostrarToast("Canal ↓");
});

// BOTÓN VOLUMEN + - AUMENTAR VOLUMEN
document.getElementById('vol-up').addEventListener('click', () => {
    if (!tvEncendida) return;
    
    // Aumentar volumen en 10%, máximo 100%
    player.volume = Math.min(1, player.volume + 0.1);
    mostrarToast("Volumen: " + Math.round(player.volume * 100) + "%");
});

// BOTÓN VOLUMEN - - DISMINUIR VOLUMEN
document.getElementById('vol-down').addEventListener('click', () => {
    if (!tvEncendida) return;
    
    // Disminuir volumen en 10%, mínimo 0%
    player.volume = Math.max(0, player.volume - 0.1);
    mostrarToast("Volumen: " + Math.round(player.volume * 100) + "%");
});

// BOTÓN CANAL + - SIGUIENTE CANAL
document.getElementById('ch-up').addEventListener('click', () => {
    if (!tvEncendida) return;
    
    // Cambiar al siguiente canal (cíclico)
    current = current === 3 ? 1 : current + 1;
    cargarVideo(current);
    mostrarToast("Canal siguiente: " + videos[current].title);
});

// BOTÓN CANAL - - CANAL ANTERIOR
document.getElementById('ch-down').addEventListener('click', () => {
    if (!tvEncendida) return;
    
    // Si está en el canal 0 (intro), no hacer nada
    if (current === 0) {
        mostrarToast("Ya estás en el video introductorio.");
    } else {
        // Cambiar al canal anterior (cíclico)
        current = current === 1 ? 3 : current - 1;
        cargarVideo(current);
        mostrarToast("Canal anterior: " + videos[current].title);
    }
});

// ==========================
// SISTEMA DE VOTACIÓN
// ==========================

// Función principal para registrar votos
async function votar(color, candidato) {
    // Verificar que la TV esté encendida
    if (!tvEncendida) {
        mostrarToast("🔴 Enciende la TV para votar");
        return;
    }

    try {
        // Intentar guardar el voto en la base de datos (o localStorage)
        const response = await guardarVotoEnBD(color, candidato);
        
        // Si se guardó correctamente
        if (response.success) {
            mostrarToast(`¡Voto para ${candidato} registrado! 🌟`);
            actualizarContadores();     // Actualizar números en círculos
            actualizarDiagramaBarras(); // Actualizar gráfico de barras
        } else {
            mostrarToast('Error al registrar voto');
        }
    } catch (error) {
        // Manejar errores de conexión o otros errores
        console.error('Error:', error);
        mostrarToast('Error de conexión');
    }
}

// Función para simular el guardado en base de datos
async function guardarVotoEnBD(color, candidato) {
    // Devolver una promesa para simular una operación asíncrona
    return new Promise((resolve) => {
        // Simular delay de red (500ms)
        setTimeout(() => {
            // Obtener votos actuales de localStorage, o crear objeto vacío si no existe
            const votos = JSON.parse(localStorage.getItem('votosEclipsSoul')) || {
                BTS: 0,
                GOLDEN: 0,
                SODA: 0
            };
            
            // Incrementar el voto del candidato seleccionado
            votos[candidato] = (votos[candidato] || 0) + 1;
            
            // Guardar los votos actualizados en localStorage
            localStorage.setItem('votosEclipsSoul', JSON.stringify(votos));
            
            // Indicar que la operación fue exitosa
            resolve({ success: true });
        }, 500);
    });
}

// Función para actualizar los contadores circulares
function actualizarContadores() {
    // Obtener votos actuales de localStorage
    const votos = JSON.parse(localStorage.getItem('votosEclipsSoul')) || {
        BTS: 0,
        GOLDEN: 0,
        SODA: 0
    };
    
    // Actualizar el texto en los elementos HTML
    document.getElementById('contador-bts').textContent = votos.BTS;
    document.getElementById('contador-golden').textContent = votos.GOLDEN;
    document.getElementById('contador-soda').textContent = votos.SODA;
}

// Función para actualizar el diagrama de barras
function actualizarDiagramaBarras() {
    // Obtener votos actuales
    const votos = JSON.parse(localStorage.getItem('votosEclipsSoul')) || {
        BTS: 0,
        GOLDEN: 0,
        SODA: 0
    };
    
    // Calcular el total de votos para calcular porcentajes
    const totalVotos = votos.BTS + votos.GOLDEN + votos.SODA;
    
    // Array con los nombres de los candidatos
    const candidatos = ['BTS', 'GOLDEN', 'SODA'];
    
    // Para cada candidato, actualizar su barra y valor
    candidatos.forEach(candidato => {
        const valor = votos[candidato] || 0;  // Obtener cantidad de votos
        
        // Calcular porcentaje (evitar división por cero)
        const porcentaje = totalVotos > 0 ? (valor / totalVotos) * 100 : 0;
        
        // Obtener referencia a la barra de este candidato
        const barra = document.getElementById(`bar-${candidato.toLowerCase()}`);
        
        // Obtener referencia al texto del valor
        const valorElement = document.getElementById(`value-${candidato.toLowerCase()}`);
        
        // Si la barra existe, actualizar su ancho
        if (barra) {
            barra.style.width = `${porcentaje}%`;  // Establecer ancho basado en porcentaje
            
            // Agregar clase de animación temporal
            barra.classList.add('updating');
            
            // Quitar la clase después de 500ms
            setTimeout(() => barra.classList.remove('updating'), 500);
        }
        
        // Actualizar el texto con la cantidad de votos
        if (valorElement) {
            valorElement.textContent = valor;
        }
    });
}



// ==========================
// UTILIDADES
// ==========================

// Función para mostrar mensajes temporales (toasts)
function mostrarToast(mensaje) {
    // Buscar si ya existe un toast anterior
    const toastAnterior = document.querySelector('.toast');
    
    // Si existe, eliminarlo para evitar múltiples toasts
    if (toastAnterior) {
        toastAnterior.remove();
    }
    
    // Crear nuevo elemento de toast
    const toast = document.createElement('div');
    toast.className = 'toast';  // Clase para estilos CSS
    toast.textContent = mensaje; // Texto del mensaje
    
    // Aplicar estilos inline
    toast.style.cssText = `
        position: fixed;           /* Posición fija en la pantalla */
        bottom: 20px;              /* 20px desde la parte inferior */
        left: 50%;                 /* Centrado horizontalmente */
        transform: translateX(-50%); /* Ajuste para centrado perfecto */
        background: rgba(0, 0, 0, 0.8);  /* Fondo negro semitransparente */
        color: white;              /* Texto blanco */
        padding: 12px 20px;        /* Espaciado interno */
        border-radius: 25px;       /* Bordes redondeados */
        font-size: 14px;           /* Tamaño de fuente */
        z-index: 10000;            /* Por encima de todo */
        animation: fade-in 0.3s forwards;  /* Animación de entrada */
        border: 1px solid rgba(255, 255, 255, 0.2);  /* Borde sutil */
    `;
    
    // Agregar el toast al cuerpo del documento
    document.body.appendChild(toast);
    
    // Programar la eliminación automática del toast
    setTimeout(() => {
        // Iniciar animación de salida
        toast.style.animation = 'fade-out 0.3s forwards';
        
        // Eliminar el elemento después de que termine la animación
        setTimeout(() => toast.remove(), 300);
    }, 3000);  // El toast permanece visible por 3 segundos
}

// Crear y agregar estilos CSS para las animaciones de toast
const toastStyles = `
/* Animación de entrada del toast */
@keyframes fade-in {
    from { 
        opacity: 0; 
        transform: translateX(-50%) translateY(20px);  /* Comienza 20px más abajo */
    }
    to { 
        opacity: 1; 
        transform: translateX(-50%) translateY(0);     /* Termina en posición normal */
    }
}

/* Animación de salida del toast */
@keyframes fade-out {
    from { 
        opacity: 1; 
        transform: translateX(-50%) translateY(0);     /* Comienza en posición normal */
    }
    to { 
        opacity: 0; 
        transform: translateX(-50%) translateY(-20px); /* Termina 20px más arriba */
    }
}
`;

// Crear elemento style y agregar los estilos de animación
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;

// Agregar los estilos al head del documento
document.head.appendChild(styleSheet);

// Función mejorada para mostrar la barra de información
function mostrarInfoBar(videoSrc) {
    // Obtener la información del video actual
    const videoInfo = videoDescriptions[videoSrc] || {
        title: "Video en Reproducción",
        description: "Disfruta de este contenido musical"
    };
    
    // Obtener elementos de la barra
    const infoBar = document.getElementById('videoInfoBar');
    const titleElement = document.getElementById('videoInfoTitle');
    const descriptionElement = document.getElementById('videoInfoDescription');
    
    // Actualizar contenido
    titleElement.textContent = videoInfo.title;
    descriptionElement.textContent = videoInfo.description;
    
    // Detener cualquier timeout anterior
    clearTimeout(infoBarTimeout);
    
    // Remover clase de animación de salida si existe
    infoBar.classList.remove('hiding');
    
    // Remover barra de progreso anterior si existe
    const oldProgress = infoBar.querySelector('.info-bar-progress');
    if (oldProgress) {
        oldProgress.remove();
    }
    
    // Crear nueva barra de progreso
    const progressBar = document.createElement('div');
    progressBar.className = 'info-bar-progress';
    infoBar.appendChild(progressBar);
    
    // Mostrar la barra
    infoBar.style.display = 'block';
    
    // Reiniciar la animación de la barra de progreso
    progressBar.style.animation = 'none';
    setTimeout(() => {
        progressBar.style.animation = 'progressCountdown 40s linear forwards';
    }, 10);
    
    // Programar ocultamiento automático después de 40 segundos
    infoBarTimeout = setTimeout(() => {
        ocultarInfoBar();
    }, 40000); // 40 segundos = 40000 milisegundos
}
// Objeto con las descripciones de cada video
const videoDescriptions = {
    "videointro.mp4": {
        title: "EclipsSoul 🌙 - Introducción",
        description: "🌙 MODERADORAS DEL PROGRAMA ECLIPSOUL: LETTY Y LUCY | When Two Souls Shine Together 🌟"
    },
    "videoBTS.mp4": {
        title: "BTS - Dynamite",
        description: "🎵 BTS es un grupo de K-pop surcoreano de siete miembros: Jin, Suga, J-Hope, RM, Jimin, V y Jungkook. Formado en 2013. Su nombre, Bangtan Sonyeondan, significa 'Boy Scouts a prueba de balas'. 'Dynamite' es su primer sencillo completamente en inglés, lanzado en agosto de 2020, que destaca por su ritmo disco, colores pastel y mensaje de alegría. 💫"
    },
    "videos/videoGOLDEN.mp4": {
        title: "Kpop Demon Hunters - Golden",
        description: "🎵 'Kpop Demon Hunters' es un grupo ficticio llamado HUNTR/X, que tiene una doble vida como grupo de K-pop y cazadoras secretas de demonios. 'Golden' es una de sus canciones más famosas, que se convirtió en un gran éxito comercial y de crítica, elogiada por su letra y composición, llegando a lo más alto de las listas de éxitos mundiales. Cuyas voces pertenecen a las artistas EJAE, Audrey Nuna y Rei Ami. ✨"
    },
    "videoSODA.mp4": {
        title: "ONEUS - Soda Pop",
        description: "🎵 ONEUS es un grupo de K-Pop surcoreano de cinco miembros que debutó en 2019 con el miniálbum Light Us. Aunque la canción 'Soda Pop' no es suya, sino de la banda ficticia de la película 'K-Pop Demon Hunters', ONEUS se describe como un grupo con música emotiva y un estilo único, con miembros como Seoho, Leedo, Keonhee, Hwanwoong y Xion. 🎸"
    
    }
};

// Función para mostrar la barra de información del video
function mostrarInfoBar(videoSrc) {
    // Obtener la información del video actual
    const videoInfo = videoDescriptions[videoSrc] || {
        title: "🌟 Gracias por ver EclipsSoul",
        description: "When Two Souls Shine Together ✨"
    };
    
    // Obtener elementos de la barra
    const infoBar = document.getElementById('videoInfoBar');
    const titleElement = document.getElementById('videoInfoTitle');
    const descriptionElement = document.getElementById('videoInfoDescription');
    
    // Actualizar contenido
    titleElement.textContent = videoInfo.title;
    descriptionElement.textContent = videoInfo.description;
    
    // Detener cualquier animación anterior y limpiar timeouts
    infoBar.classList.remove('hiding');
    clearTimeout(window.infoBarTimeout);
    clearInterval(window.infoBarProgressInterval);
    
    // Remover barra de progreso si existe
    const progressBar = infoBar.querySelector('.info-bar-progress');
    if (progressBar) {
        progressBar.remove();
    }
    
    // Mostrar la barra
    infoBar.style.display = 'block';
}

// Función para ocultar la barra de información
function ocultarInfoBar() {
    const infoBar = document.getElementById('videoInfoBar');
    
    if (infoBar.style.display !== 'none') {
        // Agregar clase de animación de salida
        infoBar.classList.add('hiding');
        
        // Esperar a que termine la animación para ocultar
        setTimeout(() => {
            infoBar.style.display = 'none';
            infoBar.classList.remove('hiding');
        }, 500);
    }
    
    // Limpiar timeouts e intervals
    clearTimeout(window.infoBarTimeout);
    clearInterval(window.infoBarProgressInterval);
}

// Función para cerrar manualmente la barra
function cerrarInfoBar() {
    ocultarInfoBar();
}

// ==========================
// FUNCIONES DE VIDEO ACTUALIZADAS (SIMPLIFICADAS)
// ==========================

// Función para abrir video desde imágenes
function openVideo(videoSrc, videoName, songTitle) {
    if (!tvEncendida) {
        mostrarToast("🔴 Enciende la TV primero");
        return;
    }

    player.src = videoSrc;
    player.style.display = "block";
    player.play().catch(e => console.log("Error play:", e));
    
    // Mostrar información del video (sin tiempo límite)
    mostrarInfoBar(videoSrc);
    
    mostrarToast(`Reproduciendo: ${videoName}`);
}

// Función para cargar video
function cargarVideo(videoIndex) {
    if (!tvEncendida) return;
    
    const videoSrc = videos[videoIndex].file;
    player.src = videoSrc;
    player.play().catch(e => console.log("Error play:", e));
    current = videoIndex;
    
    // Mostrar información del video (sin tiempo límite)
    mostrarInfoBar(videoSrc);
    
    mostrarToast("Reproduciendo: " + videos[videoIndex].title);
}

// Event listener para teclado numérico
document.querySelectorAll(".num").forEach(btn => {
    btn.addEventListener("click", () => {
        if (!tvEncendida) {
            mostrarToast("🔴 Enciende la TV primero");
            return;
        }

        const n = btn.dataset.num;
        const src = mapaVideos[n];

        if (!src) {
            mostrarToast("Botón " + n + " sin video asignado");
            return;
        }

        player.src = src;
        player.style.display = "block";
        player.play().catch(e => console.log("Error play:", e));
        
        // Mostrar información del video (sin tiempo límite)
        mostrarInfoBar(src);
        
        mostrarToast("Canal " + n);
    });
});

// Event listeners para flechas de canales
document.getElementById("flecha-up").addEventListener("click", () => {
    if (!tvEncendida) return;
    const next = current === 3 ? 1 : current + 1;
    cargarVideo(next);
    mostrarToast("Canal ↑");
});

document.getElementById("flecha-down").addEventListener("click", () => {
    if (!tvEncendida) return;
    const prev = current === 1 ? 3 : current - 1;
    cargarVideo(prev);
    mostrarToast("Canal ↓");
});

// Event listeners para botones de canal
document.getElementById('ch-up').addEventListener('click', () => {
    if (!tvEncendida) return;
    current = current === 3 ? 1 : current + 1;
    cargarVideo(current);
    mostrarToast("Canal siguiente: " + videos[current].title);
});

document.getElementById('ch-down').addEventListener('click', () => {
    if (!tvEncendida) return;
    if (current === 0) {
        mostrarToast("Ya estás en el video introductorio.");
    } else {
        current = current === 1 ? 3 : current - 1;
        cargarVideo(current);
        mostrarToast("Canal anterior: " + videos[current].title);
    }
});

// Event listener para cuando el video termina
player.addEventListener('ended', function() {
    // Ocultar barra de información cuando el video termina
    ocultarInfoBar();
});

// Modificar sistema de encendido/apagado para manejar la barra de información
function apagarSistema() {
    // Video y contenedores
    player.pause();
    player.style.display = "none";
    document.querySelector('.video-container').style.opacity = "0.3";
    
    // Ocultar barra de información al apagar
    ocultarInfoBar();
    
    // Resto del código de apagado...
    document.querySelectorAll('.video-item, .num, .flecha, .ok-btn, .vol-btn, .ch-btn, .btn-voto').forEach(element => {
        element.style.opacity = "0.4";
        element.style.pointerEvents = "none";
        if (element.tagName === 'BUTTON') element.disabled = true;
    });
    
    document.querySelector('.control-remote').style.boxShadow = "0 0 10px rgba(128, 128, 128, 0.5)";
    document.querySelector('.impressive-title').style.animation = "none";
    document.querySelector('.impressive-title').style.opacity = "0.6";
}

function encenderSistema() {
    // Video y contenedores
    player.style.display = "block";
    player.play().catch(e => console.log("Error play:", e));
    document.querySelector('.video-container').style.opacity = "1";
    
    // Elementos interactivos
    document.querySelectorAll('.video-item, .num, .flecha, .ok-btn, .vol-btn, .ch-btn, .btn-voto').forEach(element => {
        element.style.opacity = "1";
        element.style.pointerEvents = "auto";
        if (element.tagName === 'BUTTON') element.disabled = false;
    });
    
    // Efectos visuales
    document.querySelector('.control-remote').style.boxShadow = "0 0 20px rgba(20, 187, 225, 0.687)";
    document.querySelector('.impressive-title').style.animation = "glowing 1.5s ease-in-out infinite alternate";
    document.querySelector('.impressive-title').style.opacity = "1";
    
    // Mostrar información del video actual al encender
    const currentVideoSrc = videos[current].file;
    mostrarInfoBar(currentVideoSrc);
}

// ==========================
// SOLUCIÓN MÁS SIMPLE - SOLO BOTÓN 8
// ==========================

// Agregar esto al final de tu script.js actual
document.addEventListener('DOMContentLoaded', function() {
    // Encontrar el botón 8
    const boton8 = document.querySelector('.num[data-num="8"]');
    
    if (boton8) {
        // Remover cualquier event listener anterior
        boton8.replaceWith(boton8.cloneNode(true));
        
        // Volver a obtener el botón fresco
        const nuevoBoton8 = document.querySelector('.num[data-num="8"]');
        
        // Agregar nuevo event listener
        nuevoBoton8.addEventListener('click', function() {
            if (!tvEncendida) {
                mostrarToast("🔴 Enciende la TV primero");
                return;
            }
            
            // Reproducir video final
            player.src = "FINAL.mp4";
            player.style.display = "block";
            player.play().catch(e => console.log("Error play:", e));
            
            // Mostrar información
            mostrarInfoBar("FINAL.mp4");
            
            // Mensaje especial
            mostrarToast("🎬 Reproduciendo Créditos Finales...");
            
            // Cuando termine, volver al inicio
            player.onended = function() {
                mostrarToast("🌟 ¡Gracias por ver EclipsSoul! 🌟");
                setTimeout(() => {
                    player.src = "videointro.mp4";
                    player.play();
                }, 3000);
            };
        });
    }
});

// También actualizar el mapa de videos
if (typeof mapaVideos !== 'undefined') {
    mapaVideos["8"] = "FINAL.mp4";
}
// ==========================
// RESET TOTAL CUANDO SE APAGA LA TV
// ==========================

function resetearControl() {
    // Volver al video introductorio
    player.src = "videointro.mp4";
    player.currentTime = 0;
    current = 0;

    // Restablecer volumen a 50%
    player.volume = 0.5;

    // Quitar cualquier efecto o selección en botones numéricos
    document.querySelectorAll(".num").forEach(btn => {
        btn.classList.remove("active");
    });

    // Quitar selección de flechas, OK, canal y volumen
    document.querySelectorAll(".flecha, .ok-btn, .vol-btn, .ch-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    // Restaurar visibilidad del contenedor del video
    document.querySelector('.video-container').style.opacity = "0.3";

    // Ocultar el reproductor hasta que se vuelva a encender
    player.style.display = "none";

    // Mostrar mensaje
    console.log("Control remoto reseteado.");
// ==========================
// SISTEMA DE RESET AL APAGAR
// ==========================

// Función para resetear todos los datos de votación
function resetearVotacion() {
    // Resetear localStorage
    localStorage.removeItem('votosEclipsSoul');
    
    // Resetear contadores visuales
    document.getElementById('contador-bts').textContent = '0';
    document.getElementById('contador-golden').textContent = '0';
    document.getElementById('contador-soda').textContent = '0';
    
    // Resetear barras del gráfico
    document.getElementById('bar-bts').style.width = '0%';
    document.getElementById('bar-golden').style.width = '0%';
    document.getElementById('bar-soda').style.width = '0%';
    
    // Resetear valores numéricos del gráfico
    document.getElementById('value-bts').textContent = '0';
    document.getElementById('value-golden').textContent = '0';
    document.getElementById('value-soda').textContent = '0';
    
    console.log("Votación reseteada - Todos los contadores en 0");
}

// ==========================
// MODIFICACIÓN DEL SISTEMA DE APAGADO
// ==========================

// Guardar la función original de apagarSistema
const originalApagarSistema = apagarSistema;

// Sobrescribir la función para incluir el reset
apagarSistema = function() {
    // Primero ejecutar la función original
    originalApagarSistema();
    
    // Luego resetear la votación
    resetearVotacion();
    
    // Mostrar mensaje de confirmación
    mostrarToast("🗳️ Votación reseteada");
};

// ==========================
// INICIALIZACIÓN MEJORADA
// ==========================

// Modificar la inicialización para asegurar que todo funcione correctamente
document.addEventListener('DOMContentLoaded', function() {
    // Tu código de inicialización original aquí...
    inicializarSistemaEncendido();
    actualizarContadores();
    actualizarDiagramaBarras();
    
    // Agregar esta línea para asegurar que el reset funcione
    console.log("Sistema de reset de votación cargado correctamente");
});
}

// INTERVENCIÓN: añadir RESET al apagarSistema()
const originalApagarSistema = apagarSistema;

apagarSistema = function() {
    originalApagarSistema();   // Llama a la función original
    resetearControl();         // Aplica el RESET total
};


