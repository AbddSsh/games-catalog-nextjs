interface IPrivacyViewProps {
  locale: string;
  lastUpdated: string;
}

export function PrivacyView({ lastUpdated }: IPrivacyViewProps) {
  return (
    <div className="pt-[40px]">
      <article className="w-full rounded-[13px] bg-bg-text-block px-5 py-6 text-text-primary">
        <h1 className="text-3xl font-bold text-text-primary">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Last updated: {lastUpdated}
        </p>
        <p className="mt-4 text-text-primary">
          This Privacy Policy explains how information is handled when you visit
          and use this website (the &quot;Site&quot;). By accessing the Site,
          you agree to the terms described below.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          1. General Information
        </h2>
        <p className="mt-2 text-text-primary">
          This Site operates as an informational platform. It does not require
          user registration, does not offer account creation, and does not
          process payments.
        </p>
        <p className="mt-2 text-text-primary">
          We are committed to minimizing data collection and maintaining
          transparency.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          2. Personal Data
        </h2>
        <p className="mt-2 text-text-primary">
          We do not collect, store, or process personally identifiable
          information such as:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-text-secondary">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Billing or payment information</li>
          <li>Government-issued identification</li>
          <li>Account credentials</li>
        </ul>
        <p className="mt-2 text-text-primary">
          The Site does not provide user accounts, subscription forms, or direct
          payment functionality.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          3. Automatically Collected Technical Information
        </h2>
        <p className="mt-2 text-text-primary">
          When you access the Site, certain technical information may be
          processed automatically. This may include:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-text-secondary">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device type</li>
          <li>Operating system</li>
          <li>Language preferences</li>
          <li>Date and time of access</li>
          <li>Pages visited and referring URLs</li>
        </ul>
        <p className="mt-2 text-text-primary">
          This information is used solely for:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-text-secondary">
          <li>Ensuring proper functionality of the Site</li>
          <li>Performance monitoring and diagnostics</li>
          <li>Aggregated analytics</li>
          <li>Improving user experience</li>
        </ul>
        <p className="mt-2 text-text-primary">
          We do not use this data to identify individual users or create
          personal profiles.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          4. Cookies and Similar Technologies
        </h2>
        <p className="mt-2 text-text-primary">
          The Site may use cookies or similar technologies to:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-text-secondary">
          <li>Enable essential site functionality</li>
          <li>Maintain technical preferences</li>
          <li>Analyze traffic in aggregated form</li>
        </ul>
        <p className="mt-2 text-text-primary">
          Cookies used on this Site do not store personally identifiable
          information.
        </p>
        <p className="mt-2 text-text-primary">
          You may disable cookies through your browser settings. Please note
          that some features of the Site may not function properly if cookies
          are disabled.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          5. Third-Party Services
        </h2>
        <p className="mt-2 text-text-primary">
          The Site may use third-party tools or services (such as analytics
          providers or advertising partners). These services may process
          technical data in accordance with their own privacy policies.
        </p>
        <p className="mt-2 text-text-primary">
          We do not control the data handling practices of third-party
          websites or services. If you follow external links from this Site, we
          encourage you to review their respective privacy policies.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          6. Data Security
        </h2>
        <p className="mt-2 text-text-primary">
          We implement reasonable technical and organizational measures to
          protect the Site and its systems from unauthorized access.
        </p>
        <p className="mt-2 text-text-primary">
          However, no method of transmission over the internet or electronic
          storage is completely secure. We cannot guarantee absolute security.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          7. Children&apos;s Privacy
        </h2>
        <p className="mt-2 text-text-primary">
          This Site is not directed to individuals under the age of 13.
        </p>
        <p className="mt-2 text-text-primary">
          We do not knowingly collect personal data from children. If you
          believe that a child has provided personal information through this
          Site, please contact us so appropriate steps can be taken.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          8. Changes to This Policy
        </h2>
        <p className="mt-2 text-text-primary">
          We reserve the right to update or modify this Privacy Policy at any
          time. The updated version will be published on this page with a
          revised &quot;Last updated&quot; date.
        </p>
        <p className="mt-2 text-text-primary">
          Continued use of the Site after changes become effective constitutes
          acceptance of the updated Policy.
        </p>

        <hr className="my-6 border-border-main" />

        <h2 className="text-xl font-semibold text-text-primary">
          9. Microsoft Clarity and Microsoft Advertising
        </h2>
        <p className="mt-2 text-text-primary">
          We partner with Microsoft Clarity and Microsoft Advertising to capture
          how you use and interact with our website through behavioral metrics,
          heatmaps, and session replay to improve and market our products/services.
          Website usage data is captured using first and third-party cookies and
          other tracking technologies to determine the popularity of products/services
          and online activity. Additionally, we use this information for site
          optimization, fraud/security purposes, and advertising. For more
          information about how Microsoft collects and uses your data, visit the{' '}
          <a
            href="https://privacy.microsoft.com/privacystatement"
            target="_blank"
            className="text-primary underline hover:no-underline"
          >
            Microsoft Privacy Statement
          </a>
          .
        </p>
      </article>
    </div>
  );
}
