var idiomaSelecionado = "pt-br";

angular.module('starter.controllers', [])

.controller('AppController', function($scope, $ionicModal, $timeout) {

    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/about.html', {
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
        
        //Altera o idioma do app
        ChangeLanguage(idiomaSelecionado);
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
    
    //Altera o idioma do app
    ChangeLanguage(idiomaSelecionado);
})

.controller('TimesheetController', function($scope, $ionicPlatform, $cordovaSQLite) {
    
    $scope.apontarHoras = function() {
        
        var hora = FormatarHora(new Date(), 'hh:mm');
        var data = FormatarData(new Date(), 'dd/mm/yyyy');
        var ultimoApontamento = BuscarUltimoApontamento($cordovaSQLite, data);
        debugger;
        var query = MarcarHorario(ultimoApontamento);
        
        $cordovaSQLite.execute(db, query, [hora, ultimoApontamento, data]).then(function(result) {
            var message = "INSERT ID -> " + result.insertId;
            console.log(message);
        
        }, function (exception) {
            console.error(exception);
        });
        
        $scope.timesheet = ListarApontamentos();
        
        //Altera o idioma do app
        ChangeLanguage(idiomaSelecionado);
    }
    
    $ionicPlatform.ready(function() {
debugger;
        function ListarApontamentos() {

            var lista = [];
            var query = "SELECT id, data, horaEntrada, horaSaidaAlmoco, horaVoltaAlmoco, horaSaida, ultimoApontamento FROM timesheet";
            
            $cordovaSQLite.execute(db, query, []).then(function(result) {
                if(result.rows.length > 0) {
                    for (var i = 0; i < result.rows.length; i++) {
                        lista.push(
                            { 
                                "id" : result.rows.item(i).id, 
                                "data" : result.rows.item(i).data, 
                                "horaEntrada" : result.rows.item(i).horaEntrada, 
                                "horaSaidaAlmoco" : result.rows.item(i).horaSaidaAlmoco, 
                                "horaVoltaAlmoco" : result.rows.item(i).horaVoltaAlmoco, 
                                "horaSaida" : result.rows.item(i).horaSaida,
                                "ultimoApontamento" : result.rows.item(i).ultimoApontamento
                            }
                        );
                    }
                } 
                else {
                    console.log("Nenhum resultado encontrado");
                }

            }, function (exception) {
                console.error(exception);
            });

            return lista;
        }
        
        $scope.timesheet = ListarApontamentos();
    
        console.log(idiomaSelecionado);
        //Altera o idioma do app
        ChangeLanguage(idiomaSelecionado);
        
    })
    
    //Altera o idioma do app
    ChangeLanguage(idiomaSelecionado);
})

.controller('SettingsController', function($scope, $cordovaSQLite) {
    $scope.alterarIdioma = function(idioma) {
        idiomaSelecionado = idioma;
        //Altera o idioma do app
        ChangeLanguage(idiomaSelecionado);
    }
});

function BuscarUltimoApontamento($cordovaSQLite, data) {
    
    var query = "SELECT ultimoApontamento FROM timesheet where data = ?";
    var ultimoApontamento = 0;
    
    debugger;
    $cordovaSQLite.execute(db, query, [data]).then(function(result) {
        debugger;
        if(result.rows.length > 0) {
            ultimoApontamento = result.rows.item(0).ultimoApontamento;
            ultimoApontamento = ultimoApontamento + 1;
        }
    }, function (exception) {
        console.error(exception);
    });
    
    debugger;
    return ultimoApontamento;
}

function MarcarHorario(ultimoApontamento) {
    
    var sql = "";
    
    switch (ultimoApontamento) {
        case 1:
            /* 1 - Entrada */
            sql = "insert into timesheet (horaEntrada, ultimoApontamento, data) values (?, ?, ?)";
            break;

        case 2:
            /* 2 - Saida para almoço */
            sql = "update timesheet set horaSaidaAlmoco = ?, ultimoApontamento = ? where data = ?";
            break;

        case 3:
            /* 3 - Volta do almoço */
            sql = "update timesheet set horaVoltaAlmoco = ?, ultimoApontamento = ? where data = ?";
            break;

        case 4:
            /* 4 - Saída */
            sql = "update timesheet set horaSaida = ?, ultimoApontamento = ? where data = ?";
            break;
    }
    
    return sql;
}

function FormatarData(date, mask){
    var dia = date.getDate();
    var mes = (date.getMonth() + 1);
    var ano = date.getFullYear();
    
    if (dia < 10)
        dia = '0' + dia;
        
    if (mes < 10)
        mes = '0' + mes;

    return mask.replace('dd', dia).replace('mm', mes).replace('yyyy', ano);
}

function FormatarHora(time, mask){
    var hora = time.getHours();
    var minuto = time.getMinutes();
    var segundo = time.getSeconds();
    
    if (hora < 10)
        hora = '0' + hora;
        
    if (minuto < 10)
        minuto = '0' + minuto;

    if (segundo < 10)
        segundo = '0' + segundo;
    
    return mask.replace('hh', hora).replace('mm', minuto).replace('ss', segundo);
}
