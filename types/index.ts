export interface PopularityHistoryPoint {
  year: number;
  rank: number | null;
}

export interface NamePopularity {
  usa: number;
  trend: 'rising' | 'falling' | 'stable';
  latestYear?: number;
  history?: PopularityHistoryPoint[];
}

// Core Name Interface
export interface Name {
  id: string;
  name: string;
  slug: string;
  gender: 'male' | 'female' | 'unisex';
  origins: string[];
  meaning: string;
  meaningKeywords?: string[];  // For semantic filtering (e.g., ["ocean", "sea", "water"])
  pronunciation: string;
  syllables: number;
  popularity: NamePopularity;
  nicknames: string[];
  siblingSuggestions: {
    brothers: string[];
    sisters: string[];
  };
  categories: string[];
  famousNamesakes: Array<{ name: string; description: string }>;
  description: string;
  history?: string;
  publishedAt?: string;
  updatedAt?: string;
}

// Filter State for Search
export interface FilterState {
  gender: 'all' | 'male' | 'female' | 'unisex';
  query: string;
  origin?: string;
  letter?: string;
  syllables?: number;
  lengthMin?: number;
  lengthMax?: number;
  popularityMax?: number;
}

// List System Types
export interface ListFilter {
  type: 'meaning' | 'origin' | 'letter' | 'category' | 'popularity' | 'gender' | 'custom';
  matchAny?: string[];
  gender?: 'male' | 'female' | 'unisex' | 'all';
  startsWith?: string;
  country?: string;
  year?: string;
  maxRank?: number;
  // Extended filter fields for hybrid system
  origin?: string;
  meaningKeywords?: string[];
  category?: string;
  syllables?: number;
}

export interface ListDefinition {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription?: string;  // Meta description for SEO (150-160 chars)
  category: string;  // Extended to support generated list categories
  type?: string;     // For template matching (origin-gender, meaning, etc.)
  keywords: string[];
  filter: ListFilter;
  relatedLists: string[];
  featuredImage?: string;
  priority?: 'high' | 'medium' | 'low';
  customIntro?: string;  // Custom intro for core lists
  publishedAt?: string;
  updatedAt?: string;
}

export interface ContentSection {
  title: string;
  content: string;
}

export interface IntroTemplate {
  intro: string;
  seoTitle?: string;
  seoDescription?: string;
  sections: ContentSection[];
  relatedSearches?: string[];
}

export interface PageContent {
  intro: string;
  sections: ContentSection[];
  relatedSearches: string[];
  relatedLists: string[];
}

// Sibling Matcher Types
export interface SiblingSuggestion {
  name: Name;
  score: number;
  reasons: string[];
}

// Flow Check Types
export interface FlowDetail {
  type: 'good' | 'neutral' | 'warn';
  title: string;
  desc: string;
}

export interface FlowResult {
  score: number;
  feedback: string;
  details: FlowDetail[];
}

// Initials Check Types
export interface InitialVariation {
  label: string;
  value: string;
  note: string;
}

export interface InitialsResult {
  variations: InitialVariation[];
  warnings: string[];
}

// Length Analysis Types
export interface LengthAnalysis {
  charCount: number;
  syllableCount: number;
  assessment: string;
  advice: string;
  type: 'good' | 'neutral' | 'warn';
}
