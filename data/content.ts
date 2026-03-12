import type { IntroTemplate } from '@/types';

export const CONTENT_TEMPLATES: Record<string, IntroTemplate> = {
  default: {
    intro: "Discover beautiful **{title}** for your baby. Each name on this list has been carefully selected for its meaning, origin, and style.\n\nWhether you're looking for something classic, trendy, or unique, you'll find the perfect name among these **{count}+ options**.\n\nBrowse our collection below, complete with meanings, origins, nicknames, and popularity rankings.",
    sections: [],
    relatedSearches: []
  },
  meaning: {
    intro: "Looking for the perfect **name meaning {keyword}** for your baby? These names embody the essence of {keyword}, carrying deep significance across cultures.\n\nNames with this meaning are often chosen to reflect hope, personality, or family heritage.\n\nBelow you'll find **{count}+ names meaning {keyword}**, each with detailed information about origin, pronunciation, and popularity.",
    sections: [
      {
        title: "Why Choose a Name Meaning {keyword}?",
        content: "Names associated with {keyword} often convey a sense of purpose and identity. Parents who select these names typically want to bestow a specific quality or blessing upon their child from day one."
      },
      {
        title: "Popularity Trends",
        content: "While some {keyword} names are timeless classics, others are rising stars in the charts. Review the trend indicators below to see which names are currently capturing hearts."
      }
    ],
    relatedSearches: ["Strong names", "Nature names", "Unique names"]
  },
  origin: {
    intro: "Explore our curated collection of **{title}**. These names carry the rich heritage and linguistic beauty of their culture.\n\nFrom traditional family names to modern favorites, these **{count} options** bridge the gap between past and present.\n\nDiscover the perfect name to honor your {keyword} roots below.",
    sections: [
      {
        title: "The Beauty of {keyword} Names",
        content: "{keyword} naming traditions are often steeped in history, mythology, and deep familial bonds. Choosing a name from this origin is a wonderful way to connect your child with their ancestry."
      }
    ],
    relatedSearches: ["Classic names", "International names", "Family names"]
  }
};
