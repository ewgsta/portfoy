import React from 'react';

export const HeroSkeleton = () => (
  <section className="min-h-screen flex items-center justify-center px-6">
    <div className="text-center max-w-4xl animate-pulse">
      <div className="h-12 md:h-16 bg-white/10 rounded-lg w-3/4 mx-auto mb-6" />
      <div className="h-6 bg-white/5 rounded w-full mb-3" />
      <div className="h-6 bg-white/5 rounded w-2/3 mx-auto mb-8" />
      <div className="h-12 w-48 bg-sky-glow/20 rounded-lg mx-auto" />
    </div>
  </section>
);

export const AboutSkeleton = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-white/10 rounded w-2/3 mb-6" />
      <div className="space-y-3">
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-5/6" />
        <div className="h-4 bg-white/5 rounded w-4/6" />
      </div>
    </div>
  </section>
);

export const ProjectsSkeleton = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12 animate-pulse">
        <div className="h-10 bg-white/10 rounded w-64 mx-auto mb-4" />
        <div className="h-5 bg-white/5 rounded w-48 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white/5 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-48 bg-white/10" />
            <div className="p-6">
              <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
              <div className="h-4 bg-white/5 rounded w-full mb-2" />
              <div className="h-4 bg-white/5 rounded w-2/3 mb-4" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-white/10 rounded" />
                <div className="h-6 w-20 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ContactSkeleton = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12 animate-pulse">
        <div className="h-10 bg-white/10 rounded w-48 mx-auto mb-4" />
        <div className="h-5 bg-white/5 rounded w-72 mx-auto" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6 animate-pulse">
          <div className="bg-white/5 rounded-2xl p-6 h-32" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl h-20" />
            <div className="bg-white/5 rounded-xl h-20" />
          </div>
          <div className="bg-white/5 rounded-xl h-40" />
        </div>
        <div className="bg-white/5 rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-40 mb-8" />
          <div className="space-y-6">
            <div className="h-12 bg-white/5 rounded" />
            <div className="h-12 bg-white/5 rounded" />
            <div className="h-24 bg-white/5 rounded" />
            <div className="h-14 bg-sky-glow/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const NavbarSkeleton = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center animate-pulse">
      <div className="h-8 w-24 bg-white/10 rounded" />
      <div className="hidden md:flex gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-16 bg-white/5 rounded" />
        ))}
      </div>
    </div>
  </nav>
);
