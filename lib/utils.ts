import type {
  Name,
  FilterState,
  ListDefinition,
  PageContent,
  FlowResult,
  FlowDetail,
  InitialsResult,
  LengthAnalysis,
  SiblingSuggestion
} from '@/types';
import { doesNameMatchList } from '@/lib/lists';
import { getCurrentUsaRank } from '@/lib/namePopularity';

// Re-export types needed by components
export type { SiblingSuggestion } from '@/types';

/**
 * Strips trailing gender qualifiers from a list title.
 * e.g. "Names That Mean Quiet for Boys and Girls" Ã¢â€ â€™ "Names That Mean Quiet"
 * Used for H1/headings; the full title is kept for SEO meta/schema.
 */
export function stripGenderSuffix(title: string): string {
  return title
    .replace(/\s+for\s+(boys\s+and\s+girls|girls\s+and\s+boys|boys\s+&\s+girls|girls\s+&\s+boys|boys|girls|boy|girl)\s*$/i, '')
    .trim();
}

// Helper: Count Syllables (Approximate)
export function countSyllables(word: string): number {
  if (!word) return 0;
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const match = word.match(/[aeiouy]{1,2}/g);
  return match ? match.length : 1;
}

// 1. IMPROVED INITIALS CHECK
export function checkInitials(first: string, middle: string, last: string): InitialsResult {
  const f = first.charAt(0).toUpperCase();
  const m = middle.charAt(0).toUpperCase();
  const l = last.charAt(0).toUpperCase();

  const variations: Array<{ label: string; value: string; note: string }> = [];

  if (f && l) {
    if (m) {
      variations.push({ label: 'Standard', value: `${f}${m}${l}`, note: 'First Middle Last' });
      variations.push({ label: 'Monogram', value: `${f}${l}${m}`, note: 'Traditional Monogram' });
    }
    variations.push({ label: 'Short', value: `${f}${l}`, note: 'First Last' });
  }

  const problematic = new Set([
    'ASS', 'FAT', 'PIG', 'SAD', 'MAD', 'BAD', 'DIE', 'KKK', 'STD', 'WTF', 'FML',
    'BRA', 'SEX', 'TIT', 'CUM', 'FAG', 'GAY', 'JEW', 'JAP', 'BUM', 'POO', 'PEE',
    'COX', 'DUD', 'HAG', 'HOE', 'ILL', 'LSD', 'MUD', 'SOB', 'SOD', 'UGH', 'VAG',
    'WOP', 'ZOO', 'GOD', 'WAR', 'COK', 'SUX', 'HELL'
  ]);

  const warnings: string[] = [];

  variations.forEach(v => {
    if (problematic.has(v.value)) {
      warnings.push(`Combination "${v.value}" (${v.note}) spells a potentially negative word.`);
    }
  });

  return { variations, warnings };
}

// 2. SURNAME FLOW ANALYSIS
export function checkFlow(first: string, last: string): FlowResult {
  if (!first || !last) return { score: 0, feedback: 'Enter names to check.', details: [] };

  let score = 5;
  const details: FlowDetail[] = [];

  const f = first.trim().toLowerCase();
  const l = last.trim().toLowerCase();

  // A. Ending/Start Transition
  const endSound = f.slice(-1);
  const startSound = l.charAt(0);

  if (endSound === startSound) {
    score -= 1.5;
    details.push({
      type: 'warn',
      title: 'Gliding Sounds',
      desc: `The '${endSound.toUpperCase()}' at the end of the first name blends into the surname.`
    });
  } else if (['d','t','b','p','k','g'].includes(endSound) && ['d','t','b','p','k','g'].includes(startSound)) {
    score -= 0.5;
    details.push({
      type: 'neutral',
      title: 'Hard Stop',
      desc: 'Two hard consonants create a distinct pause between names.'
    });
  } else {
    details.push({
      type: 'good',
      title: 'Smooth Transition',
      desc: 'Sounds flow clearly from first to last name without stumbling.'
    });
  }

  // B. Syllable Rhythm
  const s1 = countSyllables(f);
  const s2 = countSyllables(l);

  if (s1 === 1 && s2 === 1) {
    details.push({
      type: 'neutral',
      title: 'Punchy Rhythm (1-1)',
      desc: 'Short and strong, but lacks melodic variation.'
    });
  } else if (s1 !== s2) {
    details.push({
      type: 'good',
      title: 'Dynamic Rhythm',
      desc: `Varying syllable lengths (${s1}-${s2}) create musicality.`
    });
  } else {
    details.push({
      type: 'neutral',
      title: 'Steady Rhythm',
      desc: `Consistent syllable count (${s1}-${s2}).`
    });
  }

  // C. Rhyme Check
  if (f.length > 2 && l.length > 2 && f.slice(-2) === l.slice(-2)) {
    score -= 1.5;
    details.push({
      type: 'warn',
      title: 'Rhyme Detected',
      desc: 'Names share the same ending sound, which can sound cartoonish.'
    });
  }

  const feedback = score >= 4.5 ? 'Excellent Flow' : score >= 3.5 ? 'Good Compatibility' : 'Average Flow';

  return { score: Math.max(1, Math.min(5, score)), feedback, details };
}

