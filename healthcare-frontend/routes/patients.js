const helper = require('../helper.js');



const patientsRoutes = (app, request) => {

// Get a list of current bookings
app.get("/patients", function (req, res) {

    var options = {
      method: "get",
      url: helper.listURL,
    };

    console.log("Requesting list of booking to " + helper.listURL);
    request(options, function (err, response, body) {
      if (err) {
        console.error("patients Error:", err);
        res.render("patients.html", { service_unavailable: true });
        return;
      }
      var history_table = [];
      var bookings = JSON.parse(body);
      bookings.forEach((b) => {
        history_table.push(b);
        console.log("Reading patients from the database:" + b);
      });
      res.render("patients.html", { history_table: history_table });
    });
  });

  // Reset the passenger list
  app.get("/reset", function (req, res) {
    var options = {
      method: "get",
      url: helper.resetURL,
    };
    console.log("Requesting to delete all booking tos " + options.url);
    request(options, function (err, response, body) {
      if (err) {
        console.error("patients Error:", err);
        res.render("patients.html", { service_unavailable: true });
        return;
      }
      var history_table = [];
      res.render("patients.html", { history_table: history_table });
    });
  });
};
module.exports = patientsRoutes