package com.cisco.fso.refund;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class RefundApplication {

	public static void main(String[] args) {
		SpringApplication.run(RefundApplication.class, args);
	}
}