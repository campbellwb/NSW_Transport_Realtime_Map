﻿var markers = [];

function init_map() {

    var var_location = new google.maps.LatLng(-33.8688, 151.2093);

    var var_mapoptions = {
        center: var_location,
        zoom: 12
    };

    var map = new google.maps.Map(document.getElementById("map-container"),
        var_mapoptions);

    collect_vehicle_data(map);

}

function collect_vehicle_data(map) {

    $.get("/home/updateTrains", function (data, status) {
        update_map(map, data);
    });
}

function update_map(map, data) {

    vehicles = data["vehicles"];

    for (i = 0; i < vehicles.length; i++) {

        var vehicle_location = new google.maps.LatLng(vehicles[i].latitude, vehicles[i].longitude);

        var label = vehicles[i].label;

        var vehicle_updated = false;

        if (!markers[i]) {
            var marker = new google.maps.Marker({
                position: vehicle_location,
                map: map,
                title: label
            });
        } else {
            marker = markers[i];
            if (vehicle_location != marker.position) {
                vehicle_updated = true;
                marker.position = vehicle_location;
            }
        }

        var contentString = '<p id="firstHeading" class="firstHeading">' + vehicles[i].label + '</p>'

        marker.info = new google.maps.InfoWindow({
            content: contentString
        });

        google.maps.event.addListener(marker, 'click', function () {
            var marker_map = this.getMap();
            this.info.open(marker_map, this);
        });
        if (vehicle_updated) {
            marker.setMap(map);
        }

        if (markers.indexOf(marker) == -1) {
            markers.push(marker);
        }

    }
    // Update positions in 1.5 seconds (1500 miliseconds)
    setTimeout(collect_vehicle_data, 1500, map);
}

google.maps.event.addDomListener(window, 'load', init_map);

// Initialize maps
google.maps.event.addDomListener(window, 'load', regular_map);