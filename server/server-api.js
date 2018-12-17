var http = require("http");
var url = require("url");
var fs = require("fs");

function registrarDados(estacao, velocity, direction, rainfall_level) {

    var arquivos = fs.readdirSync("dados");
    var data = new Date;
    var dados = "\n#"+String(data.getDate())+"/"+String(data.getMonth())+"/"+String(data.getFullYear())+" "+String(data.getHours())+":"+String(data.getMinutes())+":"+String(data.getSeconds())+" "+velocity+"&"+direction+"&"+rainfall_level;

    if (arquivos.indexOf(estacao+".est") == -1){
        fs.writeFileSync("dados/"+estacao+".est");
    }

    fs.appendFileSync("dados/"+estacao+".est", dados);

    console.log(String(data.getDate())+"/"+String(data.getMonth())+"/"+String(data.getFullYear())+" "+String(data.getHours())+":"+String(data.getMinutes())+":"+String(data.getSeconds())+" | "+estacao+": Fez novos registros.");
}

function consultarDados(estacao, paramters){

    var dados = String(fs.readFileSync("dados/"+estacao+".est", 'utf-8'));
    var dados = dados.split("\n");
    var result = []

    for (i=0;i<dados.length;i++){

        if (dados[i] != "undefined"){

            var infos = dados[i].split(" ");
            var infosMetem = infos[2].split("&");
            dados[i] = {"date":infos[0].replace("#", ""), "time":infos[1], "velocity":infosMetem[0], "direction":infosMetem[1], "rainfall_level":infosMetem[2]};

        }
    }

    if (paramters[0] == undefined && paramters[1] == undefined &&paramters[2] == undefined && paramters[3] == undefined && paramters[4] == undefined){

        for (i=0;i<dados.length;i++){

            if (dados[i]["date"] == paramters[0] || dados[i]["time"] == paramters[1] || dados[i]["velocity"] == paramters[2] || dados[i]["direction"] == paramters[3] || dados[i]["rainfall_level"] == paramters[4]){

                result.push(dados[i]);

            }

        }
    }else{

        result.push(dados[dados.length-1])

    }

    return result;

}



var server = http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type' : 'text/plain'});

    var query = url.parse(req.url, true).query;
    var opcao = String(query.opcao);
    var opcao = opcao.toLocaleLowerCase();
    var estacao = String(query.estacao);
    var estacao = estacao.toLowerCase();
    var date = String(query.date);
    var date = date.toLocaleLowerCase();
    var time = String(query.time);
    var time = time.toLocaleLowerCase();
    var direction = String(query.direction);
    var direction = direction.toLowerCase();
    var velocity = String(query.velocity);
    var velocity = velocity.toLowerCase();
    var rainfall_level = String(query.rainfall_level);
    var rainfall_level = rainfall_level.toLowerCase();

    if (opcao == "add"){

        registrarDados(estacao, velocity, direction, rainfall_level);
        res.end("success");

    }else{

        var paramters = [date, time, velocity, direction, rainfall_level]

        res.end(JSON.stringify(consultarDados(estacao, paramters)));

    }


}).listen(8080);