// 3. FULL NAME LENGTH ANALYSIS
export function analyzeLength(first: string, middle: string, last: string): LengthAnalysis {
  const full = `${first} ${middle} ${last}`.trim();
  const charCount = full.length;
  const syllableCount = countSyllables(first) + countSyllables(middle) + countSyllables(last);

  let assessment = 'Standard Length';
  let advice = 'Fits easily on all standard forms and IDs.';
  let type: 'good' | 'neutral' | 'warn' = 'good';

  if (charCount > 25) {
    assessment = 'Very Long';
    advice = 'May be truncated on airline tickets or credit cards (>25 chars).';
    type = 'warn';
  } else if (charCount > 20) {
    assessment = 'Long';
    advice = 'Distinguished, but takes time to write out.';
    type = 'neutral';
  } else if (charCount < 10 && charCount > 0) {
    assessment = 'Short';
    advice = 'Easy to spell and quick to write.';
    type = 'good';
  }

  return { charCount, syllableCount, assessment, advice, type };
}

function matchesSearchSyllableFilter(nameSyllables: number, filterSyllables?: number): boolean {
  if (!filterSyllables) {
    return true;
  }

  return filterSyllables === 4 ? nameSyllables >= filterSyllables : nameSyllables === filterSyllables;
}

// 4. FILTER NAMES
export function filterNames(names: Name[], filters: FilterState): Name[] {
  return names.filter(name => {
    // Gender
    if (filters.gender !== 'all' && name.gender !== filters.gender) return false;

    // Query (Name, Meaning, Category, or Origin)
    const q = filters.query.toLowerCase().trim();
    if (q) {
      const nameMatch = name.name.toLowerCase().includes(q);
      const meaningMatch = name.meaning.toLowerCase().includes(q);
      const categoryMatch = name.categories.some(cat => cat.toLowerCase().includes(q));
      const originMatch = name.origins.some(origin => origin.toLowerCase().includes(q));

      if (!nameMatch && !meaningMatch && !categoryMatch && !originMatch) return false;
    }

    // Letter
    if (filters.letter && !name.name.toUpperCase().startsWith(filters.letter)) return false;

    // Origin
    if (filters.origin && !name.origins.includes(filters.origin)) return false;

    // Syllables
    if (!matchesSearchSyllableFilter(name.syllables, filters.syllables)) return false;

    // Length
    if (filters.lengthMin && name.name.length < filters.lengthMin) return false;
    if (filters.lengthMax && name.name.length > filters.lengthMax) return false;

    // Popularity (Rank <= max means closer to #1, so more popular)
    if (filters.popularityMax && name.popularity.usa > filters.popularityMax) return false;

    return true;
  });
}

// 5. FILTER NAMES BY LIST
export function filterNamesByList(list: ListDefinition, namesDb: Name[]): Name[] {
  const results = namesDb.filter(name => doesNameMatchList(name, list));

  // Sort by popularity by default
  results.sort((a, b) => a.popularity.usa - b.popularity.usa);

  return results;
}

