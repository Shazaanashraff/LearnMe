package com.lms.lms.Config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "di4asaf4d",
            "api_key", "171666674981168",
            "api_secret", "kpy8aiNkw_e8br0D8Qy2TBCK9Fg"
        ));
    }
}