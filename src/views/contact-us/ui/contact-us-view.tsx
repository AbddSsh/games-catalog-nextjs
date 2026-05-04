export function ContactUsView() {
  return (
    <div className="">
      <article className="w-full p-10">
        <span className="mb-5 inline-block rounded-full bg-bg-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-purple">
          Contact
        </span>

        <h1 className="mb-2 text-3xl font-extrabold leading-tight text-text-primary">
          Contact Us
        </h1>

        <p className="mb-6 border-b border-border-main pb-7 text-sm text-text-secondary">
          If you have any questions, feedback, or requests, feel free to reach out to us. We will get back to you as soon as possible.
        </p>

        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
          <div className="rounded-lg border border-accent-secondary/30 bg-bg-block px-6 py-5">
            <h2 className="mb-3 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
              Email
            </h2>
            <a
              href="mailto:privacy@go-get-games.com"
              className="text-accent-cyan transition-colors hover:underline"
            >
              privacy@go-get-games.com
            </a>
          </div>

          <div className="rounded-lg border border-accent-secondary/30 bg-bg-block px-6 py-5">
            <h2 className="mb-3 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
              Website
            </h2>
            <a
              href="https://go-get-games.com"
              className="text-accent-cyan transition-colors hover:underline"
            >
              go-get-games.com
            </a>
          </div>

          <div className="rounded-lg border border-accent-secondary/30 bg-bg-block px-6 py-5 tablet:col-span-2">
            <h2 className="mb-4 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
              Address
            </h2>
            <address className="not-italic text-text-secondary">
              <p className="mb-1 font-semibold text-text-primary">PAVIMENTOS LUGO SL</p>
              <p>Pl. Virgen Blanca 63</p>
              <p>Tona, Barcelona</p>
              <p>Spain</p>
            </address>
          </div>
        </div>
      </article>
    </div>
  );
}
