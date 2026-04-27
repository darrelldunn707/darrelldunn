import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-16 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          Product Engagement Specialist portfolio
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal md:text-6xl">
          Practical launch readiness, support enablement, and customer feedback operations.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
          The current featured work sample is Product Readiness OS, a fictional demo for coordinating an enterprise beta launch across partner, support, product, and engineering views.
        </p>
        <div className="mt-8">
          <Link
            href="/product-readiness-os"
            className="inline-flex rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            Open Product Readiness OS
          </Link>
        </div>
      </section>
    </main>
  );
}
