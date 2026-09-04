import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="py-20 text-center bg-emerald-900 text-white px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
        Smart Irrigation & Water Management for Smallholder Farmers
      </h1>
      <p className="mt-4 text-base text-emerald-100 max-w-xl mx-auto">
        Amatsi watches your farm's weather and soil, tells you exactly when to
        irrigate, and saves water when rain is on the way.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/auth/signup"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-md text-sm transition"
        >
          Get Started
        </Link>
        <Link
          href="/auth/login"
          className="px-6 py-3 border border-emerald-400 text-emerald-100 hover:bg-emerald-800 font-bold rounded-md text-sm transition"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}