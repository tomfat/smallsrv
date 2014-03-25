var http = require('http');
var fs = require('fs');
var path = require('path');

var ssPort = 8080; //Default port is 8080
var ssRoot = ".";//Default web root is current work directory.
var ssListDir = false;
var BUF_SIZE = 1024;

console.log('Small Server');
console.log('Listing to port:' + ssPort);

var toLocalPath = function(url){
    return ssRoot + url;
}


new http.createServer(function(req, resp){
    console.log('Recevied:' + req.url); 
    var localPath = toLocalPath(req.url);
    //if(localPath === './'){
    //localPath = './index.html';
    //}
    console.log('DEBUG:' + localPath);
    fs.open(localPath, 'r' , function(err, fd){
        if(err){
            resp.writeHead(404, {"Content-Type" : "test/plain"});
        }else if(fd){
            fs.stat(localPath, function(err, stat){
                if(stat.isDirectory()) {
                    if(!ssListDir){
                        resp.writeHead(401, {"Content-Type" : "text/plain"});
                        resp.write("Directory access is not alowed");
                        resp.end();
                    }                        
                    fs.close(fd);
                }else{
                    fs.readFile(fd, function(err, data){
                        if(err){
                            resp.writeHead(500, {"Content-Type" : "test/plain"});
                            resp.write("Unknown error");
                        }else{
                            resp.write(data);
                        }
                        resp.end();
                        fs.close(fd);
                    });
                }
            });
        }else{
            resp.writeHead(500, {"Content-Type" : "test/plain"});
            resp.write("Unknown error");
            resp.end();
        }
    });
}).listen(ssPort);