// 6. GENERATE LIST CONTENT
export function generateListContent(
  list: ListDefinition,
  count: number,
  contentTemplates: Record<string, { intro: string; sections: Array<{ title: string; content: string }>; relatedSearches?: string[] }>
): PageContent {
  let template = contentTemplates.default;

  if (list.category === 'meaning' && contentTemplates.meaning) {
    template = contentTemplates.meaning;
  } else if (list.category === 'origin' && contentTemplates.origin) {
    template = contentTemplates.origin;
  }

  const keyword = list.keywords[0] || list.title;

  const replaceVars = (text: string) => {
    return text
      .replace(/{count}/g, count.toString())
      .replace(/{title}/g, list.title)
      .replace(/{keyword}/g, keyword);
  };

  const customIntro = list.customIntro;

  if (customIntro) {
    return {
      intro: replaceVars(customIntro),
      sections: [],
      relatedSearches: [],
      relatedLists: list.relatedLists || []
    };
  }

  return {
    intro: replaceVars(template.intro),
    sections: template.sections.map(s => ({
      title: replaceVars(s.title),
      content: replaceVars(s.content)
    })),
    relatedSearches: template.relatedSearches || [],
    relatedLists: list.relatedLists || []
  };
}

// 7. GET UNIQUE ORIGINS
export function getUniqueOrigins(names: Name[]): string[] {
  const allOrigins = names.flatMap(n => n.origins);
  return Array.from(new Set(allOrigins)).sort();
}

// 8. GET SIMILAR NAMES
export function getSimilarNames(targetName: Name, allNames: Name[]): Name[] {
  return allNames.filter(n =>
    n.id !== targetName.id &&
    (n.gender === targetName.gender || n.gender === 'unisex') &&
    (n.origins.some(o => targetName.origins.includes(o)) ||
     n.categories.some(c => targetName.categories.includes(c)))
  ).slice(0, 3);
}

// 9. COMMON MIDDLE NAMES
export const COMMON_MIDDLE_NAMES = [
  'James', 'Rose', 'Grace', 'William', 'Elizabeth', 'Lee', 'Marie', 'Thomas', 'Jane', 'Alexander',
  'May', 'Louise', 'Anne', 'Joseph', 'David', 'Nicole', 'Francis', 'Ray', 'Jean', 'Arthur',
  'Scott', 'Lynn', 'Kate', 'Paul', 'Renee', 'Claire', 'Hope', 'Faith', 'June', 'Quinn', 'Gray'
];

