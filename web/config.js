var username = "eugeneyjy";
var password = "Dnthackmepls78";
var host = "room.88id4.mongodb.net";
var dbname = "utar_accom";
var dbparam = "retryWrites=true&w=majority";
var collection = "room";

var url = `mongodb+srv://${username}:${password}@${host}/${dbname}?${dbparam}`;

exports.url = url;
exports.dbname = dbname;
exports.collection = collection;
