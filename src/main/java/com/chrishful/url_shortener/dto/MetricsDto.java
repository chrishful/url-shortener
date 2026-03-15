package com.chrishful.url_shortener.dto;

import java.time.Instant;
import java.util.List;

public class MetricsDto {
    private final String shortUrl;
    private final List<Instant> visited;

    public MetricsDto(String shortUrl, List<Instant> visited) {
        this.shortUrl = shortUrl;
        this.visited = visited;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public List<Instant> getVisited() {
        return visited;
    }

}
