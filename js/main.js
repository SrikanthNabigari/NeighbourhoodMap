// when google maps api gets failed
var googleError = function(){
    viewModel.self.apiError = true;
};


var map ;
var infowindow ;
var marker;
initMap = function(){
    var pyrmont = {lat: 17.3850, lng: 78.4867};
    // displays the requested map content in map div 
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12
    });
    // displays location information in window when marker clicked
    infowindow = new google.maps.InfoWindow();
              
    for(var i=0; i<places.length; i++){
        AddMarker(places[i]);
    };
  
};
// Adds the marker by getting place location details
var AddMarker = function(place){
    removeMarkers();
    var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId:  place.place_id
        },function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            }
        if(marker){
            self.markersArray().push(marker);        
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                                       place.formatted_address + '</div>');
                infowindow.open(map, this);
            }); 
        }   
    });
};
// removes all the markers
var removeMarkers = function(){
    for(var i=0; i<self.markersArray().length; i++ ){
        self.markersArray()[i].setMap(null);
    }
};
// shows all the markers    
var showMarkers = function(){
    for(var i=0; i<self.markersArray().length; i++ ){
        self.markersArray()[i].setMap(map);
    }
};         

var viewModel = function(){
    var self = this;
    this.markersArray = ko.observableArray([]);    
    this.query = ko.observable('');
    // filters the places array when searched in a query input
    this.searchResults = ko.computed(function() {
        q = self.query();
        if(!q){
            showMarkers();
            return places;
        }
        else{
            return ko.utils.arrayFilter(places, function(place) {
                if(place.name.toLowerCase().indexOf(q) >= 0) {
                    AddMarker(place);
                    return place;
                }    
            });
        }
    });

    // when name of the location clicked displays infowindow
    this.viewPlace = function(clickedName){
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId:  clickedName.place_id
        },function(place){
            marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            if(marker){
            self.markersArray().push(marker);        
            }
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                                  place.formatted_address + '</div>');
            infowindow.open(map, marker);
        });
        
    };
      
        
};    

ko.applyBindings(viewModel);
