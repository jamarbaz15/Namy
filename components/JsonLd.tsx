import StructuredData from '@/components/StructuredData';

interface JsonLdProps {
  data: Record<string, unknown>;
}

// Legacy wrapper kept so future imports still go through the centralized renderer.
export default function JsonLd({ data }: JsonLdProps) {
  return <StructuredData data={data} />;
}
