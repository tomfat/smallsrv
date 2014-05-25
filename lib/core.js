var http = require('http');
var fs = require('fs');
var path = require('path');
var promise = require('promise');

var stat_promise = promise.denodeify(fs.stat);
var open_promise = promise.denodeify(fs.open);
var readfile_promise = promise.denodeify(fs.readFile);

var ssPort = 8080; //Default port is 8080
var ssRoot = ".";//Default web root is current work directory.

var toLocalPath = function(url){
    return ssRoot + url;
}

var createServer = function(port, root){
    ssPort = port || 8080;
    ssRoot = root || ".";
    console.log('Small Server');
    console.log('Listing to port:' + ssPort);

    return new http.createServer(function(req, resp){
        console.log('Recevied:' + req.url); 
        var localPath = toLocalPath(req.url);
        stat_promise(localPath).then(function(stat){
            if(stat.isFile()){
                return readfile_promise(localPath);
            }else{
                throw "file not found";   
            }
        }).then(function(data){
            resp.write(data);
            console.log("Send response.");
            resp.end();
        },function(err){
            console.log(err);
            resp.writeHead(500, {"content-type" : "text/plain"});
            resp.write(JSON.stringify(err));
            console.log("Send response.");
            resp.end();
        });

    }).listen(ssPort);
}

module.exports.toLocalPath = toLocalPath;
module.exports.createServer = createServer;
