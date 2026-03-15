package com.chrishful.url_shortener.service;

import com.chrishful.url_shortener.dto.UrlDto;
import com.chrishful.url_shortener.generator.SnowflakeIdGenerator;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class UrlShortenerService {

    private final SnowflakeIdGenerator snowflakeIdGenerator;
    private static final String baseCname = "http://localhost:8080/";

    public UrlShortenerService(SnowflakeIdGenerator snowflakeIdGenerator) {
        this.snowflakeIdGenerator = snowflakeIdGenerator;
    }

    private final ConcurrentHashMap<String, String> localStorage = new ConcurrentHashMap<>();

    public UrlDto shortenUrl(String originalUrl) {
        String shortUrl = toBase62(snowflakeIdGenerator.nextId());
        localStorage.put(shortUrl, originalUrl);
        System.out.println("Generated short URL: " + shortUrl + " for original URL: " + originalUrl);
        return new UrlDto(originalUrl, baseCname + shortUrl);
    }

    @Cacheable(value = "urls", key = "#shortUrl")
    public String getOriginalUrl(String shortUrl) {
        try {
            localStorage.get(shortUrl);
            System.out.println("Retrieved original URL: " + localStorage.get(shortUrl) + " for short URL: " + shortUrl);
        } catch (Exception e) {
            System.out.println("Short URL not found: " + shortUrl);
            throw new IllegalArgumentException("Short URL not found: " + shortUrl);
        }
        return localStorage.get(shortUrl);
    }

    private String toBase62(long id) {
        String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.append(chars.charAt((int)(id % 62)));
            id /= 62;
        }
        return sb.reverse().toString();
    }

}
