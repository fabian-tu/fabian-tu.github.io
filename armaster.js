document.addEventListener("DOMContentLoaded", () => {
  let currentMarker = null;
  const sceneEl = document.getElementById("sceneEl");

  const trexText = "This is a Trex!";
  const magnemiteText = "This is the Pokemon Magnemite!";

  // Log current location
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      console.log(
        "Latitude: " +
          position.coords.latitude +
          ", Longitutde: " +
          position.coords.longitude
      );
    }, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  function showError(error) {
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
  }

  // Handle clicks on AR Elements
  sceneEl.addEventListener("click", handleTap);

  sceneEl.addEventListener("markerFound", (e) => {
    currentMarker = e.target.id;
  });

  sceneEl.addEventListener("markerLost", (e) => {
    currentMarker = null;
  });

  function handleTap() {
    if (currentMarker) {
      console.log(`${currentMarker}, clicked!`);
      window.open("https://de.wikipedia.org/wiki/Tyrannosaurus", "_blank");
    }
  }
});
