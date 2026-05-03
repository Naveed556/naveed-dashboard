"use client";
import { ModeToggle } from "./mode-toogle"; 
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent",
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-2 group"
        aria-label="DailyEarn home"
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <span className="font-semibold text-base tracking-tight">
          DailyEarn
        </span>
      </Link>

      <nav className="flex items-center gap-2" aria-label="Main navigation">
        <ModeToggle />
        <Button
          size="sm"
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        >
          <Link href="/auth/login">
            Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </nav>
    </header>
  );
};

export default Header;
