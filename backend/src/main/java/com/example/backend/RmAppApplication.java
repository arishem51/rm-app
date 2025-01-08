package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

//FIXME: remove it when have db
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class RmAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(RmAppApplication.class, args);
	}

}
