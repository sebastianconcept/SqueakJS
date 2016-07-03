var run = require('./run');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./localStorage');

run();

// localStorage.setItem('123', 123);

// console.log('localStorage.getItem("123")',localStorage.getItem('123'));