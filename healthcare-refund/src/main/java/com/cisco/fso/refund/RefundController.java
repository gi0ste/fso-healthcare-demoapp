package com.cisco.fso.refund;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
public class RefundController {
	
	@Autowired
    RefundRepository refundRepository;
	
    private String EXTERNALSERVICE  = System.getenv().getOrDefault("EXTERNALSERVICE", "HTTPS://AMEX-FSO-PAYMENT-GW-SIM.AZUREWEBSITES.NET/API/PAYMENT");
    private String REDIS_SERVICE    = System.getenv().getOrDefault("REDIS_SERVICE","34.132.233.144");
    private int REDIS_PORT      	= Integer.parseInt( System.getenv().getOrDefault("REDIS_PORT", "6379") );
	private String redisKey = "transactions";
	private String redisKeyRefunded = "refunded";
	
   
    
	@GetMapping("/version")
	public String version() {
		System.out.println("Requesting version....");
		return "RefundService version 1.0.0";
	}
	
	@GetMapping("/info")
	public String info() {
		System.out.println("Requesting version....");
		return "EXTERNALSERVICE:" + this.EXTERNALSERVICE + "\n REDIS_SERVICE:" + this.REDIS_SERVICE + ":" + this.REDIS_PORT;
	}
	
	@GetMapping("/refunded")
	@ResponseBody
	public List<Refund> refunded() {
		System.out.println("Requesting all refunds. Querying the database...");
		return refundRepository.findAll();
	}
	
	
	@PostMapping("/refund")
	public int refund(@RequestBody Refund aBooking ) {
		System.out.println("RefundController: Requesting refund for booking " + aBooking.toString() );
		refundRepository.save(aBooking);
		System.out.println("Added booking to the list of refunded pax");
		System.out.println("Refunded: " + aBooking.getPrice());
		return aBooking.getPrice();
	}


}
