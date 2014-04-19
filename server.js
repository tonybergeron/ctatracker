var app = require('express').createServer();

var request = require('request');
var parser = require('xml2json');

app.get('/', function(req, res) {
  res.send("Hello World");
});

//CTA Bus Tracker
app.get('/cta/bustime/getpredictions', function(req, res) {

	//use query for url values
	var key = 'JbbYsQ54N2ar84ALjN2y4sH9d';
	var rt = req.query.rt;
	var stpid = req.query.stpid;

	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  uri: 'http://www.ctabustracker.com/bustime/api/v1/getpredictions',
	  qs: {
	  	key: key,
	  	rt: rt,
	  	stpid: stpid
	  }
	};

	
	request(options, function (error, response, data) {

	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");

	  if (!error && response.statusCode == 200) {
	  	var json = parser.toJson(data);
	    console.log(json);
	    res.send(json);
	  } else {
	    console.log(error);
	    res.send(error);
	  }
	});

});

app.listen(process.env.PORT || 3000, function() {
  console.log("listening on 3000");
});

