# Meet AI - AI-Powered Video Meeting SaaS

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

---

🚀 A SaaS platform that enables **AI-powered video meetings** with real-time AI agents, meeting transcripts, summaries, playback, and AI Q&A.  
Built with **React**, **Express**, **Passport.js**, **Drizzle ORM**, and **Stream.io**.

---

## 📑 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Usage](#usage)
- [Deployment](#deployment)
- [Built Using](#built-using)
- [License](#License)

---

## 🧐 About

**Meet AI** is a full-stack SaaS platform designed for hosting **video meetings** enhanced with **AI-driven agents** (e.g., tutors, coaches, assistants). These agents interact in real-time during meetings, providing dynamic support. Post-meeting, the platform generates **summaries, searchable transcripts, call recordings**, and enables **AI-powered Q&A** for reviewing discussions.

This project serves as a **scalable SaaS template** for building AI-enhanced video collaboration tools.

---

## ✨ Features

- 🔐 **User Authentication**: Supports Google OAuth, and Email login via Passport.js
- 📞 **Real-time Video Calls**: Powered by Stream.io Video SDK
- 💬 **Live In-call Chat**: Integrated with Stream.io Chat SDK
- 🤖 **AI Meeting Assistants**: Context-aware, real-time responses using OpenAI
- 📝 **Post-Meeting Intelligence**:
  - AI-generated structured summaries
  - Searchable transcripts with timestamps
  - Recording playback
  - Chat-style AI follow-ups for meeting insights
- 📂 **Dashboard**: Manage upcoming, live, and past meetings
- 📱 **Responsive UI**: Built with React and TailwindCSS
- 💳 **Subscription-Ready Architecture**: Express backend with Stripe integration support

---

## 🏁 Getting Started

### Prerequisites

You’ll need:

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) (preferred package manager)
- PostgreSQL database (recommended: [Neon.tech](https://neon.tech))
- [Stream.io](https://getstream.io) account for Video and Chat SDK
- [OpenAI](https://platform.openai.com) account for AI agents

### Installation

1. **Clone the repository**

   ```bash
    git clone https://github.com/myselfsandip/meet-ai.git
    cd meet-ai
   ```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a .env file in the project root

### Database

```bash
DATABASE_URL=postgres://user:password@host/db
```

### Authentication

```bash
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### Stream.io

```bash
STREAM_KEY=xxx
STREAM_SECRET=xxx
```

### OpenAI

```bash
OPENAI_API_KEY=sk-xxxx
```

### Set up the database with Drizzle ORM

```bash
pnpm drizzle-kit push
```

### Run development servers

**Start the backend API (Express):**

```bash
pnpm dev:server
```

**Start the frontend (React client):**

```bash
pnpm dev:client
```

## 🔧 Running the Tests

**Run automated tests with:**

```bash
pnpm test
```

**Types of Tests**

Unit Tests: Cover Drizzle models and utility functions
Integration Tests: Validate API endpoints, authentication, and meeting creation

## 🎈 Usage

Register or log in using Google, or Email via Passport.js.
Create an AI Agent by defining its behavior or persona.
Start a new meeting and select your AI agent.
Engage in real-time conversations with the AI and other participants.
After the meeting, access summaries, transcripts, and recordings.
Use the AI assistant to ask questions about the meeting content.

## 🚀 Deployment

- **Frontend (React):** Deploy to AWS Cloudfront CDN via S3 Bucket .

- **Backend (Express API):** Deploy to AWS EC2 VM.

- **Database:** Use Neon.tech for Remote Postgres Database

## ⛏️ Built Using

- React.js - Frontend UI
- TailwindCSS - Styling
- SHADCN UI - UI Components
- Tanstack Query - API Data Fetching & Caching
- Zustand - State Management
- Express.js - Backend API
- Passport.js - Authentication
- Drizzle ORM - Database ORM (Postgres)
- Stream.io - Video and Chat SDK
- OpenAI - AI-powered meeting features

## License

Licensed under the [MIT license](./LICENSE).

You're free to use my code! Just make sure to <ins>remove all my personal information</ins> before publishing your website. It's awesome to see my code being useful to someone!
