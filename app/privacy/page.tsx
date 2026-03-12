import type { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { SITE_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';
import { getPrivacyPageContentDates } from '@/lib/contentDates';

const title = 'Privacy Policy';
const description =
  'Learn how NamyLab handles analytics, local preferences such as saved names, and general site usage data.';

const sections = [
  {
    title: 'What We Collect',
    body:
      'NamyLab is primarily an informational site. We may collect standard analytics data such as page views, device type, browser details, and referral information so we can understand how the site is being used. Features like saved favorites or name comparisons may also store data locally in your browser.',
  },
  {
    title: 'How We Use Information',
    body:
      'We use this information to keep the site running, improve search and list pages, measure what content helps parents most, and maintain site security. We do not sell personal data gathered through normal site usage.',
  },
  {
    title: 'Cookies And Local Storage',
    body:
      'NamyLab may use cookies or similar browser storage to remember settings, improve performance, and support features such as favorites, compare lists, and basic analytics. You can clear or block these from your browser settings, although some features may stop working as expected.',
  },
  {
    title: 'Third-Party Services',
    body:
      'Some pages may rely on third-party services for analytics, hosting, or embedded assets. Those services may process technical data according to their own policies. We limit those integrations to tools that help operate or measure the site.',
  },
  {
    title: 'Policy Updates',
    body:
      'We may update this policy when NamyLab changes features, tooling, or legal requirements. When we do, we will update the revision date on this page so the current policy is clear.',
  },
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/privacy',
  twitterCard: 'summary',
});

export default function PrivacyPage() {
  const dates = getPrivacyPageContentDates();

  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/privacy',
          title,
          description,
          breadcrumbItems: [
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy' },
          ],
          imageUrl: toSchemaImage(SITE_SHARE_ASSET),
          ...dates,
        })}
      />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              This page explains how NamyLab handles basic site data, browser-stored preferences, and analytics used to improve the product.
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
