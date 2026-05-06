"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  Brain,
  CalendarDays,
  Camera,
  ChevronRight,
  GalleryHorizontalEnd,
  Home,
  ImageUp,
  LogOut,
  Megaphone,
  Palette,
  Settings,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "create" | "gallery" | "calendar" | "brand" | "settings";
type BriefStep = "assets" | "brand" | "offer" | "audience" | "generate";

type BrandBrief = {
  brandName: string;
  description: string;
  palette: string[];
  offer: string;
  audience: string;
  goal: string;
  productImage: string;
  logoImage: string;
};

type CopyVariant = {
  tone: string;
  copy: string;
};

type PostStatus = "Pendiente" | "Publicado" | "Funciono" | "Rehacer" | "Reutilizar";

type PostMetrics = {
  likes: number;
  comments: number;
  saves: number;
  leads: number;
  sales: number;
};

type CampaignPost = {
  day: number;
  title: string;
  format: string;
  pillar: string;
  goal: string;
  cta: string;
  color: string;
  copy: string;
  status: PostStatus;
  metrics: PostMetrics;
  variants: CopyVariant[];
};

const initialBrief: BrandBrief = {
  brandName: "",
  description: "",
  palette: ["#f8582f", "#ffd166", "#2515ff"],
  offer: "",
  audience: "",
  goal: "Ventas/leads",
  productImage: "",
  logoImage: "",
};

const navItems: Array<{ id: Tab; label: string; icon: typeof Home }> = [
  { id: "create", label: "Crear", icon: Sparkles },
  { id: "gallery", label: "Galeria", icon: GalleryHorizontalEnd },
  { id: "calendar", label: "Calendario", icon: CalendarDays },
  { id: "brand", label: "Marca", icon: Palette },
  { id: "settings", label: "Ajustes", icon: Settings },
];

const steps: Array<{ id: BriefStep; label: string }> = [
  { id: "assets", label: "Assets" },
  { id: "brand", label: "Marca" },
  { id: "offer", label: "Oferta" },
  { id: "audience", label: "Audiencia" },
  { id: "generate", label: "Generar" },
];

const formatCycle = ["Post cuadrado", "Story", "Reel cover", "Carrusel"];
const pillarCycle = ["Oferta", "Educativo", "Prueba social", "Objecion", "Beneficio"];
const statusOptions: PostStatus[] = ["Pendiente", "Publicado", "Funciono", "Rehacer", "Reutilizar"];
const emptyMetrics: PostMetrics = { likes: 0, comments: 0, saves: 0, leads: 0, sales: 0 };

function buildCampaignPosts(brief: BrandBrief): CampaignPost[] {
  const brand = brief.brandName.trim() || "Tu marca";
  const offer = brief.offer.trim() || "tu oferta principal";
  const audience = brief.audience.trim() || "clientes listos para comprar";

  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const pillar = pillarCycle[index % pillarCycle.length];
    const format = formatCycle[index % formatCycle.length];
    const color = brief.palette[index % brief.palette.length] ?? "#f8582f";
    const title = `${pillar} para ${brand}`;
    const cta = index % 3 === 0 ? "Escribenos hoy" : index % 3 === 1 ? "Pide tu cotizacion" : "Reserva ahora";
    const base = `${brand}: ${offer}. Ideal para ${audience}. ${cta}.`;

    return {
      day,
      title,
      format,
      pillar,
      goal: brief.goal,
      cta,
      color,
      copy: base,
      status: "Pendiente",
      metrics: { ...emptyMetrics },
      variants: [
        { tone: "Directo", copy: `${offer} sin vueltas. Si quieres avanzar, ${cta.toLowerCase()}.` },
        { tone: "Emocional", copy: `Haz que tu proxima decision se sienta simple con ${brand}. ${cta}.` },
        { tone: "Oferta", copy: `Esta semana activamos ${offer}. Cupos limitados para ${audience}.` },
        { tone: "Educativo", copy: `Antes de elegir, mira por que ${offer} puede resolver mejor tu necesidad.` },
        { tone: "Urgencia", copy: `Ultimos espacios para aprovechar ${offer}. ${cta} antes de que cierre el dia.` },
      ],
    };
  });
}

