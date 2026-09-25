import React, { useEffect, useMemo, useState } from "react";

type TrackId = "main" | "dsa" | "core" | "ai";

type Topic = {
  id: string;
  title: string;
  description: string;
  outcome?: string;
};

type Phase = {
  id: string;
  number: number;
  title: string;
  objective: string;
  topics: Topic[];
};

type Track = {
  id: TrackId;
  title: string;
  subtitle: string;
  phases: Phase[];
};

const STORAGE_KEY = "se-roadmap-2026-2028-progress-v1";

const phase = (
  number: number,
  title: string,
  objective: string,
  topics: string[],
  descriptions: string[] = []
): Phase => ({
  id: `phase-${number}`,
  number,
  title,
  objective,
  topics: topics.map((title, i) => ({
    id: `p${number}-t${i + 1}`,
    title,
    description: descriptions[i] || "Study this topic, practice it, and make sure you can explain it without relying on copied code.",
  })),
});

const MAIN_PHASES: Phase[] = [
  phase(0, "Foundations", "Build the engineering/runtime foundation before application-level work.", [
    "Linux filesystem, shell, permissions & environment variables",
    "Git: commits, branches, merges, conflicts & pull requests",
    "HTTP request/response lifecycle",
    "DNS, TCP/IP, ports, sockets & TLS",
    "Processes, threads, memory & OS basics",
    "Node.js runtime, event loop & async I/O",
    "Buffers, streams, modules & npm",
    "Deliverable: small Node HTTP server with logging, parsing & error handling",
    "Exit check: explain a browser HTTP request all the way to a local server",
  ]),
  phase(1, "JavaScript + TypeScript", "Become strong enough in JS/TS to reason about real application code.", [
    "JavaScript types, scope, functions, objects & arrays",
    "Closures, prototypes & execution context",
    "Promises, async/await & error propagation",
    "Event loop & asynchronous execution",
    "ES modules, CommonJS & package management",
    "TypeScript types, interfaces, unions & narrowing",
    "Generics & utility types",
    "Strict mode & safe handling of external data",
    "Debugging & refactoring",
    "Deliverable: typed utility package or small app with errors & tests",
    "Exit check: explain an async program, execution flow & error propagation",
  ]),
  phase(2, "Frontend", "Build accessible, responsive React/Next.js interfaces and understand browser behavior.", [
    "Semantic HTML & accessibility",
    "CSS fundamentals & responsive design",
    "DOM & browser APIs",
    "React components, props & state",
    "Hooks & component composition",
    "Forms & validation",
    "Loading, error & empty states",
    "Context & state management",
    "Next.js App Router",
    "Server Components vs Client Components",
    "Data fetching, caching & revalidation",
    "Frontend testing & performance",
    "React DevTools & debugging",
    "Deliverable: responsive multi-page app with forms, validation & API integration",
    "Exit check: implement a design, explain component structure & debug a failed API request",
  ]),
  phase(3, "Backend APIs + MongoDB", "Build maintainable backend services and understand the full request-to-database path.", [
    "Node server architecture",
    "Express routing & middleware",
    "REST API design",
    "Request validation & error handling",
    "Configuration & environment variables",
    "MongoDB CRUD",
    "Mongoose models & schemas",
    "Data modeling & relationships",
    "Authentication & authorization",
    "Password hashing",
    "Cookies & tokens",
    "Logging & API documentation",
    "Basic API security",
    "Frontend-backend integration",
    "Deliverable: backend with auth, protected resources & frontend integration",
    "Exit check: trace route → validation → business logic → DB → response",
  ]),
  phase(4, "SQL + PostgreSQL", "Learn relational data modeling and integrity deeply enough to prevent invalid states.", [
    "Relational tables & data types",
    "Primary keys, foreign keys & constraints",
    "SELECT, filtering, joins & aggregations",
    "Normalization & relational data modeling",
    "Transactions & ACID",
    "Indexes & query plans",
    "Concurrency & locking",
    "Database migrations",
    "Connection pooling",
    "ORM/query builder + raw SQL",
    "Prisma or Drizzle",
    "Docker Compose for PostgreSQL",
    "Deliverable: relational booking/inventory system with constraints & transaction-safe logic",
    "Exit check: explain invalid-state prevention & investigate a slow query",
  ]),
  phase(5, "Testing + Security + Deployment", "Make software repeatable, testable, secure and deployable.", [
    "Unit testing",
    "Integration testing",
    "API & database testing",
    "Authentication tests",
    "Edge cases & concurrent operations",
    "Secure configuration & secrets",
    "Docker & Docker Compose",
    "GitHub Actions / CI",
    "Deployment fundamentals",
    "Logs & troubleshooting",
    "OpenAPI / API documentation",
    "Basic observability",
    "Deliverable: tested, documented, deployed app with repeatable build/test",
    "Exit check: demonstrate a failing test, fix it, and show corrected behavior",
    "Internship milestone: start applying when you can demonstrate a working app and clearly explain your contribution",
  ]),
  phase(6, "Full-Stack Product", "Turn the previous skills into a complete, publicly demonstrable product.", [
    "Full-stack API contracts",
    "Authentication across the stack",
    "Role-based UX",
    "Forms + client/server validation",
    "Pagination, filtering & search",
    "Loading, error & optimistic UI",
    "File uploads & external services",
    "Database integrity",
    "Testing critical user journeys",
    "Deployment, documentation & maintenance",
    "Deliverable: full-stack product solving a real problem",
    "Exit check: explain architecture, database, security & trade-offs",
  ]),
  phase(7, "Production Backend", "Learn the backend patterns needed when traffic, work and failure become real concerns.", [
    "Redis fundamentals",
    "Cache-aside pattern",
    "Cache invalidation",
    "Rate limiting",
    "Background jobs",
    "Queues, retries & idempotency",
    "Connection/query optimization",
    "Structured logs & metrics",
    "Tracing",
    "Failure & recovery",
    "BullMQ",
    "OpenTelemetry overview",
    "Docker/cloud deployment",
    "Deliverable: add caching/background processing and measure the result",
    "Exit check: explain failure modes, cost & trade-offs",
  ]),
  phase(8, "Cloud + Operations", "Deploy and operate software on real infrastructure.", [
    "Linux server administration basics",
    "Docker in production",
    "Docker Compose",
    "Nginx",
    "Cloud networking & access control",
    "Managed databases",
    "Object storage",
    "Environment variables & secrets",
    "CI/CD",
    "Monitoring",
    "Backups & recovery",
    "Infrastructure as Code fundamentals",
    "AWS fundamentals",
    "EC2, S3, IAM & CloudFront",
    "Basic Terraform",
    "Deliverable: deploy and operate an app with deployment/recovery documentation",
    "Exit check: troubleshoot a failed deployment and restore the service",
  ]),
  phase(9, "Distributed Systems", "Understand asynchronous, multi-service systems and their failure modes.", [
    "Distributed systems fundamentals",
    "Service boundaries",
    "Queues & pub/sub",
    "Delivery guarantees",
    "Retries & dead-letter queues",
    "Idempotent consumers",
    "Eventual consistency",
    "Kafka & consumer groups",
    "Redis Streams",
    "CQRS",
    "Distributed failure handling",
    "Deliverable: async/multi-service app with retry and failure documentation",
    "Exit check: explain why a queue is needed and when synchronous design is simpler",
  ]),
  phase(10, "AI-Enabled Engineering", "Build AI features while keeping conventional software engineering in control.", [
    "LLM APIs",
    "Structured outputs",
    "Prompt & context design",
    "Streaming responses",
    "Tool calling & controlled actions",
    "Embeddings",
    "Semantic search",
    "Vector storage / vector databases",
    "RAG",
    "Evaluation & quality testing",
    "Cost, latency & rate limits",
    "Privacy, security & failure handling",
    "Vercel AI SDK / LLM SDKs",
    "PostgreSQL pgvector or a vector database",
    "Deliverable: AI-enabled app with evaluation, authorization, error handling & cost awareness",
    "Exit check: explain AI failure points and where conventional backend controls belong",
  ]),
  phase(11, "System Design", "Design scalable systems by making explicit architectural trade-offs.", [
    "Requirements & constraints",
    "API design & data models",
    "Modular architecture",
    "Bottlenecks & scaling",
    "Caching & load balancing",
    "Database scaling",
    "Queues & asynchronous work",
    "Reliability & fault tolerance",
    "Security",
    "Operational cost",
    "Architecture trade-offs",
    "Design a booking system",
    "Design a notification system",
    "Design a URL shortener",
    "Design file storage",
    "Deliverable: design and document systems as requirements grow",
    "Exit check: justify architecture decisions and changes as the system scales",
  ]),
];

