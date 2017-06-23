'use strict';


app.controller('View2Ctrl', function($scope, $state,Lightbox,currentAuth) {
    $scope.disasters = [];
    $scope.currentNavItem = 'stats';


    //stats
    $scope.totalclosed = 0 ;
    $scope.todayclosed = 0 ;
    $scope.todaydisasters = 0 ;
    $scope.totaldisasters = 0;
    $scope.todaypending = 0 ;
    $scope.totalpending = 0;



    $scope.goto = function (name) {

        $state.go(name);
    }


    $scope.selected = [];

    $scope.query = {
        order: 'Date',
        limit: 5,
        page: 1
    };


    $scope.view = function (photourl) {

        $scope.images = [
            {
                'url': photourl,
                'caption': 'Disaster Image',
                'thumbUrl': photourl // used only for this example
            }];

        Lightbox.openModal($scope.images, 0);
        console.log($scope.images[0]);
    };



    firebase.database().ref().child('disaster').on('value',function (disastersnap) {


        $scope.pending = 0 ;
        $scope.closed = 0 ;






        $scope.disasters = [];

        Object.keys(disastersnap.val()).forEach(function(key,index) {

            console.log(key)
            var foundobj = disastersnap.val()[key] ;
            foundobj["$id"] = key ;

            if(foundobj["status"] == "Pending"){
                $scope.pending++;
            }else if (foundobj["status"] == "Closed"){
                $scope.totalclosed++;
                // Get today's date
                var todaysDate = new Date();

                // Create date from input value
                var inputDate = new Date(foundobj["closeddate"]);

                if(inputDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
                   $scope.todayclosed++;
                }
            }

            firebase.database().ref().child('users/'+foundobj.userid).once('value',function (userobject) {
                // console.log(extend({},disastersnap.val(),userobject.val()))

                $scope.disasters.push(extend({},foundobj,userobject.val()));
                // console.log(extend({},item,userobject.val()))
                $scope.$apply();
            })
        })



    });












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