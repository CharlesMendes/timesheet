angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };
    
    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };
    
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('TimesheetCtrl', function($scope) {
    $scope.timesheet = ListarApontamentos();
});

function ListarApontamentos() {
    var lista = [
        { data: '01/01/2015', horaEntrada: '10:00', horaSaidaAlmoco: '12:30', horaVoltaAlmoco: '13:30', horaSaida: '19:00' },
        { data: '02/01/2015', horaEntrada: '10:00', horaSaidaAlmoco: '12:30', horaVoltaAlmoco: '13:30', horaSaida: '19:00' },
        { data: '03/01/2015', horaEntrada: '10:00', horaSaidaAlmoco: '12:30', horaVoltaAlmoco: '13:30', horaSaida: '19:00' },
        { data: '04/01/2015', horaEntrada: '10:00', horaSaidaAlmoco: '12:30', horaVoltaAlmoco: '13:30', horaSaida: '19:00' },
        { data: '05/01/2015', horaEntrada: '10:00', horaSaidaAlmoco: '12:30', horaVoltaAlmoco: '13:30', horaSaida: '19:00' },
        { data: '08/01/2015', horaEntrada: '10:00', horaSaidaAlmoco: '12:30', horaVoltaAlmoco: '', horaSaida: '' }
    ];
    
    return lista;
}

function MarcarHorario() {
    alert('novo horario Pedãooooo');
}
