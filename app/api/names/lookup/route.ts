import { NextResponse } from 'next/server';
import { getAllNames } from '@/data';

type LookupNameResponse = {
  name: string;
  gender: 'male' | 'female' | 'unisex';
  meaning: string;
  origins: string[];
};

let lookupCache: Map<string, LookupNameResponse> | null = null;

function getLookupCache() {
  if (lookupCache) {
    return lookupCache;
  }

  lookupCache = new Map<string, LookupNameResponse>();
  for (const name of getAllNames()) {
    const key = name.name.trim().toLowerCase();
    if (!key || lookupCache.has(key)) {
      continue;
    }

    lookupCache.set(key, {
      name: name.name,
      gender: name.gender,
      meaning: name.meaning,
      origins: name.origins,
    });
  }

  return lookupCache;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const normalizedName = searchParams.get('name')?.trim().toLowerCase() ?? '';

  if (!normalizedName) {
    return NextResponse.json({ name: null });
  }

  return NextResponse.json(
    {
      name: getLookupCache().get(normalizedName) ?? null,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    }
  );
}