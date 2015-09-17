var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortee');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');

// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: '127.0.0.1',
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });

var urlSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  timestamps: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

urlSchema.methods.createHash = function(password) {

};

module.exports.Url = mongoose.model('Url', urlSchema);

var userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  timestamps: { type: Date, default: Date.now }
});

module.exports.User = mongoose.model('User', userSchema);

module.exports = db;


// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });
