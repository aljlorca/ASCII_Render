# Usar la imagen oficial de Python
FROM python:3.9-slim

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar los archivos requeridos al contenedor
COPY . /app

# Instalar dependencias
RUN pip install --no-cache-dir flask moviepy colorama opencv-python-headless tqdm

# Exponer el puerto 5000
EXPOSE 5000

# Comando para ejecutar el servicio
CMD ["python", "service.py"]
