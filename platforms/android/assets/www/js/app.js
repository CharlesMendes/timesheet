var db = null;
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        
        db = $cordovaSQLite.openDB({ name: "my.db" });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS timesheet (id integer primary key, data text, horaEntrada text, horaSaidaAlmoco text, horaVoltaAlmoco text, horaSaida text)");
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })
    
    .state('app.about', {
        url: "/about",
        views: {
            'menuContent': {
                templateUrl: "templates/about.html"
            }
        }
    })
    
    .state('app.timesheet', {
        url: "/timesheet",
        views: {
            'menuContent': {
                templateUrl: "templates/timesheet.html",
                controller: 'TimesheetCtrl'
            }
        }
    })
  
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/timesheet');
});
