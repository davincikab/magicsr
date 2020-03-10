// Initialize a map object
var data_url = "../data/places.geojson";
var map = L.map('map',{
    center: [11.986744135673385, 79.81807708740236],
    zoom:13,
    maxZoom:25,
    minZoom:9
});

// Add a tilelayers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

osm.addTo(map);

// Load the data Layers
var places  = L.geoJson(null,{
    onEachFeature:function(feature,layer){
        let popupText = "<div class='container-fluid'>"+
            "<div class='card-title'>"+feature.properties['Name NGO']+"</div>"+
            "</div>";
        layer.bindPopup(popupText);
    },
    style:function(feature){
        return {

        }
    }

}).addTo(map);

// read the data using jquery getJSON method
$.getJSON(data_url)
  .done(function(data){
    populateData(data);
    places.addData(data);
  })  
  .fail(function(error){
      console.log("Failed to load the data");
  })

// Add data to the section
function populateData(data){
    let section = [];
    data.features.forEach(function(feature){
        let content = "<section id ='"+ feature.properties.fid+"'>"+
            "<h5>"+feature.properties['Name NGO']+"</h5>"+
            "<p>"+feature.properties.Description+"<p>"+
            ""
        "</section>";
        section.push(content);
    });

    $('#content').append(section);
    $('#1').addClass('active');
}

// Handle Window scroll
let content = document.getElementById('content');

content.onscroll = function(){
    console.log("Scroll");
    var places = [1,2,3,4,5,6,7];
    for (const id of places) {
        if (isElementOnScreen(id)){
            setActivePlace(id);
            break;
        }
    }
    
}

var activePlace = "1";
function setActivePlace(place){
    if (place == activePlace) return;

    places.eachLayer(function(layer){
        if(layer.feature.properties.fid == place){
            map.flyTo(layer.getLatLng(),16);
            layer.openPopup();
        }
    });
    
    document.getElementById(place).setAttribute('class','active');
    document.getElementById(activePlace).setAttribute('class','');

    activePlace = place;
}

function isElementOnScreen(id){
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect( );

    return bounds.top < window.innerHeight && bounds.bottom >0;
}
// Leaflet timslider
getDataAddMarkers = function ({ label, value, map, exclamation }){
    // Updatet the markers
    console.log(label);
}

L.control.timelineSlider({
    timelineItems: ["2009", "2010", "2011", "2015", "2020"],
    changeMap: getDataAddMarkers,
    extraChangeMapParams: { exclamation: "Hello World!" }
}).addTo(map);   