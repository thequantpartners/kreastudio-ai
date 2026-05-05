"use client";

import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  Check,
  CircleDot,
  Home,
  Mail,
  MoreVertical,
  Plus,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "home" | "agents" | "workflow" | "activity" | "settings";

const metrics = [
  { label: "Active Agents", value: "12", icon: Users },
  { label: "Running Workflows", value: "8", icon: Workflow },
  { label: "Tasks Completed", value: "144", icon: Check },
  { label: "Success Rate", value: "98%", icon: BarChart3 },
];

const quickActions = [
  { label: "Create Agent", icon: Plus },
  { label: "View Analytics", icon: BarChart3 },
];

const recentActivity = [
  { title: "Support Agent started", time: "2 minutes ago", icon: Bot },
  { title: "Email workflow completed", time: "15 minutes ago", icon: Mail },
  { title: "Data analysis finished", time: "22 minutes ago", icon: CircleDot },
];

const navItems: Array<{ id: Tab; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "agents", label: "Agents", icon: Users },
  { id: "workflow", label: "Flows", icon: Workflow },
  { id: "activity", label: "Pulse", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

function SectionTitle({ title }: Readonly<{ title: string }>) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <h2 className="text-[14px] font-bold text-white">{title}</h2>
      <button type="button" className="text-[10px] font-medium text-white/70">
        View all
      </button>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }: Readonly<(typeof metrics)[number]>) {
  return (
    <article className="relative min-h-[116px] overflow-hidden rounded-[8px] border border-white/8 bg-[linear-gradient(145deg,rgba(83,84,109,.7),rgba(37,38,51,.86)_62%,rgba(24,24,32,.92))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_18px_36px_rgba(0,0,0,.26)]">
      <div className="absolute -right-7 -top-7 size-20 rounded-full bg-[#9f7cff]/18 blur-2xl" />
      <div className="grid size-8 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.55),rgba(136,104,232,.58)_48%,rgba(50,43,73,.8))] text-white shadow-[0_8px_20px_rgba(127,88,220,.28)]">
        <Icon className="size-4" />
      </div>
      <p className="mt-5 text-[11px] font-medium text-white/84">{label}</p>
      <p className="mt-1 text-[22px] font-semibold leading-none text-white">{value}</p>
      <button
        type="button"
        className="absolute bottom-0 right-0 flex h-7 min-w-[72px] items-center justify-center gap-1 rounded-tl-[8px] border-l border-t border-white/10 bg-[linear-gradient(135deg,rgba(144,126,202,.55),rgba(59,59,83,.88))] px-2 text-[7px] font-bold leading-none text-white/92"
      >
        <span className="whitespace-nowrap">See More</span>
        <ArrowRight className="size-2.5 shrink-0" strokeWidth={3} />
      </button>
    </article>
  );
}

