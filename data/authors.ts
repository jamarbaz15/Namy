import { AUTHOR_PROFILE_DATES } from '@/data/content-metadata';
import type { Name } from '@/types';

export interface Author {
  id: string;
  name: string;
  slug: string;
  role: string;
  title: string;
  bio: string;
  shortBio: string;
  expertise: string[];
  credentials: string[];
  avatar: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  articlesCount?: number;
  joinedDate: string;
  featuredQuote?: string;
  publishedAt?: string;
  updatedAt?: string;
}


export const AUTHORS: Author[] = [
  {
    id: 'grace-royal',
    name: 'Grace Royal',
    slug: 'grace-royal',
    role: 'Editor-in-Chief',
    title: 'Baby Name Expert & Lead Editor',
    bio: `Grace Royal is the Editor-in-Chief at Namylab with over 15 years of experience in baby naming, linguistics, and family writing. She holds a Master's degree in Linguistics from Columbia University and has helped thousands of parents find the perfect name for their children.

Grace's journey into baby naming began when she worked as a naming consultant for expecting parents in New York City. Her fascination with etymology, cultural naming traditions, and the psychology behind names led her to become one of the most respected voices in the baby naming industry.

She has been featured in Parents Magazine, The Bump, and What to Expect, and regularly contributes expert commentary on naming trends. Grace believes that a name is the first gift parents give their child, and she's passionate about helping families make this important decision with confidence.`,
    shortBio: 'Editor-in-Chief with 15+ years in baby naming and linguistics. Columbia University M.A. in Linguistics.',
    expertise: ['Classic Names', 'Name Etymology', 'Cultural Naming Traditions', 'Celebrity Baby Names'],
    credentials: ['M.A. Linguistics, Columbia University', 'Certified Naming Consultant', '15+ Years Experience'],
    avatar: '/images/authors/grace-royal.png',
    social: {
      twitter: 'graceroyal_names',
      linkedin: 'grace-royal-linguistics',
      instagram: 'graceroyalnames'
    },
    joinedDate: '2019-01-15',
    featuredQuote: 'A name carries the weight of identity, heritage, and hope. Choosing one is both an honor and a joy.',
    ...AUTHOR_PROFILE_DATES
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    slug: 'marcus-chen',
    role: 'Senior Name Researcher',
    title: 'Multicultural Naming Specialist',
    bio: `Marcus Chen is a Senior Name Researcher at Namylab, specializing in multicultural and international baby names. With a background in Anthropology from UC Berkeley and fluency in Mandarin, Spanish, and Japanese, Marcus brings a unique global perspective to baby naming.

Growing up in a multicultural household, Marcus developed a deep appreciation for how names connect us to our heritage. He spent three years traveling through Asia, Europe, and Latin America, researching naming traditions and documenting how names evolve across cultures.

Marcus is particularly passionate about helping families with mixed heritage find names that honor multiple cultural backgrounds. His research on bilingual-friendly names and names that "travel well" has helped countless international families navigate the complex world of baby naming.`,
    shortBio: 'Multicultural naming expert with a UC Berkeley Anthropology background. Fluent in 4 languages.',
    expertise: ['International Names', 'Asian Names', 'Hispanic Names', 'Bilingual-Friendly Names'],
    credentials: ['B.A. Anthropology, UC Berkeley', 'Multilingual (4 languages)', 'Cultural Research Fellow'],
    avatar: '/images/authors/marcus-chen.png',
    social: {
      twitter: 'marcuschen_names',
      linkedin: 'marcus-chen-naming'
    },
    joinedDate: '2020-06-10',
    featuredQuote: 'The best names are bridges between cultures, connecting children to all parts of their heritage.',
    ...AUTHOR_PROFILE_DATES
  },
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    slug: 'sarah-mitchell',
    role: 'Parenting Editor',
    title: 'Family & Parenting Writer',
    bio: `Sarah Mitchell is a Parenting Editor at Namylab and a mother of three. With a journalism degree from Northwestern University and a decade of experience writing for major parenting publications, Sarah brings both professional expertise and personal insight to her work.

Before joining Namylab, Sarah was a senior editor at a leading parenting magazine where she covered everything from pregnancy to toddlerhood. Her experience as a mom to kids with unique names (Juniper, Caspian, and Wren) gives her firsthand knowledge of living with distinctive name choices.

Sarah specializes in trending names, nature-inspired names, and the practical aspects of choosing a name that grows with your child. She's known for her relatable writing style and honest advice about the real-world implications of name choices.`,
    shortBio: 'Parenting editor, mom of 3, and former senior editor at a leading parenting magazine.',
    expertise: ['Trending Names', 'Nature Names', 'Modern Names', 'Parenting Perspectives'],
    credentials: ['B.A. Journalism, Northwestern University', '10+ Years Parenting Writing', 'Mom of Three'],
    avatar: '/images/authors/sarah-mitchell.png',
    social: {
      twitter: 'sarahmitchell_mom',
      instagram: 'sarahmitchellwrites'
    },
    joinedDate: '2021-02-20',
    featuredQuote: 'Choose a name you love saying out loud - you\'ll be saying it thousands of times!',
    ...AUTHOR_PROFILE_DATES
  },
  {
    id: 'dr-elena-vasquez',
    name: 'Dr. Elena Vasquez',
    slug: 'elena-vasquez',
    role: 'Historical Names Consultant',
    title: 'Name Historian & Etymology Expert',
    bio: `Dr. Elena Vasquez is a Historical Names Consultant at Namylab, bringing academic rigor to the study of baby names. She holds a Ph.D. in Medieval History from Stanford University, with a dissertation focused on naming practices in European royal courts.

Elena's fascination with names began during her doctoral research, where she discovered how names served as political tools, cultural markers, and windows into historical periods. She has published numerous academic papers on naming conventions throughout history.

At Namylab, Elena leads research on classic names, royal names, and the historical context behind popular name choices. She's particularly skilled at tracing name origins and explaining how names have evolved over centuries. Her "Name History" columns have become reader favorites.`,
    shortBio: 'Ph.D. in Medieval History from Stanford. Expert in historical naming practices and etymology.',
    expertise: ['Historical Names', 'Royal Names', 'Name Etymology', 'Classic Names'],
    credentials: ['Ph.D. Medieval History, Stanford', 'Published Academic Researcher', 'History Professor (Adjunct)'],
    avatar: '/images/authors/elena-vasquez.png',
    social: {
      linkedin: 'dr-elena-vasquez',
      twitter: 'drvasquez_names'
    },
    joinedDate: '2020-09-01',
    featuredQuote: 'Every name tells a story spanning centuries. Understanding that story helps you choose wisely.',
    ...AUTHOR_PROFILE_DATES
  },
  {
    id: 'james-okonkwo',
    name: 'James Okonkwo',
    slug: 'james-okonkwo',
    role: 'Data & Trends Analyst',
    title: 'Baby Name Trends Specialist',
    bio: `James Okonkwo is a Data & Trends Analyst at Namylab, combining his background in data science with a passion for names. With a degree in Statistics from MIT and experience at major tech companies, James brings a unique analytical approach to understanding baby name trends.

James developed his interest in name data while analyzing Social Security Administration records as a personal project. He discovered fascinating patterns in how names rise and fall in popularity, and how cultural events influence naming trends.

At Namylab, James is responsible for popularity rankings, trend predictions, and regional name analysis. His data-driven insights help parents understand whether a name is rising, falling, or holding steady. He's known for his ability to predict "the next big name" before it hits the mainstream.`,
    shortBio: 'MIT Statistics grad specializing in baby name data analysis and trend forecasting.',
    expertise: ['Popularity Trends', 'Data Analysis', 'Regional Names', 'Trend Predictions'],
    credentials: ['B.S. Statistics, MIT', 'Former Data Scientist', 'SSA Data Specialist'],
    avatar: '/images/authors/james-okonkwo.png',
    social: {
      twitter: 'jamesokonkwo_data',
      linkedin: 'james-okonkwo-data'
    },
    joinedDate: '2021-08-15',
    featuredQuote: 'The data tells a story. Understanding trends helps you choose a name that feels fresh, not dated.',
    ...AUTHOR_PROFILE_DATES
  },
  {
    id: 'lily-anderson',
    name: 'Lily Anderson',
    slug: 'lily-anderson',
    role: 'Creative Names Editor',
    title: 'Unique & Creative Names Specialist',
    bio: `Lily Anderson is a Creative Names Editor at Namylab, specializing in unique, rare, and creative baby names. With a background in Creative Writing from Sarah Lawrence College and experience as a novelist, Lily approaches naming with an artist's eye.

Lily's love for unusual names stems from her own experience - as a "Lily" in a sea of Jennifers and Jessicas, she knows the value of standing out. She spent years building a collection of rare names from literature, mythology, and cultures around the world.

At Namylab, Lily curates lists of unique names, writes about mythological and literary names, and helps parents who want something different find options that are distinctive without being difficult. Her "Hidden Gem Names" series has introduced readers to hundreds of overlooked treasures.`,
    shortBio: 'Creative Writing grad and novelist specializing in unique, literary, and mythological names.',
    expertise: ['Unique Names', 'Literary Names', 'Mythological Names', 'Rare Names'],
    credentials: ['M.F.A. Creative Writing, Sarah Lawrence', 'Published Novelist', 'Name Collection Curator'],
    avatar: '/images/authors/lily-anderson.png',
    social: {
      instagram: 'lilyanderson_names',
      twitter: 'lilyandersonwrites'
    },
    joinedDate: '2022-01-10',
    featuredQuote: 'The most beautiful names are often hiding in plain sight - in old books, ancient myths, and forgotten histories.',
    ...AUTHOR_PROFILE_DATES
  }
];

