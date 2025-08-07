# 🔗 SnipLink - AI-Powered Bookmark Manager


[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://sniplink-v1.vercel.app)

> **Save, organize, and summarize your favorite links with AI-powered intelligence.**

SnipLink is a modern, AI-powered bookmark manager that automatically generates summaries for your saved links, making it easy to organize and rediscover your content. Built with Next.js 15, Supabase, and featuring a beautiful glass-morphism UI.

![SnipLink Preview](https://sniplink-v1.vercel.app/preview.png)


## ✨ Features

### 🤖 **AI-Powered Summaries**
- Automatic content summarization using Jina AI
- Smart extraction of key information from any webpage
- Instant insights without reading full articles

### 🎨 **Modern UI/UX**
- Beautiful glass-morphism design
- Smooth animations and micro-interactions
- Responsive design for all devices
- Dark/Light theme support

### 📚 **Smart Organization**
- Drag & drop reordering (persistent across sessions)
- Tag-based filtering and categorization
- Advanced search across titles, URLs, and summaries
- Multiple sorting options

### 🔐 **Secure Authentication**
- Google OAuth integration
- Email/password authentication
- Row-level security with Supabase
- User data isolation

### ⚡ **Performance**
- Built with Next.js 15 App Router
- Server-side rendering for fast loading
- Optimized database queries
- Real-time updates

## 🚀 Live Demo

**Try SnipLink now:** [https://sniplink-v1.vercel.app](https://sniplink-v1.vercel.app)

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Google OAuth + Email)
- **Styling:** Tailwind CSS + shadcn/ui
- **AI Integration:** Jina AI for content summarization
- **Deployment:** Vercel
- **Language:** TypeScript

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials (optional)

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/yourusername/sniplink.git
cd sniplink
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Google OAuth (for enhanced authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
\`\`\`

### 4. Set up Supabase

1. Create a new Supabase project
2. Run the SQL script from `scripts/001-create-tables.sql` in your Supabase SQL editor
3. Enable Google OAuth in Supabase Auth settings (optional)

### 5. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

\`\`\`sql
-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  favicon_url TEXT,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## 🎯 Usage

### Adding Bookmarks
1. Click the "Add Bookmark" button
2. Paste any URL
3. Add optional tags
4. SnipLink automatically fetches the title, favicon, and generates an AI summary

### Organizing Bookmarks
- **Drag & Drop:** Reorder bookmarks by dragging (position sorting mode)
- **Tags:** Filter bookmarks by clicking on tags
- **Search:** Find bookmarks by title, URL, or summary content
- **Sort:** Multiple sorting options (newest, oldest, title, URL, position)

### AI Summaries
- View all AI-generated summaries in the dedicated Summaries page
- Search through summaries for quick content discovery
- Filter summaries by tags

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sniplink)

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Supabase Setup

1. **Create Project:** Go to [supabase.com](https://supabase.com) and create a new project
2. **Database Setup:** Run the SQL script from `scripts/001-create-tables.sql`
3. **Auth Configuration:** 
   - Enable email authentication
   - Configure Google OAuth (optional)
   - Set up redirect URLs for your domain

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

## 📱 Features Overview

### Dashboard
- Overview of all bookmarks with statistics
- Recent bookmarks with AI summaries
- Quick actions and insights

### Bookmarks Management
- Complete CRUD operations
- Drag & drop reordering
- Advanced filtering and search
- Bulk operations support

### AI Summaries
- Dedicated page for all AI-generated summaries
- Search and filter summaries
- Export capabilities

### User Experience
- Responsive design for mobile/desktop
- Dark/Light theme toggle
- Smooth animations and transitions
- Keyboard shortcuts support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Jina AI](https://jina.ai/) - AI-powered content processing
- [Vercel](https://vercel.com/) - Deployment and hosting platform

## 📞 Support

- **Live Demo:** [https://sniplink-v1.vercel.app](https://sniplink-v1.vercel.app)
- **Issues:** [GitHub Issues](https://github.com/yourusername/sniplink/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/sniplink/discussions)

---

<div align="center">

**Made with ❤️ by [Ojas Bhosale](https://github.com/ojasbhosale)**

[⭐ Star this repo](https://github.com/yourusername/sniplink) • [🐛 Report Bug](https://github.com/yourusername/sniplink/issues) • [✨ Request Feature](https://github.com/yourusername/sniplink/issues)

</div>
