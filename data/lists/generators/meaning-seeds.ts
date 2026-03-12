import type { ListDefinition } from '@/types';

const RAW_KEYWORD_BLOB = `
names meaning adventure
names meaning air
names meaning alone
names meaning angel
names meaning anger
names meaning art
names meaning autumn
names meaning balance
names meaning beautiful
names meaning beauty
names meaning beloved
names meaning betrayal
names meaning black
names meaning blessing
names meaning blind
names meaning blood
names meaning blue
names meaning brave
names meaning bright
names meaning broken
names meaning brown
names meaning calm
names meaning change
names meaning chaos
names meaning chaos girl
names meaning chaos male
names meaning cloud
names meaning cold
names meaning colorful
names meaning crazy
names meaning creation
names meaning creative
names meaning cunning
names meaning cursed
names meaning dark
names meaning darkness
names meaning dawn
names meaning death
names meaning deceit
names meaning deceiver
names meaning demon
names meaning destruction
names meaning dragon
names meaning dream
names meaning dusk
names meaning earth
names meaning earth boy
names meaning eclipse
names meaning electricity
names meaning empty
names meaning envy
names meaning eternal
names meaning fairy
names meaning faith
names meaning faithful
names meaning fast
names meaning fate
names meaning fear
names meaning fighter
names meaning fire
names meaning first
names meaning flame
names meaning flight
names meaning fool
names meaning forest
names meaning forgotten
names meaning free
names meaning freedom
names meaning friend
names meaning frost
names meaning future
names meaning gentle
names meaning gentle boy
names meaning gift
names meaning god
names meaning gold
names meaning golden
names meaning grace
names meaning gray
names meaning greed
names meaning green
names meaning grey
names meaning guardian
names meaning happy
names meaning harmony
names meaning healer
names meaning healing
names meaning heart
names meaning heaven
names meaning helper
names meaning hero
names meaning hidden
names meaning honey
names meaning hope
names meaning hunter
names meaning ice
names meaning illusion
names meaning immortal
names meaning innocent
names meaning intelligent
names meaning joy
names meaning justice
names meaning kind
names meaning king
names meaning knowledge
names meaning leader
names meaning liar
names meaning life
names meaning light
names meaning lightning
names meaning lonely
names meaning lost
names meaning love
names meaning loyal
names meaning luck
names meaning lucky
names meaning lust
names meaning magic
names meaning memory
names meaning mercy
names meaning messenger
names meaning metal
names meaning midnight
names meaning mirror
names meaning mischief
names meaning moon
names meaning moonlight
names meaning mother
names meaning mountain
names meaning music
names meaning mysterious
names meaning mystery
names meaning night
names meaning nightmare
names meaning noble
names meaning nothing
names meaning ocean
names meaning one
names meaning orange
names meaning pain
names meaning passion
names meaning peace
names meaning pearl
names meaning perfect
names meaning perseverance
names meaning pink
names meaning poison
names meaning power
names meaning pride
names meaning prince
names meaning princess
names meaning protector
names meaning puppet
names meaning pure
names meaning purple
names meaning queen
names meaning quiet
names meaning rain
names meaning rainbow
names meaning rebel
names meaning rebirth
names meaning reborn
names meaning red
names meaning redemption
names meaning resilient
names meaning revenge
names meaning rock
names meaning rose
names meaning ruler
names meaning sacrifice
names meaning sad
names meaning sand
names meaning savior
names meaning sea
names meaning second chance
names meaning secret
names meaning seeker
names meaning shadow
names meaning shield
names meaning silent
names meaning silver
names meaning siren
names meaning sky
names meaning sleep
names meaning small
names meaning smart
names meaning sneaky
names meaning snow
names meaning soft
names meaning sorrow
names meaning soul
names meaning sound
names meaning space
names meaning speed
names meaning spirit
names meaning spring
names meaning star
names meaning stardust
names meaning starlight
names meaning stars
names meaning storm
names meaning strawberry
names meaning strength
names meaning strong
names meaning suffering
names meaning sun
names meaning sun girl
names meaning sunset
names meaning sunshine
names meaning survivor
names meaning sweet
names meaning thief
names meaning thunder
names meaning time
names meaning transformation
names meaning traveler
names meaning trickster
names meaning truth
names meaning unique
names meaning unknown
names meaning unlucky
names meaning void
names meaning wanderer
names meaning war
names meaning water
names meaning white
names meaning wild
names meaning wind
names meaning winter
names meaning wisdom
names meaning wise
names meaning wrath
names meaning yellow

names that mean abandoned
names that mean abundance
names that mean abyss
names that mean angry
names that mean apple
names that mean artist
names that mean ash
names that mean beast
names that mean beginning
names that mean blessed
names that mean blossom
names that mean calm boy
names that mean child of god
names that mean clever
names that mean colors
names that mean comfort
names that mean compassion
names that mean courage
names that mean creator
names that mean day
names that mean dead
names that mean defender
names that mean destiny
names that mean destroyer
names that mean determination
names that mean dreamer
names that mean dreams
names that mean electric
names that mean elegant
names that mean empathy
names that mean energy
names that mean explorer
names that mean failure
names that mean family
names that mean fearless
names that mean fierce
names that mean fire warrior
names that mean forgiveness
names that mean fortune
names that mean friendship
names that mean giant
names that mean goddess
names that mean graceful
names that mean growth
names that mean guardian angel
names that mean guide
names that mean happiness
names that mean heal
names that mean health
names that mean heavenly
names that mean help
names that mean holy
names that mean honest
names that mean honor
names that mean hope
names that mean humility
names that mean infinity
names that mean intelligence
names that mean iron
names that mean journey
names that mean kindness
names that mean laughter
names that mean leader male
names that mean life
names that mean lightning girl
names that mean loyalty
names that mean loved
names that mean mermaid
names that mean miracle or blessing
names that mean mischievous
names that mean moonlight
names that mean music
names that mean new
names that mean paradise
names that mean patience
names that mean peaceful
names that mean phoenix
names that mean poet
names that mean precious
names that mean promise
names that mean prosperity
names that mean protection
names that mean purity
names that mean quick
names that mean rebirth boy
names that mean resilience
names that mean resurrection
names that mean river
names that mean sadness
names that mean safety
names that mean servant
names that mean shepherd
names that mean shine
names that mean shooting star
names that mean silence
names that mean soldier
names that mean spark
names that mean special
names that mean summer
names that mean sunflower
names that mean sunlight
names that mean sunrise
names that mean surprise
names that mean swift
names that mean thankful
names that mean the end
names that mean the sea
names that mean the sun
names that mean timekeeper
names that mean travel or adventure
names that mean trust
names that mean unity
names that mean universe
names that mean vengeance
names that mean venom
names that mean vision
names that mean voice
names that mean warmth
names that mean warrior
names that mean weather
names that mean wings
names that mean wish
names that mean wonder
names that mean world

boy names meaning light
girl names meaning light
boy names meaning fire
girl names meaning fire
boy names meaning hope
girl names meaning hope
boy names meaning strength
girl names meaning strength
boy names meaning warrior
girl names meaning warrior
boy names meaning moon
girl names meaning moon
boy names meaning love
girl names meaning love
boy names meaning water
girl names meaning water

japanese names meaning angel
japanese names meaning blood
japanese names meaning blue
japanese names meaning dark
japanese names meaning death
japanese names meaning demon
japanese names meaning dragon
japanese names meaning fire
japanese names meaning ice
japanese names meaning light
japanese names meaning lightning
japanese names meaning love
japanese names meaning mischief
japanese names meaning moon
japanese names meaning night
japanese names meaning ocean
japanese names meaning red
japanese names meaning shadow
japanese names meaning snow
japanese names meaning star
japanese names meaning strength
japanese names meaning strong
japanese names meaning sun
japanese names meaning water
japanese names meaning wind
japanese names that mean anger
japanese names that mean darkness
japanese names that mean evil
japanese names that mean hope
japanese names that mean life
japanese names that mean moonlight
japanese names that mean music
japanese names that mean protector
japanese names that mean sadness
japanese names that mean sweet
japanese names that mean warrior

last names meaning dark
last names meaning death
last names meaning fire
last names meaning light
last names meaning love
last names meaning moon
last names meaning star
last names meaning sun
last names meaning warrior
last names meaning water
last names that mean darkness
last names that mean evil
last names that mean hope
last names that mean power
last names that mean royalty
last names that mean strong
`;

