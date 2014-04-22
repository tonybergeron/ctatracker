var app = require('express').createServer();

var request = require('request');
var parser = require('xml2json');

app.get('/', function(req, res) {
  res.send("Hello World");
});

//CTA Bus Tracker
//Example: http://www.ctabustracker.com/bustime/api/v1/gettime?key=89dj2he89d8j3j3ksjhdue93j
app.get('/bustime/api/:version/:method', function(req, res) {

	var baseUrl = 'http://www.ctabustracker.com/bustime/api';
	var defaultKey = 'JbbYsQ54N2ar84ALjN2y4sH9d';

	//Cache the query string
	var queryString = req.query;

	//Handle Key
	if(req.query['key'] === null || req.query['key'] === undefined) {
		queryString.key = defaultKey;
	}

	var options = {
	  uri: baseUrl + '/' + req.params.version + '/' + req.params.method,
	  qs: queryString
	};
	
	//Make request to CTA
	request(options, function (error, response, data) {

	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");

	  if (!error && response.statusCode == 200) {
	  	var datesConverted = convertCTADates(data);
	  	var json = parser.toJson(datesConverted);
	    //console.log(json);
	    res.send(json);
	  } else {
	    console.log(error);
	    res.send(error);
	  }
	});

});


//CTA Train Tracker
//Example: http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=e3875818a474304&runnumber=12
app.get('/traintime/api/:version/:method', function(req, res) {

	var baseUrl = 'http://lapi.transitchicago.com/api';
	var defaultKey = '8a277d0d03c54646a9189e55b9f2da05';

	//Cache the query string
	var queryString = req.query;

	//Handle Key
	if(req.query['key'] === null || req.query['key'] === undefined) {
		queryString.key = defaultKey;
	}

	var options = {
	  uri: baseUrl + '/' + req.params.version + '/' + req.params.method + '.aspx',
	  qs: queryString
	};

		//Make request to CTA
	request(options, function (error, response, data) {
	  
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");

	  if (!error && response.statusCode == 200) {
	  	var datesConverted = convertCTADates(data);
	  	var json = parser.toJson(datesConverted);
	    //console.log(json);
	    res.send(json);
	  } else {
	    console.log(error);
	    console.log('[Error] Call Made: ');
	    res.send(error);
	  }
	});

});


/**
 *	Converts all strings of format '20140421 20:06:21' to standard date in millis
 */
function convertCTADates(data) {

	var scrub = data;
	var scrubbed = '';

	var pattern = /2\d{3}[0-1][0-9][0-3][0-9]\s[0-2][0-9]\:[0-6][0-9](\:\d{0,3}){0,1}/gm;

    scrubbed = scrub.replace(pattern, function(match, entity) {
    	return translateCTADate(match);
    });

	//console.log(scrubbed);

	return scrubbed;

};

/**
* Translate the Custom CTA date into standard date in millis
*/
function translateCTADate(text) {

  	if(text != null || text != undefined ) {

    	var millis = 0;

    	// Sample Time Format
    	// 20140419 19:25
    	var textSplit = text.split(" ");
    	var dateText = textSplit[0];
    	var timeText = textSplit[1];

    	//Collect the Date portion
		var date = {
			year: dateText.slice(0,4),
			month: dateText.slice(4,6),
			days: dateText.slice(6,8)
		};

		//Collect the Time portion
		var timeTextSplit = timeText.split(":");
		var time = {
			hours: timeTextSplit[0],
			minute: timeTextSplit[1]
		};

		//Take all of this and make a date of it, then return the millis
		var dateObj = new Date(date.year, (date.month - 1), date.days, time.hours, time.minute);

    	return dateObj.getTime();

	} else {
		//Return null
		return null;
	}

};



app.listen(process.env.PORT || 3000, function() {
  console.log("listening on 3000");
});

