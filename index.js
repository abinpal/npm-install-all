#!/usr/bin/env node
var lineReader = require('line-reader');
var exec = require('child_process').exec;
var Promise = require('bluebird');
var Handlebars = require('handlebars');
var dir = require('node-dir');
var execSync = require("sync-exec");
var fs = require('fs');
var moduleArr = [];
var fileName = process.argv[2];
var fileNames = [];

function storingModuleNames(fn){
  var eachLine = Promise.promisify(lineReader.eachLine);
    if(process.argv[2]==null){
      fileName = fn;
    }
    eachLine(fileName, function(line) {
      var regex = /require\(([^.\/)]+)\)/g;
      var mat = regex.exec(line);
      if(mat != null){
        mat[1] = mat[1].replace(/'/g, '');
        if (moduleArr.indexOf(mat[1]) == -1) {
          moduleArr.push(mat[1]);
        }
      }
    }).catch(function(err) {
      console.error(err);
    });
};

function runningCommand(modules){
    console.log('\nINSTALLING THE FOLLOWING MODULES:');
    for (var module in modules){
      var localCommand = 'npm install '+modules[module]+' --save';
      console.log('├── ',modules[module]);
      execSync(localCommand);
    }
    console.log('\nMODULES INSTALLED AND SAVED INTO package.json...');
  };

function checkPackageJSON(){
    fs.stat('package.json', function(err, stat) {
      if(err == null) {
        //console.log('File exists');
      } else if(err.code == 'ENOENT') {
          function puts(error, stdout, stderr) {
            var globalModulesPath = stdout;
            var packageTemplatePath = globalModulesPath.trim() + '\\node_modules\\npm-install-all\\template\\template-package-json.hbs';
            var template = fs.readFileSync(packageTemplatePath).toString();
            var compiledTemplate = Handlebars.compile(template);
            var packagejson = JSON.parse(compiledTemplate());
            fs.writeFileSync('package.json', JSON.stringify(packagejson, null, "\t"));
          }

          var globalPathPrefixCommand = 'npm config get prefix';
          exec(globalPathPrefixCommand, puts);
          return;
      } else {
          console.log('Some other error: ', err.code);
      }
  });
}

var compute = function() {
  if(fileName!=null){
    checkPackageJSON();
    storingModuleNames();
    setTimeout(function(){
      runningCommand(moduleArr);
    }, 1000);
  }
  else{
    dir.readFiles('./', {
      match: /.js$/,
      excludeDir: ['node_modules']
    }, function(err, content, next) {
        if (err) throw err;
        next();
      },
      function(err, files){
        if (err) throw err;
        fileNames = files;
        checkPackageJSON();
        for (var file in fileNames){
          storingModuleNames(fileNames[file]);
        }

        setTimeout(function(){
          runningCommand(moduleArr);
        }, 5000);
      });
  }
};

compute();