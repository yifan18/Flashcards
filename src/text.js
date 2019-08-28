

  var http = require("http");

  var options = {
    host: "localhost",
    port: 8123,
    path: "http://www.google.com",
    headers: {
      Host: "www.google.com"
    }
  };
  http.get(options, function(res) {
    // console.log(res);
    res.pipe(process.stdout);
  }); 