interface IPrivacyViewProps {
  locale: string;
  lastUpdated: string;
}

export function PrivacyView({ lastUpdated }: IPrivacyViewProps) {
  return (
    <div className="">
      <article className="w-full px-5 py-8 tablet:px-16 tablet:py-14">
        <span className="mb-5 inline-block rounded-full bg-bg-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-purple">
          Legal
        </span>

        <h1 className="mb-2 text-3xl font-extrabold leading-tight text-text-primary">
          Privacy Policy
        </h1>

        <p className="mb-9 border-b border-border-main pb-7 text-xs text-text-muted">
          Website: <strong className="text-text-secondary">go-get-games.com</strong>
          {" · "}
          Effective date: <strong className="text-text-secondary">May 4, 2026</strong>
          {" · "}
          Last updated: <strong className="text-text-secondary">{lastUpdated}</strong>
        </p>

        <div className="mb-6 rounded-lg border border-accent-secondary/30 bg-bg-block px-5 py-4 text-sm text-text-primary">
          <strong>Summary (plain language): </strong>
          Go Get Games is a free game showcase website. We do not require registration or collect payment data. We use standard analytics cookies and may display third-party ads or affiliate links. This policy explains exactly what we collect and why.
        </div>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          1. Who We Are
        </h2>
        <p className="mb-4 text-text-primary">
          Go Get Games is a website operated by <strong>PAVIMENTOS LUGO SL</strong>, a company registered in Spain (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). The website <strong>go-get-games.com</strong> is an online showcase of video games, including descriptions, links, and related content. PAVIMENTOS LUGO SL is the data controller for personal data processed through this website.
        </p>
        <p className="mb-4 text-text-primary">
          For questions or requests relating to your personal data, contact us at:{" "}
          <a href="mailto:privacy@go-get-games.com" className="text-accent-cyan hover:underline">
            privacy@go-get-games.com
          </a>
        </p>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          2. What Data We Collect
        </h2>
        <p className="mb-4 text-text-primary">
          Because Go Get Games is a content-only showcase (no user accounts, no purchases), we collect a minimal amount of data:
        </p>
        <div className="mb-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b-2 border-border-main bg-bg-block px-4 py-2 text-left font-bold text-text-primary">Data type</th>
                <th className="border-b-2 border-border-main bg-bg-block px-4 py-2 text-left font-bold text-text-primary">Examples</th>
                <th className="border-b-2 border-border-main bg-bg-block px-4 py-2 text-left font-bold text-text-primary">Collected automatically?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-primary"><strong>Usage &amp; technical data</strong></td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">IP address (anonymized), browser type &amp; version, OS, referring URL, pages visited, session duration</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Yes — via analytics tools</td>
              </tr>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-primary"><strong>Cookie &amp; tracking data</strong></td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Cookie IDs, session tokens, ad interaction signals</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Yes — see Section 5</td>
              </tr>
              <tr>
                <td className="px-4 py-2 align-top text-text-primary"><strong>Contact data</strong></td>
                <td className="px-4 py-2 align-top text-text-secondary">Name, email address (only if you contact us via a form)</td>
                <td className="px-4 py-2 align-top text-text-secondary">No — only if you provide it</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4 text-text-primary">
          We do <strong>not</strong> collect: payment or financial information, government IDs, sensitive personal categories, or data from users we know to be under 13 years of age.
        </p>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          3. How We Use Your Data
        </h2>
        <p className="mb-4 text-text-primary">
          We process data for the following purposes and on the following legal bases:
        </p>
        <div className="mb-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b-2 border-border-main bg-bg-block px-4 py-2 text-left font-bold text-text-primary">Purpose</th>
                <th className="border-b-2 border-border-main bg-bg-block px-4 py-2 text-left font-bold text-text-primary">Legal basis (GDPR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Operating and improving the website (analytics, performance monitoring)</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Legitimate interest (Art. 6(1)(f))</td>
              </tr>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Displaying personalized or contextual advertisements</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Consent (Art. 6(1)(a))</td>
              </tr>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Responding to enquiries or support requests</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Legitimate interest / contract performance</td>
              </tr>
              <tr>
                <td className="px-4 py-2 align-top text-text-secondary">Complying with legal obligations</td>
                <td className="px-4 py-2 align-top text-text-secondary">Legal obligation (Art. 6(1)(c))</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          4. Third-Party Services &amp; Affiliate Links
        </h2>
        <p className="mb-4 text-text-primary">
          Go Get Games may contain links to third-party game platforms, stores, and affiliate networks. When you click these links:
        </p>
        <ul className="mb-4 ml-6 list-disc space-y-1 text-text-secondary">
          <li>You leave our website and are subject to the privacy policy of the destination site.</li>
          <li>Affiliate networks may place tracking cookies on your device to attribute referrals.</li>
          <li>We may receive a commission if you make a purchase — this does not affect the price you pay.</li>
        </ul>
        <p className="mb-4 text-text-primary">
          We are not responsible for the data practices of any third-party sites. We encourage you to review their privacy policies before providing any personal data.
        </p>
        <p className="mb-3 text-text-primary">We use the following specific third-party services on our website:</p>

        <h3 className="mb-2 mt-5 text-base font-bold text-text-primary">
          Google Analytics &amp; Google Tag Manager
        </h3>
        <p className="mb-4 text-text-primary">
          We use <strong>Google Analytics</strong> to understand how visitors find and interact with our website. Google Analytics collects data such as pages visited, time on site, referring source, and device/browser type. IP addresses are anonymized before storage. We deploy Google Analytics via <strong>Google Tag Manager (GTM)</strong>, a tag management system that allows us to manage tracking scripts without editing site code directly. GTM itself does not collect personal data but may load scripts from third parties (including those listed in this section).
        </p>
        <p className="mb-4 text-text-primary">
          The data collected via Google Analytics is processed by Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. You can opt out of Google Analytics tracking by installing the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" className="text-accent-cyan hover:underline">
            Google Analytics Opt-out Browser Add-on
          </a>
          . For more information, see{" "}
          <a href="https://policies.google.com/privacy" target="_blank" className="text-accent-cyan hover:underline">
            Google&apos;s Privacy Policy
          </a>
          .
        </p>

        <h3 className="mb-2 mt-5 text-base font-bold text-text-primary">
          Microsoft Clarity and Microsoft Advertising
        </h3>
        <p className="mb-4 text-text-primary">
          We partner with <strong>Microsoft Clarity</strong> and <strong>Microsoft Advertising</strong> to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay to improve and market our products/services. Website usage data is captured using first and third-party cookies and other tracking technologies to determine the popularity of products/services and online activity. Additionally, we use this information for site optimization, fraud/security purposes, and advertising. For more information about how Microsoft collects and uses your data, visit the{" "}
          <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" className="text-accent-cyan hover:underline">
            Microsoft Privacy Statement
          </a>
          .
        </p>

        <h3 className="mb-2 mt-5 text-base font-bold text-text-primary">
          Advertising &amp; CDN
        </h3>
        <ul className="mb-4 ml-6 list-disc space-y-1 text-text-secondary">
          <li>
            <strong className="text-text-primary">Advertising networks</strong> (e.g. Google AdSense or similar): to serve relevant ads. These services may use cookies. You can opt out via{" "}
            <a href="https://optout.aboutads.info" target="_blank" className="text-accent-cyan hover:underline">aboutads.info</a>
            {" "}or{" "}
            <a href="https://www.youronlinechoices.eu" target="_blank" className="text-accent-cyan hover:underline">youronlinechoices.eu</a>.
          </li>
          <li>
            <strong className="text-text-primary">Content Delivery Networks (CDN)</strong>: to serve website assets quickly and reliably.
          </li>
        </ul>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          5. Cookies
        </h2>
        <p className="mb-4 text-text-primary">
          We use cookies and similar technologies (pixels, local storage) to make the website work and to improve your experience. You may manage your cookie preferences at any time via our cookie banner or your browser settings.
        </p>
        <div className="mb-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b-2 border-border-main bg-bg-block px-4 py-2 text-left font-bold text-text-primary">Category</th>
                <th className="border-b-2 border-border-main bg-bg-block px-4 py-2 text-left font-bold text-text-primary">Purpose</th>
                <th className="border-b-2 border-border-main bg-bg-block px-4 py-2 text-left font-bold text-text-primary">Consent required?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-primary"><strong>Strictly necessary</strong></td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Core website functionality (e.g. cookie consent preferences)</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">No</td>
              </tr>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-primary"><strong>Analytics</strong></td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Measure traffic and user behaviour to improve the site (Google Analytics / GTM)</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Yes</td>
              </tr>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-primary"><strong>Behavioral analytics &amp; session replay</strong></td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Heatmaps, session recording, behavioral metrics (Microsoft Clarity)</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Yes</td>
              </tr>
              <tr>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-primary"><strong>Advertising</strong></td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Show relevant ads, measure ad performance (Google Advertising, Microsoft Advertising)</td>
                <td className="border-b border-border-main px-4 py-2 align-top text-text-secondary">Yes</td>
              </tr>
              <tr>
                <td className="px-4 py-2 align-top text-text-primary"><strong>Affiliate tracking</strong></td>
                <td className="px-4 py-2 align-top text-text-secondary">Attribute referral clicks to affiliate partners</td>
                <td className="px-4 py-2 align-top text-text-secondary">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4 text-text-primary">
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. Visit{" "}
          <a href="https://www.allaboutcookies.org" target="_blank" className="text-accent-cyan hover:underline">allaboutcookies.org</a>
          {" "}for guidance. Note that some parts of our website may not function properly without certain cookies.
        </p>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          6. Data Sharing &amp; Disclosure
        </h2>
        <p className="mb-4 text-text-primary">
          We do not sell, rent, or trade your personal data. We may share data only in the following circumstances:
        </p>
        <ul className="mb-4 ml-6 list-disc space-y-1 text-text-secondary">
          <li><strong className="text-text-primary">Service providers</strong>: companies acting on our behalf (hosting, analytics, ad networks) under strict data processing agreements.</li>
          <li><strong className="text-text-primary">Legal requirements</strong>: where disclosure is required by law, court order, or to protect our legal rights.</li>
          <li><strong className="text-text-primary">Business transfers</strong>: in the event of a merger, acquisition, or sale of assets, personal data may be transferred to the successor entity.</li>
        </ul>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          7. International Data Transfers
        </h2>
        <p className="mb-4 text-text-primary">
          Some of our third-party service providers are located outside the European Economic Area (EEA). When data is transferred outside the EEA, we ensure appropriate safeguards are in place, such as the EU Standard Contractual Clauses (SCCs) approved by the European Commission.
        </p>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          8. Data Retention
        </h2>
        <p className="mb-4 text-text-primary">
          We retain personal data only for as long as necessary for the purposes described in this policy:
        </p>
        <ul className="mb-4 ml-6 list-disc space-y-1 text-text-secondary">
          <li><strong className="text-text-primary">Analytics data</strong>: retained for up to 14 months, then deleted or anonymized.</li>
          <li><strong className="text-text-primary">Contact enquiries</strong>: retained for up to 2 years, or until resolved.</li>
          <li><strong className="text-text-primary">Advertising data</strong>: governed by the respective third-party&apos;s retention policy.</li>
        </ul>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          9. Your Rights
        </h2>
        <p className="mb-4 text-text-primary">
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <div className="mb-5 grid grid-cols-1 gap-3 tablet:grid-cols-2">
          {[
            { title: "Right of access", desc: "Request a copy of the data we hold about you." },
            { title: "Right to rectification", desc: "Ask us to correct inaccurate or incomplete data." },
            { title: "Right to erasure", desc: "Ask us to delete your data (\"right to be forgotten\")." },
            { title: "Right to restriction", desc: "Ask us to limit how we use your data." },
            { title: "Right to portability", desc: "Receive your data in a structured, machine-readable format." },
            { title: "Right to object", desc: "Object to processing based on legitimate interests or for direct marketing." },
            { title: "Right to withdraw consent", desc: "Withdraw consent at any time (e.g. via cookie settings)." },
            { title: "Right to complain", desc: "Lodge a complaint with your local data protection authority." },
          ].map(({ title, desc }) => (
            <div key={title} className="rounded-lg bg-bg-block px-4 py-3 text-sm">
              <strong className="mb-1 block text-text-primary">{title}</strong>
              <span className="text-text-secondary">{desc}</span>
            </div>
          ))}
        </div>
        <p className="mb-4 text-text-primary">
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:privacy@go-get-games.com" className="text-accent-cyan hover:underline">
            privacy@go-get-games.com
          </a>
          . We will respond within 30 days.
        </p>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          10. Children&apos;s Privacy
        </h2>
        <p className="mb-4 text-text-primary">
          Go Get Games is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us at{" "}
          <a href="mailto:privacy@go-get-games.com" className="text-accent-cyan hover:underline">
            privacy@go-get-games.com
          </a>
          {" "}and we will promptly delete the information.
        </p>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          11. Security
        </h2>
        <p className="mb-4 text-text-primary">
          We implement commercially reasonable technical and organisational measures to protect your data against unauthorized access, loss, or destruction. However, no internet transmission or electronic storage method is 100% secure. We encourage you to use secure, updated browsers when visiting our website.
        </p>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          12. Changes to This Policy
        </h2>
        <p className="mb-4 text-text-primary">
          We may update this Privacy Policy from time to time. When we make material changes, we will post the updated policy on this page and update the &quot;Last updated&quot; date at the top. We encourage you to review this page periodically. Continued use of the website after changes are posted constitutes your acceptance of the updated policy.
        </p>

        <h2 className="mb-3 mt-9 border-l-[3px] border-accent-cyan pl-4 text-lg font-bold text-text-primary">
          13. Contact Us
        </h2>
        <p className="mb-4 text-text-primary">
          If you have questions, concerns, or requests about this Privacy Policy or the handling of your personal data, please contact us:
        </p>
        <ul className="mb-4 ml-6 list-disc space-y-1 text-text-secondary">
          <li>
            <strong className="text-text-primary">Email:</strong>{" "}
            <a href="mailto:privacy@go-get-games.com" className="text-accent-cyan hover:underline">
              privacy@go-get-games.com
            </a>
          </li>
          <li>
            <strong className="text-text-primary">Website:</strong>{" "}
            <a href="https://go-get-games.com" className="text-accent-cyan hover:underline">
              go-get-games.com
            </a>
          </li>
        </ul>
      </article>
    </div>
  );
}
