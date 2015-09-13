const fs = require("fs");

function report(req, res) {
  res.send("Thanks");

  if(req.params.ip.length <= 45) {
    fs.stat("reports.txt", function(err, stats) {
      if(err || stats.size < 20*1024*1024) {
        const report = JSON.stringify({
          ip: req.params.ip,
          reporter: req.connection.remoteAddress,
          timestamp: Date.now()
        });

        fs.appendFile("reports.txt", report+"\n");
      }
    });
  }
}

module.exports = function(config) {
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
