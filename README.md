# npm-install-all
This module simply recognizes all the require commands and help you to install all the npm modules and also save it in your package.json.
This is a pretty cool module which reduces the work of repetitive installation of npm modules which are not present in your package.json to run an application. If there exists a package.json, it saves it as dependencies inside it, else creates it.

## Install

```
$ npm install npm-install-all -g
```

## Usage

```
$ npm-install-all <filename>
```

## Example
```
$ npm-install-all test.js
```