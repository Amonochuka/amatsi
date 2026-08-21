import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="font-serif text-xl font-bold text-emerald-900">
        Amatsi
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/auth/login" className="text-stone-600 hover:text-stone-900">
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 bg-emerald-900 text-white rounded-md font-semibold"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
