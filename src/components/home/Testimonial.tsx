export function Testimonial() {
  return (
    <section
      data-graph-focus-node="award-imagine-cup"
      data-graph-focus-key="testimonial"
      className="flex-1 mx-0 w-full max-w-none py-12 sm:py-20 lg:py-24"
    >
      <blockquote className="mr-auto ml-0 w-full max-w-4xl border-l-2 border-signal bg-gradient-to-r from-void/90 via-void/65 to-transparent py-2 pr-5 pl-5 text-left sm:py-3 sm:pr-8 sm:pl-8 lg:pl-10">
        <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-4xl lg:text-[2.75rem]">
          &ldquo;Matt stood out as a dependable, proactive team leader. His
          curiosity and technical focus made a real difference to the
          project&rsquo;s progress — and helped him win another global
          competition by Microsoft.&rdquo;
        </p>
        <footer className="mt-4 font-mono text-xs uppercase tracking-wide sm:mt-6 sm:text-sm">
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
