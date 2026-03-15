package com.chrishful.url_shortener.service;

import com.chrishful.url_shortener.dto.MetricsDto;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UrlAnalyticsService {

    private final ConcurrentHashMap<String, List<Instant>> metricsStorage = new ConcurrentHashMap<>();

    public void recordVisit(String shortUrl) {
        metricsStorage.computeIfAbsent(shortUrl, k -> new java.util.concurrent.CopyOnWriteArrayList<>()).add(Instant.now());
        System.out.println("Recorded visit for short URL: " + shortUrl);
    }

    public MetricsDto getMetrics(String shortUrl) {
        var visited = metricsStorage.get(shortUrl);
        System.out.println("Metrics for short URL: " + shortUrl + " - visited times: " + (visited != null ? visited.size() : 0));
        return new MetricsDto(shortUrl, Objects.requireNonNullElseGet(visited, List::of));
    }
}