function QuickActions() {
  return (
    <div className="relative mt-3 h-[90px] overflow-hidden rounded-[8px] border border-white/8 bg-[linear-gradient(145deg,rgba(72,73,96,.68),rgba(30,31,41,.9))] p-4">
      <div className="absolute right-[-28px] top-3 h-16 w-12 rounded-l-full border border-[#9e73ff]/40 bg-[#8e61ff]/18" />
      <div className="flex h-full items-center gap-2">
        {quickActions.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-[7px] border border-white/12 bg-[#242536]/76 px-2 text-[9px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)]"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-[#5e5488]/80">
              <item.icon className="size-3.5" />
            </span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActivityRow({
  title,
  time,
  icon: Icon,
}: Readonly<{
  title: string;
  time: string;
  icon: typeof Bot;
}>) {
  return (
    <article className="relative flex min-h-[58px] items-center gap-3 overflow-hidden rounded-[8px] border border-white/8 bg-[linear-gradient(145deg,rgba(76,77,101,.72),rgba(36,37,50,.95))] px-3 shadow-[0_12px_26px_rgba(0,0,0,.18)]">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#6e5ba6]/70">
        <Icon className="size-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-bold text-white">{title}</p>
        <p className="mt-0.5 text-[9px] text-white/70">{time}</p>
      </div>
      <button
        type="button"
        className="absolute right-0 top-0 grid h-6 w-11 place-items-center rounded-bl-[8px] border-b border-l border-white/10 bg-[linear-gradient(135deg,rgba(137,113,197,.62),rgba(54,54,76,.88))]"
        aria-label={`Options for ${title}`}
      >
        <MoreVertical className="size-3.5" />
      </button>
    </article>
  );
}

function HomeView() {
  return (
    <>
      <header className="mt-4 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-10 rounded-full border border-white/24 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=240&auto=format&fit=crop)",
            }}
          />
          <div>
            <p className="text-[10px] text-white/58">Welcome Back,</p>
            <h1 className="text-[13px] font-semibold text-white">Max John Doe</h1>
          </div>
        </div>
        <button
          type="button"
          className="relative grid size-10 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_20%,rgba(255,255,255,.36),rgba(83,73,124,.84))] shadow-[0_10px_28px_rgba(0,0,0,.32)]"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-2.5 top-2 size-2 rounded-full bg-[#ff4b86] ring-2 ring-[#4e466d]" />
        </button>
      </header>

      <section className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <SectionTitle title="Quick Actions" />
      <QuickActions />

      <SectionTitle title="Recent Activity" />
      <div className="mt-3 space-y-3">
        {recentActivity.slice(0, 2).map((item) => (
          <ActivityRow key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}

function AgentsView() {
  return (
    <>
      <header className="mt-4 flex shrink-0 items-center justify-between">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_20%,rgba(255,255,255,.34),rgba(80,70,120,.84))]"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h1 className="text-[15px] font-bold text-white">Agents</h1>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_20%,rgba(255,255,255,.34),rgba(80,70,120,.84))]"
          aria-label="More"
        >
          <MoreVertical className="size-4" />
        </button>
      </header>

      <label className="mt-5 flex h-12 shrink-0 items-center gap-2 rounded-[8px] border border-white/7 bg-[#343346]/78 px-3 text-white/72">
        <Search className="size-4" />
        <input
          type="search"
          placeholder="Search agents"
          className="min-w-0 flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-white/48"
        />
      </label>

      <div className="mt-4 flex gap-2 overflow-hidden">
        {["All", "Active", "Idle", "Offline", "Busy"].map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={cn(
              "h-8 shrink-0 rounded-full px-4 text-[11px] font-medium text-white",
              index === 0
                ? "bg-[linear-gradient(135deg,rgba(171,143,255,.7),rgba(74,64,108,.9))] shadow-[0_8px_20px_rgba(105,79,171,.26)]"
                : "bg-[#2c2a3d]/88"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <article className="mt-4 overflow-hidden rounded-[8px] border border-white/8 bg-[linear-gradient(145deg,rgba(65,66,87,.82),rgba(34,35,48,.95))] p-3">
        <div className="flex items-start gap-3">
          <div className="relative grid size-10 place-items-center rounded-full bg-[#645898]">
            <Bot className="size-5" />
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#36364a] bg-[#54df8f]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[12px] font-bold text-white">Customer Support Agent</h2>
            <p className="text-[10px] text-white/60">AI Assistant</p>
          </div>
          <MoreVertical className="size-4 text-white/80" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["Tasks Today", "24"],
            ["Success", "99%"],
            ["Last Active", "2 min ago"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[7px] bg-[#4b4b63]/58 p-2">
              <p className="text-[8px] text-white/48">{label}</p>
              <p className="mt-1 text-[12px] font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[8px] text-white/58">
            <span>Usage</span>
            <span>85%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/78">
            <div className="h-full w-[58%] rounded-full bg-[linear-gradient(90deg,#7b43ff,#c18cff)]" />
          </div>
        </div>
      </article>

      <SectionTitle title="Recent Activity" />
      <div className="mt-3 space-y-3">
        {recentActivity.map((item) => (
          <ActivityRow key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}

function PlaceholderView({
  tab,
  onLogout,
}: Readonly<{
  tab: Tab;
  onLogout?: () => void;
}>) {
  const isSettings = tab === "settings";

  return (
    <div className="grid min-h-[58svh] place-items-center text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#6d5ba5]/58">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="mt-4 text-lg font-bold capitalize text-white">{tab}</h1>
        <p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-5 text-white/58">
          This area is ready for the next dashboard module.
        </p>
        {isSettings ? (
          <button
            type="button"
            onClick={onLogout}
            className="mx-auto mt-6 flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-[linear-gradient(135deg,#b695ff,#7359c7)] px-5 text-[13px] font-bold text-white shadow-[0_14px_32px_rgba(126,95,218,.3)] transition hover:brightness-110"
          >
            <LogOut className="size-4" />
            Cerrar sesion
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function MobileDashboard({ onLogout }: Readonly<{ onLogout?: () => void }>) {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <main className="h-[100svh] w-full overflow-hidden bg-[#10071d] text-white md:h-dvh">
      <div className="relative mx-auto grid h-[100svh] w-full max-w-full grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-[linear-gradient(180deg,#1b1230_0%,#151522_42%,#0c0d13_100%)] px-[clamp(16px,5vw,22px)] pb-[max(14px,env(safe-area-inset-bottom))] pt-3 md:h-dvh md:max-w-[430px]">
        <div className="absolute left-[-130px] top-[-90px] size-72 rounded-full bg-[#7b4dff]/32 blur-3xl" />
        <div className="absolute right-[-110px] top-28 size-64 rounded-full bg-[#3772ff]/18 blur-3xl" />
        <div className="absolute bottom-[-140px] left-12 size-72 rounded-full bg-[#b15cff]/18 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.08),transparent_34%),linear-gradient(180deg,transparent_0%,rgba(0,0,0,.28)_100%)]" />

        <div
          className={cn(
            "relative z-10 flex min-h-0 justify-center overflow-hidden pb-4",
            activeTab === "home" ? "items-center" : "items-start pt-2"
          )}
        >
          <div className="w-full max-w-full">
            {activeTab === "home" ? <HomeView /> : null}
            {activeTab === "agents" ? <AgentsView /> : null}
            {activeTab !== "home" && activeTab !== "agents" ? (
              <PlaceholderView tab={activeTab} onLogout={onLogout} />
            ) : null}
          </div>
        </div>

        <nav className="relative z-20 grid h-[58px] shrink-0 grid-cols-5 items-center rounded-full border border-white/12 bg-[linear-gradient(135deg,rgba(99,81,145,.9),rgba(59,49,90,.96))] px-2 shadow-[0_18px_42px_rgba(0,0,0,.36),inset_0_1px_0_rgba(255,255,255,.16)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex h-11 min-w-0 items-center justify-center rounded-full text-white/86 transition",
                  active
                    ? "flex-col gap-0.5 bg-[linear-gradient(135deg,#b695ff,#7a5fd1)] px-2 text-center shadow-[0_10px_24px_rgba(126,95,218,.35)]"
                    : "px-1"
                )}
                aria-label={item.label}
              >
                <Icon className="size-[18px]" />
                {active ? <span className="max-w-full truncate text-[9px] font-semibold leading-none">{item.label}</span> : null}
              </button>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
