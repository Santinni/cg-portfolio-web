import { getPayload } from 'payload'
import path from 'path'
import fs from 'fs'

process.loadEnvFile()

// Node.js loadEnvFile does not support ${VAR} interpolation.
// Construct DATABASE_URI from individual DB_* variables that loaded fine.
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env
if (DB_USER && DB_PASSWORD && DB_HOST && DB_PORT && DB_NAME) {
  process.env.DATABASE_URI = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
}

// Dynamic import so env vars are available before Payload config loads
const { default: payloadConfig } = await import('./src/payload.config')

/** Helper to create a Lexical paragraph node from a text string. */
function paragraph(text: string) {
  return {
    type: 'paragraph',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'text',
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text,
        version: 1,
      },
    ],
  }
}

/** Helper to wrap paragraphs into a Lexical root structure. */
function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map(paragraph),
    },
  }
}

async function seed() {
  const payload = await getPayload({ config: payloadConfig })

  console.log('Seeding database...')

  // ──────────────────────────────────────
  // 1. Media — upload a placeholder image for projects
  // ──────────────────────────────────────
  console.log('Creating media...')
  const mediaFilePath = path.resolve(process.cwd(), 'public/media/img.webp')
  const mediaFile = fs.readFileSync(mediaFilePath)

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: 'Karel Kutchan — Frontend Developer',
    },
    file: {
      data: mediaFile,
      mimetype: 'image/webp',
      name: 'img.webp',
      size: mediaFile.byteLength,
    },
  })

  // ──────────────────────────────────────
  // 2. About
  // ──────────────────────────────────────
  console.log('Creating About section...')
  await payload.create({
    collection: 'about',
    data: {
      title: 'About me',
      content: richText([
        'I build web applications that people actually enjoy using. With over ten years in frontend development — and a current role as Lead Frontend Engineer at BlueGhost — I have shipped enough products to know that great code means nothing if the end result feels clunky or slow.',
        'React, Next.js, and TypeScript are my daily tools. I use them to deliver interfaces that are fast, accessible, and straightforward to maintain. Whether it is a complex B2C energy portal or a headless CMS-driven site, I care about the same things — clean architecture, solid performance, and code that the next developer can actually read.',
        'Over the years I have worked with companies like BlueGhost, Kontent.ai, eMan, LMC, Skype, and Foxconn, building everything from design systems and component libraries to full-scale client portals for EON, ČEZ, and MND. I have led frontend teams, defined platform architecture, introduced Storybook-driven workflows, and shipped accessibility improvements using React Aria.',
        'I am pragmatic. I pick the right tool for the job — React, HTMX, vanilla JS — whatever makes the product better. I communicate clearly, I ship reliably, and I am always looking for the next interesting problem to solve.',
      ]),
      image: media.id,
    },
  })

  // ──────────────────────────────────────
  // 3. Services — 4 cards for the homepage grid
  // ──────────────────────────────────────
  console.log('Creating Services...')
  const services = [
    {
      title: 'Frontend Development',
      description:
        'Modern, production-ready web applications built with React, Next.js, and TypeScript. I focus on clean architecture, type safety, and code that scales with your product.',
      icon: 'Code',
    },
    {
      title: 'Design Systems & UI',
      description:
        'Reusable component libraries documented in Storybook, built on top of Radix UI or React Aria. Consistent UI across your entire product — from prototype to production.',
      icon: 'Layout',
    },
    {
      title: 'Performance & Accessibility',
      description:
        'Audits and hands-on optimization of Core Web Vitals, rendering strategies, and WCAG compliance. Faster load times, better SEO, and an interface everyone can use.',
      icon: 'Zap',
    },
    {
      title: 'Consulting & Code Review',
      description:
        'Technical assessment of your frontend codebase, architecture decisions, and team workflows. Honest feedback, actionable recommendations, no fluff.',
      icon: 'MessageSquare',
    },
  ]

  for (const service of services) {
    await payload.create({
      collection: 'services',
      data: service,
    })
  }

  // ──────────────────────────────────────
  // 4. Projects — key references from CV
  // ──────────────────────────────────────
  console.log('Creating Projects...')
  const projects = [
    {
      title: 'BlueGhost — Frontend Platform',
      description:
        'As Lead Frontend Engineer I oversee the frontend platform architecture and technical vision. I guide a team delivering scalable, performant web applications, define the frontend strategy, make architectural decisions, mentor developers, and conduct code reviews. Day-to-day I work hands-on with React, Next.js, and TypeScript.',
      image: media.id,
      link: 'https://blueghost.cz',
      technologies: [
        { technology: 'React' },
        { technology: 'Next.js' },
        { technology: 'TypeScript' },
        { technology: 'Architecture' },
      ],
    },
    {
      title: 'Kontent.ai — Accessibility Overhaul',
      description:
        'Contract engagement focused on making a headless CMS platform fully WCAG-compliant. I worked with React Aria hooks and built custom accessibility solutions, ensuring the application met strict guidelines within a fixed timeframe.',
      image: media.id,
      link: 'https://kontent.ai',
      technologies: [
        { technology: 'React' },
        { technology: 'React Aria' },
        { technology: 'TypeScript' },
        { technology: 'Accessibility (WCAG)' },
      ],
    },
    {
      title: 'eMan — Energy Client Portals',
      description:
        'Over two and a half years I built and maintained customer-facing portals for major Czech energy providers — EON, MND, ČEZ, and Bohemia Energy. The work included modernizing legacy codebases, improving performance, and collaborating closely with UX designers and backend teams.',
      image: media.id,
      technologies: [
        { technology: 'React' },
        { technology: 'Next.js' },
        { technology: 'TypeScript' },
        { technology: 'Styled Components' },
      ],
    },
    {
      title: 'Skype.com — Global Website',
      description:
        'Contributed to the main Skype website serving over 400,000 daily users across 30+ countries. Focused on accessibility, responsiveness, and performance while integrating content through Kentico CMS.',
      image: media.id,
      link: 'https://skype.com',
      technologies: [
        { technology: 'React' },
        { technology: 'Kentico CMS' },
        { technology: 'JavaScript' },
        { technology: 'CSS' },
      ],
    },
    {
      title: 'LMC — jobs.cz Platform',
      description:
        'Built tailored web solutions for one of the largest job platforms in the Czech Republic. Worked directly with designers and clients to deliver responsive, accessible interfaces optimized across devices and browsers.',
      image: media.id,
      link: 'https://jobs.cz',
      technologies: [
        { technology: 'React' },
        { technology: 'HTML5' },
        { technology: 'CSS3' },
        { technology: 'JavaScript' },
      ],
    },
    {
      title: 'Amp X — Digital Energy Platform',
      description:
        'Frontend development for an innovative distributed energy platform. Delivered a responsive, accessible UI using ReactJS and Material-UI, with a focus on clean, maintainable code.',
      image: media.id,
      technologies: [
        { technology: 'React' },
        { technology: 'Material-UI' },
        { technology: 'CSS-in-JS (JSS)' },
        { technology: 'Vanilla JavaScript' },
      ],
    },
    {
      title: 'Foxconn — Design System & GUI',
      description:
        'Developed a custom design system based on BEM methodology and built the graphical user interface with a strong emphasis on HTML architecture and responsive design.',
      image: media.id,
      technologies: [
        { technology: 'React' },
        { technology: 'BEM' },
        { technology: 'Vanilla JS' },
        { technology: 'CSS3' },
      ],
    },
  ]

  for (const project of projects) {
    await payload.create({
      collection: 'projects',
      data: project,
    })
  }

  // ──────────────────────────────────────
  // 5. Contact
  // ──────────────────────────────────────
  console.log('Creating Contact...')
  await payload.create({
    collection: 'contact',
    data: {
      title: "Let's work together",
      description:
        'Looking for a reliable frontend developer for your next project? Drop me a line — I am always open to interesting challenges and new collaborations.',
      email: 'karel@codeguy.cz',
      phone: '+420 605 570 494',
      linkedin: 'https://www.linkedin.com/in/karelkutchan/',
      github: 'https://github.com/Santinni',
    },
  })

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
