package com.project.work.rm.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Project Work 16 REST APIs")
                .version("1.0")
                .description("Documentation of the REST APIs for the Project Work 16 by Roberta Matera"));
    }
}