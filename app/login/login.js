app.controller('loginCtrl', function($scope,$firebaseAuth,$state,currentAuth    ){

    if(currentAuth){
        $state.go('home');
    }

    var Auth = $firebaseAuth();
    $scope.loader = false;
        $scope.login =  function (email,password) {
            $scope.loader = true;
            Auth.$signInWithEmailAndPassword(email,password).then(function (res) {
                $scope.loader = false;
                console.log(res);
                var messagesRef = firebase.database().ref("agents").child(res.uid);
                messagesRef.update({
                    status:"online"
                }).then(function () {
                    $state.go("home");
                })




            }).catch(function (err) {
                $scope.loader = false;
                alert(err)
            })
        }


})


