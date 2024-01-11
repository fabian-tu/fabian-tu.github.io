const button = document.getElementById("fullScreenButton");
const navBar = document.getElementById("navBar");
const fullScreenElement = document.documentElement;
const mainElement = document.getElementById("main");

const OUTDOOR = "OUTDOOR";
const INDOOR = "INDOOR";
let mode;

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert(
        "User denied the request for Geolocation. Application won't work properly."
      );
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    if (position.coords.accuracy <= 10 && mode != OUTDOOR) {
      mode = OUTDOOR;
      switchMode(mode);
    } else if (mode != INDOOR) {
      mode = INDOOR;
      switchMode(mode);
    }
  }, showError);
} else {
  alert("Geolocation API is not supported by this browser.");
}

// Functions to handle Fullscreen
function openFullscreen() {
  if (fullScreenElement.requestFullscreen) {
    fullScreenElement.requestFullscreen();
  } else if (fullScreenElement.webkitRequestFullscreen) {
    /* Safari */
    fullScreenElement.webkitRequestFullscreen();
  } else if (fullScreenElement.msRequestFullscreen) {
    /* IE11 */
    fullScreenElement.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function fullscreenEnabled() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
}

function handleFullscreenChange() {
  fullscreenEnabled()
    ? (navBar.style.display = "none")
    : (navBar.style.display = "block");
}

if (button) {
  button.addEventListener("click", () => {
    fullscreenEnabled() ? closeFullscreen() : openFullscreen();
  });
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("msfullscreenchange", handleFullscreenChange);

// Function to switch between indoors and outdoors
function switchMode(mode) {
  const arDoc = mode == INDOOR ? "marker_part.html" : "location_part.html";

  fetch(arDoc)
    .then((response) => response.text())
    .then((html) => {
      mainElement.innerHTML = html;
      const video = document.querySelector("video");

      video && video.remove();
    });
}

// register AFRAME component that logs coordinates for debugging
AFRAME.registerComponent("log-coordinates", {
  init: function () {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        console.log(
          `Geolocation API Coordinates\nLatitude: ${position.coords.latitude}, Longitutde: ${position.coords.longitude}`
        );
        console.log(`Geolocation API Accuracy: ${position.coords.accuracy}`);
      }, this.showError);
    } else {
      console.log("Geolocation API is not supported by this browser.");
    }
  },
  remove: function () {
    navigator.geolocation.clearWatch();
  },
});

// registering an AFRAME component for handling clicks on AR elements
AFRAME.registerComponent("click-detector", {
  init: function () {
    this.currentMarker = null;
    this.lock = false;

    this.handleMarkerFound = this.handleMarkerFound.bind(this);
    this.handleMarkerLost = this.handleMarkerLost.bind(this);
    this.handleTap = this.handleTap.bind(this);

    this.el.addEventListener("markerFound", this.handleMarkerFound);
    this.el.addEventListener("markerLost", this.handleMarkerLost);
    this.el.addEventListener("click", this.handleTap);
    this.el.addEventListener("touchstart", this.handleTap);
  },
  remove: function () {
    this.el.removeEventListener("markerFound", this.handleMarkerFound);
    this.el.removeEventListener("markerLost", this.handleMarkerLost);
    this.el.removeEventListener("click", this.handleTap);
  },
  handleMarkerFound: function (e) {
    this.currentMarker = e.target;
    console.log("Marker found!!!");
  },
  handleMarkerLost: function () {
    this.currentMarker = null;
  },
  handleTap: function (e) {
    const link = this.currentMarker
      ? this.currentMarker.getAttribute("clickable")
      : e.target.getAttribute("clickable");
    link && window.open(link, "_blank");
  },
});
