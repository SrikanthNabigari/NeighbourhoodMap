// when google maps api failed to response
var googleError = function(){
    $('.api-error').show();
};

var map ;
var infowindow ;
initMap = function(){
    var pyrmont = {lat: 17.3850, lng: 78.4867};
    // displays the requested map content in map div 
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12
    });
    // displays location information in window when marker clicked
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    // gets the detailed place information by place_id stored in model
    for(var i = 0; i < places.length; i++){
            service.getDetails({
                placeId:  places[i].place_id
            }, function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                                      place.formatted_address + '</div>');
                infowindow.open(map, this);
                });
            }
        });
        };       

};

var viewModel = function(){
    var self = this;
    
    this.query = ko.observable('');
    // filters the places array when searched in a query input
    this.searchResults = ko.computed(function() {
        q = self.query();
        return places.filter(function(i) {
            return i.name.toLowerCase().indexOf(q) >= 0;
        });
    });
    // when name of the location clicked displays infowindow
    this.viewPlace = function(clickedName){
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId:  clickedName.place_id
        },function(place){
            self.marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                                  place.formatted_address + '</div>');
            infowindow.open(map,self.marker);
        });
        
    };
      
        
};

ko.applyBindings(viewModel);
