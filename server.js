var app = require('./server-config.js');

// var port = 4568;

app.listen(process.env.PORT);

console.log('Server now listening on port ' + process.env.PORT);