const DSA_PHASES: Phase[] = [
  phase(1, "DSA in TypeScript / JavaScript", "Use one language consistently for interview problem solving.", [
    "Arrays",
    "Strings",
    "Hash Maps & Sets",
    "Two Pointers",
    "Sliding Window",
    "Stacks",
    "Queues",
    "Linked Lists",
    "Binary Search",
    "Sorting",
    "Recursion",
    "Backtracking",
    "Trees",
    "Heaps / Priority Queues",
    "Graphs",
    "Greedy Algorithms",
    "Dynamic Programming",
    "Time & Space Complexity",
    "Timed practice",
    "Mistake notebook / pattern review",
  ]),
];

const CORE_PHASES: Phase[] = [
  phase(1, "Core CS", "Connect computer science fundamentals to the systems you build.", [
    "DBMS & SQL",
    "Operating Systems",
    "Computer Networks",
    "OOP concepts",
    "HTTP / Web fundamentals",
    "Relate CS concepts to your projects",
    "Technical communication: explain architecture",
    "Technical communication: explain database choices",
    "Technical communication: explain debugging decisions",
    "Technical communication: explain testing strategy",
    "Technical communication: explain trade-offs & improvements",
  ]),
];

const AI_PHASES: Phase[] = [
  phase(1, "AI-Assisted Engineering", "Use AI to improve engineering speed without giving up understanding or ownership.", [
    "Understand the requirement before prompting",
    "Ask AI for edge cases and explanations",
    "Generate an implementation plan",
    "Implement focused changes",
    "Ask AI for tests and review ideas",
    "Run tests and inspect behavior yourself",
    "Review the Git diff",
    "Keep only changes you understand",
    "Use AI for unfamiliar code and errors",
    "Use AI for design comparisons and trade-offs",
    "Use AI for edge-case discovery",
    "Use AI for PR/code review",
    "Use AI for large-codebase navigation",
    "Use AI for documentation from verified implementation",
    "Do not blindly generate an entire project",
    "Do not trust unreviewed auth/DB code",
    "Do not treat AI-generated tests as proof",
    "Do not expose secrets or private data",
    "Do not install every new agent/framework",
    "Weekly review: what did AI speed up?",
    "Weekly review: what did I actually understand?",
    "Weekly review: where did AI produce a bad suggestion?",
  ]),
];

