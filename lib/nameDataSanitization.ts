// Known bad duplicate records where a mainstream name was duplicated under the
// opposite gender. We exclude these IDs at load time so search, filters,
// lists, name pages, and sitemaps all stay aligned until the source data is
// regenerated.
export const EXCLUDED_WRONG_GENDER_NAME_IDS = new Set([
  'alexander-f',
  'amelia-m',
  'ava-m',
  'charlotte-m',
  'david-f',
  'elizabeth-m',
  'emma-m',
  'isabella-m',
  'james-f',
  'john-f',
  'liam-f',
  'mia-m',
  'michael-f',
  'oliver-f',
  'olivia-m',
  'sarah-m',
  'sophia-m',
  'theodore-f',
  'william-f',
]);

export function isExcludedWrongGenderNameId(id: string): boolean {
  return EXCLUDED_WRONG_GENDER_NAME_IDS.has(id);
}