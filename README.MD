# ASCII Art Renderer

Este es un proyecto basado en Flask para convertir imágenes y videos en arte ASCII con colores y mostrar los resultados en una página web.

## Descripción

La aplicación permite a los usuarios cargar imágenes o videos y procesarlos en el servidor para convertirlos en arte ASCII coloreado. Los resultados se devuelven en formato HTML, lo que permite mostrar los colores correctamente en el navegador del usuario.

## Requisitos

- Python 3.x
- Docker

## Instalación

Sigue estos pasos para instalar y ejecutar la aplicación en tu entorno local:

1. Clona este repositorio:

    ```bash
    git clone https://github.com/tu_usuario/ascii-art-renderer.git
    cd ascii-art-renderer
    ```

## Uso

0. Host en aljlorca.pythonanywhere.com

1. Inicia el servidor en Docker con el comando:

    ```bash
    docker-compose up --build -d
    ```

   Esto iniciará el servidor en `http://0.0.0.0:5000`.

2. Abre un navegador y accede a `http://localhost:5000` para cargar la interfaz de la aplicación.

3. Carga una imagen o un video, selecciona los parámetros de conversión (ancho, fps, etc.), y presiona "Renderizar".

4. Terminar el servidor: 
    ```bash
    docker-compose down
    ```


## Endpoints

La aplicación proporciona los siguientes endpoints:

- **`GET /`**: Devuelve la página principal de la aplicación.
- **`POST /render-image`**: Recibe un archivo de imagen y un ancho opcional, y devuelve el arte ASCII coloreado en formato HTML.
- **`POST /render-video`**: Recibe un archivo de video, un ancho opcional, y una tasa de fotogramas (fps) opcional, y devuelve una lista de fotogramas ASCII coloreados en formato HTML.

## Ejemplo de Solicitud a la API

Puedes enviar solicitudes a los endpoints de la API usando `curl` o cualquier herramienta de cliente HTTP:

```bash
# Enviar una imagen para renderizar
curl -X POST -F "file=@ruta/a/tu/imagen.jpg" -F "width=100" http://localhost:5000/render-image

# Enviar un video para renderizar
curl -X POST -F "file=@ruta/a/tu/video.mp4" -F "width=100" -F "fps=15" http://localhost:5000/render-video
```
