const helper = require("../helper.js");

const name = "BOOKINGROUTES";
const bookingRoutes = (app, request) => {
 
 
 
    // Fill form to confirm booking
  app.post("/confirmBooking", function (req, res) {
    let availability = [];
    try {

        // Build Calendar GET Request
        var options = {
            method: "get",
            json: true,
            url: helper.calendarUrl
        };

        // Execute POST to CalendarService
        request(options, function (err, response, body) {
            if (err) {
                helper.log(name, "confirmBooking ERROR calling the CalendarService :" + err);
                res.render("ordersummary.html", { service_unavailable: true });
                return;
            }
            availDays = response.body;
            for (let i = 0; i < availDays.length; i++) {
                helper.log(name, "Date" + response.body[0])
                availability.push(new Date(response.body[i]))
            }

            var payload = {
                doctor: req.body.doctor,
                price: req.body.price,
                category: req.body.category,
                hospital: req.body.hospital,
                specialty: req.body.specialty
            };

            helper.addAppDynamicsData(payload);

            res.render("confirmBooking.html", {
                doctor: req.body.doctor,
                category: req.body.category,
                specialty: req.body.specialty,
                price: req.body.price,
                hospital: req.body.hospital,
                date: availability, // change availability to fetch data from Calendar Service
                validation_success: true
            });

    });
} catch (err) {
    helper.log(name, err);
}
});

  // Confirm booking
  app.post("/book", function (req, res) {
    console.log("Making request to BookingService:" + helper.bookingURL);
    try {
      // Build Payload
      payload = helper.payloadBuilder(req.body);
      // Build Booking POST options
      var options = {
        method: "POST",
        body: payload,
        json: true,
        url: helper.bookingURL,
      };
      // Execute POST to Booking Service
      request(options, function (err, response, body) {
        if (err) {
          console.log("confirmBooking ERROR :", err);
          res.render("ordersummary.html", { service_unavailable: true });
          return;
        }

        console.log("Preparing to sending AppDynamics data");
        helper.addAppDynamicsData(payload);
        console.log("Appdynamics data sent. Sending back the response");

        helper.addAppDynamicsData(payload);
        if (body.error) {
          res.render("ordersummary.html", {
            result: payload,
            validation_success: true,
            error_msg: body.error.message,
            error_type: body.error.type,
          });
        } else {
          res.render("ordersummary.html", {
            result: payload,
            validation_success: true,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
};
module.exports = bookingRoutes;
