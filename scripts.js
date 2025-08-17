// QUERY HTML ELEMENTS/////////////////////////////////////////////
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

// current time
const currentTime = document.querySelector(".current-time");
// total time
const totalTime = document.querySelector(".total-time");

// captions
const captionsButton = document.querySelector(".cc-btn");
video.textTracks[0].mode = "hidden";

// skip left button
const skipLeftButton = document.querySelector(".skip-left-btn");

// skip right button
const skipRightButton = document.querySelector(".skip-right-btn");

//Playback Speed
const playbackSpeed = document.querySelector(".playback-speed");

// Current time line
const currentTimeLine = document.querySelector(".current-time-line");

//timeline container
const timelineContainer = document.querySelector(".total-time-line");

const previewTimelineProgress = document.querySelector(".preview-progress");

/////////////////////////////////////////////////////////////////////////

// KEYDOWN SWITCH

document.addEventListener("keydown", (e) => {
  const activeTagName = document.activeElement.tagName.toLowerCase(); //refers to the element which is active triggered by Tab for accesibility (focused element).

  if (activeTagName === "input") return;
  console.log("e.key.toLowerCase()", e.key.toLowerCase());
  switch (e.key.toLowerCase()) {
    case "k":
    case " ":
      if (activeTagName === "button") return; //if is button means that user selected a button with Tab and we do not want to trigger play and pause at every space click
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

      break;
    case "arrowleft":
      video.currentTime -= 5;
      break;
    case "arrowright":
      video.currentTime += 5;
      break;

    case "arrowup":
      if (video.volume > 0.1) {
        video.muted = false; // if volume is greater than 0.1, unmute the video
      }
      video.volume += 0.1;
      break;
    case "arrowdown":
      video.volume -= 0.1;
      if (video.volume < 0.1) {
        video.muted = true; // if volume is less than 0.1, mute the video
      }
      break;

    case "c":
      toggleCaptions();
      break;

    default:
      break;
  }
});

/////////////// EVENT LISTENERS AND INTERACTIONS ///////////////////////////////////

// TIMELINE
let percentage = 0;
timelineContainer.addEventListener("mousemove", (e) => {
  const timelineContainerPosition = timelineContainer.getBoundingClientRect();
  const mouseX = e.clientX - timelineContainerPosition.left;
  const timelineWidth = timelineContainer.offsetWidth;
  percentage = (mouseX / timelineWidth) * 100;

  previewTimelineProgress.style.width = `${percentage}%`;
});

timelineContainer.addEventListener("click", () => {
  video.currentTime = (percentage / 100) * video.duration;
});

// PLAYBACK SPEED
playbackSpeed.addEventListener("click", () => {
  if (video.playbackRate <= 4) {
    video.playbackRate += 1;
    playbackSpeed.textContent = `${video.playbackRate}x`;
  } else {
    video.playbackRate = 1;
    playbackSpeed.textContent = `${video.playbackRate}x`;
  }
});

// SKIP LEFT
skipLeftButton.addEventListener("click", () => {
  video.currentTime -= 5;
});

// SKIP RIGHT
skipRightButton.addEventListener("click", () => {
  video.currentTime += 5;
});

// CAPTIONS
captionsButton.addEventListener("click", toggleCaptions);

function toggleCaptions() {
  if (video.textTracks[0].mode === "hidden") {
    video.textTracks[0].mode = "showing";
    captionsButton.classList.remove("inactive");
  } else {
    video.textTracks[0].mode = "hidden";
    captionsButton.classList.add("inactive");
  }
}

// DURATION
video.addEventListener("loadeddata", () => {
  totalTime.textContent = formatDuration(video.duration);
});

video.addEventListener("timeupdate", () => {
  currentTime.textContent = formatDuration(video.currentTime);
  currentTimeLine.style.width = `${
    (video.currentTime / video.duration) * 100
  }%`;
});

function formatDuration(timeInSec) {
  const dataObj = new Date(timeInSec * 1000); // Convert seconds to milliseconds
  const seconds = dataObj.getUTCSeconds();
  const minutes = dataObj.getUTCMinutes();
  const hours = dataObj.getUTCHours();

  return `${hours}:${minutes}:${seconds}`;
}

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
    // If full screen is opened, close it
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
    // if theater mode is opened, close it
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
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  playPausebutton.classList.add("paused");
  videoContainer.classList.add("paused");
});
