import os
import json
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB, TDRC

CARPETA_AUDIO = "./audio"
CARPETA_DATA = "./data"
ARCHIVO_SALIDA = os.path.join(CARPETA_DATA, "tracks.json")

os.makedirs(CARPETA_DATA, exist_ok=True)

pistas = []

for archivo in os.listdir(CARPETA_AUDIO):
    if archivo.lower().endswith(".mp3"):
        ruta = os.path.join(CARPETA_AUDIO, archivo)

        # Leer duración
        audio = MP3(ruta)
        duracion_seg = int(audio.info.length)
        minutos = duracion_seg // 60
        segundos = duracion_seg % 60
        duracion = f"{minutos}:{str(segundos).zfill(2)}"

        # Leer metadatos ID3
        try:
            etiquetas = ID3(ruta)
            titulo = etiquetas.get("TIT2", TIT2(encoding=3, text=[archivo])).text[0]
            artista = etiquetas.get("TPE1", TPE1(encoding=3, text=["Desconocido"])).text[0]
            album = etiquetas.get("TALB", TALB(encoding=3, text=[""])).text[0]
            año = etiquetas.get("TDRC", TDRC(encoding=3, text=[""])).text[0]
        except:
            titulo = archivo
            artista = "Desconocido"
            album = ""
            año = ""

        pistas.append({
            "name": titulo,
            "artist": artista,
            "album": album,
            "year": str(año),
            "duration": duracion,
            "url": f"audio/{archivo}"
        })

# Guardar en JSON
with open(ARCHIVO_SALIDA, "w", encoding="utf-8") as f:
    json.dump(pistas, f, indent=2, ensure_ascii=False)

print(f"✅ Generado {ARCHIVO_SALIDA} con {len(pistas)} pistas.")
