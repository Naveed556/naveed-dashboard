"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Shield,
  BarChart2,
  Clock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/header";
import { cn } from "@/lib/utils";

/* ─── DATA ─────────────────────────────────────────────────── */

const HOW_STEPS = [
  {
    n: "01",
    title: "Create your account",
    desc: "Sign up in under 60 seconds. No credit card, no setup fees. Your dashboard is ready instantly.",
  },
  {
    n: "02",
    title: "Generate your link",
    desc: "Paste any URL. We wrap it with a unique UTM code and hand you a short tracking link.",
  },
  {
    n: "03",
    title: "Share anywhere",
    desc: "Post to TikTok, Instagram, Facebook, newsletters, forums — everywhere your audience lives.",
  },
  {
    n: "04",
    title: "Watch earnings roll in",
    desc: "Every click is logged server-side in real-time. Withdraw your earnings whenever you like.",
  },
];

const FEATURES = [
  {
    icon: <Zap className="h-4 w-4" />,
    title: "Instant link generation",
    desc: "Unlimited UTM links in seconds. Copy, paste, share. No complicated setup required.",
  },
  {
    icon: <BarChart2 className="h-4 w-4" />,
    title: "Real-time dashboard",
    desc: "Live clicks, earnings, and traffic sources updated as they happen — per second.",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    title: "AI fraud detection",
    desc: "Bot filtering, IP validation, and anomaly detection keep every earned cent clean.",
  },
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Multi-platform tracking",
    desc: "Works everywhere — social media, email, SMS, podcasts, WhatsApp, and beyond.",
  },
  {
    icon: <Clock className="h-4 w-4" />,
    title: "Flexible withdrawals",
    desc: "Request payouts via PayPal, bank transfer, or crypto. No minimums, no waiting.",
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "UTM optimisation",
    desc: "A/B test campaigns with UTM parameters. See which channels and content convert best.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "TikTok Creator",
    earning: "$4,200/mo",
    text: "I was skeptical, but the tracking is genuinely transparent. I can see exactly which video drove which click.",
  },
  {
    name: "Alex Rivera",
    role: "Tech Blogger",
    earning: "$6,800/mo",
    text: "The real-time dashboard is addictive. I optimise my posts based on click data every single week.",
  },
  {
    name: "Jordan Kim",
    role: "Email Newsletter",
    earning: "$8,500/mo",
    text: "My subscribers generate passive income for me 24/7. Set it up once and it just runs.",
  },
];

const FAQS = [
  {
    q: "How does the tracking work?",
    a: "Every link you generate includes a unique UTM code. Our servers log each visit server-side — no JavaScript required — so you never lose a click to ad blockers or privacy extensions.",
  },
  {
    q: "When do I get paid?",
    a: "Earnings are tallied daily. Once you cross your chosen threshold, you can request a payout any time via Bank Transfer, PayPal, Payoneer, or crypto.",
  },
  {
    q: "What RPM can I expect?",
    a: "RPMs range from $2 to $18 depending on your traffic geography and engagement quality. Tier 1 audiences (US, UK, CA, AU) consistently hit the upper range.",
  },
  {
    q: "Is there a minimum to join?",
    a: "None. Sign up free, generate your first link in under 60 seconds, and start earning from your very first click.",
  },
  {
    q: "Is bot or fake traffic detected?",
    a: "Yes. Our AI fraud layer filters bots, VPNs, and suspicious click patterns in real-time. Only genuine human traffic counts toward your earnings.",
  },
];

const STATS = [
  { num: "50K+", label: "Active affiliates" },
  { num: "$2–18", label: "RPM range (USD)" },
  { num: "99.99%", label: "Tracking accuracy" },
  { num: "< 60s", label: "Time to first link" },
];

const TICKER_ITEMS = [
  "No minimum balance",
  "Instant link generation",
  "Real-time dashboard",
  "Server-side tracking",
  "AI fraud detection",
  "PayPal · Bank · Crypto",
  "Free forever",
];

/* ─── PAGE ─────────────────────────────────────────────────── */

