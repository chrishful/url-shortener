package com.chrishful.url_shortener.controller;


import com.chrishful.url_shortener.dto.MetricsDto;
import com.chrishful.url_shortener.dto.UrlDto;
import com.chrishful.url_shortener.service.UrlAnalyticsService;
import com.chrishful.url_shortener.service.UrlShortenerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@CrossOrigin(origins = "*")
public class UrlShortenerController {

    private final UrlShortenerService urlShortenerService;
    private final UrlAnalyticsService urlAnalyticsService;

    public UrlShortenerController(UrlShortenerService urlShortenerService, UrlAnalyticsService urlAnalyticsService) {
        this.urlShortenerService = urlShortenerService;
        this.urlAnalyticsService = urlAnalyticsService;
    }

    public record ShortenRequest(String url) {}

    @PostMapping("/shorten")
    public ResponseEntity<UrlDto> shortenUrl(@RequestBody ShortenRequest request) {
        return ResponseEntity.ok(urlShortenerService.shortenUrl(request.url()));
    }

    @GetMapping("/{shortUrl}")
    public ResponseEntity<String> getOriginalUrl(@PathVariable String shortUrl) {
        urlAnalyticsService.recordVisit(shortUrl);
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(urlShortenerService.getOriginalUrl(shortUrl)))
                .body(urlShortenerService.getOriginalUrl(shortUrl));
    }

    @GetMapping("/metrics/{shortUrl}")
    public ResponseEntity<MetricsDto> getMetrics(@PathVariable String shortUrl) {
        return ResponseEntity
                .ok()
                .body(urlAnalyticsService.getMetrics(shortUrl));
    }

}
