// player.js
const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const progressBar = document.getElementById("progress-bar");

let isPlaying = false;

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = "⏯"; // volver a play
  } else {
    audio.play();
    playBtn.textContent = "⏸"; // icono de pausa
  }
});

audio.addEventListener("play", () => {
  isPlaying = true;
});

audio.addEventListener("pause", () => {
  isPlaying = false;
});

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = percent || 0;
});

progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});
