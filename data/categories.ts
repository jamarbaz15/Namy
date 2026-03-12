// Categories data for homepage browse section
export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  { id: 'classic', name: 'Classic', icon: '👑', count: 2450 },
  { id: 'nature', name: 'Nature', icon: '🌿', count: 890 },
  { id: 'biblical', name: 'Biblical', icon: '📖', count: 1250 },
  { id: 'unique', name: 'Unique', icon: '✨', count: 3200 },
  { id: 'royal', name: 'Royal', icon: '🏰', count: 580 },
  { id: 'mythology', name: 'Mythology', icon: '⚡', count: 720 },
];
