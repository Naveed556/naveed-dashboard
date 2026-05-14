import Header from "@/components/header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <section className="relative min-h-screen flex flex-col justify-center items-center bg-background overflow-hidden">
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
        <div className="w-full max-w-sm relative">{children}</div>
      </section>
    </>
  );
}