// Helper functions
export function getAuthorById(id: string): Author | undefined {
  return AUTHORS.find(author => author.id === id);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find(author => author.slug === slug);
}

export function getAllAuthors(): Author[] {
  return AUTHORS;
}

// Assign authors to content types
export const AUTHOR_ASSIGNMENTS: Record<string, string[]> = {
  // By list category
  'meaning': ['grace-royal', 'lily-anderson', 'dr-elena-vasquez'],
  'origin': ['marcus-chen', 'dr-elena-vasquez', 'grace-royal'],
  'letter': ['sarah-mitchell', 'grace-royal', 'lily-anderson'],
  'category': ['lily-anderson', 'grace-royal', 'sarah-mitchell'],
  'popularity': ['james-okonkwo', 'sarah-mitchell', 'grace-royal'],
  'curated': ['grace-royal', 'lily-anderson', 'marcus-chen'],

  // By specific topics
  'classic': ['dr-elena-vasquez', 'grace-royal'],
  'royal': ['dr-elena-vasquez', 'grace-royal'],
  'nature': ['sarah-mitchell', 'lily-anderson'],
  'unique': ['lily-anderson', 'grace-royal'],
  'trending': ['james-okonkwo', 'sarah-mitchell'],
  'international': ['marcus-chen', 'grace-royal'],
  'mythological': ['lily-anderson', 'dr-elena-vasquez'],
  'historical': ['dr-elena-vasquez', 'grace-royal']
};

