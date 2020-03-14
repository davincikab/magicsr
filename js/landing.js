// Initialize a map object
var data_url = "../data/places.geojson";
var imageContainer = $('#images');
var yearSlider = $("#ex13").slider({
    ticks: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    ticks_labels: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    ticks_snap_bounds: 30,

});
var currentPlace = 'Upasana';

var map = L.map('map', {
    center: [11.986744135673385, 79.81807708740236],
    zoom: 13,
    maxZoom: 25,
    minZoom: 9
});

// Image url for various 
var imagesUrl = [{
    "Upasana":{
        "2011": ["Ecofemme_blog entry_building.jpg", "cleanings.jpg", "codes.jpg", "markets.jpg", "cleanings.jpg", "codes.jpg", 
                 "markets.jpg", "cleanings.jpg", "codes.jpg", "markets.jpg"],
        "2012": ["codes.jpg","markets.jpg"],
        "2013":[],
        "2014":[]
    },
},{
    "WasteLess":{
        "2011": [],
        "2012": [],
        "2013": ["Mohanam Village Heritage Center_2019-20_children playing AUP student.jpg"],
        "2014": ["Ecofemme_blog entry_building.jpg"],
        "2019": ["Wasteless_2019-20_wasteless team AUP students.jpg"]
    }
},{
        "Auroville Consulting": {
            "2011": ["markets.jpg",'codes.jpg'],
            "2012": [], 
            "2013": ["Mohanam Village Heritage Center_2019-20_children playing AUP student.jpg"],
            "2014": ["Ecofemme_blog entry_building.jpg"],
            "2019": ["Wasteless_2019-20_wasteless team AUP students.jpg"]
        }
    }
];


// remove zoom control
map.zoomControl.remove();

// Add a tilelayers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// osm.addTo(map);

var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
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
            // icon: icon
        });
    }

}).addTo(map);

// Zoom to the feature
function zoomToFeature(e){
    var layer = e.target;
    map.flyTo(layer.getLatLng(),16);

    // Scroll to the layer
    currentPlace = layer.feature.properties['Name NGO'];
    updatePictures(2011, currentPlace);
    scrollToPlaceDescription(layer.feature.properties.fid);
    
}

function scrollToPlaceDescription(placeId){
    document.getElementById(placeId).scrollIntoView();
    updateActivePlaceClass(placeId);
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
            "<p class=''>" + feature.properties.Description.toString() +
            "<p>" +
            // "<img class='' src='./images/markets.jpg' height=200 width=300>" +
            "</section>";
        section.push(content);
    });

    $('#content').append(section);
    $('#1').addClass('active');
}

// Handle content scroll event
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

// Active place data
var activePlace = "1";
function setActivePlace(place) {
    if (place == activePlace) return;

    // Flyto the map oobject
    places.eachLayer(function (layer) {
        if (layer.feature.properties.fid == place) {
            map.flyTo(layer.getLatLng(), 16);
            layer.openPopup();

            currentPlace = layer.feature.properties['Name NGO']
            updatePictures(2011, currentPlace);
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

// Sear found event handler
searchNgoControl.on('search:locationfound', function(e){
    // Upadate the current place name
    currentPlace = e.layer.feature.properties['Name NGO'];

    // Open popup
    if (e.layer._popup){
         e.layer.openPopup();
    }

    // Scroll to the layer description 
    scrollToPlaceDescription(e.layer.feature.properties.fid);
    updatePictures(2011, currentPlace);
}).on('search:collapsed', function (e) {
    e.layer.closePopup();
});

searchNgoControl.addTo(map);

// Year Slider Event Listener
yearSlider.on('slideStop', function (e) {
    console.log(e.value);
    updatePictures(e.value,currentPlace);
});

// Upadate the images per year according to the 
function updatePictures(year, place){
    console.log(year, currentPlace, place);
    // Get images for current year and place
    var activePlaceImages = imagesUrl.find(image => {
        return image[place];
    });

    console.log(activePlaceImages);
    activePlaceImages = activePlaceImages[place]?activePlaceImages[place][year]:[];

    // Create image carousel
    var imagesOne = [];
    var imagesTwo = [];
    var imagesThree = [];
    activePlaceImages.forEach(function(image, i){
        if (i >= 0 && i < 4){
            imagesOne.push(
                "<div class='col-md-3'><img src='./images/image/" + image + "' alt='" + place + "' class='img-responsive ml-2 mb-1'></div>"
            );
        } else if (i >= 4 && i < 8){
            imagesTwo.push(
                "<div class='col-md-3'><img src='./images/image/" + image + "' alt='" + place + "' class='img-responsive ml-2 mb-1' ></div>"
            );
        }else{
            imagesThree.push(
                "<div class='col-md-3'><img src='./images/image/" + image + "' alt='" + place + "' class='img-responsive ml-2 mb-1'></div>"
            );
        }
        
    });

    $('#item_one').empty();
    $('#item_two').empty();
    $('#item_three').empty();
    
    $('#item_one').append(imagesOne);
    $('#item_two').append(imagesTwo);
    $('#item_three').append(imagesThree);

   
    // Append the images to the images view
    console.log(activePlaceImages);
}

updatePictures(2011, currentPlace);

// Carousel Modal
