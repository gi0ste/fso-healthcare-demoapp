const helper = require('../helper.js');
const searchRoutes = (app, request) => {



    app.all("/search", function (req, res) {
        console.log("Searching for doctor. URL is " + helper.searchUrl)


        try {

            var options = {
                method: "get",
                url: helper.searchUrl
            };

            if (req.query.category) {
                console.log("SEARCHROUTES: Filtering request based on Categories:" + req.query.category);
                options.url += "?category=" + req.query.category
            } else if (req.body.category) {
                options.url += "?category=" + req.body.category
                var payload = {
                    category: req.body.category
                };

                helper.addAppDynamicsData(payload);
            }



            // Execute the GET request to Offers Services
            request(options, function (err, response, body) {
                if (err) {
                    console.error("SEARCHROUTES Error:", err);
                    res.render("offers.html", { service_unavailable: true });
                    return;
                }

                res.render("offers.html", {
                    offers: JSON.parse(body)
                });
            });
        } catch (err) {
            console.error(err);
        }
    });
}

module.exports = searchRoutes