var mongoose = require('mongoose');
mongoose.connect('mongodb://Shortee-DB:HdJzmJy.NSFrsdSx2UC8q5hZW7O7uWCeIRDkUP1m8sY-@ds042898.mongolab.com:42898/Shortee-DB');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
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

var Schema = mongoose.Schema; 

var urlSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  timestamps: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

urlSchema.methods.createCode = function () {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);

}

module.exports.Url = mongoose.model('Url', urlSchema);

var userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  timestamps: { type: Date, default: Date.now }
});

userSchema.methods.createHash = function(password, cb) {
  bcrypt.hash(password, null, null, cb); //callback takes err, hash
};

userSchema.methods.authenticate = function(password, cb) { //authenticates password with hash in DB
  bcrypt.compare(password, this.password, cb) //callback takes err and a boolean
}

module.exports.User = mongoose.model('User', userSchema);

// module.exports = db;


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
