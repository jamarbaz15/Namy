import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllAuthors } from '@/data/authors';
import StructuredData from '@/components/StructuredData';
import { createSimpleCollectionPageGraph } from '@/lib/schema';
import { AUTHORS_SHARE_ASSET, buildPageMetadata, absoluteUrl, toSchemaImage } from '@/lib/seo';
import { getAuthorsHubContentDates } from '@/lib/contentDates';

const title = 'Our Expert Team';
const description = 'Meet the baby name experts behind NamyLab. Our team of linguists, researchers, and parenting writers help you find the perfect name.';

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/authors',
  openGraphTitle: 'Meet Our Baby Name Experts',
  openGraphDescription: 'Our team of linguists, historians, and parenting experts.',
  twitterCard: 'summary',
});

export default function AuthorsPage() {
  const authors = getAllAuthors();
  const dates = getAuthorsHubContentDates();
  const itemListItems = authors.map((author) => ({
    name: author.name,
    url: absoluteUrl(`/author/${author.slug}`),
  }));

  return (
    <>
      <StructuredData
        data={createSimpleCollectionPageGraph({
          path: '/authors',
          title,
          description,
          breadcrumbItems: [
            { name: 'Home', path: '/' },
            { name: 'Authors' },
          ],
          imageUrl: toSchemaImage(AUTHORS_SHARE_ASSET),
          itemListItems,
          totalItems: itemListItems.length,
          ...dates,
        })}
      />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Expert Team
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our team of linguists, historians, data analysts, and parenting experts
              work together to help you find the perfect name for your baby.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authors.map((author) => (
                <Link
                  key={author.id}
                  href={`/author/${author.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-24 bg-gradient-to-r from-pink-400 to-rose-500 relative">
                    <div className="absolute -bottom-10 left-6">
                      <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-2xl font-bold">
                          {author.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-14 px-6 pb-6">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                      {author.name}
                    </h2>
                    <p className="text-pink-600 font-medium text-sm mb-2">
                      {author.role}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {author.shortBio}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {author.expertise.slice(0, 3).map((area, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Find the Perfect Name?
            </h2>
            <p className="text-gray-600 mb-6">
              Our experts have curated thousands of names with detailed meanings, origins, and insights.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/search"
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
              >
                Search Names
              </Link>
              <Link
                href="/lists"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Browse Lists
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

