// for ui-router

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth();
    }
]);

app.run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        console.log("state changed");
        if (error === "AUTH_REQUIRED") {
            $state.go("login");
        }
    });
}]);



app.config(["$stateProvider", function ($stateProvider) {
    $stateProvider
        .state("login", {
            url:'/login',
            controller: "loginCtrl",
            templateUrl: "login/login.html",
            resolve: {
                // controller will not be loaded until $waitForSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForSignIn returns a promise so the resolve waits for it to complete
                    return Auth.$waitForSignIn();
                }]
            }
        })
        .state("signup", {
            url:'/signup',
            controller: "signupCtrl",
            templateUrl: "signup/signup.html",
            resolve: {
                // controller will not be loaded until $waitForSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForSignIn returns a promise so the resolve waits for it to complete
                    return Auth.$waitForSignIn();
                }]
            }
        })

        .state("god", {
            url:'/god',
            controller: "godCtrl",
            templateUrl: "god/god.html",
            resolve: {
                // controller will not be loaded until $waitForSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForSignIn returns a promise so the resolve waits for it to complete
                    return Auth.$requireSignIn();
                }]
            }
        })

        .state("home", {
            url:'/home',
            controller: "View1Ctrl",
            templateUrl: "view1/view1.html",
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireSignIn();
                }]
            }
        });
}]);