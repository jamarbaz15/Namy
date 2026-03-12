import type { ListDefinition } from '@/types';

export interface ListTheme {
  from: string;
  to: string;
  text: string;
  emoji: string;
  label: string;
}

// Keyword → theme mapping. Order matters — first match wins.
const KEYWORD_THEMES: Array<{ keys: string[]; theme: ListTheme }> = [
  // ── Meanings ────────────────────────────────────────────────────────────────

  // Specific / unique meanings first (prevent being swallowed by broader themes)
  { keys: ['quiet', 'silence', 'silent', 'hush', 'whisper', 'still', 'hushed', 'mute'],
    theme: { from: '#E8EAF6', to: '#C5CAE9', text: '#283593', emoji: '🤫', label: 'Meaning' } },
  { keys: ['dream', 'dreamer', 'vision', 'imagine', 'fantasy', 'reverie'],
    theme: { from: '#EDE7F6', to: '#CE93D8', text: '#4A148C', emoji: '💭', label: 'Meaning' } },
  { keys: ['magic', 'magical', 'mystical', 'mystic', 'enchant', 'enchanted', 'sorcery', 'wizard', 'witch', 'spell', 'charm'],
    theme: { from: '#1A237E', to: '#512DA8', text: '#E8EAF6', emoji: '🔮', label: 'Meaning' } },
  { keys: ['butterfly', 'flutter'],
    theme: { from: '#FCE4EC', to: '#CE93D8', text: '#6A1B9A', emoji: '🦋', label: 'Meaning' } },
  { keys: ['rainbow', 'colorful', 'spectrum'],
    theme: { from: '#E3F2FD', to: '#A5D6A7', text: '#1B5E20', emoji: '🌈', label: 'Meaning' } },
  { keys: ['dragon', 'serpent', 'wyvern'],
    theme: { from: '#212121', to: '#37474F', text: '#ECEFF1', emoji: '🐉', label: 'Meaning' } },
  { keys: ['arrow', 'archer', 'hunt', 'hunter', 'huntress'],
    theme: { from: '#FBE9E7', to: '#FFAB91', text: '#BF360C', emoji: '🏹', label: 'Meaning' } },
  { keys: ['sword', 'blade', 'lance', 'shield', 'armor'],
    theme: { from: '#ECEFF1', to: '#90A4AE', text: '#263238', emoji: '⚔️', label: 'Meaning' } },
  { keys: ['phoenix', 'rebirth', 'reborn'],
    theme: { from: '#FFF8E1', to: '#FF8A65', text: '#BF360C', emoji: '🦅', label: 'Meaning' } },
  { keys: ['deer', 'fawn', 'doe', 'stag'],
    theme: { from: '#E8F5E9', to: '#A5D6A7', text: '#2E7D32', emoji: '🦌', label: 'Meaning' } },
  { keys: ['silver', 'pearl', 'ivory', 'opal'],
    theme: { from: '#ECEFF1', to: '#CFD8DC', text: '#455A64', emoji: '🌟', label: 'Meaning' } },
  { keys: ['gold', 'golden', 'amber', 'aureate'],
    theme: { from: '#FFF8E1', to: '#FFD700', text: '#E65100', emoji: '🏆', label: 'Meaning' } },
  { keys: ['free', 'freedom', 'liberty', 'liberate'],
    theme: { from: '#E3F2FD', to: '#81D4FA', text: '#01579B', emoji: '🕊️', label: 'Meaning' } },
  { keys: ['harvest', 'grain', 'wheat', 'meadow', 'pasture'],
    theme: { from: '#FFF8E1', to: '#FFD54F', text: '#F57F17', emoji: '🌾', label: 'Meaning' } },
  { keys: ['swift', 'speed', 'fleet', 'quick'],
    theme: { from: '#E1F5FE', to: '#4FC3F7', text: '#01579B', emoji: '⚡', label: 'Meaning' } },
  { keys: ['loyal', 'loyalty', 'faithful', 'devotion'],
    theme: { from: '#EDE7F6', to: '#9575CD', text: '#311B92', emoji: '💎', label: 'Meaning' } },
  { keys: ['rose', 'ruby', 'scarlet', 'crimson'],
    theme: { from: '#FCE4EC', to: '#EF9A9A', text: '#B71C1C', emoji: '🌹', label: 'Meaning' } },
  { keys: ['sunrise', 'sunset', 'dusk', 'twilight'],
    theme: { from: '#FFF3E0', to: '#FF8A65', text: '#BF360C', emoji: '🌅', label: 'Meaning' } },
  { keys: ['wild', 'fierce', 'untamed', 'savage'],
    theme: { from: '#FBE9E7', to: '#FFAB91', text: '#BF360C', emoji: '🐅', label: 'Meaning' } },
  { keys: ['bee', 'honey', 'sweet', 'nectar'],
    theme: { from: '#FFF8E1', to: '#FFD54F', text: '#F57F17', emoji: '🍯', label: 'Meaning' } },
  { keys: ['dark', 'darkness', 'shadow', 'shade', 'black'],
    theme: { from: '#212121', to: '#424242', text: '#E0E0E0', emoji: '🌑', label: 'Meaning' } },

  { keys: ['light', 'bright', 'shine', 'radiant', 'glow', 'luminous'],
    theme: { from: '#FFFDE7', to: '#FFE57F', text: '#7A5C00', emoji: '✨', label: 'Meaning' } },
  { keys: ['love', 'heart', 'beloved', 'affection', 'dear'],
    theme: { from: '#FCE4EC', to: '#FF8FAB', text: '#880E4F', emoji: '❤️', label: 'Meaning' } },
  { keys: ['strength', 'strong', 'power', 'warrior', 'battle', 'brave', 'bold'],
    theme: { from: '#FBE9E7', to: '#FF8A65', text: '#BF360C', emoji: '💪', label: 'Meaning' } },
  { keys: ['nature', 'earth', 'forest', 'tree', 'wood', 'green'],
    theme: { from: '#E8F5E9', to: '#81C784', text: '#1B5E20', emoji: '🌿', label: 'Meaning' } },
  { keys: ['ocean', 'sea', 'wave', 'water', 'river', 'lake', 'marine'],
    theme: { from: '#E3F2FD', to: '#64B5F6', text: '#0D47A1', emoji: '🌊', label: 'Meaning' } },
  { keys: ['fire', 'flame', 'blaze', 'spark'],
    theme: { from: '#FFF8E1', to: '#FFB300', text: '#E65100', emoji: '🔥', label: 'Meaning' } },
  { keys: ['star', 'stellar', 'astro'],
    theme: { from: '#EDE7F6', to: '#B39DDB', text: '#311B92', emoji: '⭐', label: 'Meaning' } },
  { keys: ['moon', 'lunar', 'night', 'shadow'],
    theme: { from: '#E8EAF6', to: '#7986CB', text: '#1A237E', emoji: '🌙', label: 'Meaning' } },
  { keys: ['sun', 'solar', 'dawn', 'day', 'morning'],
    theme: { from: '#FFFDE7', to: '#FFD54F', text: '#F57F17', emoji: '☀️', label: 'Meaning' } },
  { keys: ['peace', 'calm', 'serene', 'tranquil', 'gentle'],
    theme: { from: '#E0F7FA', to: '#80DEEA', text: '#006064', emoji: '🕊️', label: 'Meaning' } },
  { keys: ['wisdom', 'wise', 'knowledge', 'intellect', 'sage'],
    theme: { from: '#F3E5F5', to: '#CE93D8', text: '#4A148C', emoji: '🦉', label: 'Meaning' } },
  { keys: ['flower', 'bloom', 'blossom', 'petal', 'rose', 'lily', 'jasmine'],
    theme: { from: '#FCE4EC', to: '#F8BBD9', text: '#880E4F', emoji: '🌸', label: 'Meaning' } },
  { keys: ['angel', 'divine', 'holy', 'sacred', 'heaven', 'miracle', 'blessing'],
    theme: { from: '#F5F5F0', to: '#C8D8E8', text: '#37474F', emoji: '😇', label: 'Meaning' } },
  { keys: ['victory', 'triumph', 'conquer', 'win'],
    theme: { from: '#E8F5E9', to: '#A5D6A7', text: '#1B5E20', emoji: '🏆', label: 'Meaning' } },
  { keys: ['joy', 'happy', 'happiness', 'cheer', 'delight', 'merry'],
    theme: { from: '#FFFDE7', to: '#FFF176', text: '#F57F17', emoji: '😊', label: 'Meaning' } },
  { keys: ['grace', 'graceful', 'elegant', 'noble', 'dignity'],
    theme: { from: '#FBE9E7', to: '#FFCCBC', text: '#BF360C', emoji: '🦢', label: 'Meaning' } },
  { keys: ['hope', 'faith', 'trust', 'believe'],
    theme: { from: '#E8F5E9', to: '#C8E6C9', text: '#2E7D32', emoji: '🌱', label: 'Meaning' } },
  { keys: ['king', 'queen', 'prince', 'princess', 'ruler', 'crown'],
    theme: { from: '#EDE7F6', to: '#9575CD', text: '#311B92', emoji: '👑', label: 'Meaning' } },
  { keys: ['storm', 'thunder', 'lightning', 'tempest'],
    theme: { from: '#ECEFF1', to: '#90A4AE', text: '#263238', emoji: '⛈️', label: 'Meaning' } },
  { keys: ['gift', 'treasure', 'gem', 'precious'],
    theme: { from: '#FFF8E1', to: '#FFD700', text: '#E65100', emoji: '🎁', label: 'Meaning' } },
  { keys: ['sky', 'air', 'wind', 'cloud', 'breeze'],
    theme: { from: '#E1F5FE', to: '#81D4FA', text: '#01579B', emoji: '🌤️', label: 'Meaning' } },
  { keys: ['snow', 'ice', 'winter', 'frost', 'crystal'],
    theme: { from: '#E3F2FD', to: '#BBDEFB', text: '#0D47A1', emoji: '❄️', label: 'Meaning' } },
  { keys: ['mountain', 'hill', 'stone', 'rock'],
    theme: { from: '#ECEFF1', to: '#B0BEC5', text: '#37474F', emoji: '🏔️', label: 'Meaning' } },
  { keys: ['wolf', 'bear', 'lion', 'tiger', 'eagle', 'hawk', 'fox'],
    theme: { from: '#FBE9E7', to: '#FFAB91', text: '#BF360C', emoji: '🦁', label: 'Meaning' } },

  // ── Origins ──────────────────────────────────────────────────────────────────
  { keys: ['irish', 'celtic', 'gaelic', 'ireland'],
    theme: { from: '#E8F5E9', to: '#A5D6A7', text: '#1B5E20', emoji: '☘️', label: 'Origin' } },
  { keys: ['greek', 'greece', 'hellenic'],
    theme: { from: '#E3F2FD', to: '#90CAF9', text: '#0D47A1', emoji: '🏛️', label: 'Origin' } },
  { keys: ['hebrew', 'jewish', 'israel'],
    theme: { from: '#FFF9C4', to: '#FFF176', text: '#F57F17', emoji: '✡️', label: 'Origin' } },
  { keys: ['arabic', 'arab', 'muslim', 'islamic'],
    theme: { from: '#E8F5E9', to: '#80CBC4', text: '#004D40', emoji: '🌙', label: 'Origin' } },
  { keys: ['japanese', 'japan'],
    theme: { from: '#FCE4EC', to: '#F48FB1', text: '#880E4F', emoji: '🌸', label: 'Origin' } },
  { keys: ['african', 'africa', 'swahili'],
    theme: { from: '#FFF8E1', to: '#FFCC02', text: '#E65100', emoji: '🌍', label: 'Origin' } },
  { keys: ['scandinavian', 'norse', 'viking', 'nordic', 'swedish', 'norwegian', 'danish'],
    theme: { from: '#E8EAF6', to: '#9FA8DA', text: '#1A237E', emoji: '🌊', label: 'Origin' } },
  { keys: ['latin', 'roman', 'rome'],
    theme: { from: '#FBE9E7', to: '#FFCCBC', text: '#BF360C', emoji: '🏛️', label: 'Origin' } },
  { keys: ['french', 'france'],
    theme: { from: '#E3F2FD', to: '#90CAF9', text: '#0D47A1', emoji: '🗼', label: 'Origin' } },
  { keys: ['indian', 'hindi', 'sanskrit', 'india'],
    theme: { from: '#FFF8E1', to: '#FFD54F', text: '#E65100', emoji: '🪔', label: 'Origin' } },
  { keys: ['spanish', 'spain', 'hispanic'],
    theme: { from: '#FCE4EC', to: '#EF9A9A', text: '#B71C1C', emoji: '💃', label: 'Origin' } },
  { keys: ['english', 'british', 'anglo'],
    theme: { from: '#E3F2FD', to: '#90CAF9', text: '#0D47A1', emoji: '🏰', label: 'Origin' } },
  { keys: ['italian', 'italy'],
    theme: { from: '#E8F5E9', to: '#A5D6A7', text: '#1B5E20', emoji: '🍕', label: 'Origin' } },
  { keys: ['chinese', 'china', 'mandarin'],
    theme: { from: '#FCE4EC', to: '#EF9A9A', text: '#B71C1C', emoji: '🏮', label: 'Origin' } },
  { keys: ['hawaiian', 'hawaii', 'polynesian'],
    theme: { from: '#E0F7FA', to: '#80DEEA', text: '#006064', emoji: '🌺', label: 'Origin' } },
  { keys: ['native american', 'indigenous', 'tribal'],
    theme: { from: '#FBE9E7', to: '#FFAB91', text: '#BF360C', emoji: '🦅', label: 'Origin' } },
  { keys: ['german', 'germanic', 'germany'],
    theme: { from: '#F5F5F5', to: '#E0E0E0', text: '#212121', emoji: '🦅', label: 'Origin' } },
  { keys: ['scottish', 'scotland'],
    theme: { from: '#E3F2FD', to: '#90CAF9', text: '#0D47A1', emoji: '🏴', label: 'Origin' } },
  { keys: ['welsh', 'wales'],
    theme: { from: '#FCE4EC', to: '#EF9A9A', text: '#B71C1C', emoji: '🐉', label: 'Origin' } },
  { keys: ['korean', 'korea'],
    theme: { from: '#E8EAF6', to: '#9FA8DA', text: '#1A237E', emoji: '🌸', label: 'Origin' } },

  // ── Categories ───────────────────────────────────────────────────────────────
  { keys: ['royal', 'regal', 'aristocrat'],
    theme: { from: '#EDE7F6', to: '#9575CD', text: '#311B92', emoji: '👑', label: 'Category' } },
  { keys: ['classic', 'timeless', 'traditional', 'old fashioned'],
    theme: { from: '#F5F5F0', to: '#D4C9B0', text: '#4E342E', emoji: '📜', label: 'Category' } },
  { keys: ['biblical', 'bible', 'christian', 'religious', 'spiritual'],
    theme: { from: '#FFF9C4', to: '#F0D080', text: '#7A5C00', emoji: '📖', label: 'Category' } },
  { keys: ['mythological', 'mythology', 'myth', 'legend', 'legendary'],
    theme: { from: '#EDE7F6', to: '#CE93D8', text: '#4A148C', emoji: '⚡', label: 'Category' } },
  { keys: ['literary', 'book', 'author', 'fiction', 'character'],
    theme: { from: '#F3E5F5', to: '#BA68C8', text: '#4A148C', emoji: '📚', label: 'Category' } },
  { keys: ['vintage', 'retro', 'old', 'antique', 'nostalgic'],
    theme: { from: '#FBE9E7', to: '#FFAB91', text: '#BF360C', emoji: '🕰️', label: 'Category' } },
  { keys: ['modern', 'contemporary', 'trendy', 'current'],
    theme: { from: '#E0F7FA', to: '#80DEEA', text: '#006064', emoji: '🆕', label: 'Category' } },
  { keys: ['unique', 'rare', 'unusual', 'uncommon'],
    theme: { from: '#F3E5F5', to: '#CE93D8', text: '#4A148C', emoji: '💫', label: 'Category' } },
  { keys: ['celestial', 'cosmic', 'galaxy', 'space', 'universe'],
    theme: { from: '#1A237E', to: '#283593', text: '#E8EAF6', emoji: '🌌', label: 'Category' } },
  { keys: ['short', 'one syllable', 'simple', 'brief'],
    theme: { from: '#E8F5E9', to: '#C8E6C9', text: '#2E7D32', emoji: '✂️', label: 'Category' } },
  { keys: ['long', 'elegant', 'sophisticated', 'formal'],
    theme: { from: '#EDE7F6', to: '#D1C4E9', text: '#311B92', emoji: '🎩', label: 'Category' } },

  // ── Gender (for letter pages etc.) ──────────────────────────────────────────
  { keys: ['girl', 'female', 'feminine'],
    theme: { from: '#FCE4EC', to: '#F48FB1', text: '#880E4F', emoji: '👧', label: 'Gender' } },
  { keys: ['boy', 'male', 'masculine'],
    theme: { from: '#E3F2FD', to: '#90CAF9', text: '#0D47A1', emoji: '👦', label: 'Gender' } },
  { keys: ['unisex', 'neutral', 'gender neutral'],
    theme: { from: '#EDE7F6', to: '#B39DDB', text: '#311B92', emoji: '🌈', label: 'Gender' } },
];

