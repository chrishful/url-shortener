# URL Shortener

A full-stack URL shortener built with Spring Boot and React. Generates short codes using Snowflake IDs encoded in base-62, with in-memory caching, rate limiting, and visit analytics.

This is mainly for refresh of basic design in case of interview questions. IK it's basic and trivial. Just need to be prepared.

## Stack

**Backend**
- Java / Spring Boot
- Spring Cache (ConcurrentHashMap)
- Bucket4j (rate limiting)
- Spring Data JPA

**Frontend**
- React
- Recharts

---

## Running Locally

### Prerequisites

- Java 21+
- Node.js 18+
- Maven

---

### Backend

From the project root:

```bash
mvn spring-boot:run
```

The server starts on `http://localhost:8080`.
 
---

### Frontend

```bash
cd frontend
npm install
npm start
```

The app starts on `http://localhost:3000`.
 
---

## API

### Shorten a URL

```
POST /shorten
Content-Type: application/json
 
{ "url": "https://example.com/some/long/path" }
```

Response:
```json
{
  "originalUrl": "https://example.com/some/long/path",
  "shortUrl": "http://localhost:8080/abc123"
}
```
 
---

### Redirect

```
GET /{shortCode}
```

Returns a `302` redirect to the original URL. If the code does not exist, redirects to the not-found page on the frontend.
 
---

### Analytics

```
GET /metrics/{shortCode}
```

Response:
```json
{
  "shortUrl": "abc123",
  "visited": ["2024-01-01T12:00:00Z", "2024-01-01T12:05:00Z"]
}
```
 
---

## Pages

| Route | Description |
|---|---|
| `/` | Shorten a URL |
| `/analytics` | View visit metrics for a short code |
| `/not-found` | Shown when a short code does not exist |
 
---

## Notes

- Rate limiting is per IP: 10 requests per minute by default
- Cache is in-memory and resets on restart
- Analytics visits are recorded before the cache is hit, so every redirect is tracked
- For multi-instance deployments, replace the in-memory cache with Redis
 
