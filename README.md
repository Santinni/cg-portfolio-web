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
│   │   ├── (backend-payload)/  # PayloadCMS admin interface and configuration
│   │   └── routes/            # API routes and endpoints
│   ├── collections/  # PayloadCMS collections (data models and schemas)
│   ├── lib/         # Utility functions, hooks, and shared business logic
│   ├── payload/     # PayloadCMS core configuration and customization
│   └── types/       # TypeScript type definitions and interfaces
...
```

This structure follows modern Next.js and PayloadCMS best practices with a clear separation of concerns:

- **Frontend**: All client-side code is organized under `src/app/(frontend)`, following Next.js 14+ App Router conventions
- **Backend**: PayloadCMS admin and API functionality is isolated in `src/app/(backend-payload)`
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

## 🚀 Deployment

```bash
pnpm build
pnpm start
```

## 📝 License

[License Type] - see the [LICENSE.md](LICENSE.md) file for details

## 👥 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