const FALLBACK_THEME: ListTheme = {
  from: '#FFF5F7', to: '#FFD4DF', text: '#880E4F', emoji: '🍼', label: 'Baby Names',
};

export function resolveListTheme(list: ListDefinition): ListTheme {
  // Build a SET of individual lowercase words for whole-word matching.
  // We split on spaces, dashes, underscores so "moonlight" → ["moonlight"],
  // while also keeping each source token so "moon" matches "moon" exactly.
  const rawTokens: string[] = [
    list.category,
    list.type,
    list.title,
    ...(list.keywords ?? []),
    list.filter?.origin ?? '',
    list.filter?.category ?? '',
    ...(list.filter?.matchAny ?? []),
    ...(list.filter?.meaningKeywords ?? []),
  ].filter((s): s is string => Boolean(s));

  // Build two structures:
  //  1. wordSet – individual words split from every token (for exact word hits)
  //  2. tokenSet – each full token as-is (for multi-word keys like "native american")
  const wordSet = new Set<string>();
  const tokenSet = new Set<string>();

  for (const raw of rawTokens) {
    const lower = raw.toLowerCase();
    tokenSet.add(lower);
    for (const word of lower.split(/[\s\-_]+/)) {
      if (word) wordSet.add(word);
    }
  }

  const matches = (k: string) => {
    // Multi-word key (e.g. "native american") → check full token set
    if (k.includes(' ')) return tokenSet.has(k);
    // Single word → exact word match only
    return wordSet.has(k);
  };

  for (const { keys, theme } of KEYWORD_THEMES) {
    if (keys.some(matches)) {
      return theme;
    }
  }

  return FALLBACK_THEME;
}
