document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Mostrar el spinner y deshabilitar el botón de enviar y el campo de carga de archivos
    const spinner = document.getElementById('spinner');
    const submitButton = document.getElementById('submit-button');
    const fileInput = document.getElementById('file-input');
    spinner.style.display = 'block';
    submitButton.disabled = true; // Deshabilitar el botón de enviar
    fileInput.disabled = true; // Deshabilitar el campo de carga de archivos

    const width = document.getElementById('width').value;
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo.');
        spinner.style.display = 'none'; // Ocultar el spinner si no hay archivo
        submitButton.disabled = false; // Habilitar el botón de enviar
        fileInput.disabled = false; // Habilitar el campo de carga de archivos
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', width);

    let endpoint = file.type.startsWith('image') ? '/render-image' : '/render-video';
    
    try {
        const response = await fetch(`https://aljlorca.pythonanywhere.com/${endpoint}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();

        const asciiContainer = document.getElementById('ascii-art');
        asciiContainer.innerHTML = '';  // Limpiar contenido previo

        if (file.type.startsWith('image')) {
            // Mostrar el arte ASCII de la imagen
            asciiContainer.innerHTML = data.ascii_art;
        } else {
            // Animar los fotogramas ASCII del video
            animateFrames(data.ascii_art, asciiContainer);
        }

        // Ajustar el tamaño de fuente basado en el tamaño de la ventana
        adjustFontSize(asciiContainer);
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al procesar tu solicitud.');
    } finally {
        // Ocultar el spinner y habilitar el botón de enviar y el campo de carga de archivos cuando termine el procesamiento
        spinner.style.display = 'none';
        submitButton.disabled = false;
        fileInput.disabled = false;
    }
});

function adjustFontSize(container) {
    // Ajustar el tamaño de fuente dinámicamente según el tamaño del contenedor y la ventana
    const maxWidth = window.innerWidth * 0.9; // 90% del ancho de la ventana
    const contentWidth = container.scrollWidth; // Ancho real del contenido
    const scaleFactor = maxWidth / contentWidth; // Factor de escala

    if (scaleFactor < 1) {
        container.style.fontSize = `${Math.max(8, scaleFactor * 12)}px`; // Ajusta el tamaño de fuente entre 8 y 12 px
    } else {
        container.style.fontSize = '12px'; // Restablece el tamaño de fuente a 12 px si cabe
    }
}

function animateFrames(frames, container, frameDuration = 100) {
    let currentFrame = 0;
    container.innerHTML = frames[currentFrame]; // Mostrar el primer fotograma

    const interval = setInterval(() => {
        currentFrame = (currentFrame + 1) % frames.length; // Mover al siguiente fotograma
        container.innerHTML = frames[currentFrame]; // Mostrar el fotograma actual
            // Detener la animación después de una repetición completa
            if (currentFrame === frames.length - 1) {
                clearInterval(interval);
        }
    }, frameDuration);
}
// Función para limpiar el contenido del div con id="ascii-art"
document.getElementById('clear-button').addEventListener('click', function() {
const asciiContainer = document.getElementById('ascii-art');
asciiContainer.innerHTML = ''; // Limpiar el contenido del div
    // Detener cualquier animación en curso
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
});