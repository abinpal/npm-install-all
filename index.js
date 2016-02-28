#!/usr/bin/env node

var lineReader = require('line-reader');
var exec = require('child_process').exec;
var Promise = require('bluebird');
var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

var moduleArr = []; 
var fileName = process.argv[2];

function storingModuleNames(){

var eachLine = Promise.promisify(lineReader.eachLine);

    eachLine(fileName, function(line) {
      if (line.indexOf('require') != -1){
      var regex = /require\(([^)]+)\)/g;
      var mat = regex.exec(line);

      mat[1] = mat[1].replace(/'/g, '');
      moduleArr.push(mat[1]);
    }
    }).then(function() {
      runningCommand(moduleArr);
    }).catch(function(err) {
      console.error(err);
    });
};

function runningCommand(modules){
    for (var module in modules){

      var localCommand = 'npm install '+modules[module]+' --save';
      
      function puts(error, stdout, stderr) { console.log(stdout) }
      exec(localCommand, puts);
    }
  };

function checkPackageJSON(){
    fs.stat('package.json', function(err, stat) {
      if(err == null) {
          //console.log('File exists');
      } else if(err.code == 'ENOENT') {
          var globalPackagePath = require.resolve('npm-install-all');
          var globalPackagePathDir = path.dirname(globalPackagePath);
          var template = fs.readFileSync(globalPackagePathDir + '/template/template-package-json.hbs').toString();
          var compiledTemplate = Handlebars.compile(template);
          var packagejson = JSON.parse(compiledTemplate());
          fs.writeFile('package.json', JSON.stringify(packagejson, null, "\t"));
          return;
      } else {
          console.log('Some other error: ', err.code);
      }
  });
}

var compute = function() {

  return new Promise(function(resolve) {
          if(fileName!=null){
            checkPackageJSON(); 
            storingModuleNames();
          }
          else
            console.error('A filename should be passed as argument');
        })
        .catch(function (e) {
            throw e;
        });
};

compute();