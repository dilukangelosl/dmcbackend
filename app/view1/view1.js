'use strict';



app.controller('View1Ctrl', function($scope, $firebaseObject,$firebaseArray,$mdDialog,NgMap,Lightbox,$state,currentAuth, $firebaseAuth) {
   var userid = currentAuth.uid;
    var Auth = $firebaseAuth();

    var userref = firebase.database().ref("agents").child(userid);
    $scope.user = $firebaseObject(userref);
    $scope.user.$loaded().then(function (res) {
       if(res.name == null){
           alert("You dont have Permission");
           Auth.$signOut().then(function () {
               $state.go('login')
           })

       }
       $scope.name = res.name;
    })

    $scope.logout =  function () {
        var messagesRef = firebase.database().ref("agents").child(currentAuth.uid);
        messagesRef.update({
            status:"offline"
        }).then(function () {
            Auth.$signOut().then(function () {

                $state.go('login');
            })
        })


    }

    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ69lIz-sWh-cypMUZTPMgVcdrNaxi220";
  var firstload = true;
$scope.disasters = [];
$scope.currentNavItem = 'home';
$scope.disaster = {};
$scope.pending = 0 ;
$scope.closed = 0 ;


$scope.mute = false;


$scope.muteaudio = function () {

    $scope.mute =  !$scope.mute;
}

    $scope.openLightboxModal = function () {

        $scope.images = [
            {
                'url': $scope.disaster.photo,
                'caption': 'Disaster Image',
                'thumbUrl': $scope.disaster.photo // used only for this example
            }];

        Lightbox.openModal($scope.images, 0);
      //  console.log($scope.images[0]);
    };


 firebase.database().ref().child('disaster').orderByChild("agent").equalTo(currentAuth.uid).on('value',function (disastersnap) {

     console.log(disastersnap.val());


     $scope.pending = 0 ;
     $scope.closed = 0 ;

    NgMap.getMap().then(function(map) {
       //  console.log(map.getCenter());
       //  console.log('markers', map.markers);
       //  console.log('shapes', map.shapes);
     });


    if(!firstload){
        if(!$scope.mute){
            var audio = new Audio('view1/sound.mp3');
            audio.play();
        }
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('DISASTER ALERT!!!')
                .textContent('Someone Needs help!!')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')

        ).finally(function () {
            audio.pause();
            audio.currentTime = 0;
            $scope.disaster =  $scope.disasters[0];
        })




    }


     $scope.disasters = [];

     Object.keys(disastersnap.val()).forEach(function(key,index) {

        // console.log(key)
         var foundobj = disastersnap.val()[key] ;
         foundobj["$id"] = "";
         foundobj["$id"] = key ;

         if(foundobj["status"] == "Pending"){
             $scope.pending++;
         }else if (foundobj["status"] == "Closed"){
             $scope.closed++;
         }

         firebase.database().ref().child('users/'+foundobj.userid).once('value',function (userobject) {
             // console.log(extend({},disastersnap.val(),userobject.val()))

             $scope.disasters.push(extend({},foundobj,userobject.val()));
             // console.log(extend({},item,userobject.val()))
             $scope.$apply();
         })
     })



     /*
     for(key in disastersnap.val()){
         var foundobj = disastersnap.val()[key] ;
         foundobj["$id"] = key ;
         if(foundobj["status"] == "Pending"){
             $scope.pending++;
         }else if (foundobj["status"] == "Closed"){
             $scope.closed++;
         }
         firebase.database().ref().child('users/'+foundobj.userid).once('value',function (userobject) {
             // console.log(extend({},disastersnap.val(),userobject.val()))

             $scope.disasters.push(extend({},foundobj,userobject.val()));
             // console.log(extend({},item,userobject.val()))
             $scope.$apply();
         })

     }
     */


     firstload = false;

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


    $scope.showdisaster = function (item) {

       // $scope.disaster["photo"] = null;
        $scope.disaster = item;
        setTimeout(function(){ $scope.$apply(); });

    }


    $scope.viewissue = function (id) {

        var ref = firebase.database().ref().child("disaster/"+id);

        var obj = new $firebaseObject(ref);
        obj.$loaded().then(function(res) {

            res["statusdetails"] = "Viewing Issue";
            firstload = true;
           res.$save();
        });
    }

    $scope.closeissue =  function (id, meessage) {
        var ref = firebase.database().ref().child("disaster/"+id);

        var obj = new $firebaseObject(ref);
        obj.$loaded().then(function(res) {
            var d = new Date().toLocaleString();
            res["status"] = "Closed";
            res["responseMessage"] = meessage;
            res["statusdetails"] = "Closed on " + d;
            firstload = true;
            //console.log(res);
            res.$save();

            var ref = firebase.database().ref("agents");
            var agentregf = ref.child(res.agent);

            agentregf.once('value',function (r) {
                var work = r.val().work;
                work =  work - 1;
                agentregf.update({
                    work:work
                }).then(function (res) {
                    console.log("agent Updated");
                })
            })

        });
    }


    $scope.goto = function (name) {

        $state.go(name);
    }



});