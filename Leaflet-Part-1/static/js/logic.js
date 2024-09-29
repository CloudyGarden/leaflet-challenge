// Create the map
var map = L.map('map').setView([0, 0], 2); 

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

/// Fetch the GeoJSON data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
    // Create a function to determine marker size based on magnitude
    function markerSize(magnitude) {
        return magnitude * 2; 
    }

    // Create a function to determine marker color based on depth
    function getColor(depth) {
        return depth > 100 ? '#FF0000' : 
               depth > 50  ? '#FF7F00' : 
               depth > 20  ? '#FFFF00' : 
               depth > 0   ? '#7FFF00' : 
               '#00FF00';               
    }

    // Create a GeoJSON layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 2, 
                fillColor: getColor(feature.geometry.coordinates[2]), 
                color: "#000", 
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km");
        }
    }).addTo(map);

    // Create a legend
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<strong>Depth (km)</strong><br>';
    div.innerHTML += '<i style="background: #FF0000"></i> > 100<br>';  
    div.innerHTML += '<i style="background: #FF7F00"></i> 50 - 100<br>'; 
    div.innerHTML += '<i style="background: #FFFF00"></i> 20 - 50<br>'; 
    div.innerHTML += '<i style="background: #7FFF00"></i> 0 - 20<br>';   
    div.innerHTML += '<i style="background: #00FF00"></i> < 0<br>';  
    
    return div;
};

legend.addTo(map);
});