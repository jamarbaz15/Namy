<div align="center">
  <h1>NamyLab</h1>
  <p>The Perfect Baby Name Finder</p>
</div>

---

## About

NamyLab is a comprehensive baby name discovery platform built with Next.js. Explore thousands of curated names with detailed information about meanings, origins, popularity trends, and more. Find the perfect name for your little one with powerful search, filtering, and comparison tools.

## Features

- **Extensive Database**: 2,000+ baby names with detailed information
- **Smart Search**: Filter by gender, origin, meaning, popularity, and more
- **Popularity Trends**: Historical SSA ranking data with interactive charts
- **Name Tools**: Full name preview, surname compatibility, sibling matcher, nickname predictor
- **Curated Lists**: Browse themed collections (biblical, modern, vintage, etc.)
- **Favorites & Compare**: Save names and compare options side-by-side
- **SEO Optimized**: Fast, indexed pages with rich structured data
- **Mobile Responsive**: Beautiful design on all devices

## Tech Stack

- **Framework**: Next.js 14.2.28 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.17
- **Charts**: Recharts 2.15.0
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Namy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example file and configure:
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` with your configuration:
   - `NEXT_PUBLIC_SITE_URL`: Your site URL
   - `NEXT_PUBLIC_GA_ID`: Google Analytics ID (optional)
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console verification code (optional)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── api/                  # API routes (banner generation, etc.)
├── author/               # Author profile pages
├── compare/              # Name comparison tool
├── favorites/            # User favorites page
├── list/                 # Baby name list pages
├── lists/                # Lists hub
├── name/                 # Individual name detail pages
├── search/               # Search with filters
├── tools/                # Name tools (preview, matcher, etc.)
├── layout.tsx            # Root layout
├── page.tsx              # Homepage
├── sitemap.ts            # Dynamic sitemap
└── robots.ts             # Robots.txt configuration

components/               # Reusable React components
data/                     # Name database and list definitions
lib/                      # Utility functions and helpers
public/                   # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

Vercel automatically handles:
- Build optimization
- Image optimization
- CDN distribution
- SSL certificates

### Manual Deployment

```bash
npm run build
npm run start
```

## Performance

NamyLab is optimized for performance:

- **Server-Side Rendering**: Fast initial page loads
- **Static Generation**: Pre-rendered pages for instant loading
- **Lazy Loading**: Charts and heavy components load on demand
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic bundle splitting by route

## SEO

Built-in SEO features:

- Dynamic meta tags for all pages
- Open Graph and Twitter Card support
- Schema.org structured data (JSON-LD)
- XML sitemap generation
- robots.txt configuration
- Clean, semantic URLs
- Mobile-friendly design

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Name data sourced from public datasets
- Popularity data from U.S. Social Security Administration
- Built with love for expecting parents everywhere

---

<div align="center">
  <p>Made with ❤️ by NamyLab Team</p>
</div>