function getDeterministicIndex(values: string[], seed: string): number {
  if (values.length <= 1) return 0;

  let hash = 0;
  for (const ch of seed) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }

  return hash % values.length;
}

function getAssignedAuthor(normalizedKey: string): Author | undefined {
  const authorId = AUTHOR_ASSIGNMENTS[normalizedKey]?.[0];
  return authorId ? getAuthorById(authorId) : undefined;
}

function getDeterministicAssignedAuthor(category: string, seed: string): Author {
  const authorIds = AUTHOR_ASSIGNMENTS[category] || ['grace-royal'];
  const authorId = authorIds[getDeterministicIndex(authorIds, seed)];
  return getAuthorById(authorId) || AUTHORS[0];
}

// Get appropriate author for a list
export function getAuthorForList(listCategory: string, listKeywords: string[]): Author {
  for (const keyword of listKeywords) {
    const matchedAuthor = getAssignedAuthor(keyword.toLowerCase());
    if (matchedAuthor) {
      return matchedAuthor;
    }
  }

  const seed = `${listCategory}|${listKeywords.join('|').toLowerCase()}`;
  return getDeterministicAssignedAuthor(listCategory, seed);
}

export function getAuthorForName(name: Pick<Name, 'id' | 'origins' | 'categories' | 'meaningKeywords'>): Author {
  const topicalSignals = [
    ...name.categories,
    ...(name.meaningKeywords || []),
    ...name.origins,
  ];

  for (const signal of topicalSignals) {
    const matchedAuthor = getAssignedAuthor(signal.toLowerCase());
    if (matchedAuthor) {
      return matchedAuthor;
    }
  }

  const fallbackCategory = name.origins.length > 0 ? 'origin' : 'meaning';
  const seed = `${name.id}|${fallbackCategory}|${topicalSignals.join('|').toLowerCase()}`;
  return getDeterministicAssignedAuthor(fallbackCategory, seed);
}
