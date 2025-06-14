const form = document.getElementById("upload-form");
const audioInput = document.getElementById("audio");
const coverInput = document.getElementById("cover");
const artistInput = document.getElementById("artist");

const preview = document.getElementById("preview");
const coverPreview = document.getElementById("cover-preview");
const artistName = document.getElementById("artist-name");
const fileName = document.getElementById("file-name");
const durationText = document.getElementById("duration");
const player = document.getElementById("player");

const tableBody = document.querySelector("#track-table tbody");

let tracks = JSON.parse(localStorage.getItem("tracks") || "[]");




form.addEventListener("submit", function (e) {
  e.preventDefault();

  const file = audioInput.files[0];
  if (!file) return alert("Seleccioná un archivo .mp3");

  const audioURL = URL.createObjectURL(file);
  const coverFile = coverInput.files[0];
  const coverURL = coverFile ? URL.createObjectURL(coverFile) : null;
  const artist = artistInput.value || "Desconocido";

  // Mostrar preview
  fileName.textContent = file.name;
  artistName.textContent = artist;
  player.src = audioURL;

  if (coverURL) {
    coverPreview.src = coverURL;
    coverPreview.style.display = "block";
  } else {
    coverPreview.style.display = "none";
  }

// Mostrar preview
fileName.textContent = file.name;
artistName.textContent = artist;
player.src = audioURL;

if (coverURL) {
  coverPreview.src = coverURL;
  coverPreview.style.display = "block";
} else {
  coverPreview.style.display = "none";
}

// Esperar a que el audio esté cargado para guardar
player.addEventListener("loadedmetadata", function handler() {
  // Remover el handler para evitar múltiples ejecuciones
  player.removeEventListener("loadedmetadata", handler);

  const duration = `${Math.floor(player.duration / 60)}:${Math.floor(player.duration % 60).toString().padStart(2, "0")}`;

  // Guardar solo una vez
  tracks.push({
    name: file.name,
    artist,
    duration,
    url: audioURL
  });
  localStorage.setItem("tracks", JSON.stringify(tracks));
  renderTable();
  preview.classList.remove("hidden");
});

});

function renderTable() {
  tableBody.innerHTML = "";
  tracks.forEach((track, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${track.name}</td>
      <td><input type="text" value="${track.artist}" class="edit-input" data-index="${index}"/></td>
      <td>${track.duration}</td>
      <td>
        <button class="edit" onclick="playTrack(${index})">▶</button>
        <button class="delete" onclick="deleteTrack(${index})">🗑</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  // Guardar cambios al editar artista
  document.querySelectorAll(".edit-input").forEach(input => {
    input.addEventListener("change", e => {
      const i = e.target.dataset.index;
      tracks[i].artist = e.target.value;
      localStorage.setItem("tracks", JSON.stringify(tracks));
    });
  });
}

function playTrack(index) {
  const t = tracks[index];
  player.src = t.url;
  artistName.textContent = t.artist;
  fileName.textContent = t.name;
  durationText.textContent = t.duration;
  preview.classList.remove("hidden");
  player.play();
}

function deleteTrack(index) {
  if (confirm("¿Eliminar esta pista?")) {
    tracks.splice(index, 1);
    localStorage.setItem("tracks", JSON.stringify(tracks));
    renderTable();
  }
}

fetch("data/tracks.json")
  .then(res => res.json())
  .then(data => {
    tracks = data;
    localStorage.setItem("tracks", JSON.stringify(tracks));
    renderTable();
  });


// Al cargar la página
renderTable();



