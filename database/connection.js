var mongoose = require('mongoose')
require('dotenv').config()


var dbUser = process.env.DB_USER;
var dbPassword = process.env.DB_PASSWORD;
var dbHost = process.env.DB_HOST;
// Setup default mongoose connection

var mongoDB = `mongodb://${dbUser}:${dbPassword}@odinproj1-shard-00-00.32enl.mongodb.net:27017,odinproj1-shard-00-01.32enl.mongodb.net:27017,odinproj1-shard-00-02.32enl.mongodb.net:27017/NewsBoard?ssl=true&replicaSet=atlas-5gf361-shard-0&authSource=admin&retryWrites=true&w=majority`
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

var db = mongoose.connection;

module.exports = db
