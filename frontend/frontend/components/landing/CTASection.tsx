import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 text-center bg-emerald-900 text-white px-4">
      <h2 className="text-2xl font-bold">Ready to save water and boost yields?</h2>
      <Link
        href="/auth/signup"
        className="mt-6 inline-block px-6 py-3 bg-white text-emerald-900 font-bold rounded-md text-sm"
      >
        Create your account
      </Link>
    </section>
  );
}
