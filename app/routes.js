app.config(function($stateProvider) {
    var helloState = {
        name: 'home',
        url: '/home',
        templateUrl: 'view1/view1.html',
        controller:'View1Ctrl'
    }

    var aboutState = {
        name: 'sos',
        url: '/sos',
        templateUrl: 'view2/view2.html',
        controller:'View2Ctrl'
    }

    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
});