const TRACKS: Track[] = [
  { id: "main", title: "Main Roadmap", subtitle: "Software engineering execution path", phases: MAIN_PHASES },
  { id: "dsa", title: "DSA", subtitle: "Interview problem solving", phases: DSA_PHASES },
  { id: "core", title: "Core CS", subtitle: "CS fundamentals + communication", phases: CORE_PHASES },
  { id: "ai", title: "AI Engineering", subtitle: "AI-assisted development workflow", phases: AI_PHASES },
];

type SavedState = Record<string, { completed: boolean; notes: string }>;

function loadState(): SavedState {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function App() {
  const [activeTrack, setActiveTrack] = useState<TrackId>("main");
  const [state, setState] = useState<SavedState>(loadState);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [notesTopic, setNotesTopic] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const track = TRACKS.find((t) => t.id === activeTrack)!;
  const allTopics = track.phases.flatMap((p) => p.topics);
  const completed = allTopics.filter((t) => state[t.id]?.completed).length;
  const total = allTopics.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const firstIncomplete = allTopics.find((t) => !state[t.id]?.completed);

  const visiblePhases = useMemo(() => {
    const q = search.trim().toLowerCase();
    return track.phases
      .map((p) => ({
        ...p,
        topics: p.topics.filter((t) => {
          const matchesSearch =
            !q ||
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            p.title.toLowerCase().includes(q);
          const done = !!state[t.id]?.completed;
          const matchesFilter =
            filter === "all" || (filter === "done" && done) || (filter === "todo" && !done);
          return matchesSearch && matchesFilter;
        }),
      }))
      .filter((p) => p.topics.length);
  }, [track, search, filter, state]);

  const toggle = (id: string) => {
    setState((s) => ({
      ...s,
      [id]: { completed: !s[id]?.completed, notes: s[id]?.notes || "" },
    }));
  };

  const updateNotes = (id: string, notes: string) => {
    setState((s) => ({ ...s, [id]: { completed: !!s[id]?.completed, notes } }));
  };

  const continueLearning = () => {
    if (!firstIncomplete) return;
    setOpenTopic(firstIncomplete.id);
    requestAnimationFrame(() => {
      document.getElementById(firstIncomplete.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const reset = () => {
    setState({});
    setShowReset(false);
  };

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const colors = dark
    ? {
        bg: "#0B0F19", surface: "#111827", elevated: "#172033", border: "#253044",
        text: "#F8FAFC", muted: "#94A3B8", accent: "#6EA8FE", success: "#4ADE80",
        warning: "#FBBF24",
      }
    : {
        bg: "#F5F7FB", surface: "#FFFFFF", elevated: "#EEF3FA", border: "#D9E1EC",
        text: "#101827", muted: "#64748B", accent: "#2563EB", success: "#16A34A",
        warning: "#D97706",
      };

  return (
    <div className="app-shell" style={{ minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        button, input, textarea { font: inherit; }
        button { cursor: pointer; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 20px; border: 3px solid ${colors.bg}; }
        .hoverable:hover { border-color: ${colors.accent} !important; transform: translateY(-1px); }
        .topic:hover { background: ${dark ? "#141D2D" : "#F8FAFC"} !important; }
        .site-header { backdrop-filter: blur(18px); background: ${dark ? "rgba(17,24,39,.88)" : "rgba(255,255,255,.88)"} !important; }
        .workspace { max-width: 1680px !important; width: 100%; }
        .progress-card { min-height: 148px; }
        .track-tabs { scrollbar-width: none; }
        .track-tabs::-webkit-scrollbar { display: none; }
        .phase-card { box-shadow: 0 12px 30px ${dark ? "rgba(0,0,0,.12)" : "rgba(15,23,42,.05)"}; }
        .topic { box-shadow: 0 2px 7px ${dark ? "rgba(0,0,0,.08)" : "rgba(15,23,42,.025)"}; }
        @media (min-width: 851px) { .roadmap { padding-right: 26px; } }
        @media (max-width: 850px) {
          .header-inner { flex-direction: column !important; align-items: stretch !important; }
          .controls { width: 100% !important; }
          .search-wrap, .search-wrap input { width: 100% !important; }
          .controls > button { flex: 1; min-height: 42px; }
          .workspace { padding: 18px 14px 44px !important; }
          .layout { grid-template-columns: 1fr !important; }
          .sidebar { position: static !important; }
          .sidebar { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px !important; }
          .sidebar > div:first-child { grid-column: 1 / -1; }
          .roadmap { padding: 0 !important; }
          .progress-grid { grid-template-columns: 1fr !important; }
          .progress-card { min-height: auto; }
          .topic-row { align-items: flex-start !important; }
          .topic-title { line-height: 1.35; }
          .roadmap-timeline { padding-left: 0 !important; }
          .roadmap-timeline > div:first-child, .roadmap-section > div:first-child { display: none; }
          .roadmap-section { margin-bottom: 22px !important; }
          .phase-card { padding: 14px !important; }
          .section-heading { font-size: 18px !important; }
        }
        @media (max-width: 480px) {
          .header-inner { padding: 16px 14px !important; }
          .header-inner h1 { font-size: 21px !important; }
          .header-inner > div:first-child > div:last-child { font-size: 12px !important; }
          .sidebar { grid-template-columns: 1fr; }
          .sidebar > div:first-child { grid-column: auto; }
          .phase-card > div { align-items: flex-start !important; }
          .phase-card > div > div:last-child { min-width: 42px !important; }
          .topic-row { padding: 12px 10px !important; gap: 9px !important; }
          .topic-row > button:first-child { margin-top: 1px; }
          .topic-row > span { display: none; }
          .topic-detail { padding: 12px 12px 14px 39px !important; }
        }
      `}</style>

      <header className="site-header" style={{ borderBottom: `1px solid ${colors.border}`, background: colors.surface, position: "sticky", top: 0, zIndex: 10 }}>
        <div className="header-inner" style={{ maxWidth: 1500, margin: "auto", padding: "18px 24px", display: "flex", gap: 18, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: colors.accent, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>2026 → 2028</div>
            <h1 style={{ margin: "3px 0 0", fontSize: 24, lineHeight: 1.2 }}>Software Engineering Roadmap</h1>
            <div style={{ color: colors.muted, fontSize: 13, marginTop: 5 }}>Your personal execution checklist • progress stays in this browser</div>
          </div>

          <div className="controls" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div className="search-wrap" style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 11, top: 9, color: colors.muted }}>⌕</span>
              <input
                aria-label="Search roadmap"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics..."
                style={{ width: 220, padding: "9px 12px 9px 30px", borderRadius: 9, border: `1px solid ${colors.border}`, background: colors.elevated, color: colors.text, outline: "none" }}
              />
            </div>
            <button onClick={() => setDark(!dark)} style={btn(colors)}>{dark ? "☼ Light" : "☾ Dark"}</button>
            <button onClick={() => setShowReset(true)} style={{ ...btn(colors), color: colors.warning }}>Reset</button>
          </div>
        </div>
      </header>

      <main className="workspace" style={{ maxWidth: 1500, margin: "auto", padding: "28px 30px 70px" }}>
        <div className="progress-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr .8fr", gap: 12, marginBottom: 20 }}>
          <div className="progress-card" style={card(colors)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20 }}>
              <div>
                <div style={{ color: colors.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em" }}>{track.title}</div>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{percent}% complete</div>
                <div style={{ color: colors.muted, fontSize: 13 }}>{completed} of {total} checklist items completed</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: percent === 100 ? colors.success : colors.accent }}>{percent}%</div>
            </div>
            <div style={{ height: 8, background: colors.border, borderRadius: 10, overflow: "hidden", marginTop: 15 }}>
              <div style={{ width: `${percent}%`, height: "100%", background: percent === 100 ? colors.success : colors.accent, transition: "width .25s ease" }} />
            </div>
          </div>

          <div className="progress-card" style={card(colors)}>
            <div style={{ color: colors.muted, fontSize: 12 }}>NEXT UP</div>
            <div style={{ marginTop: 7, fontWeight: 700, lineHeight: 1.35 }}>{firstIncomplete?.title || "Everything completed 🎉"}</div>
            {firstIncomplete && <button onClick={continueLearning} style={{ ...btn(colors), marginTop: 12, width: "100%" }}>Continue Learning →</button>}
          </div>

          <div className="progress-card" style={card(colors)}>
            <div style={{ color: colors.muted, fontSize: 12 }}>MILESTONE</div>
            <div style={{ marginTop: 7, fontWeight: 700 }}>{milestone(percent)}</div>
            <div style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>Complete topics in sequence; nothing is locked.</div>
          </div>
        </div>

        <div className="track-tabs" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 18 }}>
          {TRACKS.map((t) => (
            <button key={t.id} onClick={() => { setActiveTrack(t.id); setSearch(""); setFilter("all"); setOpenTopic(null); }} style={{ ...tab(colors), background: activeTrack === t.id ? colors.accent : colors.surface, color: activeTrack === t.id ? "#07101F" : colors.text }}>
              {t.title}
            </button>
          ))}
        </div>

        <div className="layout" style={{ display: "grid", gridTemplateColumns: "250px minmax(0, 1fr)", gap: 22, alignItems: "start" }}>
          <aside className="sidebar" style={{ position: "sticky", top: 105, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: colors.muted, fontSize: 12, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", margin: "5px 4px" }}>Phases</div>
            {track.phases.map((p) => {
              const pDone = p.topics.filter((t) => state[t.id]?.completed).length;
              return (
                <button key={p.id} onClick={() => jumpTo(p.id)} className="hoverable" style={{ ...sideButton(colors), textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span><b style={{ color: colors.accent, marginRight: 7 }}>{String(p.number).padStart(2, "0")}</b>{p.title}</span>
                    <span style={{ color: colors.muted, fontSize: 11 }}>{pDone}/{p.topics.length}</span>
                  </div>
                  <div style={{ height: 3, marginTop: 7, background: colors.border, borderRadius: 5 }}>
                    <div style={{ height: "100%", width: `${(pDone / p.topics.length) * 100}%`, background: colors.success }} />
                  </div>
                </button>
              );
            })}
          </aside>

          <section className="roadmap">
            <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
              {(["all", "todo", "done"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{ ...filterButton(colors), background: filter === f ? colors.elevated : "transparent", borderColor: filter === f ? colors.accent : colors.border }}>
                  {f === "all" ? "All" : f === "todo" ? "Not Started" : "Completed"}
                </button>
              ))}
            </div>

            <div className="roadmap-timeline" style={{ position: "relative", paddingLeft: 34 }}>
              <div style={{ position: "absolute", left: 12, top: 10, bottom: 10, width: 2, background: colors.border }} />

              {visiblePhases.map((p) => {
                const done = p.topics.filter((t) => state[t.id]?.completed).length;
                return (
                  <section className="roadmap-section" id={p.id} key={p.id} style={{ position: "relative", marginBottom: 30 }}>
                    <div style={{ position: "absolute", left: -28, top: 18, width: 14, height: 14, borderRadius: "50%", background: done === p.topics.length ? colors.success : colors.accent, boxShadow: `0 0 0 5px ${colors.bg}` }} />
                    <div className="phase-card" style={{ ...card(colors), marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start" }}>
                        <div>
                          <div style={{ color: colors.accent, fontSize: 11, fontWeight: 800, letterSpacing: ".1em" }}>PHASE {String(p.number).padStart(2, "0")}</div>
                          <h2 className="section-heading" style={{ margin: "4px 0 5px", fontSize: 20 }}>{p.title}</h2>
                          <div style={{ color: colors.muted, fontSize: 13, lineHeight: 1.5 }}>{p.objective}</div>
                        </div>
                        <div style={{ minWidth: 58, textAlign: "right", color: done === p.topics.length ? colors.success : colors.muted, fontWeight: 800, fontSize: 13 }}>
                          {done}/{p.topics.length}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 7 }}>
                      {p.topics.map((t) => {
                        const done = !!state[t.id]?.completed;
                        const open = openTopic === t.id;
                        return (
                          <article id={t.id} key={t.id} className="topic" style={{ border: `1px solid ${done ? colors.success + "66" : colors.border}`, background: colors.surface, borderRadius: 10, transition: "all .15s ease" }}>
                            <div className="topic-row" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px" }}>
                              <button
                                aria-label={done ? `Mark ${t.title} incomplete` : `Mark ${t.title} complete`}
                                onClick={() => toggle(t.id)}
                                style={{ width: 20, height: 20, flex: "0 0 20px", borderRadius: 5, border: `1.5px solid ${done ? colors.success : colors.muted}`, background: done ? colors.success : "transparent", color: "#07101F", fontWeight: 900 }}
                              >{done ? "✓" : ""}</button>
                              <button className="topic-title" onClick={() => setOpenTopic(open ? null : t.id)} style={{ flex: 1, border: 0, background: "transparent", color: done ? colors.muted : colors.text, textAlign: "left", textDecoration: done ? "line-through" : "none", fontWeight: 650, padding: 0, cursor: "pointer" }}>
                                {t.title}
                              </button>
                              <button onClick={() => setNotesTopic(notesTopic === t.id ? null : t.id)} title="Notes" style={{ border: 0, background: "transparent", color: state[t.id]?.notes ? colors.accent : colors.muted, fontSize: 16 }}>✎</button>
                              <span style={{ color: colors.muted, fontSize: 16 }}>{open ? "⌃" : "⌄"}</span>
                            </div>

                            {open && (
                              <div className="topic-detail" style={{ borderTop: `1px solid ${colors.border}`, padding: "12px 14px 14px 44px" }}>
                                <div style={{ color: colors.muted, fontSize: 13, lineHeight: 1.55 }}>{t.description}</div>
                                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                                  <button onClick={() => toggle(t.id)} style={{ ...btn(colors), background: done ? "transparent" : colors.success, color: done ? colors.text : "#06120A", borderColor: done ? colors.border : colors.success }}>
                                    {done ? "Mark Incomplete" : "Mark Complete"}
                                  </button>
                                  <button onClick={() => setNotesTopic(notesTopic === t.id ? null : t.id)} style={btn(colors)}>Add Notes</button>
                                </div>
                                {notesTopic === t.id && (
                                  <textarea
                                    value={state[t.id]?.notes || ""}
                                    onChange={(e) => updateNotes(t.id, e.target.value)}
                                    placeholder="Write your study notes, links, mistakes, or questions..."
                                    rows={4}
                                    style={{ marginTop: 12, width: "100%", resize: "vertical", borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.elevated, color: colors.text, padding: 10, outline: "none" }}
                                  />
                                )}
                              </div>
                            )}

                            {!open && notesTopic === t.id && (
                              <div style={{ borderTop: `1px solid ${colors.border}`, padding: "10px 14px 12px 44px" }}>
                                <textarea
                                  autoFocus
                                  value={state[t.id]?.notes || ""}
                                  onChange={(e) => updateNotes(t.id, e.target.value)}
                                  placeholder="Write your study notes, links, mistakes, or questions..."
                                  rows={3}
                                  style={{ width: "100%", resize: "vertical", borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.elevated, color: colors.text, padding: 10, outline: "none" }}
                                />
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            {!visiblePhases.length && (
              <div style={{ ...card(colors), textAlign: "center", padding: 40, color: colors.muted }}>
                No topics match your search/filter.
              </div>
            )}

            <section style={{ ...card(colors), marginTop: 28 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Engineering Feedback Loop</h2>
              <p style={{ color: colors.muted, fontSize: 13, lineHeight: 1.55 }}>Use this loop for every meaningful feature. AI can accelerate the loop; it does not replace understanding, testing, inspection, or review.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {["Understand requirement", "Break into small tasks", "Implement small change", "Run & inspect", "Tests / typecheck / lint", "Review diff", "Focused commit", "Document"].map((x, i) => (
                  <span key={x} style={{ padding: "8px 10px", borderRadius: 8, background: colors.elevated, border: `1px solid ${colors.border}`, fontSize: 12 }}>
                    {i + 1}. {x}
                  </span>
                ))}
              </div>
            </section>
          </section>
        </div>
      </main>

      {showReset && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "grid", placeItems: "center", zIndex: 50, padding: 20 }}>
          <div style={{ ...card(colors), width: "min(420px, 100%)" }}>
            <h2 style={{ marginTop: 0 }}>Reset all progress?</h2>
            <p style={{ color: colors.muted, lineHeight: 1.5 }}>This removes every completed checkbox and note stored for this roadmap in this browser.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setShowReset(false)} style={btn(colors)}>Cancel</button>
              <button onClick={reset} style={{ ...btn(colors), background: colors.warning, color: "#211600", borderColor: colors.warning }}>Reset Everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function card(c: Record<string, string>): React.CSSProperties {
  return { border: `1px solid ${c.border}`, background: c.surface, borderRadius: 12, padding: 16 };
}
function btn(c: Record<string, string>): React.CSSProperties {
  return { border: `1px solid ${c.border}`, background: c.elevated, color: c.text, borderRadius: 8, padding: "8px 11px", fontSize: 12, fontWeight: 700 };
}
function tab(c: Record<string, string>): React.CSSProperties {
  return { border: `1px solid ${c.border}`, borderRadius: 9, padding: "9px 13px", fontWeight: 800, whiteSpace: "nowrap" };
}
function sideButton(c: Record<string, string>): React.CSSProperties {
  return { border: `1px solid ${c.border}`, background: c.surface, color: c.text, borderRadius: 9, padding: "10px 11px", fontSize: 12, width: "100%" };
}
function filterButton(c: Record<string, string>): React.CSSProperties {
  return { border: `1px solid ${c.border}`, background: "transparent", color: c.text, borderRadius: 8, padding: "7px 10px", fontSize: 12, fontWeight: 700 };
}
function milestone(percent: number) {
  if (percent === 100) return "Roadmap complete";
  if (percent >= 80) return "System design + advanced engineering";
  if (percent >= 60) return "Production + cloud";
  if (percent >= 40) return "Full-stack product";
  if (percent >= 20) return "Frontend + backend foundations";
  return "Start with foundations";
}

export default App;
