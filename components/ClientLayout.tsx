'use client';

import React, { ReactNode } from 'react';
import { AppProvider, useApp } from './Providers';
import Header from './Header';
import Footer from './Footer';

function LayoutContent({ children }: { children: ReactNode }) {
  const { favorites, compareList } = useApp();

  return (
    <>
      <Header favoritesCount={favorites.size} compareCount={compareList.length} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <LayoutContent>{children}</LayoutContent>
    </AppProvider>
  );
}
