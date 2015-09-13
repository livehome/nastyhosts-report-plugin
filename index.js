const fs = require("fs");

let reports = [];

function report(req, res) {
  if(reports.length < 20000 && req.params.ip.length <= 30) {
    reports.push({
      ip: req.params.ip,
      reporter: req.connection.remoteAddress,
      timestamp: Date.now()
    });
  }
  res.send("Thanks");
}

module.exports = function(config) {
  fs.readFile("reports.json", function(err, data) {
    if(!err) {
      const prev = JSON.parse(data);
      if(Array.isArray(prev)) {
        reports = reports.concat(prev);
      }
    }
  });

  setInterval(function() {
    fs.writeFile("reports.json", JSON.stringify(reports, null, 2));
  }, 1000*60);

  return {
    routes: [
      {
        method: "get",
        path: "/report/:ip",
        callback: report
      }
    ]
  };
};