const TERM_SYNONYMS: Record<string, string[]> = {
  light: ['bright', 'luminous', 'glow', 'radiant', 'shine'],
  strength: ['strong', 'power', 'might', 'resilient', 'brave'],
  love: ['beloved', 'affection', 'dear', 'cherish', 'adore'],
  warrior: ['fighter', 'defender', 'battle', 'hero', 'brave'],
  water: ['ocean', 'sea', 'river', 'rain', 'wave'],
  fire: ['flame', 'blaze', 'ember', 'spark', 'burning'],
  moon: ['lunar', 'moonlight', 'night', 'crescent'],
  sun: ['sunlight', 'sunshine', 'day', 'dawn'],
  peace: ['calm', 'harmony', 'serenity', 'tranquil'],
  star: ['starlight', 'celestial', 'sky', 'cosmic']
};

const MEANING_SEED_ORIGINS: Record<string, string> = {
  japanese: 'Japanese',
};

function toTitleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractRawKeywords(): string[] {
  return RAW_KEYWORD_BLOB
    .split('\n')
    .map(line => line.trim().toLowerCase())
    .filter(Boolean)
    .filter(line => line.includes('meaning') || line.includes('mean'));
}

function canonicalizeRawKeyword(raw: string): string {
  const lower = raw.toLowerCase().trim();

  if (lower.startsWith('japanese names')) {
    return lower
      .replace(/^japanese names\s+(meaning|that mean)\s+/, 'japanese ')
      .replace(/\s+(boy|boys|girl|girls|male|female)$/, '')
      .replace(/\s+or\s+/g, ' and ')
      .trim();
  }

  if (lower.startsWith('last names')) {
    return lower
      .replace(/^last names\s+(meaning|that mean)\s+/, 'last-name ')
      .replace(/\s+or\s+/g, ' and ')
      .trim();
  }

  const withoutPrefix = lower
    .replace(/^(boy|boys|girl|girls)\s+names\s+(meaning|that mean)\s+/, '')
    .replace(/^names\s+(meaning|that mean)\s+/, '')
    .replace(/^names\s+with\s+meaning\s+/, '');

  return withoutPrefix
    .replace(/\s+(boy|boys|girl|girls|male|female)$/, '')
    .replace(/\s+or\s+/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toSlug(term: string): string {
  const sanitized = term
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  if (sanitized.startsWith('japanese-')) {
    return sanitized.replace(/^japanese-/, 'japanese-names-that-mean-');
  }

  if (sanitized.startsWith('last-name-')) {
    return sanitized.replace(/^last-name-/, 'last-names-that-mean-');
  }

  return `names-that-mean-${sanitized}`;
}

function getMatchAny(term: string): string[] {
  const parts = term.split(' ').filter(Boolean);
  const synonyms = TERM_SYNONYMS[term] || [];
  const expandedFromParts = parts.flatMap(part => TERM_SYNONYMS[part] || []);

  return Array.from(new Set([term, ...parts, ...synonyms, ...expandedFromParts]));
}

function getMeaningSeedOrigin(term: string): string | undefined {
  const [prefix] = term.split(' ');
  return MEANING_SEED_ORIGINS[prefix];
}

function getMeaningSeedBaseTerm(term: string): string {
  const origin = getMeaningSeedOrigin(term);
  if (!origin) {
    return term;
  }

  return term.replace(/^[^\s]+\s+/, '').trim();
}

function buildMeaningSeedFilter(term: string): ListDefinition['filter'] {
  const origin = getMeaningSeedOrigin(term);
  const baseTerm = getMeaningSeedBaseTerm(term);

  return {
    type: 'meaning',
    ...(origin ? { origin } : {}),
    matchAny: getMatchAny(baseTerm).filter(Boolean),
  };
}

export function generateSeedMeaningLists(existingSlugs: Set<string>): ListDefinition[] {
  const terms = Array.from(new Set(extractRawKeywords().map(canonicalizeRawKeyword))).filter(Boolean);

  const generated: ListDefinition[] = [];
  const seenGeneratedSlugs = new Set<string>();

  for (const term of terms) {
    const slug = toSlug(term);
    if (existingSlugs.has(slug) || seenGeneratedSlugs.has(slug)) {
      continue;
    }
    seenGeneratedSlugs.add(slug);

    const displayTerm = toTitleCase(term.replace(/^last-name\s+/, 'last name ').replace(/^japanese\s+/, 'japanese '));
    const isRegionSpecific = term.startsWith('japanese ');
    const isLastName = term.startsWith('last-name ');

    const titleBase = isLastName
      ? `Last Names That Mean ${displayTerm.replace(/^Last Name\s+/i, '')}`
      : isRegionSpecific
      ? `Japanese Names That Mean ${displayTerm.replace(/^Japanese\s+/i, '')}`
      : `Names That Mean ${displayTerm}`;

    generated.push({
      id: slug,
      slug,
      title: `${titleBase}${isRegionSpecific || isLastName ? '' : ' for Boys and Girls'}`,
      seoTitle: `${titleBase}${isRegionSpecific || isLastName ? '' : ' for Boys and Girls'} | Namylab`,
      seoDescription: `Discover baby names that mean ${term.replace(/^last-name\s+/, '').replace(/^japanese\s+/, '')}${isRegionSpecific ? ' in Japanese' : ''}${isLastName ? ' for surnames' : ' for boys and girls'}. Explore meanings, origins, and related ideas.`,
      category: 'meaning',
      type: 'meaning',
      keywords: [displayTerm, `Names that mean ${displayTerm}`, `Boy names meaning ${displayTerm}`, `Girl names meaning ${displayTerm}`],
      filter: buildMeaningSeedFilter(term),
      relatedLists: ['names-that-mean-light', 'names-that-mean-love', 'names-that-mean-strength'],
      priority: ['light', 'love', 'strength', 'warrior', 'hope', 'peace', 'fire', 'water', 'moon'].includes(term) ? 'high' : 'medium'
    });
  }

  return generated;
}
