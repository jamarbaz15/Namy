import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllAuthors, getAuthorBySlug, AUTHOR_ASSIGNMENTS } from '@/data/authors';
import { LIST_DEFINITIONS } from '@/data';
import StructuredData from '@/components/StructuredData';
import { createAuthorProfileGraph } from '@/lib/schema';
import { buildPageMetadata } from '@/lib/seo';
import { getAuthorContentDates } from '@/lib/contentDates';

export async function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const author = getAuthorBySlug(params.slug);
  if (!author) {
    return {};
  }

  return buildPageMetadata({
    title: `${author.name} - ${author.role}`,
    description: author.shortBio,
    path: `/author/${author.slug}`,
    openGraphTitle: `${author.name} - ${author.title}`,
    openGraphDescription: author.shortBio,
    openGraphType: 'profile',
    twitterTitle: author.name,
    twitterDescription: author.shortBio,
    twitterCard: 'summary',
  });
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) notFound();

  const allLists = LIST_DEFINITIONS;

  const authorLists = allLists.filter(list => {
    const categoryAuthors = AUTHOR_ASSIGNMENTS[list.category ?? ''] || [];
    const keywordMatches = (list.keywords ?? []).some(keyword => {
      const assignment = AUTHOR_ASSIGNMENTS[keyword.toLowerCase()];
      return assignment?.includes(author.id);
    });
    return categoryAuthors.includes(author.id) || keywordMatches;
  }).slice(0, 6);

  return (
    <>
      <StructuredData data={createAuthorProfileGraph(author, getAuthorContentDates(author))} />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <nav className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-pink-600">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/authors" className="hover:text-pink-600">Authors</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{author.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {author.name}
                </h1>
                <p className="text-lg text-pink-600 font-medium mb-2">
                  {author.role}
                </p>
                <p className="text-gray-600 mb-4">
                  {author.title}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {author.credentials.map((credential, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {credential}
                    </span>
                  ))}
                </div>

                {author.social && (
                  <div className="flex gap-4">
                    {author.social.twitter && (
                      <a
                        href={`https://twitter.com/${author.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        aria-label="Twitter"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}
                    {author.social.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${author.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {author.social.instagram && (
                      <a
                        href={`https://instagram.com/${author.social.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-500 transition-colors"
                        aria-label="Instagram"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {author.featuredQuote && (
          <section className="bg-gradient-to-r from-pink-50 to-rose-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <blockquote className="text-xl md:text-2xl italic text-gray-700 text-center">
                "{author.featuredQuote}"
              </blockquote>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {author.name.split(' ')[0]}</h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  {author.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Areas of Expertise</h3>
                  <ul className="space-y-2">
                    {author.expertise.map((area, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {area}
                      </li>
                    ))}
                  </ul>

                  <hr className="my-6" />

                  <div className="text-sm text-gray-500">
                    <p className="mb-2">
                      <strong>Joined:</strong> {new Date(author.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {authorLists.length > 0 && (
          <section className="py-12 bg-white border-t">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Articles by {author.name.split(' ')[0]}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {authorLists.map((list) => (
                  <Link
                    key={list.id}
                    href={`/list/${list.slug}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-1">
                      {list.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {list.category} Names
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 border-t">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {getAllAuthors()
                .filter(a => a.id !== author.id)
                .slice(0, 3)
                .map((otherAuthor) => (
                  <Link
                    key={otherAuthor.id}
                    href={`/author/${otherAuthor.slug}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:border-pink-300 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold">
                      {otherAuthor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{otherAuthor.name}</h3>
                      <p className="text-sm text-gray-500">{otherAuthor.role}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


