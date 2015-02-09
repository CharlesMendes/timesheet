var db = null;
var databaseName = 'timesheetDB.db'
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
    
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
        
        //Cria o banco de dados
        //db = $cordovaSQLite.openDB({ name: databaseName }); //Celular
        db = window.openDatabase(databaseName, "1.0", "Timesheet App", 200000);   //Windows
        
        //$cordovaSQLite.execute(db, "TRUNCATE TABLE timesheet");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS timesheet (id integer primary key, data text, horaEntrada text, horaSaidaAlmoco text, horaVoltaAlmoco text, horaSaida text, ultimoApontamento integer)").then(function(result) {
            var message = "Criada tabela timesheet ID -> " + result;
            console.log(message);
        
        }, function (exception) {
            console.error(exception);
        });
        
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS settings (id integer primary key, key text, value text)").then(function(result) {
            var message = "Criada tabela settings ID -> " + result;
            console.log(message);
        
        }, function (exception) {
            console.error(exception);
        });
        
        /*
        var query = "INSERT INTO settings (key, value) VALUES (?, ?)";
        $cordovaSQLite.execute(db, query, ["IDIOMA", "pt-br"]).then(function(res) {
            console.log("insertId IDIOMA: " + res.insertId);
        }, function (exception) {
            console.error(exception);
        });*/
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppController'
    })
    
    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "templates/settings.html",
                controller: 'SettingsController'
            }
        }
    })
    
    .state('app.timesheet', {
        url: "/timesheet",
        views: {
            'menuContent': {
                templateUrl: "templates/timesheet.html",
                controller: 'TimesheetController'
            }
        }
    })
  
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/timesheet');
});
