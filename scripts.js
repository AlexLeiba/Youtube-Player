const playPausebutton = document.querySelector(".play-pause-btn");
const video = document.querySelector("video");
const videoContainer = document.querySelector(".video-container");

// screen buttons
const theaterButton = document.querySelector(".theater-mode-btn");
const fullAndSmallScreenButton = document.querySelector(
  ".screen-large-small-btn"
);
const pictureInPictureButton = document.querySelector(".pip-btn");

// volume button element
const volumeButton = document.querySelector(".volume-on-off-btn");
// range input element
const volumeSlider = document.querySelector(".volume-slider");

// KEYDOWN SWITCH

document.addEventListener("keydown", (e) => {
  const activeTagName = document.activeElement.tagName.toLowerCase();

  if (activeTagName === "input") return;

  switch (e.key.toLowerCase()) {
    case "k":
    case " ":
      if (activeTagName === "button") return;
      togglePlayPause();

      break;
    case "t":
      toggleTheaterMode();
      break;

    case "f":
      toggleFullAndSmallScreen();
      break;

    case "i":
      togglePictureInPicture();
      break;

    case "m":
      toggleMuteVolume();

    default:
      break;
  }
});

// VOLUME //

// slider input
volumeButton.addEventListener("click", toggleMuteVolume);
volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
});
function toggleMuteVolume() {
  video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume; // Update the slider value
  let volumeLevel;

  if (video.muted || video.volume === 0) {
    volumeLevel = "muted";
    volumeSlider.value = 0;
  }

  if (!video.muted && video.volume >= 0.5) {
    volumeLevel = "high";
  } else if (!video.muted && video.volume < 0.5 && video.volume > 0) {
    volumeLevel = "low";
  }

  videoContainer.dataset.volumeLevel = volumeLevel;
});

//SCREEN VIEW MODES

// theater
theaterButton.addEventListener("click", toggleTheaterMode);

function toggleTheaterMode() {
  theaterButton.classList.toggle("inactive");
  videoContainer.classList.toggle("theater-mode");

  if (fullAndSmallScreenButton.classList.contains("fullscreen-exit")) {
    fullAndSmallScreenButton.classList.remove("fullscreen-exit");
    videoContainer.classList.remove("full-screen");
    document.exitFullscreen();
  }
}

//full screen and small screen
function toggleFullAndSmallScreen() {
  videoContainer.classList.toggle("full-screen");
  fullAndSmallScreenButton.classList.toggle("fullscreen-exit");

  if (document.fullscreenElement === null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }

  if (!theaterButton.classList.contains("inactive")) {
    theaterButton.classList.add("inactive");
    videoContainer.classList.remove("theater-mode");
  }
}

fullAndSmallScreenButton.addEventListener("click", toggleFullAndSmallScreen);

//Picture in Pictuire / Mini player

video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("miniplayer");
  pictureInPictureButton.classList.add("inactive");
});
function togglePictureInPicture() {
  if (!videoContainer.classList.contains("miniplayer")) {
    videoContainer.classList.add("miniplayer");
    pictureInPictureButton.classList.remove("inactive");
    video.requestPictureInPicture();
  } else {
    document.exitPictureInPicture();
    videoContainer.classList.remove("miniplayer");
    pictureInPictureButton.classList.add("inactive");
  }
}

pictureInPictureButton.addEventListener("click", togglePictureInPicture);

// PLAY PAUSE
playPausebutton.addEventListener("click", () => {
  togglePlayPause();
});
video.addEventListener("click", () => {
  togglePlayPause();
});

function togglePlayPause() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  playPausebutton.classList.remove("paused");
});

video.addEventListener("pause", () => {
  playPausebutton.classList.add("paused");
});