function readFilePreview(event: ChangeEvent<HTMLInputElement>, onPreview: (value: string) => void) {
  const file = event.target.files?.[0];
  if (!file) return;
  onPreview(URL.createObjectURL(file));
}

function scorePost(post: CampaignPost) {
  return post.metrics.likes + post.metrics.comments * 3 + post.metrics.saves * 4 + post.metrics.leads * 12 + post.metrics.sales * 24;
}

function getMarketingScore(posts: CampaignPost[], brief: BrandBrief) {
  const completedBriefFields = [
    brief.brandName,
    brief.description,
    brief.offer,
    brief.audience,
    brief.productImage,
    brief.logoImage,
  ].filter(Boolean).length;
  const published = posts.filter((post) => post.status !== "Pendiente").length;
  const winners = posts.filter((post) => post.status === "Funciono" || post.status === "Reutilizar").length;
  const briefScore = Math.round((completedBriefFields / 6) * 30);
  const consistencyScore = Math.min(35, Math.round((published / 30) * 35));
  const learningScore = Math.min(35, winners * 7 + posts.filter((post) => scorePost(post) > 0).length * 2);

  return Math.min(100, briefScore + consistencyScore + learningScore);
}

function getCommercialMemory(posts: CampaignPost[]) {
  const ranked = [...posts].sort((a, b) => scorePost(b) - scorePost(a));
  const topPost = ranked.find((post) => scorePost(post) > 0) ?? posts.find((post) => post.status === "Funciono") ?? posts[0];
  const published = posts.filter((post) => post.status !== "Pendiente");
  const pending = posts.filter((post) => post.status === "Pendiente");
  const reusable = posts.filter((post) => post.status === "Reutilizar" || post.status === "Funciono");
  const needsWork = posts.filter((post) => post.status === "Rehacer");

  return {
    topPost,
    published,
    pending,
    reusable,
    needsWork,
    topFormat: topPost?.format ?? "Story",
    topPillar: topPost?.pillar ?? "Oferta",
    topTone: topPost?.variants[0]?.tone ?? "Directo",
    nextAction:
      reusable.length > 0
        ? `Repite ${reusable[0].pillar.toLowerCase()} con una variacion ${reusable[0].format.toLowerCase()}.`
        : "Publica 3 piezas y registra resultados para activar aprendizajes.",
  };
}

function SectionTitle({
  title,
  action,
}: Readonly<{
  title: string;
  action?: string;
}>) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <h2 className="text-[14px] font-bold text-white">{title}</h2>
      {action ? <span className="text-[10px] font-medium text-white/60">{action}</span> : null}
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  multiline,
}: Readonly<{
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}>) {
  const common =
    "mt-2 w-full rounded-[8px] border border-white/10 bg-[#242536]/76 px-3 text-[12px] text-white outline-none placeholder:text-white/38 focus:border-[#f8582f]/60";

  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/52">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn(common, "min-h-[82px] resize-none py-3 leading-5")}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(common, "h-11")}
        />
      )}
    </label>
  );
}

