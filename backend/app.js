var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    bodyParser = require('body-parser');

var db;
mongoose.Promise = global.Promise;
db = mongoose.connect('mongodb://localhost/GQA');
console.log('Hello GQA');

var Line = require('./models/lineModel');
var DateInfo = require('./models/dateInfoModel');
var HourlyInfo = require('./models/hourlyInfoModel');

var app = express();
var port = process.env.PORT || 3000;

var server = http.Server(app);

// Socket.io server listens to our app
var io = require('socket.io')(server);

// Send current time to all connected clients
function sendTime() {
    //io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 1 secs
setInterval(sendTime, 1000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    res.header("Access-Control-Allow-Headers", "params,Access-Control-Allow-Headers,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Request-Method,Access-Control-Request-Headers");
    next();
});


lineRouter = require('./routes/lineRoutes')(Line, io);
dateInfoRouter = require('./routes/dateInfoRoutes')(DateInfo, io);
hourlyInfoRouter = require('./routes/hourlyInfoRoutes')(HourlyInfo, io);

app.use('/api/lines', lineRouter);
app.use('/api/lines/:lineId/dates', dateInfoRouter);
app.use('/api/lines/:lineId/dates/:dateId/hours', hourlyInfoRouter);

app.get('/', function(req, res){
    res.send('Welcome to GQA production API');
});

server.listen(port, function(){
    console.log('Application is running on port: ' + port);
});

module.exports = app;