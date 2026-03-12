import type { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { SITE_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';
import { getTermsPageContentDates } from '@/lib/contentDates';

const title = 'Terms of Service';
const description =
  'Read the basic terms that govern use of NamyLab, including content use, acceptable behavior, and service limitations.';

const sections = [
  {
    title: 'Use Of The Site',
    body:
      'NamyLab is provided for informational and planning purposes. You may browse, search, and use the site for personal, non-destructive use. You may not interfere with site availability, attempt to scrape the service at harmful volume, or misuse interactive tools.',
  },
  {
    title: 'Content And Accuracy',
    body:
      'We work to make name meanings, origins, lists, and editorial content useful and consistent, but no database is perfect. Site content should be treated as general information rather than legal, medical, or professional advice.',
  },
  {
    title: 'Intellectual Property',
    body:
      'The NamyLab brand, editorial copy, page structure, and supporting assets are protected by applicable intellectual property rules. You may not republish or reproduce substantial portions of the site as your own product or dataset without permission.',
  },
  {
    title: 'Third-Party Links And Services',
    body:
      'Some pages may reference third-party assets or services. We are not responsible for the content, security, or policies of external sites once you leave NamyLab.',
  },
  {
    title: 'Service Changes',
    body:
      'We may update, improve, suspend, or remove parts of the site when needed. Continued use of NamyLab after an update means you accept the current terms shown on this page.',
  },
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/terms',
  twitterCard: 'summary',
});

export default function TermsPage() {
  const dates = getTermsPageContentDates();

  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/terms',
          title,
          description,
          breadcrumbItems: [
            { name: 'Home', path: '/' },
            { name: 'Terms of Service' },
          ],
          imageUrl: toSchemaImage(SITE_SHARE_ASSET),
          ...dates,
        })}
      />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              These terms set the basic rules for using NamyLab and explain the boundaries around our content, tools, and service availability.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-8">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
