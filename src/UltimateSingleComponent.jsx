import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Search,
  SunMedium,
  Moon,
  Github,
  Mail,
  Phone,
  Download,
  ExternalLink,
  Star,
  Code2,
  Settings,
  Layers3,
  Calendar,
  ChevronRight,
  Info,
  X,
  Menu,
  Rocket,
  Flame,
  ShieldCheck,
  Wrench,
  Globe2,
  ChartNoAxesCombined,
  MessageSquare,
  BrainCircuit,
  Cpu,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ---------- Mock Data ----------
const METRICS = Array.from({ length: 12 }).map((_, i) => ({
  month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
  commits: 50 + Math.floor(Math.random() * 80),
  issues: 5 + Math.floor(Math.random() * 20),
  prs: 3 + Math.floor(Math.random() * 12),
}));

// ---------- Helpers ----------
const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
};

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`py-14 md:py-20 ${className}`}>
    {children}
  </section>
);

const Anchor = ({ to, children }) => (
  <a href={`#${to}`} className="hover:opacity-80 transition-opacity">
    {children}
  </a>
);

// ---------- Main Component ----------
export default function UltimateSingleComponent() {
  const [dark, setDark] = useLocalStorage("usc-theme", true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <TooltipProvider>
      <div
        className={`min-h-screen ${
          dark
            ? "dark bg-neutral-950 text-neutral-100"
            : "bg-neutral-50 text-neutral-900"
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-black/20 border-b border-white/20 dark:border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-2xl grid place-content-center bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-md"></div>
              <span className="font-semibold tracking-tight text-lg">
                Ultimate Single Component
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-5 text-sm">
              {[
                { id: "hero", label: "Home" },
                { id: "projects", label: "Projects" },
                { id: "skills", label: "Skills" },
                { id: "metrics", label: "Metrics" },
                { id: "timeline", label: "Timeline" },
                { id: "faq", label: "FAQ" },
                { id: "contact", label: "Contact" },
              ].map((l) => (
                <Anchor key={l.id} to={l.id}>
                  <span className="hover:underline underline-offset-4">
                    {l.label}
                  </span>
                </Anchor>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ShadTooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDark((d) => !d)}
                    className="rounded-2xl"
                  >
                    {dark ? (
                      <SunMedium className="size-5" />
                    ) : (
                      <Moon className="size-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Theme</TooltipContent>
              </ShadTooltip>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl md:hidden"
                onClick={() => setMenuOpen((m) => !m)}
              >
                <Menu className="size-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <Section id="hero" className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight"
              >
                Build fast. Ship beautiful. Repeat.
              </motion.h1>
              <p className="mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-prose">
                This single-file component packs a mini-portfolio: projects,
                skills, charts, FAQ, contact, theme toggle, and more.
              </p>
            </div>

            <div className="grid gap-4">
              {/* Commits */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <ChartNoAxesCombined className="size-5" /> Monthly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={METRICS}>
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="#6366f1"
                              stopOpacity={0.5}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip contentStyle={{ borderRadius: 12 }} />
                        <Area
                          type="monotone"
                          dataKey="commits"
                          stroke="#6366f1"
                          fillOpacity={1}
                          fill="url(#grad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Issues */}
                <Card className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="size-5" /> Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={METRICS}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="month" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip contentStyle={{ borderRadius: 12 }} />
                          <Bar
                            dataKey="issues"
                            fill="#22c55e"
                            radius={[10, 10, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* PRs */}
                <Card className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="size-5" /> Pull Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={METRICS}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="month" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip contentStyle={{ borderRadius: 12 }} />
                          <Line
                            type="monotone"
                            dataKey="prs"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </TooltipProvider>
  );
}
