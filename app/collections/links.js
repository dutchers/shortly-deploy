// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var Link = require('../models/link');

var Links = new db.Collection();

Links.model = Link;

console.log("Hello!");

module.exports = Links;