// when google maps api gets failed
var googleError = function(){
    self.error_message('Failed to load GougleMaps Api');
    self.apiError(true);
};
// when google maps api gets failed
var FourSquareError = function(){
    self.error_message('Failed to load Foursquare Api');
    self.apiError(true);
};

var map ;
var infowindow ;
this.marker;
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
        if(self.marker){
            self.markersArray().push(self.marker);        
            google.maps.event.addListener(self.marker, 'click', function() {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                place.formatted_address + '</div>');
                infowindow.open(map, this);
                self.des_name(null);
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
var open_infowindow = function(place,marker){
    self.markersArray().push(marker); 
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                place.formatted_address + '</div>');
                infowindow.open(map, marker);
    google.maps.event.addListener(self.marker, 'click', function() {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                place.formatted_address + '</div>');
                infowindow.open(map, this);
                self.des_name(null);
            });
            
};   

// Gets the location data from Foursquare
var locationData = function(place){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var today = ""+yyyy+mm+dd+"";

    var venue_id = place.venue_id;
    var client_id = "BWUSFIWLOPWY0F3RPSBEER3Y5AVNORL4SJ5UUH2LG2RLUSIH";
    var client_secret = "0DFTYZIDWMTDRMGHMSXZ1RZL12IEMDBGWVSAA0XNJ0K1R3AV";
    var FoursquareUrl = "https://api.foursquare.com/v2/venues/"+venue_id+"?client_id="+client_id+"&client_secret="+client_secret+"&v="+today+"" ;
    
    $.ajax({
        url:FoursquareUrl,
        dataType:"json",
        async:true        
    }).success(function(data){
            self.des_name(data.response.venue.name);
            self.rating(data.response.venue.rating);
            var image_prefix = data.response.venue.bestPhoto.prefix;
            var image_suffix = data.response.venue.bestPhoto.suffix;
            self.location_image(image_prefix +"320x200"+ image_suffix);
            if(data.response.venue.tips.groups[0].items[0].text){
                self.review(data.response.venue.tips.groups[0].items[0].text);
            }   
    }).error(function(data){
        FourSquareError();
    })
    
};





var viewModel = function(){
    var self = this;
    this.markersArray = ko.observableArray([]);    
    this.query = ko.observable('');
    this.location_image = ko.observable();
    this.des_name = ko.observable();
    this.rating = ko.observable();
    this.review = ko.observable();
    this.apiError = ko.observable(false);
    this.error_message = ko.observable();
    // filters the places array when searched in a query input
    this.searchResults = ko.computed(function() {
        q = self.query();
        if(!q){
            showMarkers();
            return places;
        }
        else{
            removeMarkers();
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
        locationData(clickedName);
        service.getDetails({
            placeId:  clickedName.place_id
        },function(place){
            self.marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            open_infowindow(place,self.marker);
            
        });
    };
};     
    
    
ko.applyBindings(viewModel);  
