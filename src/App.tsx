import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, AudioLines, Bell,
  CalendarClock, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Command, Headphones, LayoutDashboard, ListChecks, Menu, MessageSquare,
  MoreHorizontal, Phone, Plus, Search, Settings2, ShieldCheck, Sparkles, Users,
  X, Zap, SlidersHorizontal, Sun, Moon, Monitor, CircleDot, UserRound, PanelLeft,
  CheckCheck, FileText, HeartPulse, CircleAlert, LogOut
} from "lucide-react";

type Theme = "midnight" | "editorial" | "signal";
type Layout = "classic" | "command" | "compact";
type NavKey = "My Shift" | "Call Cockpit" | "Customers" | "Follow-ups" | "Team Pulse";

type Customer = {
  id: string; name: string; initials: string; color: string; issue: string;
  channel: string; wait: string; priority: "High" | "Medium" | "Low";
  sentiment: "Frustrated" | "Neutral" | "Positive"; status: "Waiting" | "In progress" | "Follow-up";
  lastContact: string; phone: string;
};

const seedCustomers: Customer[] = [
  { id: "CF-2048", name: "Maya Sharma", initials: "MS", color: "rose", issue: "Delivery arrived damaged", channel: "Phone", wait: "04:32", priority: "High", sentiment: "Frustrated", status: "Waiting", lastContact: "Today, 10:42 AM", phone: "+91 98765 10482" },
  { id: "CF-2047", name: "Arjun Mehta", initials: "AM", color: "blue", issue: "Refund status update", channel: "Chat", wait: "02:18", priority: "Medium", sentiment: "Neutral", status: "Waiting", lastContact: "Today, 10:18 AM", phone: "+91 98450 22316" },
  { id: "CF-2046", name: "Nisha Rao", initials: "NR", color: "violet", issue: "Unable to access account", channel: "Phone", wait: "01:06", priority: "Low", sentiment: "Neutral", status: "Waiting", lastContact: "Yesterday, 4:15 PM", phone: "+91 99860 77124" },
  { id: "CF-2045", name: "Kabir Das", initials: "KD", color: "amber", issue: "Subscription cancellation", channel: "Email", wait: "—", priority: "Medium", sentiment: "Frustrated", status: "Follow-up", lastContact: "Yesterday, 2:30 PM", phone: "+91 99001 88453" },
  { id: "CF-2044", name: "Tara Iyer", initials: "TI", color: "teal", issue: "Product setup guidance", channel: "Chat", wait: "—", priority: "Low", sentiment: "Positive", status: "Follow-up", lastContact: "Yesterday, 11:05 AM", phone: "+91 98451 00972" },
];

const navItems: { label: NavKey; icon: typeof LayoutDashboard; meta?: string }[] = [
  { label: "My Shift", icon: LayoutDashboard },
  { label: "Call Cockpit", icon: Headphones, meta: "3" },
  { label: "Customers", icon: Users },
  { label: "Follow-ups", icon: ListChecks, meta: "2" },
  { label: "Team Pulse", icon: Activity },
];

