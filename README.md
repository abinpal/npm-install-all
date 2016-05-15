# npm-install-all
This module simply recognizes all the require commands and help you to install all the npm modules and also save it in your package.json.
This is a pretty cool module which reduces the work of repetitive installation of npm modules which are not present in your package.json to run an application. If there exists a package.json, it saves it as dependencies inside it, else creates it.

You just need to run this module from the project directory. This module recursively checks all the folders (excluding node_modules folder) and files of the project or folder where you are running this command and install the npm packages that you are using in your project, and finally saves it into package.json.

## Install

```
$ npm install npm-install-all -g
```

## Usage 1 (For a specific file)

```
$ npm-install-all <filename>
```

## Example
```
$ npm-install-all test.js
```

## Usage 2 (For a complete project or folder)

```
$ npm-install-all
```

## Example
```
$ npm-install-all
```

## For example if you want to install all the dependent npm modules for the "demo-project" (currently residing in example folder)

Just go inside the demo-project folder and simply run this command below

```
$ npm-install-all
```

You will see all the node modules installed locally and a 'package.json' being created with all the node modules saved in 'dependencies' property.