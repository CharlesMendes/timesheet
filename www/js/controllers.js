var idiomaSelecionado = "pt-br";

angular.module('starter.controllers', [])

.controller('TimesheetController', function ($scope, $ionicPlatform, $cordovaSQLite) {
    GerarLog_Informacao("TimesheetController", "[INICIO]");

    var ultimoApontamento = 0;

    function BuscarUltimoApontamento($cordovaSQLite, data) {
        GerarLog_Informacao("BuscarUltimoApontamento", "[INICIO]");
        
        var query = "SELECT ultimoApontamento FROM timesheet where data = ?";
        
        $cordovaSQLite.execute(db, query, [data]).then(function (result) {
            GerarLog_Informacao("BuscarUltimoApontamento", "sql: " + query + " - Parametro: " + data);

            if (result.rows.length > 0) {
                ultimoApontamento = result.rows.item(0).ultimoApontamento;
                ultimoApontamento = ultimoApontamento + 1;
            } else {
                ultimoApontamento = 1;
            }
            
            GerarLog_Informacao("BuscarUltimoApontamento", "Ultimo apontamento: " + ultimoApontamento);
        });
        
        GerarLog_Informacao("BuscarUltimoApontamento", "[FIM]");
    }

    function ListarApontamentos() {
        GerarLog_Informacao("ListarApontamentos", "[INICIO]");
        
        var lista = [];        
        var query = "SELECT id, data, horaEntrada, horaSaidaAlmoco, horaVoltaAlmoco, horaSaida, ultimoApontamento FROM timesheet";
        
        $cordovaSQLite.execute(db, query, []).then(function (result) {
            GerarLog_Informacao("ListarApontamentos", "sql: " + query);
            
            if (result.rows.length > 0) {
                GerarLog_Informacao("ListarApontamentos", "total de registros: " + result.rows.length);
                
                for (var i = 0; i < result.rows.length - 1; i++) {
                    lista.push(
						{
						    "id": result.rows.item(i).id,
						    "data": result.rows.item(i).data,
						    "horaEntrada": result.rows.item(i).horaEntrada,
						    "horaSaidaAlmoco": result.rows.item(i).horaSaidaAlmoco,
						    "horaVoltaAlmoco": result.rows.item(i).horaVoltaAlmoco,
						    "horaSaida": result.rows.item(i).horaSaida,
						    "ultimoApontamento": result.rows.item(i).ultimoApontamento
						}
					);
                }
            }
            else {
                GerarLog_Informacao("ListarApontamentos", "Nenhum resultado encontrado");
            }
            
            ChangeLanguage(idiomaSelecionado);
            
        }, function (exception) {
            GerarLog_Erro("ListarApontamentos", exception);
        });

        GerarLog_Informacao("ListarApontamentos", "[FIM]");
        return lista;
    }

    $ionicPlatform.ready(function () {
        $scope.timesheet = ListarApontamentos();

        GerarLog_Informacao("$ionicPlatform.ready(", "Idioma: " + idiomaSelecionado);

        //Altera o idioma do app
        ChangeLanguage(idiomaSelecionado);
    })

    $scope.apontarHoras = function () {
        GerarLog_Informacao("apontarHoras", "[INICIO]");
        
        var data = FormatarData(new Date(), 'dd/mm/yyyy');
        var hora = FormatarHora(new Date(), 'hh:mm');
        
        BuscarUltimoApontamento($cordovaSQLite, data);

        if (ultimoApontamento > 0 && ultimoApontamento < 5) {
            var query = MarcarHorario(ultimoApontamento);

            if (ultimoApontamento == 1) {
                $cordovaSQLite.execute(db, query, [hora, ultimoApontamento, data]).then(function (result) {
                    GerarLog_Informacao("apontarHoras", "Inseriu ID:" + result.insertId);
                    
                }, function (exception) {
                    GerarLog_Erro("apontarHoras", exception);
                });
            } else {
                $cordovaSQLite.execute(db, query, [hora, ultimoApontamento, data]).then(function () {
                    GerarLog_Informacao("apontarHoras", "Atualizou registro");
                    
                }, function (exception) {
                    GerarLog_Erro("apontarHoras", exception);
                });
            }
            
            GerarLog_Informacao("apontarHoras", "sql: " + query + " - Parametros: " + hora + ", " + ultimoApontamento + ", " + data);
            $scope.timesheet = ListarApontamentos();
            
        } else {
            LimparTabela("timesheet");
            $scope.timesheet = ListarApontamentos();
            
            alert("Todos os apontamentos ja foram realizados para a data de hoje!");
        }
        
        GerarLog_Informacao("apontarHoras", "[FIM]");
    }
    
    function LimparTabela(tabela) {
        GerarLog_Informacao("LimparTabela", "[INICIO]");
        GerarLog_Informacao("LimparTabela", "Tabela: " + tabela);
        GerarLog_Informacao("LimparTabela", "Ultimo apontamento: " + ultimoApontamento);
        
        var query = "";
        
        //*********************************
        //Apagar tabela
        //*********************************
        query = "delete from " + tabela;
        
        GerarLog_Informacao("LimparTabela", "Iniciando a limpeza da tabela");
        $cordovaSQLite.execute(db, query, []).then(function () {
            GerarLog_Informacao("LimparTabela", "sql: " + query);
            GerarLog_Informacao("LimparTabela", "Tabela limpada");
                    
            $scope.timesheet = ListarApontamentos();
        }, function (exception) {
            GerarLog_Erro("LimparTabela", exception);
        });
        
        //*********************************
        //Reiniciar ID
        //*********************************
        query = "delete from sqlite_sequence where name='" + tabela + "'";
        
        GerarLog_Informacao("LimparTabela", "Iniciando o reset ID da tabela");
        $cordovaSQLite.execute(db, query, []).then(function () {
            GerarLog_Informacao("LimparTabela", "sql: " + query);
            GerarLog_Informacao("LimparTabela", "Tabela limpada");
                    
            $scope.timesheet = ListarApontamentos();
        }, function (exception) {
            GerarLog_Erro("LimparTabela", exception);
        });
        
        ultimoApontamento = 0;
        GerarLog_Informacao("LimparTabela", "Ultimo apontamento: " + ultimoApontamento);
        GerarLog_Informacao("LimparTabela", "[FIM]");
    }
    
    GerarLog_Informacao("TimesheetController", "[FIM]");
})

