const helper = require('../helper.js');

const refundRoutes = (app, request) => {
    // Refund Service
    var refundHost = process.env.REFUND_SERVICE
    var refundPort = process.env.REFUND_PORT
    var refundUrl = "http://" + refundHost + ":" + refundPort + "/refund";

    // Reset the refunded passenger list
    app.get("/refreset", function (req, res) {
        db.del("refunded", function (err, reply) {
            console.log("REFUNDROUTE: Client requested refunded passenger list reset.");
            res.render("refunded.html");
        });
    });

    // Ask for a refund
    app.post("/refund", function (req, res) {
        console.log("REFUNDROUTE: Refund Requested: " + req.body.pToRefund);

        try {
            // Build Payload
            payload = JSON.parse(req.body.pToRefund);

            // Build Refund POST options
            var options = {
                method: "post",
                body: payload,
                json: true,
                timeout: 2000,
                url: refundUrl
            };

            // Execute POST to Refund
            request(options, function (err, response) {
                if (err) {
                    console.error("REFUNDROUTE: ERROR:", err);
                    res.render("refunded.html", { service_unavailable: true });
                    return;
                }
                var refundRes = response.body;
                console.log("REFUNDROUTE: Requesting refund to " + refundHost);
                console.log("REFUNDROUTE: Refund service returned: " + JSON.stringify(response.body));
                console.log("REFUNDROUTE: Passenger will be refunded with amount: " + refundRes.amount);

                res.render("patients.html", {
                    refunded: true,
                    amount: refundRes
                });
            });
        } catch (err) {
            console.error("REFUNDROUTE: Error: " + err);
        }
    });

    app.get("/refunded", function (req, res) {
        var options = {
          method: "get",
          url: helper.refundedUrl
        };
        console.log("Requesting list of refunded booking to " + options.listURL);
        request(options, function (err, response, body) {
          if (err) {
            console.error("Patients Error:", err);
            res.render("patients.html", { service_unavailable: true });
            return;
          }
    
          var refund_table = [];
          var refunds = JSON.parse(body);
          refunds.forEach((refund) => {
            refund_table.push(refund);
            console.log("Pushing patiensa from DB:" + refund);
          });
          res.render("refunded.html", { refund_table: refund_table });
        });
    



    });

}
module.exports = refundRoutes