from flask import Flask, request, jsonify, render_template, send_from_directory
import moviepy.editor as mp
import os
from colorama import Style, init
import cv2
import numpy as np
import re

app = Flask(__name__)

widthVideo = 480
fpsVideo = 15

# Inicializa Colorama para colorear texto en la terminal
init(autoreset=True)

# Función para convertir RGB a hexadecimal
def rgb_to_hex(r, g, b):
    return "#{:02x}{:02x}{:02x}".format(r, g, b)

# Función para obtener el carácter ASCII y el color correspondiente usando hexadecimal
def pixel_to_ascii_color(pixel):
    ascii_chars = "█▓▒░@%#*+=-:. " # acá solo toma en cuenta los primeros 3 caracteres, así que puedes cambiarlos para el resultado que desees
    r, g, b = pixel
    intensity = int((r + g + b) / 3)
    ascii_char = ascii_chars[intensity // 25]

    # Convertir RGB a color hexadecimal para estilo CSS
    color_hex = rgb_to_hex(r, g, b)

    # Retornar el carácter ASCII envuelto en un span con el estilo de color
    return f'<span style="color:{color_hex};">{ascii_char}</span>'

def frame_to_ascii(frame, width=100):
    frame_np = np.array(frame)
    height = int((frame_np.shape[0] * width) / frame_np.shape[1] / 2)
    resized_frame = cv2.resize(frame_np, (width, height))
    ascii_frame = "\n".join(
        "".join(pixel_to_ascii_color(pixel) for pixel in row)
        for row in resized_frame
    )
    return ascii_frame

def render_video_to_ascii(video_path, width=widthVideo, fps=fpsVideo):
    video = mp.VideoFileClip(video_path)
    ascii_frames = []  # Lista para almacenar todos los cuadros ASCII
    frame_duration = 1 / fps

    for frame in video.iter_frames(fps=fps):
        ascii_frame = frame_to_ascii(frame, width=width)
        ascii_frames.append(ascii_frame)  # No es necesario convertir a HTML, ya está en el formato correcto
    return ascii_frames

def render_image_to_ascii(image_path, width=100):
    frame = cv2.imread(image_path)
    if frame is None:
        return None, "Error: No se pudo cargar la imagen."

    ascii_frame = frame_to_ascii(frame, width=width)
    return ascii_frame, None  # No es necesario convertir a HTML, ya está en el formato correcto

@app.route('/')
def index():
    # Servir la página web principal
    return send_from_directory('.', 'index.html')

@app.route('/render-image', methods=['POST'])
def render_image():
    if 'file' not in request.files:
        return jsonify({"error": "No se encontró el archivo en la solicitud."}), 400

    file = request.files['file']
    width = int(request.form.get('width', 100))
    
    file_path = os.path.join("/tmp", file.filename)
    file.save(file_path)
    
    ascii_frame, error = render_image_to_ascii(file_path, width)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"ascii_art": ascii_frame})

@app.route('/render-video', methods=['POST'])
def render_video():
    if 'file' not in request.files:
        return jsonify({"error": "No se encontró el archivo en la solicitud."}), 400

    file = request.files['file']
    width = int(request.form.get('width', widthVideo))
    fps = int(request.form.get('fps', fpsVideo))
    
    file_path = os.path.join("/tmp", file.filename)
    file.save(file_path)

    ascii_frames = render_video_to_ascii(file_path, width, fps)
    
    return jsonify({"ascii_art": ascii_frames})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
