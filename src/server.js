const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes')
const methodOveride = require('method-override');

const server = express();

server.use(express.urlencoded({ extended: true}))
server.use(express.static('public'))
server.use(methodOveride('_method'));
server.use(routes)

server.set("view engine", "njk");


nunjucks.configure("src/app/views",{
    express: server,
    autoescape: true,
    noCache: true
})


server.listen(5000, function(){
    console.log("Server is running");
})