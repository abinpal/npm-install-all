#!/usr/bin/env node

var lineReader = require('line-reader');
var exec = require('child_process').exec;
var Promise = require('bluebird');

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

      var globalCommand = 'npm install -g '+modules[module];
      var localCommand = 'npm install '+modules[module]+' --save';
      
      function puts(error, stdout, stderr) { sys.puts(stdout) }
      exec(globalCommand, puts);
      exec(localCommand, puts);
    }
  };

var compute = function() {

  return new Promise(function(resolve) {
          if(process.argv[2]!=null)
            storingModuleNames();
          else
            console.error('A filename should be passed as argument');
        })
        .catch(function (e) {
            throw e;
        });
};

compute();