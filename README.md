# Proxima AI - Your Personal AI-Powered Career Coach

<div align="center">
      <img width="1920" height="915" alt="Screenshot (98)" src="https://github.com/user-attachments/assets/6193a656-6c08-433f-b995-e469636ab5b2" />

</div>

<p align="center">
  <strong>Navigate your career path with clarity and confidence.</strong>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img alt="Genkit" src="https://img.shields.io/badge/Genkit-4285F4?style=for-the-badge&logo=google&logoColor=white">
</p>

---

## 🚀 Introduction

Proxima AI is an innovative, AI-driven platform designed to empower individuals in their professional journeys. It serves as a personal career coach, offering a suite of intelligent tools to help users with everything from discovering new career paths to acing their next interview. Built with a modern tech stack including Next.js and Google's Genkit, Proxima AI provides personalized, real-time guidance to make career development more accessible, intuitive, and effective.

## ✨ Key Features

Proxima AI is packed with features designed to support every stage of your career development:

- **🤖 AI Chatbot**: An intelligent virtual assistant available 24/7 to answer career-related questions, provide guidance on using the platform, and offer support.
- **🧭 Career Path Guidance**: Analyzes your professional profile, skills, and aspirations to recommend optimal and fulfilling career paths.
- **👔 Interview Simulator**: Practice for upcoming interviews with an AI that simulates a real interview environment and provides constructive feedback on your performance.
- **📄 Resume Builder**: Generate a professional, well-formatted resume in Markdown, tailored to a specific job description using your skills and experience.
- **🔍 ATS Score Checker**: Upload your resume (as a PDF) and a job description to get an estimated Applicant Tracking System (ATS) score, along with actionable feedback for optimization.
- **📈 Job Market Trends**: Stay informed with up-to-date insights on salary benchmarks, in-demand skills, and geographic job hotspots for any area of interest.
- **📊 Personalized Improvement Tracking**: Define your goals and receive a tailored improvement plan. Visually track your skill development and progress over time.
- **🎨 Modern, Responsive UI**: A clean, intuitive, and fully responsive interface with light and dark modes, built with ShadCN UI and Tailwind CSS.

---

## 🛠️ Tech Stack

This project is built with a cutting-edge, type-safe, and performant technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI/Backend**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **PDF Parsing**: [pdf.js](https://mozilla.github.io/pdf.js/)

---

## ⚙️ Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm`, `yarn`, or `pnpm`

### Environment Setup

This project uses Google's Genkit for its AI features, which requires an API key.

1.  **Obtain a Google AI API Key**:
    - Go to the [Google AI Studio](https://aistudio.google.com/).
    - Click `Get API key` and create a new key.

2.  **Create an Environment File**:
    - In the root of your project, create a file named `.env`.
    - Add your API key to this file:
      ```env
      GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
      ```
    - **Note**: The `.env` file is included in `.gitignore` to prevent you from accidentally committing your secret keys.

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/proxima-ai.git
    cd proxima-ai
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    The application requires two processes to run concurrently: the Next.js frontend and the Genkit development server for AI flows.

    - **Terminal 1: Start the Genkit Dev Server**
      ```sh
      npm run genkit:dev
      ```
      This will start the Genkit development UI, typically on `http://localhost:4000`.

    - **Terminal 2: Start the Next.js App**
      ```sh
      npm run dev
      ```
      This will start the main application, typically on `http://localhost:9002`.

4.  **Open the application:**
    Open [http://localhost:9002](http://localhost:9002) in your browser to see the running application.

---

## 📂 Project Structure

The project follows a standard Next.js App Router structure:

```
proxima-ai/
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── (app)/          # Main application routes with shared layout
│   │   │   ├── dashboard/
│   │   │   ├── ... (other feature pages)
│   │   │   └── layout.tsx
│   │   ├── globals.css     # Global styles and theme variables
│   │   └── layout.tsx      # Root layout
│   ├── ai/                 # Genkit AI configuration and flows
│   │   ├── flows/          # All AI-powered business logic
│   │   ├── dev.ts          # Genkit development server entrypoint
│   │   └── genkit.ts       # Genkit initialization
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Layout-specific components (e.g., sidebar)
│   │   └── ui/             # ShadCN UI components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── .env                    # Environment variables (GIT-IGNORED)
├── next.config.ts          # Next.js configuration
├── package.json
└── README.md
```
