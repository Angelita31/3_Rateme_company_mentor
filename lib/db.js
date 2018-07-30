/**
 * A custom library to establish a database connection
 */
'use strict';
var mongoose = require('mongoose');

var db = function () {
    return {

        /**
         * Open a connection to the database
         * @param conf
         */
        config: function (conf) {
            /* Para crear conextiones con mas dbs mongoose.createConnection */
            mongoose.connect('mongodb://' + conf.host + '/' + conf.database);
            require('../lib/passport'); // pass passport for configuration si no pones esto te sale Unknown local-strategy con esto ya no necesitas exportar!!! ya lo tiene
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open');
            });
        }
    };
};

module.exports = db();
