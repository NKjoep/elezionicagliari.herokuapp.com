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
		var outSenato = { spoglio: null, risultati: null };
		if (!error && response.statusCode == 200) {
		    var output = JSON.parse(body);
		    outSenato.spoglio = output.spoglio||null;
		    outSenato.risultati = output.risultati||null;
		}
		else {

		}
		request(serviceBaseUrl+'?idElezione=83', function (error, response, body) {
			var outCamera = { spoglio: null, risultati: null };
			if (!error && response.statusCode == 200) {
			    var output = JSON.parse(body);
			    outCamera.spoglio = output.spoglio||null;
			    outCamera.risultati = output.risultati||null;
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