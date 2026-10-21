package com.project.work.rm.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    private static final String BASIC_AUTH = "basicAuth";

    // Declares HTTP Basic so the "Authorize" button in Swagger UI can call the protected endpoints.
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Health Bridge Clinic REST APIs")
                        .version("1.1")
                        .description("Documentation of the REST APIs for the Health Bridge Clinic App by Roberta Matera. "
                                + "Errors are returned as {status, code, message, path, fieldErrors}."))
                .components(new Components().addSecuritySchemes(BASIC_AUTH,
                        new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("basic")))
                .addSecurityItem(new SecurityRequirement().addList(BASIC_AUTH));
    }
}
