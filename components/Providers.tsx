'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  compareList: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('namylab-favorites');
    const savedCompare = localStorage.getItem('namylab-compare');

    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(new Set(parsed));
      } catch (e) {
        console.error('Error loading favorites:', e);
        localStorage.removeItem('namylab-favorites');
      }
    }

    if (savedCompare) {
      try {
        const parsed = JSON.parse(savedCompare);
        setCompareList(parsed);
      } catch (e) {
        console.error('Error loading compare list:', e);
        localStorage.removeItem('namylab-compare');
      }
    }

    setIsHydrated(true);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('namylab-favorites', JSON.stringify([...favorites]));
    }
  }, [favorites, isHydrated]);

  // Save to localStorage when compare list changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('namylab-compare', JSON.stringify(compareList));
    }
  }, [compareList, isHydrated]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 names at a time. Remove a name to add another.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        toggleFavorite,
        compareList,
        toggleCompare,
        clearCompare,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
