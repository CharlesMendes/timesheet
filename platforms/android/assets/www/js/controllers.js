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

.controller('TimesheetController', function($scope,$ionicPlatform,$cordovaSQLite) {
    
    $scope.apontarHoras = function() {
        
        var query = MarcarHorario(1);
        $cordovaSQLite.execute(db, query, '').then(function(result) {
            var message = "INSERT ID -> " + result.insertId;
            console.log(message);
            alert(message);
        
        }, function (err) {
            console.error(err);
            alert(err);
        });
        
        $scope.timesheet = ListarApontamentos();
        
        //Altera o idioma do app
        ChangeLanguage(idiomaSelecionado);
    }
    
    $ionicPlatform.ready(function() {

        function ListarApontamentos() {

            var lista = [];
            var query = "SELECT id, data, horaEntrada, horaSaidaAlmoco, horaVoltaAlmoco, horaSaida FROM timesheet";
            
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
                                "horaSaida" : result.rows.item(i).horaSaida
                            }
                        );
                    }
                } 
                else {
                    console.log("No results found");
                    alert("Nenhum resultado encontrado");
                }

            }, function (err) {
                console.error(err);
                alert(err);
            });

            return lista;
        }
        
        $scope.timesheet = ListarApontamentos();
    
        alert(idiomaSelecionado);
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

function MarcarHorario(tipo) {
    
    var sql = "";
    var data = FormatarData(new Date(), 'dd/mm/yyyy');
    var hora = FormatarHora(new Date(), 'hh:mm');
    
    switch (tipo) {
        case 1:
            /* 1 - Entrada */
            sql = "insert into timesheet (data, horaEntrada) values ('{0}', '{1}')";
            sql = sql.replace('{0}', data).replace('{1}', hora);
            
            alert(sql);
            break;

        case 2:
            /* 2 - Saida para almoço */
            
            break;

        case 3:
            /* 3 - Volta do almoço */
            
            break;

        case 4:
            /* 4 - Saída */

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
