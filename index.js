'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    db=require('./lib/db'),
    options = {
        onconfig: function (config, next) {
            //any config overriders here
            db.config(config.get('databaseConfig'));
            next(null, config);
        }
    },
    port = process.env.PORT || 8000;


app.use(kraken(options));
var flash=require('connect-flash');
var validator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var MongoStore=require('connect-mongo')(session);
app.use(session({
    secret: 'lery',
    resave: false,
    saveUninitialized: false,
    store:new MongoStore({
        host: '127.0.0.1',
        port: '27017',
        db: 'sessions',
        url: 'mongodb://localhost:27017/ARateme'
    })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());


app.listen(port, function () {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});