export default function Home() {
  const [views, setViews] = useState(10000);

  const rpm2 = Math.round((views / 1000) * 2);
  const rpm10 = Math.round((views / 1000) * 10);
  const rpm18 = Math.round((views / 1000) * 18);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <section
        className="relative md:min-h-svh flex flex-col justify-end px-6 md:px-10 pb-14 md:pb-20 pt-28 bg-background overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(var(--muted) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        {/* Lime glow in corner */}
        <div
          className="absolute -top-40 -right-40 w-140 h-140 rounded-full opacity-[0.2] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--lime) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <Badge
          variant="outline"
          className="mb-6 w-fit border-primary/40 bg-primary/10 text-primary animate-fade-up"
        >
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary inline-block" />
          50,000+ active affiliates
        </Badge>

        <h1
          id="hero-heading"
          className="font-serif-display text-[clamp(3.2rem,10vw,8rem)] leading-[0.95] tracking-tight text-foreground animate-fade-up delay-150"
        >
          Your links.
          <br />
          Your <em className="text-primary not-italic">audience.</em>
          <br />
          Your income.
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mt-10 animate-fade-up delay-300">
          <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed font-light">
            Generate UTM tracking links. Share anywhere. Earn{" "}
            <span className="text-primary font-medium">
              $2–$18 per thousand views
            </span>{" "}
            with transparent, real-time payouts.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Link href="/auth/login">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Trust chips */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-8 animate-fade-up delay-450">
          {["No credit card", "Earn from day 1", "Free forever"].map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <span className="text-primary">✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────── */}
      <div
        className="bg-primary overflow-hidden whitespace-nowrap py-3"
        aria-hidden="true"
      >
        <div className="inline-flex animate-ticker">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex items-center">
              {TICKER_ITEMS.map((item, j) => (
                <span
                  key={j}
                  className="inline-flex items-center gap-6 pr-6 text-primary-foreground"
                >
                  <span className="text-xs font-semibold tracking-widest uppercase">
                    {item}
                  </span>
                  <span className="opacity-40 font-light">—</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS BAND ───────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 border-b border-border"
        role="region"
        aria-label="Platform statistics"
      >
        {STATS.map((s, i) => (
          <div
            key={s.num}
            className={cn(
              "px-6 md:px-10 py-8",
              i < STATS.length - 1 && "border-r border-border",
            )}
          >
            <p className="font-serif-display text-[clamp(2rem,4.5vw,3.2rem)] leading-none text-foreground">
              {s.num}
            </p>
            <p className="text-sm text-muted-foreground mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-16 md:py-24"
        aria-labelledby="how-heading"
      >
        {/* Section label */}
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6 bg-muted-foreground inline-block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            How it works
          </span>
        </div>

        <h2
          id="how-heading"
          className="font-serif-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] mb-10"
        >
          Three steps.
          <br />
          Real income.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 border border-border rounded-2xl overflow-hidden">
          {HOW_STEPS.map((step, idx) => (
            <div
              key={step.n}
              className={cn(
                "p-6 md:p-8 bg-card transition-colors hover:bg-accent/40",
                idx % 2 === 0 && "sm:border-r border-border",
                idx < 2 && "border-b border-border",
              )}
            >
              <p className="font-serif-display text-5xl text-border mb-4 leading-none select-none">
                {step.n}
              </p>
              <h3 className="text-base font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────── */}
      {/*
        Calculator section is pinned to the near-black hero-bg colour so it
        always reads as a dark panel in both light and dark mode — deliberate
        editorial rhythm (light / dark / light / dark / light / cta).
      */}
      <section
        className="px-6 md:px-10 py-16 md:py-24 bg-[--hero-bg]"
        aria-labelledby="calc-heading"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-6 bg-muted-foreground inline-block" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Earnings calculator
            </span>
          </div>

          <h2
            id="calc-heading"
            className="font-serif-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] text-foreground mb-2"
          >
            How much could you
            <br />
            <em className="text-primary not-italic">actually</em> earn?
          </h2>
          <p className="text-muted-foreground text-sm mb-10">
            Drag the slider to see your estimated monthly income.
          </p>

          {/* Slider label row */}
          <div className="mb-3 flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Monthly views</span>
            <span className="font-serif-display text-3xl text-foreground">
              {views.toLocaleString()}
            </span>
          </div>

          <Slider
            min={500}
            max={200000}
            step={500}
            value={[views]}
            onValueChange={(v) => setViews(v[0])}
            className="mb-10"
            aria-label="Monthly views"
          />

          {/* RPM result cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Conservative",
                rpm: "$2",
                value: rpm2,
                highlight: false,
              },
              { label: "Average", rpm: "$10", value: rpm10, highlight: true },
              {
                label: "Optimised",
                rpm: "$18",
                value: rpm18,
                highlight: false,
              },
            ].map(({ label, rpm, value, highlight }) => (
              <Card
                key={rpm}
                className={cn(
                  "bg-card/5 backdrop-blur-sm transition-colors",
                  highlight ? "border-primary/60" : "border-white/10",
                )}
              >
                <CardContent className="p-5">
                  <p
                    className={cn(
                      "text-xs uppercase tracking-widest font-semibold mb-2",
                      highlight ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </p>
                  <p className="font-serif-display text-4xl text-primary leading-none">
                    ${value.toLocaleString()}
                  </p>
                  <p className="text-xs text-foreground/30 mt-1.5">
                    at {rpm} RPM / mo
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-16 md:py-24"
        aria-labelledby="features-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-muted-foreground inline-block" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Platform
              </span>
            </div>
            <h2
              id="features-heading"
              className="font-serif-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05]"
            >
              Built for
              <br />
              serious creators.
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground self-start sm:self-end"
          >
            <Link href="/auth/login">
              Explore all features <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-2xl overflow-hidden">
          {FEATURES.map((f, idx) => (
            <div
              key={f.title}
              className={cn(
                "p-6 md:p-7 bg-card transition-colors hover:bg-accent/30 group",
                /* right borders between columns */
                idx % 3 !== 2 && "lg:border-r border-border",
                idx % 2 === 0 && idx % 3 !== 0 && "sm:border-r border-border",
                /* always reset for lg */
                idx % 3 === 0 && "lg:border-r border-border",
                /* bottom borders between rows */
                idx < FEATURES.length - 3 && "lg:border-b border-border",
                idx < FEATURES.length - 2 && "sm:border-b border-border",
                idx < FEATURES.length - 1 && "border-b border-border",
              )}
            >
              <div className="mb-4 h-9 w-9 flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {f.icon}
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-16 md:py-24 bg-section-alt"
        aria-labelledby="testi-heading"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6 bg-muted-foreground inline-block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Social proof
          </span>
        </div>
        <h2
          id="testi-heading"
          className="font-serif-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] mb-10"
        >
          Real creators,
          <br />
          real money.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.name}
              className="bg-card border-border hover:border-primary/50 transition-colors flex flex-col"
            >
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <p className="text-sm text-foreground leading-relaxed font-light flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <Separator />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <p className="font-serif-display text-2xl text-primary leading-none">
                    {t.earning}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-16 md:py-24 bg-[--hero-bg]"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-6 bg-muted-foreground inline-block" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              FAQ
            </span>
          </div>
          <h2
            id="faq-heading"
            className="font-serif-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] text-foreground mb-10"
          >
            Questions &amp;
            <br />
            answers.
          </h2>

          <Accordion type="single" collapsible className="space-y-0">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b border-white/10 last:border-0"
              >
                <AccordionTrigger className="text-left text-sm font-normal text-foreground/80 hover:text-primary hover:no-underline py-5 [&>svg]:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-20 md:py-28 bg-primary text-center"
        aria-labelledby="cta-heading"
      >
        <Badge
          variant="outline"
          className="mb-6 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
        >
          Free forever · No credit card
        </Badge>
        <h2
          id="cta-heading"
          className="font-serif-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.02] text-primary-foreground mb-4"
        >
          Start earning
          <br />
          today.
        </h2>
        <p className="text-sm text-primary-foreground/60 mb-10 max-w-sm mx-auto">
          Your first link in under 60 seconds. Join 50,000+ creators already
          earning.
        </p>
        <Button
          asChild
          size="lg"
          variant={"secondary"}
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium transition-all hover:-translate-y-0.5 shadow-xl"
        >
          <Link href="/auth/login">
            Create free account <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-8 bg-[--hero-bg] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground/10 text-primary">
            <Zap className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            DailyEarn
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            &copy; Copyright {new Date().getFullYear()}. All Rights Reserved
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          Made with ❤️ by{" "}
          <Link
            className="hover:underline hover:text-foreground"
            href={"https://nawabwebfolio.vercel.app"}
            target="_blank"
          >
            Moazzam Nawab
          </Link>
        </div>

        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {[
            { label: "Privacy", href: "/privacy-policy" },
            { label: "Login", href: "/auth/login" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  );
}
