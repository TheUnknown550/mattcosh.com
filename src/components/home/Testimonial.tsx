export function Testimonial() {
  return (
    <section
      data-graph-focus-node="award-imagine-cup"
      data-graph-focus-key="testimonial"
      className="flex-1 mx-0 w-full max-w-none py-24 lg:py-32"
    >
      <blockquote className="mr-auto ml-0 w-full max-w-5xl border-l-2 border-signal pl-8 text-left lg:pl-12">
        <p className="font-display text-3xl font-medium leading-snug text-ink lg:text-5xl">
          &ldquo;Matt stood out as a dependable, proactive team leader. His
          curiosity and technical focus made a real difference to the
          project&rsquo;s progress — and helped him win another global
          competition by Microsoft.&rdquo;
        </p>
        <footer className="mt-6 font-mono text-sm uppercase tracking-wide">
          <a
            href="https://www.linkedin.com/in/midreesbhat/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted transition-colors hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          >
          Mohammad Idrees Bhat — mentor, Intel AI Global Impact Festival
          </a>
        </footer>
      </blockquote>
    </section>
  );
}
