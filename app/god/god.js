app.controller('godCtrl', function($scope,$firebaseAuth,$state,currentAuth ,NgMap ,$firebaseObject,$firebaseArray ,$mdDialog){
        $scope.cls = "";
    $scope.agents = [] ;
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ69lIz-sWh-cypMUZTPMgVcdrNaxi220";
    $scope.lat = 7.961216;
    $scope.lng = 80.727311;
    $scope.zoom = 8 ;
    $scope.disastertype = "All";

    NgMap.getMap().then(function(map) {
        //  console.log(map.getCenter());
        //  console.log('markers', map.markers);
        //  console.log('shapes', map.shapes);
    });

    var ref = firebase.database().ref("agents");
    console.log("Loaded Agents")

    ref.on("value", function (snapshot) {
        $scope.agents = [];
        snapshot.forEach(function (snap) {
            $scope.agents.push(snap.val());
        })

        setTimeout(function(){ $scope.$apply(); });
        $scope.cls = "max";
    })

    var disref = firebase.database().ref("disaster");
    $scope.disasters  = $firebaseArray(disref);

    $scope.setinfo = function (disaster) {
        console.log(disaster);

}

    $scope.showinmap = function (disaster) {
        $scope.lat = disaster.latlng.lat;
        $scope.lng = disaster.latlng.lng;
        $scope.zoom = 15 ;
        $scope.showAdvanced(null,disaster);

    }

    $scope.reset = function () {
        $scope.lat = 7.961216;
        $scope.lng = 80.727311;
        $scope.zoom = 8 ;
        $scope.disastertype = "All";
    }

    $scope.modaldisaster = {};

    $scope.showAdvanced = function(ev,disaster) {
        $scope.modaldisaster = disaster;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'god/godmodel.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            locals : {
                disaster : disaster
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    function DialogController($scope, $mdDialog,disaster) {
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.disaster = disaster;
    }


})