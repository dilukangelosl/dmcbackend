'use strict';



app.controller('View1Ctrl', function($scope, $firebaseObject,$firebaseArray,$mdDialog,NgMap) {

    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ69lIz-sWh-cypMUZTPMgVcdrNaxi220";
  var firstload = true;
$scope.disasters = [];

$scope.disaster = {};


$scope.showdisaster = function (item) {

    $scope.disaster = item;

}



 firebase.database().ref().child('disaster').on('value',function (disastersnap) {


     NgMap.getMap().then(function(map) {
         console.log(map.getCenter());
         console.log('markers', map.markers);
         console.log('shapes', map.shapes);
     });


    if(!firstload){

        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('DISASTER ALERT!!!')
                .textContent('Someone Needs help!!')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')

        );

    }


     $scope.disasters = [];
     angular.forEach(disastersnap.val(),function (item) {
         firebase.database().ref().child('users/'+item.userid).once('value',function (userobject) {
             // console.log(extend({},disastersnap.val(),userobject.val()))
             $scope.disasters.push(extend({},item,userobject.val()));
        console.log(extend({},item,userobject.val()))
             $scope.$apply();
         })
     })

     firstload = false;

 })


    function extend(base) {
        var parts = Array.prototype.slice.call(arguments, 1);
        parts.forEach(function (p) {
            if (p && typeof (p) === 'object') {
                for (var k in p) {
                    if (p.hasOwnProperty(k)) {
                        base[k] = p[k];
                    }
                }
            }
        });
        return base;
    }



});