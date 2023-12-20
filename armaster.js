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
