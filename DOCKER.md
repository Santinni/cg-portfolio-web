# Docker Configuration Guide

Complete Docker setup for the CG Portfolio Web application with Next.js 15, PayloadCMS, and PostgreSQL.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

The Docker setup includes three main services:

1. **PostgreSQL Database** - Data persistence layer
2. **Next.js Application** - Web application with PayloadCMS
3. **Caddy Server** - Reverse proxy with automatic HTTPS

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose v2.0 or higher
- 2GB+ RAM available for containers
- Ports 80, 443, 3000, 5432 available

## Quick Start

### Production

```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env with your settings

# 2. Start services
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f
```

### Development

```bash
# Start with hot-reload
docker-compose -f docker-compose.dev.yml up

# Or use Make
make dev
```

## Architecture

### Production Stack

```
Internet
    ↓
Caddy (Port 80/443) ← Automatic HTTPS
    ↓
Next.js App (Port 3000) ← Built with standalone output
    ↓
PostgreSQL (Port 5432) ← Data persistence
```

### Container Details

#### 1. PostgreSQL Database (`db`)
- **Image**: `postgres:16-alpine`
- **Port**: 5432
- **Volume**: `postgres_data` (persistent storage)
- **Health Check**: Ensures database is ready before starting web app

#### 2. Next.js Application (`web`)
- **Build**: Multi-stage Dockerfile (optimized)
- **Port**: 3000
- **Dependencies**: Waits for database health check
- **Runtime**: Node.js 22 (Alpine)
- **Health Endpoint**: `/api/health`

#### 3. Caddy Reverse Proxy (`caddy`)
- **Image**: `caddy:2-alpine`
- **Ports**: 80 (HTTP), 443 (HTTPS), 443/udp (HTTP/3)
- **Features**: 
  - Automatic HTTPS with Let's Encrypt
  - Security headers
  - Compression (gzip, zstd)
  - Static file caching

## Configuration

### Environment Variables

Create `.env` from `.env.example`:

```bash
# Database
DB_USER=postgres
DB_PASSWORD=strong_password_here
DB_NAME=codeguy
DB_HOST=db  # Service name in docker-compose
DB_PORT=5432

# Payload CMS
PAYLOAD_SECRET=min-32-characters-secret-key

# Application
NODE_ENV=production
DOMAIN=codeguy.cz
NEXT_PUBLIC_SERVER_URL=https://codeguy.cz

# Docker
COMPOSE_PROJECT_NAME=codeguy
```

### Dockerfile Stages

The production Dockerfile uses multi-stage builds:

1. **deps**: Install dependencies
2. **builder**: Build application
3. **runner**: Minimal runtime image

Benefits:
- Smaller final image size (~150MB vs ~1GB)
- Improved security (no build tools in production)
- Faster deployments

## Development

### Using docker-compose.dev.yml

Development setup with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

Features:
- Code mounted as volume
- Hot-reload enabled
- Development dependencies included
- Faster rebuild times

### Development Commands

```bash
# Start dev environment
make dev

# Build and start
make dev-build

# Stop
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f web
```

## Production Deployment

### Initial Setup

1. **Prepare Server**
```bash
# Install Docker and Docker Compose on your VPS
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

2. **Clone Repository**
```bash
git clone https://github.com/Santinni/cg-portfolio-web.git
cd cg-portfolio-web
```

3. **Configure Environment**
```bash
cp .env.example .env
nano .env  # Edit with production values
```

4. **Deploy**
```bash
docker-compose up -d
```

### Using Makefile

```bash
# Build and start production
make prod

# View logs
make logs

# Restart services
make restart

# Clean everything
make clean

# Access shell
make shell

# Access database
make db-shell
```

### GitHub Container Registry (GHCR)

The project includes CI/CD for automatic Docker builds:

1. Builds triggered on push to `main` or tags
2. Images pushed to `ghcr.io/santinni/cg-portfolio-web`
3. Use in production:

```bash
docker-compose pull
docker-compose up -d
```

### SSL/HTTPS with Caddy

Caddy automatically handles HTTPS:

1. Set `DOMAIN` in `.env`
2. Point DNS A record to your server IP
3. Caddy will automatically obtain SSL certificate
4. Certificate renewal is automatic

## Troubleshooting

### Database Connection Issues

```bash
# Check database logs
docker-compose logs db

# Verify database is healthy
docker-compose ps

# Test connection
docker-compose exec db psql -U postgres -d codeguy
```

### Web Application Not Starting

```bash
# Check logs
docker-compose logs web

# Verify environment variables
docker-compose exec web env | grep DATABASE_URI

# Rebuild without cache
docker-compose build --no-cache web
docker-compose up -d web
```

### Port Conflicts

If ports are in use:

```bash
# Check what's using ports
sudo lsof -i :3000
sudo lsof -i :5432
sudo lsof -i :80

# Modify docker-compose.yml to use different ports
# Example: "3001:3000" instead of "3000:3000"
```

### Volume Issues

```bash
# Remove all volumes (WARNING: deletes data)
docker-compose down -v

# Backup database before removing volumes
docker-compose exec db pg_dump -U postgres codeguy > backup.sql
```

### Memory Issues

```bash
# Check resource usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
# Or on Linux, check available memory
free -h
```

## Best Practices

### Security

1. **Never commit `.env` file**
   - Always use `.env.example` as template
   - Store secrets in secure vault

2. **Use strong passwords**
   - Database password: 32+ characters
   - Payload secret: 32+ characters

3. **Update images regularly**
```bash
docker-compose pull
docker-compose up -d
```

4. **Limit exposed ports**
   - Only expose necessary ports
   - Use firewall rules

### Performance

1. **Use Docker build cache**
```bash
# Enabled by default in docker-compose build
docker-compose build
```

2. **Optimize image size**
   - Multi-stage builds (already implemented)
   - Alpine Linux base images (already used)

3. **Health checks**
   - Ensures services are ready
   - Automatic restart on failure

### Backups

```bash
# Database backup
docker-compose exec db pg_dump -U postgres codeguy > backup_$(date +%Y%m%d).sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U postgres codeguy

# Backup volumes
docker run --rm -v codeguy_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

### Monitoring

```bash
# View resource usage
docker stats

# Check logs
docker-compose logs -f --tail=100

# Health status
docker-compose ps
```

### Updates

```bash
# Update to latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or use zero-downtime deployment
docker-compose up -d --no-deps --build web
```

## Useful Commands

```bash
# Show all containers (including stopped)
docker-compose ps -a

# Remove stopped containers
docker-compose rm

# View environment variables
docker-compose config

# Validate docker-compose.yml
docker-compose config --quiet

# Scale services (if needed)
docker-compose up -d --scale web=2

# Export logs
docker-compose logs > app_logs.txt

# Inspect container
docker inspect codeguy-web

# Copy files from container
docker cp codeguy-web:/app/file.txt ./
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

## Support

For issues or questions:
- GitHub Issues: https://github.com/Santinni/cg-portfolio-web/issues
- Email: karel@codeguy.cz
