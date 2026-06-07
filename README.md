# Hacker News API (TypeScript)

An Express API that scrapes Hacker News and queries IMDb, returning lightweight JSON data for demos and learning.

## Features
- `GET /` returns Hacker News stories sorted by comment count.
- `GET /scraper2` returns popular IMDb movie titles with director credits from IMDb's cached GraphQL data.
- Built with TypeScript and an automated CI workflow.

## Requirements
- Node `>= 25.8.1` (see `.nvmrc`).
- npm `>= 11`.

## Setup
```bash
npm install
```

## Development
```bash
npm test
npm run lint
npm run typecheck
```

## Build And Run
```bash
npm run build
npm start
```

The server listens on `PORT` (default `3000`).

## API
### `GET /`
Returns Hacker News stories, sorted by `comments` (desc).  
Query params:
- `limit` (number, optional): number of items to return (default `30`).

### `GET /scraper2`
Returns popular IMDb movie titles from IMDb's MOVIEmeter chart and director names via IMDb's cached GraphQL endpoint.  
Query params:
- `limit` (number, optional): number of items to return (default `10`).

## Testing Notes
- Integration tests stub outbound HTTP and IMDb GraphQL requests.
- To avoid cache timers hanging tests, the suite sets `DISABLE_CACHE=true`.

## CI
GitHub Actions runs `lint`, `test`, `typecheck`, and `build` on each push and pull request.
