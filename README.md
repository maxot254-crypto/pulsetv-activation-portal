# PulseTV Activation Portal

Device activation system for PulseTV streaming application.

## Project Structure

- **packages/db** - Database schema and initialization using Drizzle ORM
- **packages/api-zod** - Shared Zod validation schemas for API endpoints
- **packages/api-server** - Express server with device activation endpoints

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Server will run on `http://localhost:3000`

### Build

```bash
pnpm build
```

### API Endpoints

- `GET /healthz` - Health check
- `POST /activate` - Device activation
- `POST /device/:deviceId/verify` - PIN verification

## Architecture

This monorepo uses pnpm workspaces with TypeScript for type safety and Drizzle ORM for database management.