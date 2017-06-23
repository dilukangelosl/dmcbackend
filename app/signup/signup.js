app.controller('signupCtrl', function($scope,$firebaseAuth,$state, currentAuth){


    if(currentAuth){
        $state.go('home');
    }

$scope.loader= false;
    var Auth = $firebaseAuth();

    $scope.signup =  function (email,password,repass,name) {

        $scope.loader= true;


       if(password === repass){
           // Create a new user
           Auth.$createUserWithEmailAndPassword(email ,password)
               .then(function(firebaseUser) {
                   $scope.message = "User created with uid: " + firebaseUser.uid;
                   var messagesRef = firebase.database().ref("agents").child(firebaseUser.uid);
                   messagesRef.set({
                       name:name,
                       status:"online",
                       work:0,
                       uid:firebaseUser.uid
                   })
                   $scope.loader= false;
                   $state.go('home');
               }).catch(function(error) {
               alert(error);
               $scope.loader= false;
           });
       }
       else{
           alert("Passwords Do Not Match");
           $scope.loader= false;
       }
    };


})