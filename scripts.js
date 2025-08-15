const playPausebutton = document.querySelector(".play-pause-btn");
const video = document.querySelector("video");
const videoContainer = document.querySelector(".video-container");

// screen buttons
const theaterButton = document.querySelector(".theater-mode-btn");
const fullAndSmallScreenButton = document.querySelector(
  ".screen-large-small-btn"
);
const pictureInPictureButton = document.querySelector(".pip-btn");

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

    default:
      break;
  }
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
