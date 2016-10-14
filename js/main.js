var map ;
var infowindow ;
initMap = function(){
    

    var pyrmont = {lat: 17.3850, lng: 78.4867};

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    for(var i = 0; i < places.length; i++){
            service.getDetails({
                placeId:  places[i].place_id
            }, function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                self.markersArray.push(marker);
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

    this.markersArray = ko.observableArray([]);
    this.removeMarkers = function(){
        for(var i=0; i<self.markersArray().length; i++ ){
            self.markersArray()[i].setMap(null);
        }
    };
    this.query = ko.observable('');

    this.searchResults = ko.computed(function() {
        q = self.query();
        return places.filter(function(i) {
            return i.name.toLowerCase().indexOf(q) >= 0;
        });
    });

    this.viewPlace = function(clickedName){
        self.removeMarkers();
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId:  clickedName.place_id
        },function(place){
            var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
        self.markersArray.push(marker);
        console.log(self.markersArray());
        google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                                place.formatted_address + '</div>');
        infowindow.open(map, this);
        });
        });
    };
      
        
};

ko.applyBindings(viewModel);
