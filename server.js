var argv = require('optimist').argv;
var express = require('express');
var ejs = require('ejs');
var request = require('request');

//command Line parameters
var options = {
	port: process.env.PORT||8000
};
if (argv.p) options.port = argv.p;
if (argv.port) options.port = argv.port;

this.app = app = express();
app.configure(function() {
	app.set('views', __dirname+"/views/");
	app.use(express.static(__dirname + "/static/"));
	app.set('view engine', 'ejs');
	app.set("view options", {layout: false});
	app.engine('html', require('ejs').renderFile);
	app.use(express.cookieParser()); 
});
app.engine('html', require('ejs').renderFile);


//cagliari config
var serviceBaseUrl = 'http://www.comune.cagliari.it/portale/api/rs/it/cagliari/risultatiElezioni.json';

//routing
app.get('/', function(req, res) {
	var request = require('request');
	request(serviceBaseUrl+'?idElezione=82', function (error, response, body) {
		var outSenato = { spoglio: null, risultati: 
			[
				{
					id: 1,
					descrizione: 'lista esempio 1',
					voti: 0,
					percentuale: 0
				},
				{
					id: 2,
					descrizione: 'lista esempio 2',
					voti: 0,
					percentuale: 0
				}
			]
		};
		if (!error && response.statusCode == 200) {
		    var output = JSON.parse(body);
		    outSenato.spoglio = output.spoglio||outSenato.spoglio;
		    outSenato.risultati = output.risultati||outSenato.risultati;
		}
		else {

		}
		request(serviceBaseUrl+'?idElezione=83', function (error, response, body) {
			var outCamera = { spoglio: null, risultati: null };
			if (!error && response.statusCode == 200) {
			    var output = JSON.parse(body);
			    outCamera.spoglio = output.spoglio||outCamera.spoglio;
			    outCamera.risultati = output.risultati||outCamera.risultati;
			}
			else {

			}	
			res.render('index', { 
				spoglioSenato: outSenato.spoglio,
				risultatiSenato: outSenato.risultati,
				spoglioCamera: outCamera.spoglio,
				risultatiCamera: outCamera.risultati
			});
		});
		

	})
});

//start
app.listen(options.port);
console.log('http://localhost:'+options.port);