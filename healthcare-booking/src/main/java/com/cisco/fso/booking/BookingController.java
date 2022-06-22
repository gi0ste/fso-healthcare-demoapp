package com.cisco.fso.booking;

import java.net.ConnectException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpClient.Redirect;
import java.net.http.HttpClient.Version;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;


import org.json.JSONObject;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cisco.fso.booking.Booking;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import redis.clients.jedis.Jedis;

@RestController
public class BookingController {
	
	@Autowired
    BookingRepository bookingRespository;
	Logger logger = LogManager.getLogger(BookingController.class);// LoggerFactory.getLogger(BookingController.class);
	
	private String 	EXTERNALSERVICE	= System.getenv().getOrDefault("EXTERNALSERVICE", "HTTPS://AMEX-FSO-PAYMENT-GW-SIM.AZUREWEBSITES.NET/API/PAYMENT");


	@GetMapping("/patients")
	public List<Booking> index(){
		logger.info("Requesting all booking. Querying the database...");
		return bookingRespository.findAll();
	}

	@GetMapping("/reset")
	public String reset() {
		logger.info("Requesting reset of all booking. Querying the database.");
		bookingRespository.deleteAll();
		String result = "{\"success\": \"True\", \"message\": \"Removed all booking from the DB\"}";
		return result;
	}

	@PostMapping("/booking")
	public String bookAVisit(@RequestBody Booking aBooking) {
		logger.info("Booking a trip."); 
		try{
			bookingRespository.save(aBooking);
			if (aBooking.getCreditcard().equals("Amex")) {
				logger.info("Amex payment has been selected for this booking.");
				URI uri = URI.create(EXTERNALSERVICE);
				HttpClient client = HttpClient.newBuilder()
						.version(Version.HTTP_1_1)
						.followRedirects(Redirect.NORMAL)
						.connectTimeout(Duration.ofSeconds(20))
						.build();
				
				HttpRequest request = HttpRequest.newBuilder().GET().uri(uri).build();
				HttpResponse response = client.send(request, HttpResponse.BodyHandlers.ofString());
	
				logger.info("Got a response from External Service:" + response.statusCode()  );    
				String result = "{\"success\": \"False\", \"error\": {\"type\": \""+response.statusCode()+"\", \"message\": \"failure\"}}";
				//JSONObject jsonObject= new JSONObject(result );
				return result;          
			}

		} catch (Exception e) {
			logger.error("Got an exception while booking the trip:" + e.getMessage() );
		}
		
		return aBooking.toString();
	}
}