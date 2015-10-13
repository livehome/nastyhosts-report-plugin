const fs = require("fs");
const pg = require("pg");
let conString;

function report(req, res) {
  res.send("Thanks");
  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error("Postgres connection error in report plugin!");
      return;
    }

    if(req.params.ip.length <= 45) {
        const report = {
          ip: req.params.ip,
          reporter: req.connection.remoteAddress,
          comment: req.params.comment,
          timestamp: Date.now()
        };

        client.query("SELECT addReport($1, $2, $3, $4);", [
          report.ip,
          report.reporter,
          report.comment,
          report.timestamp
        ]);
      };
    done();
  });
};

module.exports = function(config) {
  conString = config.report.conString;
  return {
    routes: [
      {
        method: "get",
        path: "/report/:ip/:comment",
        callback: report
      }
    ]
  };
};
