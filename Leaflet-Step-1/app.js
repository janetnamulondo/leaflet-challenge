// Function to determine marker size based on Earthquake magnitude 
function markerSize(mag) {
  return mag;
}

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features)
  console.log(data);

  // Function to determine marker size based on Earthquake magnitude 
  function markerSize(mag) {
    return mag*5;
  }
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<b>Magnitude</b>: " + feature.properties.mag);
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Define arrays to hold created city and state markers
var EarthQuakeMarkers = [];

// Loop through locations and create city and state markers
for (var i = 0; i < features.length; i++) {
  // Setting the marker radius for the Earthquake by passing magnitude into the markerSize function
  EarthQuakeMarkers.push(
    L.circle(features[i].geometry.coordinates, {
      stroke: false,
      fillOpacity: 0.75,
      color: "white",
      fillColor: "white",
      radius: markerSize(features[i].properties.mag)  
    })
  );
}
//Create legend for the Earthquake Magnitude 
function markerColor(mag) {
  return mag > 5 ? '#ff0000' :
      mag > 4 ? '#ff6600' :
          mag > 3 ? '#ffBB00' :
              mag > 2 ? '#ffff00' :
                  mag > 1 ? '#66ff00' :
                  '#00FF00' ;   

}
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(streetmap, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
