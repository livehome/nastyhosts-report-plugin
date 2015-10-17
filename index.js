const fs = require("fs");
const pg = require("pg");
let conString;
let ipcheck;

function report(req, res) {
  res.send("Thanks");
  ipcheck(req.params.ip).then(function(res) {
    if(res.suggestion == "deny") return;

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

          client.query("SELECT add_report($1, $2, $3);", [
            report.ip,
            report.reporter,
            report.comment
          ], function(err) {
            if(err) console.warn(err)
          });
        };
      done();
    });
  });
};

module.exports = function(app, config, _ipcheck) {
  conString = config.report.conString;
  ipcheck = _ipcheck;
  app.get("/report/:ip/:comment", report);
};
