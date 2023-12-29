AFRAME.registerComponent("log-coordinates", {
  init: function () {
    this.gpsEl = document.querySelector("[gps-new-camera]");

    if (this.gpsEl) {
      this.gpsEl.addEventListener(
        "gps-camera-update-position",
        this.onGpsUpdate
      );
    }

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
    this.gpsEl.removeEventListener(
      "gps-camera-update-position",
      this.onGpsUpdate
    );

    navigator.geolocation.clearWatch();
  },
  onGpsUpdate: function (e) {
    console.log(
      `ar.js Coordinates\nLatitude: ${e.detail.position.latitude}, Longitude: ${e.detail.position.longitude}`
    );
  },
  showError: function (error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  },
});

AFRAME.registerComponent("click-detector", {
  init: function () {
    this.currentMarker = null;

    this.handleMarkerFound = this.handleMarkerFound.bind(this);
    this.handleMarkerLost = this.handleMarkerLost.bind(this);
    this.handleTap = this.handleTap.bind(this);

    this.el.addEventListener("markerFound", this.handleMarkerFound);
    this.el.addEventListener("markerLost", this.handleMarkerLost);
    this.el.addEventListener("click", this.handleTap);
  },
  remove: function () {
    this.el.removeEventListener("markerFound", this.handleMarkerFound);
    this.el.removeEventListener("markerLost", this.handleMarkerLost);
    this.el.removeEventListener("click", this.handleTap);
  },
  handleMarkerFound: function (e) {
    this.currentMarker = e.target;
  },
  handleMarkerLost: function () {
    this.currentMarker = null;
  },
  handleTap: function () {
    if (this.currentMarker) {
      const link = this.currentMarker.getAttribute("clickable");

      if (link) {
        window.open(link, "_blank");
      }
    }
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("fullScreenButton");
  const navBar = document.getElementById("navBar");
  const fullScreenElement = document.documentElement;

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
});
