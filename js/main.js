// Initialize a map object
var map = L.map('map',{
    center:[],
    zoom:8,
    maxZoom:25,
    minZoom:13
});

// Add a tilelayers
var osm = L.tileLayer('',{});
osm.addTo(map);

// Load the data Layers