.controller('AppController', function ($scope, $ionicModal, $timeout) {

    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/about.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();

        //Altera o idioma do app
        ChangeLanguage(idiomaSelecionado);
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1);
    };

    //Altera o idioma do app
    ChangeLanguage(idiomaSelecionado);
})

.controller('SettingsController', function ($scope, $cordovaSQLite) {
    $scope.alterarIdioma = function (idioma) {
        idiomaSelecionado = idioma;
        //Altera o idioma do app
        ChangeLanguage(idiomaSelecionado);
    }
});

function MarcarHorario(ultimoApontamento) {
    GerarLog_Informacao("MarcarHorario", "[INICIO]");
    GerarLog_Informacao("MarcarHorario", "Ultimo apontamento: " + ultimoApontamento);

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

    GerarLog_Informacao("MarcarHorario", "query: " + sql);
    GerarLog_Informacao("MarcarHorario", "[FIM]");
    return sql;
}

function FormatarData(date, mask) {
    var dia = date.getDate();
    var mes = (date.getMonth() + 1);
    var ano = date.getFullYear();

    if (dia < 10)
        dia = '0' + dia;

    if (mes < 10)
        mes = '0' + mes;

    return mask.replace('dd', dia).replace('mm', mes).replace('yyyy', ano);
}

function FormatarHora(time, mask) {
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

function GerarLog_Informacao(metodo, mensagem) {
    
    var data = FormatarData(new Date(), 'dd/mm/yyyy');
    var hora = FormatarHora(new Date(), 'hh:mm');
    var log = "[" + data + " - " + hora + "] | [INFO] | " + metodo + " | " + mensagem;

    console.log(log);
}

function GerarLog_Erro(metodo, mensagem) {
    
    var data = FormatarData(new Date(), 'dd/mm/yyyy');
    var hora = FormatarHora(new Date(), 'hh:mm');
    var log = "[" + data + " - " + hora + "] | [ERRO] | " + metodo + " | " + mensagem;
    
    console.error(log);
}
