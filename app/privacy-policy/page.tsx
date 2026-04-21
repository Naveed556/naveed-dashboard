"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-muted-foreground inline-block" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Legal
              </span>
            </div>
            <h1 className="font-serif-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] text-foreground mb-3">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-base">
              Last Revised: May 14, 2021
            </p>
          </div>

          {/* Table of Contents */}
          <div className="mb-12 p-6 md:p-8 bg-card border border-border rounded-xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Table of Contents
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <a
                  href="#consent"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Your Consent
                </a>
              </li>
              <li>
                <a
                  href="#collection"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Which Information We May Collect
                </a>
              </li>
              <li>
                <a
                  href="#how"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  How We Collect Information
                </a>
              </li>
              <li>
                <a
                  href="#purposes"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Purposes of Collection
                </a>
              </li>
              <li>
                <a
                  href="#storage"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Where We Store Personal Information
                </a>
              </li>
              <li>
                <a
                  href="#third-parties"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Non-Personal and Personal Information of Third Parties
                </a>
              </li>
              <li>
                <a
                  href="#candidates"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Job Candidates
                </a>
              </li>
              <li>
                <a
                  href="#sharing"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Sharing Information with Third Parties
                </a>
              </li>
              <li>
                <a
                  href="#deletion"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Deletion or Modification of Personal Information
                </a>
              </li>
              <li>
                <a
                  href="#minors-security"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Minors & Security
                </a>
              </li>
              <li>
                <a
                  href="#third-party-software"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Third Party Software/Service
                </a>
              </li>
              <li>
                <a
                  href="#direct-marketing"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Direct Marketing
                </a>
              </li>
              <li>
                <a
                  href="#changes"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Changes to the Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#questions"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Questions?
                </a>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Your Consent */}
            <section id="consent">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Your Consent
              </h2>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                BY ACCESSING THE SERVICES AND/OR USING THE SERVICES, YOU AGREE
                TO THE TERMS AND CONDITIONS SET FORTH IN THIS PRIVACY POLICY,
                INCLUDING TO THE COLLECTION AND PROCESSING OF YOUR PERSONAL
                INFORMATION AS DEFINED BELOW. IF YOU DISAGREE TO ANY TERM
                PROVIDED HEREIN, YOU MAY NOT USE THE SERVICES.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Please note: you are not obligated by law to provide us with any
                Personal Information. You hereby acknowledge and agree that you
                are providing us with Personal Information at your own free
                will, for the purpose of providing you with the Services. You
                hereby agree that we may retain such Personal Information
                pursuant to this Privacy Policy and any applicable laws and
                regulations.
              </p>
            </section>

            <div className="border-t border-border" />

            {/* Collection of Information */}
            <section id="collection">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Which Information We May Collect on Our Users?
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Non-Personal Information
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Non-identifiable and anonymous information that does not
                    reveal your identity. This includes technical information
                    such as your operating system, browser version, screen
                    resolution, IP address, duration of usage, click-stream
                    data, and keyboard language.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Personal Information
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Individually identifiable information that may identify an
                    individual or be of a private and/or sensitive nature. This
                    may include:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
                    <li>
                      Name, address, phone number, email address, and password
                    </li>
                    <li>Information provided during account registration</li>
                    <li>Information about malfunctions and treatments</li>
                    <li>Job application information from candidates</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-card border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Any
                  Non-Personal Information connected or linked to any Personal
                  Information shall be deemed as Personal Information as long as
                  such connection or linkage exists.
                </p>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* How We Collect */}
            <section id="how">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                How Do We Collect Information on Our Users?
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Through Your Use of Services
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We collect information when you use our Services. We are
                    aware of your usage patterns and may gather, collect, and
                    record information relating to such usage. We also collect
                    information derived from third-party services and providers
                    we work with.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Voluntary Information
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We collect Personal Information which you voluntarily
                    provide when you use our Services.
                  </p>
                </div>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Purposes */}
            <section id="purposes">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                What Are the Purposes of the Collection of Information?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                We collect information in order to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 ml-2">
                <li>
                  Provide and operate our Services and related services in
                  connection with our Services
                </li>
                <li>Verify our User's identity</li>
                <li>
                  Deliver and enhance the Services, provide technical assistance
                  and support
                </li>
                <li>Provide updates regarding the Company's developments</li>
                <li>
                  Create cumulative statistical data and other non-personal
                  information for improving Services
                </li>
                <li>
                  Manage and make risk evaluations, improve cyber security
                  abilities
                </li>
                <li>
                  Prevent and defend from frauds, faults, or any other illegal
                  or forbidden activity
                </li>
                <li>
                  Act according to the law and obey all judicial or regulatory
                  demands
                </li>
                <li>
                  Involve in other activities requiring Personal Information
                  with your prior consent
                </li>
              </ul>
            </section>

            <div className="border-t border-border" />

            {/* Storage */}
            <section id="storage">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Where Do We Store Personal Information?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Information regarding the Users will be maintained, processed
                and stored in the United States and in Israel, and as necessary,
                in secured cloud storage provided by our third-party service
                providers.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                While the data protection laws in these jurisdictions may differ
                from the laws of your residence or location, the Company, its
                affiliates and service providers are committed to keeping your
                information protected and secured, pursuant to this Privacy
                Policy and industry standards, regardless of any lesser legal
                requirements that may apply in their jurisdiction.
              </p>
            </section>

            <div className="border-t border-border" />

            {/* Third Parties */}
            <section id="third-parties">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Non-Personal and Personal Information of Third Parties
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You represent and warrant that you shall not make available or
                provide in any manner any personal information of third parties.
                You are responsible for complying with all applicable laws and
                regulations, including any privacy and data protection laws, in
                connection with your end users.
              </p>
            </section>

            <div className="border-t border-border" />

            {/* Job Candidates */}
            <section id="candidates">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Job Candidates
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                We welcome all qualified candidates to apply to open positions.
                When candidates apply, they provide their contact details and
                CV. Since privacy and discreetness are very important to our
                candidates, we are committed to keeping your information private
                and use it solely for our internal recruitment purposes.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                The Company may retain candidate information even after the
                applied position has been filled or closed. This is done so we
                could re-consider candidates for other positions and
                opportunities, or use their information as reference for future
                applications.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you previously submitted your candidate information and wish
                to access it, update it, or have it deleted, please contact us
                at{" "}
                <Link
                  href="mailto:contactus"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  contactus
                </Link>
              </p>
            </section>

            <div className="border-t border-border" />

            {/* Sharing */}
            <section id="sharing">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Sharing Information with Third Parties
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Third Party Services
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We may share your Personal Information with selected service
                    providers whose services complement, facilitate and enhance
                    our own. These include hosting and server services, data and
                    cyber security services, web analytics, and business
                    advisors. Third Party Services may only use your information
                    for their specified purposes.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Legal Requests
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We may disclose your Personal Information pursuant to legal
                    requests, such as a subpoena, search warrant, or court
                    order, or in compliance with applicable laws if we have a
                    good faith belief that we are legally required to do so.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Protecting Rights and Safety
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We may share your Personal Information if we believe in good
                    faith that this will help protect the rights, property, or
                    personal safety of our company, users, or the general
                    public.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Corporate Changes
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your Personal Information may be shared with the parties
                    involved in any change in control of our company, including
                    merger, acquisition, or purchase of substantially all
                    assets. We will notify you if such changes materially affect
                    your Personal Information.
                  </p>
                </div>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Deletion */}
            <section id="deletion">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Deletion or Modification of Personal Information
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                If the law applicable to you grants you such rights, you may ask
                to access, correct, or delete your Personal Information that is
                stored in our systems. You may also ask for our confirmation as
                to whether or not we process your Personal Information.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Subject to the limitations in law, you may request that we
                update, correct, or delete inaccurate or outdated information.
                You may also request that we suspend the use of any Personal
                Information whose accuracy you contest while we verify the
                status of that data.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                You may also have the right to obtain a copy of the Personal
                Information you directly provided to us in a structured,
                commonly used, and machine-readable format.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To exercise any of these rights, contact us at{" "}
                <Link
                  href="mailto:contactus"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  contactus
                </Link>
                . Please note that upon request to delete your Personal
                Information, we may retain such data to comply with applicable
                regulations or defend against legal proceedings.
              </p>
            </section>

            <div className="border-t border-border" />

            {/* Minors & Security */}
            <section id="minors-security">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Minors & Security
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Minors</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To use our Services, you must be over the age of sixteen
                    (16). We do not knowingly collect Personal Information from
                    minors under the age of sixteen (16). We reserve the right
                    to request proof of age to verify that minors under the age
                    of sixteen (16) are not using the Services.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Security</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We take great care in implementing and maintaining the
                    security of our Services and your Personal Information. We
                    employ industry standard procedures and policies to ensure
                    the safety of your Personal Information and prevent
                    unauthorized use. However, we do not guarantee that
                    unauthorized access will never occur.
                  </p>
                </div>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Third Party Software */}
            <section id="third-party-software">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Third Party Software/Service
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                We use certain monitoring and tracking technologies to maintain,
                provide, and improve our Services. These enable us to track user
                preferences, authenticate sessions, secure our Services, detect
                abnormal behaviors, identify technical issues, provide
                advertising, track ad performance, and improve overall
                performance.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Cookies</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Small data files (cookies) are downloaded and stored on your
                    device for session authentication, security, preference
                    management, advertising, and performance monitoring. You can
                    delete or block cookies through your browser settings.
                    Please note that deleting cookies or disabling tracking
                    technologies may prevent you from accessing certain areas of
                    our Services or adversely affect your user experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Third Party Services
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    We use various third-party services including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
                    <li>Google Analytics for web analytics</li>
                    <li>Forensiq for fraud detection</li>
                    <li>Hotjar for session recording</li>
                    <li>Redis Labs for data services</li>
                    <li>Logentries for logging services</li>
                    <li>Twilio for communications</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Direct Marketing */}
            <section id="direct-marketing">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Direct Marketing
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                You agree that we may use your contact details provided during
                registration to inform you regarding our products and Services
                which may interest you, and to send you other marketing
                material. You may withdraw your consent by sending a written
                notice to us at{" "}
                <Link
                  href="mailto:contactus"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  contactus
                </Link>{" "}
                or by pressing the "Unsubscribe" button in the email.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Please note that we may contact you with important information
                regarding our Services, such as changes or updates, payment
                issues, or service maintenance. You will not be able to opt-out
                of receiving such service messages.
              </p>
            </section>

            <div className="border-t border-border" />

            {/* Changes */}
            <section id="changes">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Changes to the Privacy Policy
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                This Privacy Policy is an integral part of our Services and will
                govern the use of the Services and any information collected. We
                reserve the right to change this policy at any time, so please
                revisit this page frequently.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We will notify you regarding substantial changes by changing the
                link to the Privacy Policy and/or by sending you an email. Such
                substantial changes will take effect seven (7) days after
                notice. All other changes are effective as of the stated "Last
                Revised" date, and your continued use of the Services
                constitutes acceptance of these changes.
              </p>
            </section>

            <div className="border-t border-border" />

            {/* Questions */}
            <section id="questions">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Have Any Questions?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you have any questions or comments concerning this Privacy
                Policy, you are welcome to send us an email at{" "}
                <Link
                  href="mailto:contactus"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  contactus
                </Link>{" "}
                and we will make an effort to reply within a reasonable
                timeframe.
              </p>
            </section>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-muted-foreground text-xs">
                © Copyright Daily Earn. All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
