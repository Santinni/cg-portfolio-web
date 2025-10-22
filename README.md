# CG Portfolio Web Application

Modern web application built with Next.js 15+ and PayloadCMS, designed for scalability and maintainability.

## 🛠 Technology Stack

- **Node.js**: v20.9.x (required for PayloadCMS and Next.js 15+)
- **Next.js**: v15.1.x
- **React**: v19.0.x
- **TypeScript**: v5.x
- **Package Manager**: pnpm
- **CMS**: PayloadCMS (Headless CMS for content management)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js v20.x
- pnpm (latest version)

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
cd cg-portfolio-web
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure your environment variables accordingly, including PayloadCMS credentials.

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📚 Development Guidelines

This project follows development guidelines and best practices defined in the [Rules](./.cursorrules) file. These rules serve not only as prompts for [Cursor AI](https://cursor.com) but as standards and conventions for the entire project.

- The rules cover:

  - Development philosophy and principles
  - Code writing standards
  - Naming conventions
  - Best practices for React, Next.js and TypeScript
  - Application state management
  - UI and styling
  - Testing and documentation
  - Security and accessibility

- When creating new rules, it's important to remember they serve as a comprehensive guide for the entire development team.
- Additional useful prompts for Cursor AI can be found at [cursor.directory](https://cursor.directory).

## 🏗 Project Structure

```bash
cg-portfolio-web/
├── .next/  # Next.js build outputs and cache
├── public/ # Static assets (images, fonts, etc.)
├── src/  # Application source code
│   ├── access/       # PayloadCMS access control and permissions
│   ├── app/          # Next.js App Router (v14+)
│   │   ├── (frontend)/    # Frontend application routes and components
│   │   │   ├── (pages)/   # Website pages and layouts
│   │   │   │   ├── (home)/      # Home page sections (hero, about, services, etc.)
│   │   │   │   └── curriculum-vitae/  # CV page and related components
│   │   │   ├── components/  # Frontend components
│   │   │   │   ├── primitives/  # Basic UI components (buttons, inputs, etc.)
│   │   │   │   └── ui/          # Complex UI components (navigation, cards, etc.)
│   │   │   ├── styles/         # Global styles and variables
│   │   ├── (payload)/  # PayloadCMS admin interface and configuration
│   │   └── routes/            # API routes and endpoints
│   ├── collections/  # PayloadCMS collections (data models and schemas)
│   ├── lib/         # Utility functions, hooks, and shared business logic
│   ├── payload/     # PayloadCMS core configuration and customization
│   └── types/       # TypeScript type definitions and interfaces
...
```

This structure follows modern Next.js and PayloadCMS best practices with a clear separation of concerns:

- **Frontend**: All client-side code is organized under `src/app/(frontend)`, following Next.js 14+ App Router conventions
- **Backend**: PayloadCMS admin and API functionality is isolated in `src/app/(payload)`
- **Components**: UI components are split between basic primitives and complex UI components
- **Data Layer**: Collections and types provide a robust data modeling system
- **Configuration**: Environment and build settings are kept at the root level

## 🔗 PayloadCMS Integration

This project is integrated with PayloadCMS for content management. The CMS configuration and setup details will be available in the PayloadCMS specific documentation.

## 🧪 Testing

```bash
pnpm test        # Run unit tests
pnpm test:e2e    # Run end-to-end tests
```

## 🐳 Docker Deployment

This project includes complete Docker support for both development and production environments.

### Prerequisites for Docker

- Docker Engine 20.10+
- Docker Compose v2.0+

### Production Deployment with Docker

1. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your production settings
```

2. Build and start all services:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Next.js application on port 3000
- Caddy reverse proxy on ports 80/443

3. View logs:

```bash
docker-compose logs -f web
```

4. Stop services:

```bash
docker-compose down
```

### Development with Docker

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:
- Mount your local code into the container
- Enable hot-reload for development
- Use PostgreSQL for the database

### Docker Commands Reference

```bash
# Build without cache
docker-compose build --no-cache

# View running containers
docker-compose ps

# Access web container shell
docker-compose exec web sh

# Access database
docker-compose exec db psql -U postgres -d codeguy

# Remove all containers and volumes
docker-compose down -v

# View resource usage
docker stats
```

### Production Build (without Docker)

```bash
pnpm build
pnpm start
```

## 🚀 Deployment

The application can be deployed using:
- **Docker Compose** (recommended for VPS/dedicated servers)
- **Traditional Node.js** deployment
- **Vercel/Netlify** (with external PostgreSQL)

See the Docker section above for containerized deployment instructions.

## 📝 License

[License Type] - see the [LICENSE.md](LICENSE.md) file for details
