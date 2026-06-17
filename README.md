# Inkwell
### A Modern Blogging Platform — Final Year Project

---

## Problem Statement

Existing blogging platforms present a significant usability gap for students, developers, and independent writers. Platforms such as WordPress offer extensive functionality but introduce overwhelming complexity through convoluted dashboards, plugin dependencies, and steep learning curves. Conversely, platforms like Medium provide a streamlined writing experience but impose restrictive content policies, limited customization, and paywalled distribution. There is a clear need for a clean, modern blogging platform that is intuitive to use yet sufficiently feature-rich to support content creation, media management, and accessibility — without sacrificing simplicity or creative control.

## Solution

Inkwell is a full-stack blogging platform built with modern web technologies, designed to bridge the gap between complexity and simplicity. It combines a clean, distraction-free writing experience with powerful features including rich text editing via TinyMCE, cloud-based image storage through Appwrite, and built-in text-to-speech for accessibility and hands-free reading. The platform implements secure user authentication with session management and enforces per-user post ownership through permission-based access control. Built with React, TypeScript, and Tailwind CSS, Inkwell delivers a responsive, performant, and visually polished experience across all devices while maintaining a codebase that is maintainable and extensible.

## Key Features

- **Rich Text Editor (TinyMCE)** with full formatting toolbar for a professional writing experience
- **Featured Image Upload** with cloud storage via Appwrite Storage buckets
- **Text-to-Speech** for accessibility and hands-free reading of published articles
- **User Authentication** with secure session management powered by Appwrite Auth
- **Per-User Post Ownership** with permission-based access control ensuring data privacy
- **Dark/Light Theme Toggle** for comfortable reading in any environment
- **Responsive Design** across all devices including mobile, tablet, and desktop
- **SEO-friendly URLs and page structure** for improved discoverability and indexing

## Tech Stack

| Technology | Role |
|---|---|
| React 19 | Frontend UI library |
| TypeScript | Type-safe JavaScript |
| Vite | Build tool and dev server |
| Tailwind CSS 4 | Utility-first CSS framework |
| Framer Motion | Animations and transitions |
| Appwrite | Backend-as-a-Service (Auth, Database, Storage) |
| TinyMCE | Rich text editor (GPL, self-hosted) |
| React Router v7 | Client-side routing |
| React Query | Server state management |

## Screenshots

> Screenshots will be added before final submission.

## Project Setup

### Prerequisites

- Node.js 18+ and npm
- An Appwrite account (cloud or self-hosted)

### Installation

```bash
git clone <repository-url>
cd inkwell
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
```

## Appwrite Collection Schema

Collection name: `article`

| Attribute | Type | Required | Description |
|---|---|---|---|
| Title | String | Yes | Post title |
| Content | String | Yes | HTML content from TinyMCE editor |
| featuredimage | String | No | Appwrite file ID for cover image |
| status | String | Yes | Post status (active, featured) |

**Storage Bucket**: Set bucket permissions → Role `Any` → `Read`.

## Team

| Name | Role | Contact |
|---|---|---|
| Team Member 1 | Full-Stack Developer | — |
| Team Member 2 | Frontend Developer | — |
| Team Member 3 | Backend Developer | — |

## Live demo

https://commit-42ac815bb04e0480.appwrite.network/
