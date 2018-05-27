"use strict";
var Http = require("http");
var Url = require("url");
var Server;
(function (Server) {
    var studiHomoAssoc = {};
    var port = process.env.PORT;
    if (port == undefined)
        port = 8200;
    var server = Http.createServer(function (_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    server.addListener("request", handleRequest);
    server.listen(port);
    function handleRequest(_request, _response) {
        console.log("Ich h�re Stimmen!");
        var query = Url.parse(_request.url, true).query;
        console.log(query["command"]);
        if (query["command"]) {
            switch (query["command"]) {
                case "insert":
                    insert(query, _response);
                    break;
                case "refresh":
                    refresh(_response);
                    break;
                case "search":
                    search(query, _response);
                    break;
                default:
                    error();
            }
        }
        _response.end();
    }
    function insert(query, _response) {
        var obj = JSON.parse(query["data"]);
        var _name = obj.name;
        var _firstname = obj.firstname;
        var matrikel = obj.matrikel.toString();
        var _age = obj.age;
        var _gender = obj.gender;
        var _course = obj.course;
        var studi;
        studi = {
            name: _name,
            firstname: _firstname,
            matrikel: parseInt(matrikel),
            age: _age,
            gender: _gender,
            course: _course
        };
        studiHomoAssoc[matrikel] = studi;
        _response.write("Daten empfangen");
    }
    function refresh(_response) {
        console.log(studiHomoAssoc);
        for (var matrikel in studiHomoAssoc) {
            var studi = studiHomoAssoc[matrikel];
            var line = matrikel + ": ";
            line += studi.course + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)";
            _response.write(line + "\n");
        }
    }
    function search(query, _response) {
        var studi = studiHomoAssoc[query["searchFor"]];
        if (studi) {
            var line = query["searchFor"] + ": ";
            line += studi.course + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)";
            _response.write(line);
        }
        else {
            _response.write("No Match");
        }
    }
    function error() {
        alert("Error");
    }
})(Server || (Server = {}));
//# sourceMappingURL=Server.js.map