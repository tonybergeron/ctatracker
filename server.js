var app = require('express').createServer();

var http = require('http');
var parser = require('xml2json');

app.get('/', function(req, res) {
  res.send("Hello World");
});

//CTA Bus Tracker
app.get('/cta/bustime/getpredictions', function(req, res) {
	//key
	//routes
	//stops

	//use query for url values
	var key = req.query.key;
	var rt = req.query.rt;
	var stpid = req.query.stpid;

	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  host: 'http://www.ctabustracker.com',
	  path: '/bustime/api/v1/getpredictions?key=' + key + '&rt=' + rt + '&stpid=' + stpid;
	};

	callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	    console.log(str);
	    parser.toJson(str);
	  });
	}

	http.request(options, callback).end();

});

app.listen(process.env.PORT || 3000, function() {
  console.log("listening on 3000");
});

