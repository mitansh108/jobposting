# 🌉 CareerBridge - Job Posting Platform

A modern, full-stack job posting platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **Beautiful Landing Page** with Framer Motion animations
- **Authentication System** (Login/Signup/Password Reset)
- **Role-based Dashboards** (Job Seekers & Recruiters)
- **Advanced Job Search** with filters, salary ranges, and quick chips
- **Job Management** for recruiters
- **Responsive Design** for all devices
- **Secure Database** with Row Level Security (RLS)

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd jobposting
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

## 🗄️ Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `job-postings-schema.sql`
3. Set up Row Level Security policies
4. Configure authentication settings

## 🚀 Deployment on Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 👥 User Roles

### Job Seekers
- Browse and search jobs
- Apply to positions
- Save favorite jobs
- Track applications

### Recruiters
- Post job openings
- Manage job listings
- View applications
- Edit job details

## 🔐 Security Features

- Row Level Security (RLS) policies
- Secure authentication with Supabase
- Protected routes and API endpoints
- Email verification and password reset

## 📱 Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Fast loading times

## 🎨 UI/UX Features

- Smooth animations with Framer Motion
- Professional color scheme
- Intuitive navigation
- Accessible design

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.