// 10. GENERATE MIDDLE NAME
export function generateMiddleName(first: string, last: string): string {
  const f = first.trim();
  const l = last.trim();

  if (!f) return COMMON_MIDDLE_NAMES[Math.floor(Math.random() * COMMON_MIDDLE_NAMES.length)];

  const firstEnd = f.slice(-1).toLowerCase();
  const lastStart = l ? l.charAt(0).toLowerCase() : '';

  const candidates = COMMON_MIDDLE_NAMES.filter(middle => {
    const middleStart = middle.charAt(0).toLowerCase();
    const middleEnd = middle.slice(-1).toLowerCase();

    if (middleStart === firstEnd) return false;
    if (middleEnd === lastStart) return false;
    if (middleStart === f.charAt(0).toLowerCase()) return false;

    return true;
  });

  if (candidates.length === 0) {
    return COMMON_MIDDLE_NAMES[Math.floor(Math.random() * COMMON_MIDDLE_NAMES.length)];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

// 11. PREDICT NICKNAMES
export function predictNicknames(first: string, middle: string, last: string, dbName?: Name): string[] {
  const nicknames = new Set<string>();
  const f = first.trim();
  const m = middle.trim();
  const l = last.trim();

  if (!f) return [];

  // 1. DB Lookup
  if (dbName && dbName.nicknames) {
    dbName.nicknames.forEach(n => nicknames.add(n));
  }

  // 2. Common Truncations
  if (f.length > 3) nicknames.add(f.slice(0, 3));
  if (f.length > 4) nicknames.add(f.slice(0, 4));
  if (f.length >= 5) nicknames.add(f.slice(0, 5));

  // 3. Diminutives (-y, -ie)
  if (f.length >= 3) {
    const base3 = f.slice(0, 3);
    const base4 = f.slice(0, 4);

    nicknames.add(base3 + 'y');
    nicknames.add(base3 + 'ie');

    if (f.length > 4) {
      nicknames.add(base4 + 'y');
    }
  }

  // 4. Initials
  if (f && l) nicknames.add((f[0] + l[0]).toUpperCase());
  if (f && m) nicknames.add((f[0] + m[0]).toUpperCase());
  if (f && m && l) nicknames.add((f[0] + m[0] + l[0]).toUpperCase());

  // 5. Last name based
  if (l.length > 3) {
    nicknames.add(l.slice(0, 3) + 's');
  }

  return Array.from(nicknames).sort((a, b) => a.length - b.length);
}

// 12. SIBLING MATCHER ALGORITHM
export function getSiblingSuggestions(
  existingNames: string[],
  genderFilter: 'boy' | 'girl' | 'any',
  allNames: Name[]
): SiblingSuggestion[] {
  if (existingNames.length === 0) return [];

  const resolvedSiblings = existingNames.map(n => ({
    raw: n,
    data: allNames.find(db => db.name.toLowerCase() === n.toLowerCase())
  }));

  let totalLength = 0;
  let popularitySum = 0;
  let popularityCount = 0;
  const originCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const usedInitials = new Set<string>();

  existingNames.forEach(n => {
    totalLength += n.length;
    usedInitials.add(n.charAt(0).toUpperCase());
  });

  resolvedSiblings.forEach(s => {
    if (s.data) {
      const siblingRank = getCurrentUsaRank(s.data.popularity);
      if (siblingRank !== null) {
        popularitySum += siblingRank;
        popularityCount++;
      }
      s.data.origins.forEach(o => originCounts[o] = (originCounts[o] || 0) + 1);
      s.data.categories.forEach(c => categoryCounts[c] = (categoryCounts[c] || 0) + 1);
    }
  });

  const avgLength = existingNames.length > 0 ? totalLength / existingNames.length : 6;
  const avgPopularity = popularityCount > 0 ? popularitySum / popularityCount : null;

  return allNames
    .filter(candidate => {
      const isGenderMatch = genderFilter === 'any'
        ? true
        : (candidate.gender === 'unisex' || candidate.gender === (genderFilter === 'boy' ? 'male' : 'female'));

      if (!isGenderMatch) return false;
      if (existingNames.some(n => n.toLowerCase() === candidate.name.toLowerCase())) return false;
      return true;
    })
    .map(candidate => {
      let score = 60;
      const reasons: string[] = [];

      // Style Match
      let styleMatchScore = 0;
      candidate.categories.forEach(c => {
        if (categoryCounts[c]) {
          styleMatchScore += 10 * categoryCounts[c];
        }
      });
      if (styleMatchScore > 0) {
        score += Math.min(30, styleMatchScore);
        reasons.push("Matches name style");
      }

      // Origin Match
      let originMatchScore = 0;
      candidate.origins.forEach(o => {
        if (originCounts[o]) {
          originMatchScore += 10 * originCounts[o];
        }
      });
      if (originMatchScore > 0) {
        score += Math.min(20, originMatchScore);
        reasons.push("Shared origin");
      }

      // Length Balance
      const lenDiff = Math.abs(candidate.name.length - avgLength);
      if (lenDiff <= 1.5) {
        score += 15;
        reasons.push("Perfect length harmony");
      } else if (lenDiff <= 2.5) {
        score += 5;
      }

      // Popularity Tier
      const candidateRank = getCurrentUsaRank(candidate.popularity);
      if (candidateRank !== null && avgPopularity !== null && Math.abs(candidateRank - avgPopularity) < 30) {
        score += 10;
        reasons.push("Similar popularity era");
      }

      // Distinct Initial
      if (usedInitials.has(candidate.name.charAt(0).toUpperCase())) {
        score -= 10;
      } else {
        score += 5;
        reasons.push("Distinct initial");
      }

      return { name: candidate, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}



