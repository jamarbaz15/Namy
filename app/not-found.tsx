import Link from 'next/link';
import { Search, Home, TrendingUp, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/data';

export default function NotFound() {
  const popularCategories = CATEGORIES.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-5xl">🔍</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Oops! We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <form
              action="/search"
              method="GET"
              className="relative group"
            >
              <div className="absolute inset-0 bg-primary-200 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <input
                type="text"
                name="q"
                placeholder="Search baby names, meanings, or origins..."
                className="w-full pl-6 pr-16 py-4 rounded-full border-2 border-white bg-white/80 backdrop-blur-sm focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-100 outline-none text-lg shadow-xl shadow-primary-900/5 transition-all placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 aspect-square bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center"
              >
                <Search size={22} />
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
            >
              <Home size={18} /> Go Home
            </Link>
            <Link
              href="/lists"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-800 font-medium rounded-full hover:bg-gray-50 transition-colors"
            >
              <TrendingUp size={18} /> Browse Lists
            </Link>
          </div>

          {/* Popular Categories */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-card">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-6">
              <Sparkles size={14} className="fill-current" />
              <span>Popular Categories</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {popularCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/search?q=${encodeURIComponent(cat.id)}`}
                  className="group bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 rounded-xl p-4 transition-all"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <div className="font-semibold text-gray-800 group-hover:text-primary-600 text-sm">{cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} NamyLab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
