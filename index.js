var express = require('express'),
    fs = require('fs'),
    util = require('util'),
    xml2js = require('xml2js'),
    http = require('http'),
    request = require('superagent');
var beautify = require('js-beautify').js_beautify;
  
var bingPrimaryAccountKey = "IMjQ0ifyYeaa9jID6Hxj6gW+Z+QZVcJFK7wxWePcneU";

function imgsearch(str, result) {
  request
    .get('http://api.datamarket.azure.com/Bing/Search/v1/Image?Query=%27'+escape(str)+'%27&Options=%27EnableHighlighting%27&Market=%27en-US%27&Adult=%27Off%27')
    .set('Authorization', "Basic " + new Buffer(":" + bingPrimaryAccountKey).toString('base64'))
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (err) throw err;
      var js = JSON.parse(res.text);
      var obj = js.d.results;
      var parse = JSON.stringify(obj);
      var beauty = beautify(parse, { indent_size: 2 });
      result.send(beauty);
    });
}
/*
function image_search(str) {
  // https://api.datamarket.azure.com/Bing/Search/v1/Image?Query=%27kevin%20gates%27&Options=%27EnableHighlighting%27&Market=%27en-US%27&Adult=%27Off%27
  var options = {
    method: 'GET',
    host: 'api.datamarket.azure.com',
    port: 80,
    path: '/Bing/Search/v1/Image?Query=%27'+escape(str)+'%27&Options=%27EnableHighlighting%27&Market=%27en-US%27&Adult=%27Off%27'
  };

  var xmlContent = "";
  var req = http.request(options, function(res) {
    console.log("Got response: " + res.statusCode);
  //  if (res.statusCode == 302)
    //return;
    
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        xmlContent += chunk;
    });

    res.on("end", function () {
    //  var xml = fs.readFileSync('kevin gates.xml').toString('utf-8');
  //    console.log(xmlContent.text);
      var parser = new xml2js.Parser();
      parser.parseString(xmlContent, function(err, result) {
        var items = [];
        for (var i=0;i<result.feed.entry.length;i++)
        {
          items.push(entry2js(result.feed.entry[i]));
        }
        
        console.dir(items);
      });
    });
    
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
  req.setHeader('WWW-Authenticate', 'Basic realm="'+new Buffer('IMjQ0ifyYeaa9jID6Hxj6gW+Z+QZVcJFK7wxWePcneU:IMjQ0ifyYeaa9jID6Hxj6gW+Z+QZVcJFK7wxWePcneU').toString('base64')+'"');
  req.end();
}

*/

var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send(fs.readFileSync(__dirname + '/app/index.html').toString('utf-8'));
});

app.use(express.static(__dirname + '/app'));

app.get('/images', function(req, res){
  imgsearch(req.param('q'), res);
});

app.listen(3000);