const themeNames: Record<Theme, string> = {
  midnight: "Midnight Lime", editorial: "Editorial Warmth", signal: "Signal Blue"
};
const layoutNames: Record<Layout, string> = {
  classic: "Classic sidebar", command: "Command centre", compact: "Keyboard-first"
};

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("cf-theme") as Theme) || "midnight");
  const [layout, setLayout] = useState<Layout>(() => (localStorage.getItem("cf-layout") as Layout) || "command");
  const [active, setActive] = useState<NavKey>("My Shift");
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try { return JSON.parse(localStorage.getItem("cf-customers") || "null") || seedCustomers; }
    catch { return seedCustomers; }
  });
  const [availability, setAvailability] = useState<"Available" | "Busy" | "On break">("Available");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All cases");
  const [selected, setSelected] = useState<Customer>(customers[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false); // New state for Accounts modal
  const [showNewTask, setShowNewTask] = useState(false);
  const [toast, setToast] = useState("");
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, title: "Follow up with Maya Sharma", detail: "Damaged delivery · High priority", due: "Due in 12 min", done: false },
    { id: 2, title: "Confirm refund with Arjun Mehta", detail: "Refund status · Medium priority", due: "Due in 38 min", done: false },
  ]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => { localStorage.setItem("cf-theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("cf-layout", layout); }, [layout]);
  useEffect(() => { localStorage.setItem("cf-customers", JSON.stringify(customers)); }, [customers]);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const filteredCustomers = useMemo(() => customers.filter((c) => {
    const q = search.toLowerCase();
    const matches = [c.name, c.id, c.issue, c.channel].some((v) => v.toLowerCase().includes(q));
    const status = filter === "All cases" || c.status === filter;
    return matches && status;
  }), [customers, search, filter]);

  const updateCustomer = (id: string, patch: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    setSelected(prev => prev.id === id ? { ...prev, ...patch } : prev);
  };

  const startCall = (customer: Customer) => {
    setSelected(customer);
    setActive("Call Cockpit");
    setAvailability("Busy");
    setToast(`Call workspace opened for ${customer.name}`);
  };

  const resolveCase = () => {
    updateCustomer(selected.id, { status: "Follow-up" });
    setTasks(prev => [{ id: Date.now(), title: `Send resolution update to ${selected.name}`, detail: selected.issue, due: "Created just now", done: false }, ...prev]);
    setAvailability("Available");
    setToast(`Case ${selected.id} moved to follow-up`);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [{ id: Date.now(), title: newTask.trim(), detail: "Added from your shift workspace", due: "Due today", done: false }, ...prev]);
    setNewTask("");
    setShowNewTask(false);
    setToast("Follow-up added to your shift");
  };

  return (
    <div className={`app theme-${theme} layout-${layout}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><AudioLines size={23} strokeWidth={2.5} /></div>
          <div className="brand-copy"><strong>callflow</strong><span>CONTACT CENTRE</span></div>
          <button className="icon-button sidebar-collapse" aria-label="Collapse sidebar" onClick={() => setToast("Sidebar control is ready for the next layout iteration")}><PanelLeft size={17}/></button>
        </div>

        <button className="workspace-switch" onClick={() => setShowAccounts(true)}>
          <div className="workspace-avatar">N</div><div className="workspace-text"><b>Northstar Support</b><span>Customer operations</span></div><ChevronDown size={15}/>
        </button>

        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav">
          {navItems.map(({ label, icon: Icon, meta }) => (
            <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => setActive(label)}>
              <Icon size={18}/><span>{label}</span>{meta && <span className="nav-meta">{label === "Call Cockpit" ? customers.filter(c => c.status === "Waiting").length : tasks.filter(t => !t.done).length}</span>}
              {active === label && <span className="nav-active-bar"/>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="shift-card">
            <div className="shift-card-top"><span className="live-dot"/><span>YOUR SHIFT</span><span className="shift-time">04:18 left</span></div>
            <div className="shift-progress"><span/></div>
            <div className="shift-foot"><span>Started 9:00 AM</span><span>Ends 6:00 PM</span></div>
          </div>
          <button className="nav-item utility" onClick={() => setShowSettings(true)}><Settings2 size={18}/><span>Preferences</span></button>
          <button className="nav-item utility" onClick={() => setShowAccounts(true)}><CircleHelp size={18}/><span>Help & support</span></button>
          <div className="profile-row" onClick={() => setShowAccounts(true)} style={{ cursor: "pointer" }}>
            <div className="profile-avatar">DK</div><div className="profile-info"><b>Dinesh Kumar</b><span>Support specialist</span></div><button className="icon-button" aria-label="Profile menu" onClick={(e) => { e.stopPropagation(); setShowAccounts(true); }}><MoreHorizontal size={18}/></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><b>{active}</b></div>
          <div className="top-actions">
            <div className="status-wrap">
              <span className={`status-dot ${availability.toLowerCase().replace(" ", "-")}`}/>
              <select aria-label="Agent availability" value={availability} onChange={e => { setAvailability(e.target.value as typeof availability); setToast(`Availability set to ${e.target.value}`); }}>
                <option>Available</option><option>Busy</option><option>On break</option>
              </select><ChevronDown size={13}/>
            </div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setToast("You're all caught up — no new notifications")}><Bell size={18}/><i/></button>
            <button className="avatar-small" onClick={() => setShowAccounts(true)} aria-label="Open accounts and credentials">DK</button>
          </div>
        </header>

        <div className="page-content">
          {active === "My Shift" && <ShiftPage
            customers={customers} tasks={tasks} setTasks={setTasks} onCall={startCall}
            onNavigate={setActive} onAddTask={() => setShowNewTask(true)}
            onSettings={() => setShowSettings(true)} availability={availability}
            setAvailability={setAvailability} toast={setToast}
          />}
          {active === "Call Cockpit" && <CockpitPage selected={selected} customers={customers} notes={notes} setNotes={setNotes} onResolve={resolveCase} onCustomer={setSelected} onCall={startCall} toast={setToast}/>}
          {active === "Customers" && <CustomersPage customers={filteredCustomers} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onSelect={(c: Customer) => { setSelected(c); setActive("Call Cockpit"); }} onCall={startCall}/>}
          {active === "Follow-ups" && <FollowUpsPage tasks={tasks} setTasks={setTasks} onAdd={() => setShowNewTask(true)} onCustomer={(name: string) => { const c = customers.find(x => x.name === name); if (c) { setSelected(c); setActive("Call Cockpit"); } }}/>}
          {active === "Team Pulse" && <TeamPage customers={customers} tasks={tasks}/>}
        </div>
      </main>

      {showSettings && <SettingsModal theme={theme} setTheme={setTheme} layout={layout} setLayout={setLayout} onClose={() => setShowSettings(false)} toast={setToast}/>}
      {showAccounts && <AccountsModal onClose={() => setShowAccounts(false)} toast={setToast} onOpenSettings={() => { setShowAccounts(false); setShowSettings(true); }} />}
      {showNewTask && <div className="modal-backdrop" onClick={() => setShowNewTask(false)}><div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head"><div><span className="eyebrow">SHIFT WORKSPACE</span><h2>Create a follow-up</h2></div><button className="icon-button" onClick={() => setShowNewTask(false)}><X size={19}/></button></div>
        <p className="muted">Add a small, actionable reminder to your queue.</p>
        <label className="field-label" htmlFor="taskTitle">Task title</label><input id="taskTitle" autoFocus value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="e.g. Call customer after delivery update"/>
        <div className="modal-actions"><button className="button secondary" onClick={() => setShowNewTask(false)}>Cancel</button><button className="button primary" onClick={addTask}><Plus size={16}/> Add follow-up</button></div>
      </div></div>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: React.ReactNode; description: string; action?: React.ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function ShiftPage({ customers, tasks, setTasks, onCall, onNavigate, onAddTask, onSettings, availability, setAvailability, toast }: any) {
  const resolved = customers.filter((c: Customer) => c.status === "Follow-up").length + 19;
  const open = customers.filter((c: Customer) => c.status === "Waiting").length;
  return <div className="page-stack">
    <PageHeader eyebrow="SATURDAY, OCTOBER 10 · YOUR WORKSPACE" title={<>Make this shift <em>count.</em></>} description="A clear view of what needs you, what you've moved forward, and what comes next." action={<button className="button secondary" onClick={onSettings}><SlidersHorizontal size={16}/> Customize view</button>}/>
    <div className="welcome-strip"><div className="welcome-icon"><Sparkles size={19}/></div><div className="welcome-copy"><b>Good evening, Dinesh.</b><span>You've got this. Let's make the next interaction a good one.</span></div><div className="welcome-right"><span className="welcome-live"><span className="live-dot"/> SHIFT IN PROGRESS</span><span className="welcome-divider"/><span className="welcome-clock"><Clock3 size={14}/> 1:42 PM – 6:00 PM</span></div></div>

    <div className="metric-grid">
      <MetricCard label="Resolved today" value={String(resolved)} change="+4" note="ahead of your usual pace" icon={<CheckCheck size={18}/>} tone="lime" trend="up"/>
      <MetricCard label="Open conversations" value={String(open)} change="2 urgent" note="oldest waiting 04:32" icon={<MessageSquare size={18}/>} tone="blue" trend="flat"/>
      <MetricCard label="Avg. resolution" value="6m 24s" change="−12%" note="faster than last week" icon={<Zap size={18}/>} tone="violet" trend="down"/>
      <MetricCard label="Customer sentiment" value="4.8/5" change="+0.3" note="from 18 feedback ratings" icon={<HeartPulse size={18}/>} tone="peach" trend="up"/>
    </div>

    <div className="dashboard-grid">
      <section className="panel action-panel">
        <div className="panel-heading"><div><div className="eyebrow">START HERE</div><h2>Your next best action</h2></div><span className="sparkle-tag"><Sparkles size={13}/> CONTEXT-AWARE</span></div>
        <div className="recommendation">
          <div className="recommendation-top"><span className="priority-pill high"><span/> HIGH PRIORITY</span><span className="case-id">CASE CF-2048</span></div>
          <div className="recommendation-body"><div className="customer-avatar rose">MS</div><div className="recommendation-info"><h3>Maya Sharma</h3><p>Delivery arrived damaged</p><div className="context-chips"><span><Clock3 size={12}/> Open 2h 14m</span><span><MessageSquare size={12}/> 2 prior contacts</span></div></div></div>
          <div className="recommendation-reason"><Sparkles size={15}/><p><b>Why this, now?</b> Maya has contacted support twice and the case is still unresolved. A proactive update could prevent another inbound call.</p></div>
          <div className="recommendation-actions"><button className="button primary" onClick={() => onCall(customers.find((c: Customer) => c.name === "Maya Sharma") || customers[0])}><Phone size={15}/> Open conversation <ArrowUpRight size={15}/></button><button className="button subtle" onClick={() => toast("Case snoozed for 30 minutes")}>Remind me later</button></div>
        </div>
        <div className="panel-footer-note"><ShieldCheck size={15}/><span>Recommendations use sample case history in this demo.</span></div>
      </section>

      <section className="panel queue-panel">
        <div className="panel-heading"><div><div className="eyebrow">NEEDS ATTENTION</div><h2>Live queue <span className="count-badge">{customers.filter((c: Customer) => c.status === "Waiting").length}</span></h2></div><button className="text-button" onClick={() => onNavigate("Customers")}>View all <ArrowRight size={14}/></button></div>
        <div className="queue-list">{customers.filter((c: Customer) => c.status === "Waiting").slice(0, 3).map((c: Customer) => <div className="queue-item" key={c.id}>
          <div className={`customer-avatar ${c.color}`}>{c.initials}</div><div className="queue-person"><b>{c.name}</b><span>{c.issue}</span><div className="queue-meta"><span className={`channel-tag ${c.channel.toLowerCase()}`}>{c.channel}</span><span className={`sentiment ${c.sentiment.toLowerCase()}`}>{c.sentiment}</span></div></div><div className="queue-trailing"><span className={`wait-time ${c.priority === "High" ? "urgent" : ""}`}>{c.wait}</span><button className="round-action" aria-label={`Open ${c.name}`} onClick={() => onCall(c)}><ArrowUpRight size={15}/></button></div>
        </div>)}</div>
        <button className="queue-bottom" onClick={() => onNavigate("Customers")}>Open full customer queue <ArrowRight size={14}/></button>
      </section>

      <section className="panel timeline-panel">
        <div className="panel-heading"><div><div className="eyebrow">YOUR DAY, IN MOTION</div><h2>Shift story</h2></div><button className="icon-button" aria-label="Shift story options" onClick={() => toast("Showing today's shift activity")}><MoreHorizontal size={19}/></button></div>
        <div className="timeline">
          <TimelineItem time="1:24 PM" title="Refund query resolved" description="Arjun Mehta · 5m 12s" icon={<Check size={14}/>} tone="green" status="RESOLVED"/>
          <TimelineItem time="1:08 PM" title="Break completed" description="15 minute reset" icon={<Sun size={14}/>} tone="amber"/>
          <TimelineItem time="12:42 PM" title="Account access restored" description="Nisha Rao · 7m 03s" icon={<Check size={14}/>} tone="green" status="RESOLVED"/>
          <TimelineItem time="12:15 PM" title="Team huddle" description="Queue handover & daily goals" icon={<Users size={14}/>} tone="blue"/>
        </div>
        <button className="panel-link" onClick={() => toast("You're viewing all activity for today's shift")}>See full shift history <ArrowRight size={14}/></button>
      </section>

      <section className="panel followup-panel">
        <div className="panel-heading"><div><div className="eyebrow">DON'T LET IT SLIP</div><h2>Follow-up list <span className="count-badge">{tasks.filter((t: any) => !t.done).length}</span></h2></div><button className="icon-button" aria-label="Add follow-up" onClick={onAddTask}><Plus size={18}/></button></div>
        <div className="task-list">{tasks.slice(0, 3).map((task: any) => <label key={task.id} className={`task-row ${task.done ? "task-done" : ""}`}><input type="checkbox" checked={task.done} onChange={() => setTasks((prev: any[]) => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}/><span className="custom-check"><Check size={12}/></span><span className="task-copy"><b>{task.title}</b><span>{task.detail}</span><small><Clock3 size={11}/>{task.due}</small></span></label>)}</div>
        <button className="panel-link" onClick={() => onNavigate("Follow-ups")}>Manage follow-ups <ArrowRight size={14}/></button>
      </section>
    </div>

    <div className="bottom-banner"><div className="banner-icon"><Activity size={18}/></div><div className="banner-copy"><b>Your pace is steady.</b><span>You've handled 24 conversations today. Take a breath between calls — quality matters as much as speed.</span></div><button className="button secondary" onClick={() => { setAvailability(availability === "On break" ? "Available" : "On break"); toast(availability === "On break" ? "Welcome back — you're available" : "Break started. Take a moment for yourself."); }}>{availability === "On break" ? "Back to work" : "Take a break"} <ArrowUpRight size={14}/></button></div>
  </div>;
}

function MetricCard({ label, value, change, note, icon, tone, trend }: any) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><div className="metric-main"><strong>{value}</strong><span className={`metric-change ${trend}`}>{change}</span></div><div className="metric-note">{note}</div><div className={`metric-sparkline ${tone}`}><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div></div>;
}

function TimelineItem({ time, title, description, icon, tone, status }: any) {
  return <div className="timeline-item"><span className="timeline-time">{time}</span><span className={`timeline-icon ${tone}`}>{icon}</span><div className="timeline-copy"><b>{title}</b><span>{description}</span></div>{status && <span className="timeline-status">{status}</span>}</div>;
}

function CockpitPage({ selected, customers, notes, setNotes, onResolve, onCustomer, onCall, toast }: any) {
  const [callState, setCallState] = useState<"Ready" | "Connected" | "On hold" | "Ended">("Ready");
  const [tab, setTab] = useState("Overview");
  return <div className="page-stack">
    <PageHeader eyebrow="AGENT WORKSPACE · CONVERSATION" title={<>The conversation <em>cockpit.</em></>} description="Everything you need to understand the customer and move the case forward." action={<span className="case-status"><CircleDot size={13}/>{selected.status}</span>}/>
    <div className="cockpit-toolbar"><div className="case-title"><span className="eyebrow">{selected.id}</span><b>{selected.issue}</b></div><div className="cockpit-actions"><span className={`call-state state-${callState.toLowerCase().replace(" ", "-")}`}><span/>{callState}</span><button className="button secondary" onClick={() => { setCallState(callState === "On hold" ? "Connected" : "On hold"); toast(callState === "On hold" ? "Call resumed" : "Call placed on hold"); }} disabled={callState === "Ready" || callState === "Ended"}><Clock3 size={15}/>{callState === "On hold" ? "Resume" : "Hold"}</button><button className={`button ${callState === "Connected" ? "danger" : "primary"}`} onClick={() => { if (callState === "Ready" || callState === "Ended") { setCallState("Connected"); toast(`Connected to ${selected.name} (simulated)`); } else { setCallState("Ended"); toast("Call ended — add notes before resolving"); } }}><Phone size={15}/>{callState === "Ready" || callState === "Ended" ? "Start call" : "End call"}</button></div></div>
    <div className="cockpit-grid">
      <section className="panel conversation-panel">
        <div className="customer-hero"><div className={`customer-avatar large ${selected.color}`}>{selected.initials}</div><div className="customer-hero-copy"><h2>{selected.name}</h2><span>{selected.phone}</span><div className="hero-tags"><span className={`priority-pill ${selected.priority.toLowerCase()}`}><span/>{selected.priority} priority</span><span className={`sentiment ${selected.sentiment.toLowerCase()}`}>{selected.sentiment}</span></div></div><button className="icon-button" aria-label="More customer actions" onClick={() => toast("More customer actions will be available in a future iteration")}><MoreHorizontal size={20}/></button></div>
        <div className="tab-row">{["Overview", "History", "Resolution"].map(t => <button key={t} className={tab === t ? "selected" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
        {tab === "Overview" && <div className="conversation-content"><div className="eyebrow">CUSTOMER CONTEXT</div><div className="context-summary"><Sparkles size={16}/><p>{selected.name.split(" ")[0]} contacted support about <b>{selected.issue.toLowerCase()}</b>. Review the prior interaction and confirm the preferred resolution before closing the case.</p></div><div className="detail-grid"><div><span>Customer ID</span><b>CUS-10{selected.id.slice(-2)}</b></div><div><span>Last contact</span><b>{selected.lastContact}</b></div><div><span>Channel</span><b>{selected.channel}</b></div><div><span>Case status</span><b>{selected.status}</b></div></div><div className="eyebrow section-eyebrow">INTERACTION NOTES</div><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Capture key details, customer preferences, and agreed next steps..." rows={5}/><div className="note-actions"><span><ShieldCheck size={13}/> Notes stay in this demo browser</span><button className="button secondary small" onClick={() => { localStorage.setItem("cf-notes", notes); toast("Interaction notes saved"); }}><Check size={14}/> Save notes</button></div></div>}
        {tab === "History" && <div className="history-list"><TimelineItem time="Today" title="Customer contacted support" description={selected.issue} icon={<Phone size={13}/>} tone="blue"/><TimelineItem time="Yesterday" title="Previous interaction logged" description="Customer requested an update" icon={<MessageSquare size={13}/>} tone="amber"/><TimelineItem time="2 days ago" title="Case created" description={`Ticket ${selected.id} opened`} icon={<FileText size={13}/>} tone="violet"/></div>}
        {tab === "Resolution" && <div className="resolution-content"><div className="resolution-icon"><CheckCircle2 size={24}/></div><h3>Close the loop</h3><p>Before moving this case forward, confirm that you've captured the outcome and any commitment made to the customer.</p><label className="resolution-check"><input type="checkbox"/> <span>Issue and customer concern documented</span></label><label className="resolution-check"><input type="checkbox"/> <span>Next step communicated clearly</span></label><label className="resolution-check"><input type="checkbox"/> <span>Follow-up owner and timing confirmed</span></label><button className="button primary" onClick={onResolve}><CheckCircle2 size={15}/> Move to follow-up</button></div>}
      </section>
      <aside className="cockpit-rail">
        <section className="panel rail-panel"><div className="panel-heading"><div><div className="eyebrow">ASSISTANCE</div><h2>Resolution guide</h2></div><Sparkles size={17} className="accent-icon"/></div><div className="guide-card"><span className="guide-step">01</span><div><b>Acknowledge</b><p>Recognize the inconvenience and confirm what went wrong.</p></div></div><div className="guide-card"><span className="guide-step">02</span><div><b>Clarify</b><p>Ask what outcome would feel fair to the customer.</p></div></div><div className="guide-card"><span className="guide-step">03</span><div><b>Agree on next steps</b><p>Share a clear action and a realistic time expectation.</p></div></div><div className="demo-disclaimer"><ShieldCheck size={14}/> Demo guidance — not live AI analysis.</div></section>
        <section className="panel rail-panel"><div className="panel-heading"><div><div className="eyebrow">RECENT ACTIVITY</div><h2>Customer history</h2></div><button className="text-button" onClick={() => setTab("History")}>View all</button></div><div className="mini-history"><div className="mini-history-icon"><Phone size={14}/></div><div><b>Inbound conversation</b><span>{selected.lastContact}</span></div><span className="mini-duration">6m 18s</span></div><div className="mini-history"><div className="mini-history-icon chat"><MessageSquare size={14}/></div><div><b>Support chat</b><span>Yesterday, 4:15 PM</span></div><span className="mini-duration">3m 42s</span></div></section>
        <section className="panel rail-panel"><div className="panel-heading"><div><div className="eyebrow">SWITCH CONTEXT</div><h2>Other open cases</h2></div></div>{customers.filter((c: Customer) => c.id !== selected.id && c.status === "Waiting").slice(0, 2).map((c: Customer) => <button className="other-case" key={c.id} onClick={() => onCustomer(c)}><span className={`customer-avatar tiny ${c.color}`}>{c.initials}</span><span><b>{c.name}</b><small>{c.issue}</small></span><ChevronRight size={15}/></button>)}</section>
      </aside>
    </div>
  </div>;
}

function CustomersPage({ customers, search, setSearch, filter, setFilter, onSelect, onCall }: any) {
  return <div className="page-stack"><PageHeader eyebrow="CUSTOMER DIRECTORY" title={<>People, not <em>ticket numbers.</em></>} description="Find the full context behind every conversation." action={<button className="button secondary" onClick={() => { setSearch(""); setFilter("All cases"); }}><SlidersHorizontal size={15}/> Reset filters</button>}/>
    <section className="panel directory-panel"><div className="directory-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, case ID, or issue..."/>{search && <button className="icon-button" onClick={() => setSearch("")}><X size={14}/></button>}</div><select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}><option>All cases</option><option>Waiting</option><option>In progress</option><option>Follow-up</option></select><span className="result-count">{customers.length} cases</span></div>
      <div className="table-wrap"><table><thead><tr><th>CUSTOMER</th><th>ISSUE</th><th>CHANNEL</th><th>PRIORITY</th><th>STATUS</th><th></th></tr></thead><tbody>{customers.map((c: Customer) => <tr key={c.id}><td><div className="table-customer"><span className={`customer-avatar ${c.color}`}>{c.initials}</span><span><b>{c.name}</b><small>{c.id}</small></span></div></td><td>{c.issue}</td><td><span className={`channel-tag ${c.channel.toLowerCase()}`}>{c.channel}</span></td><td><span className={`priority-pill ${c.priority.toLowerCase()}`}><span/>{c.priority}</span></td><td><span className={`status-pill ${c.status.toLowerCase().replace(" ", "-")}`}>{c.status}</span></td><td><button className="round-action" onClick={() => onSelect(c)} aria-label={`Open ${c.name}`}><ArrowUpRight size={15}/></button></td></tr>)}</tbody></table>{customers.length === 0 && <div className="empty-state"><Search size={24}/><b>No matching cases</b><span>Try another search or change the status filter.</span></div>}</div></section>
    <div className="bottom-banner"><div className="banner-icon"><Users size={18}/></div><div className="banner-copy"><b>Every case has a person behind it.</b><span>Open a customer to see their interaction context, add notes, and plan the next step.</span></div></div>
  </div>;
}

function FollowUpsPage({ tasks, setTasks, onAdd, onCustomer }: any) {
  const remaining = tasks.filter((t: any) => !t.done).length;
  return <div className="page-stack"><PageHeader eyebrow="PERSONAL WORK QUEUE" title={<>Close the loops you <em>open.</em></>} description="A small, clear list of promises to keep and people to get back to." action={<button className="button primary" onClick={onAdd}><Plus size={16}/> New follow-up</button>}/>
    <div className="followup-summary"><div><span className="eyebrow">STILL TO DO</span><strong>{remaining}</strong><span>open follow-ups</span></div><div><span className="eyebrow">COMPLETED</span><strong>{tasks.filter((t: any) => t.done).length}</strong><span>closed in this session</span></div><div><span className="eyebrow">YOUR COMMITMENT</span><strong>100%</strong><span>make every next step clear</span></div></div>
    <section className="panel followup-page-panel"><div className="panel-heading"><div><div className="eyebrow">YOUR LIST</div><h2>Follow-up commitments</h2></div><span className="count-badge">{remaining} open</span></div>{tasks.map((task: any) => <label className={`followup-large-row ${task.done ? "task-done" : ""}`} key={task.id}><input type="checkbox" checked={task.done} onChange={() => setTasks((prev: any[]) => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}/><span className="custom-check"><Check size={12}/></span><span className="task-copy"><b>{task.title}</b><span>{task.detail}</span><small><Clock3 size={12}/>{task.due}</small></span><span className={`status-pill ${task.done ? "resolved" : "waiting"}`}>{task.done ? "Completed" : "Open"}</span></label>)}{tasks.length === 0 && <div className="empty-state">Your follow-up list is clear. Enjoy the breathing room.</div>}</section>
  </div>;
}

function TeamPage({ customers, tasks }: any) {
  const people = [{ name: "Dinesh Kumar", role: "Support specialist", initials: "DK", load: 72, state: "You", color: "blue" }, { name: "Priya Nair", role: "Senior support", initials: "PN", load: 84, state: "On call", color: "violet" }, { name: "Rahul Verma", role: "Support specialist", initials: "RV", load: 46, state: "Available", color: "teal" }, { name: "Ananya Bose", role: "Escalations", initials: "AB", load: 91, state: "Busy", color: "rose" }];
  return <div className="page-stack"><PageHeader eyebrow="TEAM OPERATIONS · SAMPLE DATA" title={<>A healthier view of <em>the queue.</em></>} description="Spot pressure points early and keep workloads balanced." action={<span className="case-status"><span className="live-dot"/> Demo metrics</span>}/>
    <div className="metric-grid three-metrics"><MetricCard label="Waiting conversations" value={String(customers.filter((c: Customer) => c.status === "Waiting").length)} change="2 high" note="priority cases need attention" icon={<MessageSquare size={18}/>} tone="lime"/><MetricCard label="Follow-ups open" value={String(tasks.filter((t: any) => !t.done).length)} change="Today" note="across the sample workspace" icon={<ListChecks size={18}/>} tone="blue"/><MetricCard label="Team availability" value="3 / 4" change="75%" note="agents active in sample data" icon={<Users size={18}/>} tone="violet"/></div>
    <section className="panel team-panel"><div className="panel-heading"><div><div className="eyebrow">CAPACITY OVERVIEW</div><h2>Team workload</h2></div><span className="demo-tag">ILLUSTRATIVE DATA</span></div>{people.map(p => <div className="team-row" key={p.name}><div className={`customer-avatar ${p.color}`}>{p.initials}</div><div className="team-person"><b>{p.name}</b><span>{p.role}</span></div><div className="load-cell"><div className="load-label"><span>Workload</span><b>{p.load}%</b></div><div className="load-bar"><span style={{ width: `${p.load}%` }}/></div></div><span className={`agent-state ${p.state === "Available" ? "available" : p.state === "Busy" ? "busy" : "on-call"}`}><span/>{p.state}</span></div>)}</section>
    <div className="bottom-banner"><div className="banner-icon"><HeartPulse size={18}/></div><div className="banner-copy"><b>Healthy service starts with a healthy team.</b><span>Use workload as a conversation starter, not as a measure of an individual’s worth.</span></div></div>
  </div>;
}

function AccountsModal({ onClose, toast, onOpenSettings }: { onClose: () => void; toast: (msg: string) => void; onOpenSettings: () => void }) {
  const [tab, setTab] = useState<"credentials" | "support">("credentials");
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    toast(`${label} copied to clipboard`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">NORTHSTAR SUPPORT · WORKSPACE & ACCOUNT</span>
            <h2>{tab === "credentials" ? "Login credentials" : "Customer support desk"}</h2>
          </div>
          <button className="icon-button" onClick={onClose}><X size={19} /></button>
        </div>
        <p className="muted">
          Manage your operator credentials, active Northstar Support environment, and customer escalation channels.
        </p>

        <div className="tab-row" style={{ padding: "0 0 10px 0", marginBottom: "15px" }}>
          <button className={tab === "credentials" ? "selected" : ""} onClick={() => setTab("credentials")}>
            Operator Login & Credentials
          </button>
          <button className={tab === "support" ? "selected" : ""} onClick={() => setTab("support")}>
            Northstar Customer Support
          </button>
        </div>

        {tab === "credentials" && (
          <div>
            <div className="detail-grid" style={{ borderBottom: "none", paddingBottom: "10px" }}>
              <div>
                <span>Account holder</span>
                <b>Dinesh Kumar (Support Specialist)</b>
              </div>
              <div>
                <span>Employee ID</span>
                <b>EMP-8842 · Tier 2</b>
              </div>
              <div>
                <span>Login username / email</span>
                <b>dinesh.kumar@northstar.internal</b>
              </div>
              <div>
                <span>Workspace instance</span>
                <b>Northstar Support (US-East-1)</b>
              </div>
              <div>
                <span>Current password</span>
                <b>{showPassword ? "demo_pass2026" : "••••••••••••"}</b>
              </div>
              <div>
                <span>Session status</span>
                <span className="status-pill waiting" style={{ display: "inline-block", width: "fit-content" }}>Active · Shift in progress</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              <button className="button secondary small" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide password" : "Show password"}
              </button>
              <button className="button secondary small" onClick={() => copyToClipboard("dinesh.kumar@northstar.internal / demo_pass2026", "Credentials")}>
                <Check size={14} /> Copy login details
              </button>
              <button className="button secondary small" onClick={onOpenSettings}>
                <SlidersHorizontal size={14} /> Workspace customization
              </button>
            </div>
          </div>
        )}

        {tab === "support" && (
          <div>
            <div className="context-summary" style={{ margin: "10px 0 16px" }}>
              <Sparkles size={16} />
              <p><b>Northstar Support Operations:</b> Direct contact matrix for customer escalations, dispatch assistance, and supervisor handover during your shift.</p>
            </div>

            <div className="detail-grid" style={{ borderBottom: "none", paddingBottom: "10px" }}>
              <div>
                <span>Toll-Free Customer Line</span>
                <b>+1 (800) 555-0199 / 1800-CALL-FLOW</b>
              </div>
              <div>
                <span>Internal Support Desk</span>
                <b>support@northstar.internal</b>
              </div>
              <div>
                <span>Senior Escalations Lead</span>
                <b>Priya Nair (Extension #402)</b>
              </div>
              <div>
                <span>Operational Hours</span>
                <b>24/7 Follow-the-sun (Active Shift: 9 AM - 6 PM)</b>
              </div>
              <div>
                <span>Target Response SLA</span>
                <b>&lt; 5 minutes for High Priority</b>
              </div>
              <div>
                <span>System Health</span>
                <span className="status-pill follow-up" style={{ display: "inline-block", width: "fit-content" }}>All Systems Operational</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              <button className="button secondary small" onClick={() => copyToClipboard("support@northstar.internal", "Support email")}>
                Copy support email
              </button>
              <button className="button secondary small" onClick={onOpenSettings}>
                <SlidersHorizontal size={14} /> Customize workspace view
              </button>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>Close</button>
          <button className="button primary" onClick={() => { onClose(); toast("Account status verified"); }}>
            <Check size={15} /> Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ theme, setTheme, layout, setLayout, onClose, toast }: { theme: Theme; setTheme: (t: Theme) => void; layout: Layout; setLayout: (l: Layout) => void; onClose: () => void; toast: (msg: string) => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal settings-modal" onClick={e => e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Workspace preferences</h2></div><button className="icon-button" onClick={onClose}><X size={19}/></button></div><p className="muted">Choose the visual system and layout that suit your workflow. Your choices are saved in this browser.</p>
    <div className="settings-section"><h3>01 / Visual direction</h3><div className="choice-grid">
      <button className={`theme-choice ${theme === "midnight" ? "chosen" : ""}`} onClick={() => setTheme("midnight")}><span className="theme-swatch midnight-swatch"><i/><i/><i/></span><b>Midnight Lime</b><small>Focused · high contrast</small>{theme === "midnight" && <CheckCircle2 size={16}/>}</button>
      <button className={`theme-choice ${theme === "editorial" ? "chosen" : ""}`} onClick={() => setTheme("editorial")}><span className="theme-swatch editorial-swatch"><i/><i/><i/></span><b>Editorial Warmth</b><small>Calm · human</small>{theme === "editorial" && <CheckCircle2 size={16}/>}</button>
      <button className={`theme-choice ${theme === "signal" ? "chosen" : ""}`} onClick={() => setTheme("signal")}><span className="theme-swatch signal-swatch"><i/><i/><i/></span><b>Signal Blue</b><small>Technical · crisp</small>{theme === "signal" && <CheckCircle2 size={16}/>}</button>
    </div></div>
    <div className="settings-section"><h3>02 / Workspace layout</h3><div className="layout-choices">
      <button className={`layout-choice ${layout === "classic" ? "chosen" : ""}`} onClick={() => setLayout("classic")}><PanelLeft size={19}/><span><b>Classic sidebar</b><small>Familiar, structured navigation</small></span>{layout === "classic" && <CheckCircle2 size={16}/>}</button>
      <button className={`layout-choice ${layout === "command" ? "chosen" : ""}`} onClick={() => setLayout("command")}><Command size={19}/><span><b>Command centre</b><small>Balanced canvas with a context rail</small></span>{layout === "command" && <CheckCircle2 size={16}/>}</button>
      <button className={`layout-choice ${layout === "compact" ? "chosen" : ""}`} onClick={() => setLayout("compact")}><Zap size={19}/><span><b>Keyboard-first</b><small>Compact spacing, more on screen</small></span>{layout === "compact" && <CheckCircle2 size={16}/>}</button>
    </div></div>
    <div className="modal-actions"><button className="button secondary" onClick={() => { setTheme("midnight"); setLayout("command"); toast("Default design restored"); }}>Reset defaults</button><button className="button primary" onClick={() => { onClose(); toast(`${themeNames[theme]} · ${layoutNames[layout]} saved`); }}><Check size={15}/> Save preferences</button></div>
  </div></div>;
}

export default App;
