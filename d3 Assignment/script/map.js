//Add a map area with zoom button
//Add map tiles with navigation button to control them
//Add markers on my maps with interactivity
//Add a slider to change the number of Markers
//Add button to change the position of the markers


//Function that will consume the  Feed and add markers to the map
function addMarkers(num, map){
  let numTowns = `http://34.38.72.236/Circles/Towns/${num}`;

  //Use JSON to read the feed
    d3.json(numTowns, function(error, data){
      if (error) {
        console.error(error);
      }
      else {
        let townsData = data.map(function(town){
          return [town.lat, town.lng, town.Town, town.Population, town.County];
        });

        //Use markers to represent each town
        townsData.forEach(function(data){
          let marker = L.marker([data[0], data[1]]).addTo(map);
          marker.bindPopup(`Town: ${data[2]}<br> Population: ${data[3]}<br> County: ${data[4]}`);

          // Add the hover in effect
          marker.on('mouseover', function() {
            this.openPopup();
          });

          // Add the hover out effect
          marker.on('mouseout', function() {
            this.closePopup();
          });
        });
      }
    });
}

//Function to control number of towns on the map
function controlSlider(map){
  let range = d3.select("#range");
  let waitTime;

  //Handles the change in number of towns
  range.on("input", function(){
    let rangeValue = d3.select("#rangeValue");
    rangeValue.style("left", this.value / 5.35 + "%");
    rangeValue.text(this.value);

    let newNum = this.value;

    //Remove any scheduled waiting period
    clearTimeout(waitTime);

    //Set a waiting period after using the slider to add markers
    waitTime = setTimeout(function() {
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      addMarkers(newNum, map);
    }, 200);
  });
}

//Function to reload markers of same number of towns
function reloadMarkers(map){
  let reload = d3.select(".Reload");

  //Handles the reloading of the markers
  reload.on("click", function(){
    let range = d3.select("#range");
    let reloadNum = range.node().value;

    //remove existing marker
    map.eachLayer(function(layer){
      if (layer instanceof L.Marker){
        map.removeLayer(layer);
      }
    });
    return addMarkers(reloadNum, map);
  });
}

//Function for adding multiple maptiles and their control
function controlMapTile(map){

  //Function for adding map tiles
  function addMapTile(url){
    return L.tileLayer(url, {
      maxZoom: 19,
      minZoom: 5.5,
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  }

  //Add the multiple map tiles
  let night = addMapTile('https://api.maptiler.com/maps/uk-openzoomstack-night/{z}/{x}/{y}.png?key=NTh2cn8lpdAq4rhgWNbN');
  let light = addMapTile('https://api.maptiler.com/maps/uk-openzoomstack-light/{z}/{x}/{y}.png?key=NTh2cn8lpdAq4rhgWNbN');
  let outdoor = addMapTile('https://api.maptiler.com/maps/uk-openzoomstack-outdoor/{z}/{x}/{y}.png?key=NTh2cn8lpdAq4rhgWNbN');
  let road = addMapTile('https://api.maptiler.com/maps/uk-openzoomstack-road/{z}/{x}/{y}.png?key=NTh2cn8lpdAq4rhgWNbN');


  let maptiles = {
    "light": light,
    "night": night,
    "outdoor": outdoor,
    "road": road
  };

  //Select a default MapTile
  light.addTo(map);

  //Add control for the map tiles
  return L.control.layers(maptiles).addTo(map);
}

//Function for drawing UK map
function drawUKMap(){

  //Define the map area
  let map = L.map('map',{
    center: [55, -4],
    zoom: 6
  });

  //Add the multiple map tiles and their control
  controlMapTile(map);

  //Call up an initial number of 50 towns and add to the map using markers
  addMarkers(50, map);

  //Add slider to control number of towns
  controlSlider(map);

  //Add reload to produce another set of towns
  reloadMarkers(map);
}

window.onload = drawUKMap;