function AssetPicker({
  title,
  preview,
  icon: Icon,
  onPreview,
}: Readonly<{
  title: string;
  preview: string;
  icon: typeof Camera;
  onPreview: (value: string) => void;
}>) {
  return (
    <label className="relative flex min-h-[116px] flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-[8px] border border-white/10 bg-[linear-gradient(145deg,rgba(72,73,96,.68),rgba(30,31,41,.9))] p-3">
      {preview ? (
        <span className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${preview})` }} />
      ) : null}
      <span className="relative grid size-9 place-items-center rounded-full bg-black/32 text-white backdrop-blur">
        <Icon className="size-4" />
      </span>
      <span className="relative flex items-center justify-between gap-2 text-[11px] font-bold text-white">
        {title}
        <Upload className="size-3.5 shrink-0" />
      </span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => readFilePreview(event, onPreview)}
      />
    </label>
  );
}

function ProgressRail({ step }: Readonly<{ step: BriefStep }>) {
  const activeIndex = Math.max(0, steps.findIndex((item) => item.id === step));

  return (
    <div className="mt-4 flex gap-1.5">
      {steps.map((item, index) => (
        <span
          key={item.label}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            index <= activeIndex ? "bg-[#f8582f]" : "bg-white/12"
          )}
        />
      ))}
    </div>
  );
}

function CampaignHero({
  brief,
  postCount,
}: Readonly<{
  brief: BrandBrief;
  postCount: number;
}>) {
  return (
    <article className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[linear-gradient(145deg,rgba(83,84,109,.7),rgba(37,38,51,.86)_62%,rgba(24,24,32,.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_18px_36px_rgba(0,0,0,.26)]">
      <div className="absolute -right-10 -top-10 size-28 rounded-full bg-[#f8582f]/24 blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd166]">Campana 30 dias</p>
          <h1 className="mt-2 text-[24px] font-semibold leading-[1.05] text-white">Que contenido crearemos hoy?</h1>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f8582f]/22 text-[#ffd166]">
          <Megaphone className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-[12px] leading-5 text-white/66">
        Completa el brief y convierte tu marca en una galeria estrategica lista para Instagram y Facebook.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          ["Posts", `${postCount}/30`],
          ["Objetivo", brief.goal],
          ["Canal", "IG + FB"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[7px] bg-black/22 p-2">
            <p className="text-[8px] text-white/42">{label}</p>
            <p className="mt-1 truncate text-[11px] font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function MarketingScoreCard({
  score,
  posts,
}: Readonly<{
  score: number;
  posts: CampaignPost[];
}>) {
  const memory = getCommercialMemory(posts);
  const publishedCount = memory.published.length;
  const pendingCount = memory.pending.length;

  return (
    <article className="relative mt-4 overflow-hidden rounded-[8px] border border-[#ffd166]/18 bg-[linear-gradient(145deg,rgba(248,88,47,.22),rgba(36,37,50,.94)_58%,rgba(20,20,29,.98))] p-4">
      <div className="absolute right-[-28px] top-[-28px] size-24 rounded-full bg-[#ffd166]/18 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd166]">Marketing Score</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-[40px] font-semibold leading-none text-white">{score}</span>
            <span className="pb-1 text-[12px] font-bold text-white/52">/100</span>
          </div>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-black/28 text-[#ffd166]">
          <BarChart3 className="size-5" />
        </span>
      </div>
      <p className="relative mt-3 text-[12px] leading-5 text-white/66">{memory.nextAction}</p>
      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {[
          ["Publicados", publishedCount],
          ["Pendientes", pendingCount],
          ["Reutilizar", memory.reusable.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[7px] bg-black/24 p-2">
            <p className="text-[8px] text-white/42">{label}</p>
            <p className="mt-1 text-[13px] font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function WeeklyReview({ posts }: Readonly<{ posts: CampaignPost[] }>) {
  const memory = getCommercialMemory(posts);

  return (
    <section className="mt-4 rounded-[8px] border border-white/10 bg-[#242536]/72 p-3">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffd166]/14 text-[#ffd166]">
          <TrendingUp className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[13px] font-bold text-white">Revision semanal</h2>
          <p className="mt-1 text-[11px] leading-5 text-white/58">
            Esta semana funciono mejor: {memory.topPillar.toLowerCase()} en {memory.topFormat.toLowerCase()}.
          </p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {[
          ["Repetir", memory.nextAction],
          ["Ajustar", memory.needsWork.length > 0 ? "Rehaz los posts marcados con baja respuesta antes de publicarlos otra vez." : "Prueba una oferta directa con CTA a mensajes."],
          ["Evitar", "Posts educativos largos sin CTA claro."],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[7px] bg-black/20 p-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#ffd166]">{label}</p>
            <p className="mt-1 text-[11px] leading-4 text-white/68">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CreateView({
  brief,
  step,
  posts,
  marketingScore,
  isGenerating,
  updateBrief,
  setStep,
  onGenerate,
}: Readonly<{
  brief: BrandBrief;
  step: BriefStep;
  posts: CampaignPost[];
  marketingScore: number;
  isGenerating: boolean;
  updateBrief: (patch: Partial<BrandBrief>) => void;
  setStep: (step: BriefStep) => void;
  onGenerate: () => void;
}>) {
  const stepIndex = steps.findIndex((item) => item.id === step);
  const nextStep = steps[Math.min(steps.length - 1, stepIndex + 1)]?.id ?? "generate";

  return (
    <>
      <CampaignHero brief={brief} postCount={posts.filter((post) => post.status !== "Pendiente").length} />
      <MarketingScoreCard score={marketingScore} posts={posts} />
      <ProgressRail step={step} />

      <section className="mt-4 space-y-3">
        {step === "assets" ? (
          <>
            <SectionTitle title="Assets base" action="Obligatorio" />
            <div className="flex gap-3">
              <AssetPicker
                title="Producto o servicio"
                preview={brief.productImage}
                icon={ImageUp}
                onPreview={(productImage) => updateBrief({ productImage })}
              />
              <AssetPicker
                title="Logo"
                preview={brief.logoImage}
                icon={BadgeCheck}
                onPreview={(logoImage) => updateBrief({ logoImage })}
              />
            </div>
          </>
        ) : null}

        {step === "brand" ? (
          <>
            <SectionTitle title="Identidad de marca" />
            <Field
              label="Nombre"
              value={brief.brandName}
              placeholder="Ej. Casa Brava"
              onChange={(brandName) => updateBrief({ brandName })}
            />
            <Field
              label="Descripcion"
              value={brief.description}
              placeholder="Que vendes y por que deberian elegirte?"
              onChange={(description) => updateBrief({ description })}
              multiline
            />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/52">Paleta</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {brief.palette.map((color, index) => (
                  <label key={`${color}-${index}`} className="flex h-11 items-center gap-2 rounded-[8px] border border-white/10 bg-[#242536]/76 px-2">
                    <span className="size-6 rounded-full border border-white/24" style={{ backgroundColor: color }} />
                    <input
                      type="text"
                      value={color}
                      onChange={(event) => {
                        const nextPalette = [...brief.palette];
                        nextPalette[index] = event.target.value;
                        updateBrief({ palette: nextPalette });
                      }}
                      className="min-w-0 flex-1 bg-transparent text-[10px] font-semibold text-white outline-none"
                    />
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {step === "offer" ? (
          <>
            <SectionTitle title="Oferta y objetivo" />
            <Field
              label="Oferta principal"
              value={brief.offer}
              placeholder="Ej. Menu ejecutivo semanal con delivery"
              onChange={(offer) => updateBrief({ offer })}
              multiline
            />
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/52">Objetivo</span>
              <select
                value={brief.goal}
                onChange={(event) => updateBrief({ goal: event.target.value })}
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-[#242536] px-3 text-[12px] text-white outline-none"
              >
                <option>Ventas/leads</option>
                <option>Awareness marca</option>
                <option>Engagement comunidad</option>
              </select>
            </label>
          </>
        ) : null}

        {step === "audience" ? (
          <>
            <SectionTitle title="Cliente ideal" />
            <Field
              label="Audiencia"
              value={brief.audience}
              placeholder="Ej. Oficinistas que necesitan almorzar rapido y rico"
              onChange={(audience) => updateBrief({ audience })}
              multiline
            />
            <div className="rounded-[8px] border border-[#ffd166]/18 bg-[#ffd166]/8 p-3">
              <p className="text-[11px] font-bold text-[#ffd166]">Valor agregado</p>
              <p className="mt-1 text-[11px] leading-5 text-white/64">
                Con esto la IA no solo crea imagenes: arma angulos, calendario, CTAs y variantes de copy.
              </p>
            </div>
          </>
        ) : null}

        {step === "generate" ? (
          <div className="rounded-[8px] border border-white/10 bg-[linear-gradient(145deg,rgba(72,73,96,.68),rgba(30,31,41,.9))] p-4 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#f8582f]/20 text-[#ffd166]">
              <Sparkles className={cn("size-6", isGenerating ? "animate-spin" : "")} />
            </div>
            <h2 className="mt-4 text-[18px] font-semibold text-white">
              {isGenerating ? "Armando campana..." : "Listo para generar 30 dias"}
            </h2>
            <p className="mx-auto mt-2 max-w-[260px] text-[12px] leading-5 text-white/58">
              El resultado sera una galeria viva: calendario, estados, metricas manuales y memoria comercial.
            </p>
          </div>
        ) : null}
      </section>

      <div className="mt-4 flex gap-2">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={() => setStep(steps[stepIndex - 1]?.id ?? "assets")}
            className="h-12 rounded-full border border-white/12 px-5 text-[12px] font-bold text-white/78"
          >
            Atras
          </button>
        ) : null}
        {step === "generate" ? (
          <button
            type="button"
            onClick={onGenerate}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f8582f,#ffd166)] px-5 text-[12px] font-black text-[#181018] shadow-[0_14px_32px_rgba(248,88,47,.28)]"
          >
            Generar galeria
            <Sparkles className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(nextStep)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f8582f,#ffd166)] px-5 text-[12px] font-black text-[#181018] shadow-[0_14px_32px_rgba(248,88,47,.28)]"
          >
            Continuar
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </>
  );
}

function PostCard({
  post,
  selectedTone,
  onSelectTone,
  onUpdateStatus,
  onUpdateMetrics,
}: Readonly<{
  post: CampaignPost;
  selectedTone: string;
  onSelectTone: (tone: string) => void;
  onUpdateStatus: (status: PostStatus) => void;
  onUpdateMetrics: (metrics: PostMetrics) => void;
}>) {
  const selectedCopy = post.variants.find((variant) => variant.tone === selectedTone)?.copy ?? post.copy;
  const postScore = scorePost(post);

  return (
    <article className="overflow-hidden rounded-[8px] border border-white/10 bg-[linear-gradient(145deg,rgba(65,66,87,.82),rgba(34,35,48,.95))] p-3">
      <div className="flex gap-3">
        <div className="relative grid aspect-square w-[82px] shrink-0 place-items-center overflow-hidden rounded-[8px] bg-[#202031]">
          <div className="absolute inset-0 opacity-85" style={{ background: `linear-gradient(145deg,${post.color},#151522)` }} />
          <Camera className="relative size-7 text-white/80" />
          <span className="absolute bottom-2 left-2 rounded bg-black/36 px-1.5 py-1 text-[8px] font-bold text-white">D{post.day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-[#ffd166]/14 px-2 py-1 text-[8px] font-bold text-[#ffd166]">{post.format}</span>
            <span className="truncate rounded-full bg-white/8 px-2 py-1 text-[8px] font-bold text-white/64">{post.pillar}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-[12px] font-bold leading-4 text-white">{post.title}</h3>
          <p className="mt-1 text-[10px] leading-4 text-white/58">{selectedCopy}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {post.variants.map((variant) => (
          <button
            key={variant.tone}
            type="button"
            onClick={() => onSelectTone(variant.tone)}
            className={cn(
              "h-8 shrink-0 rounded-full px-3 text-[10px] font-bold",
              selectedTone === variant.tone ? "bg-[#f8582f] text-white" : "bg-white/8 text-white/62"
            )}
          >
            {variant.tone}
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <label className="min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/42">Estado</span>
          <select
            value={post.status}
            onChange={(event) => onUpdateStatus(event.target.value as PostStatus)}
            className="mt-1 h-9 w-full rounded-[7px] border border-white/10 bg-[#242536] px-2 text-[10px] font-bold text-white outline-none"
          >
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <div className="rounded-[7px] bg-black/22 px-3 py-2 text-right">
          <p className="text-[8px] text-white/42">Score</p>
          <p className="text-[13px] font-bold text-[#ffd166]">{postScore}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {[
          ["likes", "Likes"],
          ["comments", "Com"],
          ["saves", "Save"],
          ["leads", "Leads"],
          ["sales", "Ventas"],
        ].map(([key, label]) => (
          <label key={key} className="min-w-0 rounded-[7px] bg-black/18 p-1.5">
            <span className="block truncate text-[8px] text-white/42">{label}</span>
            <input
              type="number"
              min={0}
              value={post.metrics[key as keyof PostMetrics]}
              onChange={(event) =>
                onUpdateMetrics({
                  ...post.metrics,
                  [key]: Math.max(0, Number(event.target.value) || 0),
                })
              }
              className="mt-1 h-7 w-full min-w-0 rounded bg-white/8 px-1 text-center text-[10px] font-bold text-white outline-none"
            />
          </label>
        ))}
      </div>
    </article>
  );
}

function GalleryView({
  posts,
  marketingScore,
  selectedTones,
  setSelectedTones,
  updatePost,
}: Readonly<{
  posts: CampaignPost[];
  marketingScore: number;
  selectedTones: Record<number, string>;
  setSelectedTones: (value: Record<number, string>) => void;
  updatePost: (day: number, patch: Partial<CampaignPost>) => void;
}>) {
  return (
    <>
      <header className="mt-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd166]">Galeria estrategica</p>
        <h1 className="mt-1 text-[24px] font-semibold leading-[1.05] text-white">Calendario vivo de contenido</h1>
        <p className="mt-2 text-[12px] leading-5 text-white/58">Marca estados, registra metricas y convierte resultados en memoria comercial.</p>
      </header>
      <MarketingScoreCard score={marketingScore} posts={posts} />
      <WeeklyReview posts={posts} />
      <div className="mt-4 space-y-3">
        {posts.map((post) => (
          <PostCard
            key={post.day}
            post={post}
            selectedTone={selectedTones[post.day] ?? "Directo"}
            onSelectTone={(tone) => setSelectedTones({ ...selectedTones, [post.day]: tone })}
            onUpdateStatus={(status) => updatePost(post.day, { status })}
            onUpdateMetrics={(metrics) => updatePost(post.day, { metrics })}
          />
        ))}
      </div>
    </>
  );
}

function CalendarView({ posts }: Readonly<{ posts: CampaignPost[] }>) {
  const weeks = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => ({
        week: index + 1,
        posts: posts.slice(index * 6, index * 6 + 6),
      })),
    [posts]
  );

  return (
    <>
      <header className="mt-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd166]">Calendario</p>
        <h1 className="mt-1 text-[24px] font-semibold leading-[1.05] text-white">Plan vivo de publicacion</h1>
      </header>
      <WeeklyReview posts={posts} />
      <div className="mt-4 space-y-3">
        {weeks.map((week) => (
          <section key={week.week} className="rounded-[8px] border border-white/10 bg-[#242536]/72 p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-bold text-white">Semana {week.week}</h2>
              <span className="text-[10px] text-white/50">{week.posts.length} piezas</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {week.posts.map((post) => (
                <div key={post.day} className="rounded-[7px] bg-black/22 p-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[9px] font-bold text-[#ffd166]">Dia {post.day}</p>
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        post.status === "Pendiente"
                          ? "bg-white/24"
                          : post.status === "Rehacer"
                            ? "bg-[#ff5a4f]"
                            : "bg-[#ffd166]"
                      )}
                    />
                  </div>
                  <p className="mt-1 truncate text-[10px] font-semibold text-white">{post.pillar}</p>
                  <p className="mt-0.5 truncate text-[9px] text-white/48">{post.status}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function BrandView({
  brief,
  posts,
  marketingScore,
}: Readonly<{
  brief: BrandBrief;
  posts: CampaignPost[];
  marketingScore: number;
}>) {
  const memory = getCommercialMemory(posts);
  const details = [
    ["Marca", brief.brandName || "Pendiente"],
    ["Descripcion", brief.description || "Pendiente"],
    ["Oferta", brief.offer || "Pendiente"],
    ["Cliente ideal", brief.audience || "Pendiente"],
    ["Objetivo", brief.goal],
  ];

  return (
    <>
      <header className="mt-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd166]">Memoria comercial</p>
        <h1 className="mt-1 text-[24px] font-semibold leading-[1.05] text-white">Lo que tu marca aprende</h1>
      </header>
      <MarketingScoreCard score={marketingScore} posts={posts} />
      <section className="mt-4 rounded-[8px] border border-[#ffd166]/18 bg-[#ffd166]/8 p-3">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-black/24 text-[#ffd166]">
            <Brain className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[13px] font-bold text-white">Aprendizajes activos</h2>
            <p className="mt-1 text-[11px] leading-5 text-white/64">
              Mejor formato: {memory.topFormat}. Mejor pilar: {memory.topPillar}. Tono recomendado: {memory.topTone}.
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            ["Reutilizar", `${memory.reusable.length} piezas`],
            ["Rehacer", `${memory.needsWork.length} piezas`],
            ["Pendiente", `${memory.pending.length} piezas`],
            ["Siguiente", memory.nextAction],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[7px] bg-black/18 p-2">
              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#ffd166]">{label}</p>
              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/70">{value}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-4 flex gap-3">
        <AssetPreview title="Producto" image={brief.productImage} />
        <AssetPreview title="Logo" image={brief.logoImage} />
      </div>
      <section className="mt-4 rounded-[8px] border border-white/10 bg-[#242536]/72 p-3">
        <h2 className="text-[12px] font-bold text-white">Paleta</h2>
        <div className="mt-3 flex gap-2">
          {brief.palette.map((color) => (
            <span key={color} className="h-10 flex-1 rounded-[7px] border border-white/14" style={{ backgroundColor: color }} />
          ))}
        </div>
      </section>
      <div className="mt-3 space-y-2">
        {details.map(([label, value]) => (
          <div key={label} className="rounded-[8px] border border-white/8 bg-[#242536]/58 p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/42">{label}</p>
            <p className="mt-1 text-[12px] leading-5 text-white/78">{value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function AssetPreview({ title, image }: Readonly<{ title: string; image: string }>) {
  return (
    <div className="relative flex min-h-[112px] flex-1 flex-col justify-end overflow-hidden rounded-[8px] border border-white/10 bg-[#242536]/72 p-3">
      {image ? <span className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${image})` }} /> : null}
      <span className="relative text-[11px] font-bold text-white">{title}</span>
    </div>
  );
}

function SettingsView({ onLogout }: Readonly<{ onLogout?: () => void }>) {
  return (
    <div className="grid min-h-[58svh] place-items-center text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#f8582f]/18 text-[#ffd166]">
          <Settings className="size-6" />
        </div>
        <h1 className="mt-4 text-lg font-bold text-white">Ajustes</h1>
        <p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-5 text-white/58">
          Gestiona tu sesion. Proximamente: recordatorios de revision semanal y preferencias de aprendizaje.
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="mx-auto mt-6 flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-[linear-gradient(135deg,#b695ff,#7359c7)] px-5 text-[13px] font-bold text-white shadow-[0_14px_32px_rgba(126,95,218,.3)] transition hover:brightness-110"
        >
          <LogOut className="size-4" />
          Cerrar sesion
        </button>
      </div>
    </div>
  );
}

export function MobileDashboard({ onLogout }: Readonly<{ onLogout?: () => void }>) {
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [briefStep, setBriefStep] = useState<BriefStep>("assets");
  const [brief, setBrief] = useState<BrandBrief>(initialBrief);
  const [posts, setPosts] = useState<CampaignPost[]>(() => buildCampaignPosts(initialBrief));
  const [selectedTones, setSelectedTones] = useState<Record<number, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const marketingScore = getMarketingScore(posts, brief);

  function updateBrief(patch: Partial<BrandBrief>) {
    setBrief((current) => ({ ...current, ...patch }));
  }

  function generateCampaign() {
    setIsGenerating(true);
    window.setTimeout(() => {
      setPosts(buildCampaignPosts(brief));
      setSelectedTones({});
      setIsGenerating(false);
      setActiveTab("gallery");
    }, 720);
  }

  function updatePost(day: number, patch: Partial<CampaignPost>) {
    setPosts((current) => current.map((post) => (post.day === day ? { ...post, ...patch } : post)));
  }

  return (
    <main className="h-[100svh] w-full overflow-hidden bg-[#10071d] text-white md:h-dvh">
      <div className="relative mx-auto grid h-[100svh] w-full max-w-full grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-[linear-gradient(180deg,#1b1230_0%,#151522_42%,#0c0d13_100%)] px-[clamp(16px,5vw,22px)] pb-[max(14px,env(safe-area-inset-bottom))] pt-3 md:h-dvh md:max-w-[430px]">
        <div className="absolute left-[-130px] top-[-90px] size-72 rounded-full bg-[#7b4dff]/32 blur-3xl" />
        <div className="absolute right-[-110px] top-28 size-64 rounded-full bg-[#f8582f]/18 blur-3xl" />
        <div className="absolute bottom-[-140px] left-12 size-72 rounded-full bg-[#ffd166]/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.08),transparent_34%),linear-gradient(180deg,transparent_0%,rgba(0,0,0,.28)_100%)]" />

        <div className="relative z-10 min-h-0 overflow-y-auto overflow-x-hidden pb-4 pt-2 [scrollbar-width:none]">
          {activeTab === "create" ? (
            <CreateView
              brief={brief}
              step={briefStep}
              posts={posts}
              marketingScore={marketingScore}
              isGenerating={isGenerating}
              updateBrief={updateBrief}
              setStep={setBriefStep}
              onGenerate={generateCampaign}
            />
          ) : null}
          {activeTab === "gallery" ? (
            <GalleryView
              posts={posts}
              marketingScore={marketingScore}
              selectedTones={selectedTones}
              setSelectedTones={setSelectedTones}
              updatePost={updatePost}
            />
          ) : null}
          {activeTab === "calendar" ? <CalendarView posts={posts} /> : null}
          {activeTab === "brand" ? <BrandView brief={brief} posts={posts} marketingScore={marketingScore} /> : null}
          {activeTab === "settings" ? <SettingsView onLogout={onLogout} /> : null}
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
                    ? "flex-col gap-0.5 bg-[linear-gradient(135deg,#f8582f,#ffd166)] px-2 text-center text-[#181018] shadow-[0_10px_24px_rgba(248,88,47,.3)]"
                    : "px-1"
                )}
                aria-label={item.label}
              >
                <Icon className="size-[18px]" />
                {active ? <span className="max-w-full truncate text-[9px] font-black leading-none">{item.label}</span> : null}
              </button>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
