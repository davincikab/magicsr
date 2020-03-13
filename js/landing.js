// Initialize a map object
var data_url = "../data/places.geojson";
var map = L.map('map', {
    center: [11.986744135673385, 79.81807708740236],
    zoom: 13,
    maxZoom: 25,
    minZoom: 9
});

// remove zoom control
map.zoomControl.remove();

// Add a tilelayers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// osm.addTo(map);

var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});

layer.addTo(map);


// Load the data Layers
var places = L.geoJson(null, {
    onEachFeature: function (feature, layer) {
        let popupText = "<div class='container-fluid'>" +
            "<div class='card-title'>" + feature.properties['Name NGO'] + "</div>" +
            "</div>";
        layer.bindPopup(popupText);
        
        layer.on('click', zoomToFeature);
    },
    style: function (feature) {
        return {

        }
    },
    pointToLayer: function (geojsonObj, latlng) {
        let icon = L.divIcon({
            className: 'div-marker',
            html: "<p class='text-warning text-sm bold w-50'>" + geojsonObj.properties['Name NGO'] + "</p>"
        })
        return L.marker(latlng, {
            icon: icon
        });
    }

}).addTo(map);

function zoomToFeature(e){
    var layer = e.target;
    map.flyTo(layer.getLatLng(),16);

    // Scroll to the layer
    var layerId = layer.feature.properties.fid;
    document.getElementById(layerId).scrollIntoView();
    updateActivePlaceClass(layerId);
}
// read the data using jquery getJSON method    
$.getJSON(data_url)
    .done(function (data) {
        populateData(data);
        places.addData(data);
    })
    .fail(function (error) {
        console.log("Failed to load the data");
    })

// Add data to the section
function populateData(data) {
    let section = [];
    data.features.forEach(function (feature) {
        let content = "<section id ='" + feature.properties.fid + "'>" +
            "<h5>" + feature.properties['Name NGO'] + "</h5>" +
            "<p class=''>" + feature.properties.Description.toString().slice(0, 100) +
            // "<img class='d-inline' src='./images/interiors.jpg' height=200 width=300>"+
            feature.properties.Description.toString().slice(100) +
            "<p>" +
            "<img class='' src='./images/markets.jpg' height=200 width=300>" +
            "</section>";
        section.push(content);
    });

    $('#content').append(section);
    $('#1').addClass('active');
}

// Handle Window scroll
let content = document.getElementById('content');

content.onscroll = function () {
    console.log("Scroll");
    var places = [1, 2, 3, 4, 5, 6, 7];
    for (const id of places) {
        if (isElementOnScreen(id)) {
            setActivePlace(id);
            break;
        }
    }

}

var activePlace = "1";
function setActivePlace(place) {
    if (place == activePlace) return;

    places.eachLayer(function (layer) {
        if (layer.feature.properties.fid == place) {
            map.flyTo(layer.getLatLng(), 16);
            layer.openPopup();
        }
    });

    updateActivePlaceClass(place);
}

// Update the active class
function updateActivePlaceClass(place){
    document.getElementById(place).setAttribute('class', 'active');
    document.getElementById(activePlace).setAttribute('class', '');

    activePlace = place;
}

// Determine if the layer is on the Viesw
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();

    return bounds.top < window.innerHeight && bounds.bottom > 0;
}

// Search NGO by Name
var searchNgoControl = new L.Control.Search({
    layer:places,
    position:'topleft',
    propertyName:'Name NGO',
    collapsed:false,
    moveToLocation:function(latlng,title, map){
        console.log(title);

        map.flyTo(latlng, 16); 
    }
});

searchNgoControl.on('search:locationfound', function(e){
    if (e.layer._popup){
         e.layer.openPopup();
    }

}).on('search:collapsed', function (e) {
    e.layer.closePopup();
});

searchNgoControl.addTo(map);

// With JQuery
$("#ex13").slider({
    ticks: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    ticks_labels: ['2011', '2012', '2013', '2014', '2015','2016', '2017','2018','2019','2020'],
    ticks_snap_bounds: 30,
    
}).on('slideStop', function (e) {
    console.log(e.value);
    updatePictures(e.value,);
});

// Upadate the 
function updatePictures(year){

}
