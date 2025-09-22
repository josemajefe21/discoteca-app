import { useEffect, useMemo, useState } from "react";

const GROUP_MEMBERS = [
  "Jo",
  "Jorge",
  "Willi",
  "Pablo",
  "Chino",
  "Tuqui",
  "Tucan",
  "Ramiro",
  "Poison",
];

const BRAND_GRADIENT = "bg-gradient-to-br from-[#0a2342] via-[#122b49] to-[#001220]";
const BRAND_GOLD_TEXT = "text-[#e5b84c]";
const BRAND_SILVER_TEXT = "text-[#b7c2d4]";
const CARD_BG = "bg-[#0e1b2f]/60";
const BORDER_GOLD = "border-[#e5b84c]/40";

const KEYS = {
  dishes: "discoteca_dishes_v1",
  votes: "discoteca_votes_v1",
  settings: "discoteca_settings_v1",
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function hashStringToNumber(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function generatePasswordFor(name) {
  const FOODS = [
    "CHORI", "EMPANIX", "MILANESA", "ASADO", "MATAMBRE", "PICANA",
    "BIRRIA", "TACOLATE", "ALFAJOR", "CHIMI", "SALSA_VERDE",
    "DULCELECHE", "QUESUDO", "GUACAMOLE", "CEVICHIN", "BOGA", "SORRENTIX"
  ];
  const n = hashStringToNumber(name);
  const pick = FOODS[n % FOODS.length];
  const digits = String(100 + (n % 900));
  return `${name.toUpperCase()}-${pick}-${digits}`;
}

const SEED_DISHES = [
  { name: "Filet especiado al Malbec", description: "Sobre colchón de vegetales, cremoso de papas andinas.", chef: "—", dateISO: "2024-01-11", photoUrl: "", roundIdx: 0 },
  { name: "Pechuguitas de Campo", description: "Crema de vino blanco, raíces de la huerta y hortalizas al disco.", chef: "—", dateISO: "2024-01-18", photoUrl: "", roundIdx: 0 },
  { name: "Asado tradicional argentino", description: "Clásico de la casa.", chef: "—", dateISO: "2024-01-25", photoUrl: "", roundIdx: 0 },
  { name: "Osobuco braseado al Malbec", description: "Con puré rústico de papas criollas.", chef: "—", dateISO: "2024-02-01", photoUrl: "", roundIdx: 0 },
  { name: "Sorrentinos de vacío", description: "Vacio braseado al malbec, cebollas asadas, mozzarella y gouda al disco con bolognesa rosa.", chef: "—", dateISO: "2024-02-08", photoUrl: "", roundIdx: 0 },
  { name: "Filet de Boga especiada", description: "Grillé con salsa criolla aromática, ensalada rústica de papas y huevos de campo.", chef: "—", dateISO: "2024-02-15", photoUrl: "", roundIdx: 0 },
  { name: "Estofado criollo de Vacío", description: "Al Malbec, emulsión de tomates y texturas de huerta en cocción lenta.", chef: "—", dateISO: "2024-02-22", photoUrl: "", roundIdx: 0 },
  { name: "Guiso de lentejas N&P", description: "Día de la Independencia.", chef: "—", dateISO: "2024-07-09", photoUrl: "", roundIdx: 0 },
  { name: "Hamburguesa crispy de pollo", description: "Coleslaw, panceta ahumada laqueada en whisky, skin-on fries.", chef: "—", dateISO: "2024-03-07", photoUrl: "", roundIdx: 0 },
  { name: "Pechuguitas Dijon y Miel", description: "Con aligot francés.", chef: "—", dateISO: "2024-03-14", photoUrl: "", roundIdx: 0 },
  { name: "Lasaña Bolognese Classico", description: "Al forno.", chef: "—", dateISO: "2024-03-21", photoUrl: "", roundIdx: 1 },
  { name: "Costilla ancha ahumada", description: "Horno de barro, esferas de papas a las finas hierbas.", chef: "—", dateISO: "2024-03-28", photoUrl: "", roundIdx: 1 },
  { name: "Taquitos de Birria y al Pastor", description: "Amor a la Mexicana.", chef: "—", dateISO: "2024-04-04", photoUrl: "", roundIdx: 1 },
  { name: "Picana rellena", description: "Mozzarella bufalina, jamón ibérico, portobellos en manteca de salvia; papas nativas crocantes.", chef: "—", dateISO: "2024-04-11", photoUrl: "", roundIdx: 1 },
  { name: "Matambrito con crema de verdeo", description: "Novillo joven, papas doradas al horno.", chef: "—", dateISO: "2024-04-18", photoUrl: "", roundIdx: 1 },
].map((d) => ({ ...d, id: uid("dish") }));

function HeaderBadge() {
  return (
    <div className={`w-full ${BRAND_GRADIENT} relative overflow-hidden rounded-3xl border ${BORDER_GOLD} p-6 md:p-10 shadow-xl`}>
      <svg className="absolute inset-x-0 bottom-0 w-full h-24 opacity-40" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,80 L60,80 L60,40 L90,40 L90,60 L130,60 L130,20 L170,20 L170,80 L220,80 L220,30 L260,30 L260,80 L330,80 L360,20 L370,20 L370,80 L460,80 L470,60 L520,60 L520,80 L600,80 L600,10 L620,10 L620,80 L730,80 L740,30 L770,30 L770,80 L860,80 L880,50 L900,50 L900,80 L980,80 L980,20 L995,20 L1000,80 L1100,80 L1100,50 L1150,50 L1150,80 L1200,80 L1200,120 L0,120 Z" fill="#e5b84c"/>
      </svg>
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className={`tracking-widest ${BRAND_SILVER_TEXT} text-xs md:text-sm uppercase`}>North America’s vibes • Discoteca</div>
          <h1 className={`mt-1 font-black leading-none text-5xl md:text-7xl ${BRAND_GOLD_TEXT}`}>50-Style</h1>
          <h2 className="text-white/90 text-2xl md:text-4xl font-semibold mt-1">Ranking • Las Jueves</h2>
          <div className="text-white/70 mt-2">Wynn Yerba Buena • Tucumán</div>
        </div>
        <div className="text-right">
          <div className={`${BRAND_GOLD_TEXT} text-xs md:text-sm uppercase tracking-widest`}>Jueves de autor</div>
          <div className="text-white/90 text-lg">Top 3 por vuelta • Sistema 3-2-1</div>
          <div className="text-white/60">8 votos por ronda • 10 cenas = 1 vuelta</div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, right }) {
  return (
    <section className={`${CARD_BG} border ${BORDER_GOLD} rounded-2xl p-5 md:p-6 shadow-lg`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className={`${BRAND_GOLD_TEXT} text-xl md:text-2xl font-bold`}>{title}</h3>
        {right}
      </div>
      {children}
    </section>
  );
}

function Pill({ children }) {
  return <span className="px-2 py-1 rounded-full text-xs border border-white/20 text-white/80">{children}</span>;
}

function useDiscotecaData() {
  const [dishes, setDishes] = useState(() => load(KEYS.dishes, SEED_DISHES));
  const [votes, setVotes] = useState(() => load(KEYS.votes, []));
  const [settings, setSettings] = useState(() => load(KEYS.settings, { eligibleVoters: GROUP_MEMBERS, passwords: {} }));

  useEffect(() => save(KEYS.dishes, dishes), [dishes]);
  useEffect(() => save(KEYS.votes, votes), [votes]);
  useEffect(() => save(KEYS.settings, settings), [settings]);

  // Asegurar contraseñas para cada votante habilitado
  useEffect(() => {
    const current = settings.passwords || {};
    let changed = false;
    const next = { ...current };
    for (const name of settings.eligibleVoters || []) {
      if (!next[name]) {
        next[name] = generatePasswordFor(name);
        changed = true;
      }
    }
    if (changed) setSettings({ ...settings, passwords: next });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.eligibleVoters]);

  return { dishes, setDishes, votes, setVotes, settings, setSettings };
}

function groupByRound(dishes) {
  const map = new Map();
  dishes.forEach((d) => {
    const arr = map.get(d.roundIdx) || [];
    arr.push(d);
    map.set(d.roundIdx, arr);
  });
  return map;
}

function computeScores(votes) {
  const points = new Map();
  for (const v of votes) {
    const add = (id, p) => points.set(id, (points.get(id) || 0) + p);
    if (v.first) add(v.first, 3);
    if (v.second) add(v.second, 2);
    if (v.third) add(v.third, 1);
  }
  return points;
}

function leaderboard(dishes, votes, roundIdx = null) {
  const ds = roundIdx === null ? dishes : dishes.filter((d) => d.roundIdx === roundIdx);
  const vs = roundIdx === null ? votes : votes.filter((v) => v.roundIdx === roundIdx);
  const pts = computeScores(vs);
  const rows = ds.map((d) => ({
    id: d.id,
    name: d.name,
    chef: d.chef,
    roundIdx: d.roundIdx,
    points: pts.get(d.id) || 0,
    votes: vs.filter((v) => [v.first, v.second, v.third].includes(d.id)).length,
  }));
  rows.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  return rows;
}

function DishCard({ dish, onEdit, onDelete }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
      {dish.photoUrl ? (
        <img src={dish.photoUrl} alt={dish.name} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 flex items-center justify-center bg-white/5 text-white/40 text-sm">Sin foto</div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-white font-semibold text-lg leading-tight">{dish.name}</h4>
          <Pill>Vuelta {dish.roundIdx + 1}</Pill>
        </div>
        <p className="text-white/70 text-sm mt-1">{dish.description}</p>
        <div className="text-white/60 text-xs mt-2 flex gap-3 flex-wrap">
          <span>Chef: {dish.chef || "—"}</span>
          {dish.dateISO && <span>Fecha: {dish.dateISO}</span>}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={onEdit} className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 hover:bg-white/10">Editar</button>
          <button onClick={onDelete} className="px-3 py-1.5 rounded-lg border border-red-400/40 text-red-300 hover:bg-red-400/10">Borrar</button>
        </div>
      </div>
    </div>
  );
}

function DishForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [chef, setChef] = useState(initial?.chef || "");
  const [dateISO, setDateISO] = useState(initial?.dateISO || "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl || "");
  const [roundIdx, setRoundIdx] = useState(initial?.roundIdx ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, description, chef, dateISO, photoUrl, roundIdx });
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      <div className="col-span-1 md:col-span-2">
        <label className="text-white/80 text-sm">Nombre del plato</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20" />
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="text-white/80 text-sm">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20" />
      </div>
      <div>
        <label className="text-white/80 text-sm">Chef</label>
        <input value={chef} onChange={(e) => setChef(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20" />
      </div>
      <div>
        <label className="text-white/80 text-sm">Fecha</label>
        <input type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20" />
      </div>
      <div>
        <label className="text-white/80 text-sm">Foto (URL)</label>
        <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20" />
      </div>
      <div>
        <label className="text-white/80 text-sm">Vuelta</label>
        <select value={roundIdx} onChange={(e) => setRoundIdx(Number(e.target.value))} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20">
          <option value={0}>1</option>
          <option value={1}>2</option>
          <option value={2}>3</option>
          <option value={3}>4</option>
        </select>
      </div>
      <div className="col-span-1 md:col-span-2 flex gap-2 mt-2">
        <button className="px-4 py-2 rounded-xl bg-white/90 text-[#0a2342] font-semibold hover:bg-white">Guardar</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:bg-white/10">Cancelar</button>
      </div>
    </form>
  );
}

function Voting({ dishes, votes, setVotes, eligibleVoters, settings }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const dishesByRound = useMemo(() => dishes.filter((d) => d.roundIdx === roundIdx), [dishes, roundIdx]);

  const [voter, setVoter] = useState(eligibleVoters[0] || "");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [password, setPassword] = useState("");

  const ballotsThisRound = votes.filter((v) => v.roundIdx === roundIdx);
  const hasVoted = ballotsThisRound.some((v) => v.voter === voter);

  const votersThisRound = new Set(ballotsThisRound.map((v) => v.voter));
  const remaining = Math.max(0, eligibleVoters.length - votersThisRound.size);
  const isRoundComplete = votersThisRound.size >= (eligibleVoters?.length || 0);

  function resetChoices() {
    setFirst("");
    setSecond("");
    setThird("");
    setPassword("");
  }

  function submitVote(e) {
    e.preventDefault();
    if (!voter) return alert("Elegí tu nombre.");
    if (hasVoted) return alert("Ya votaste en esta vuelta.");
    if (!first || !second || !third) return alert("Completá el Top 3.");
    if (new Set([first, second, third]).size !== 3) return alert("Los 3 deben ser distintos.");
    const expected = settings?.passwords?.[voter] || "";
    if (!password || password !== expected) return alert("Contraseña incorrecta.");

    const vote = { id: uid("vote"), voter, roundIdx, first, second, third, createdAt: new Date().toISOString() };
    setVotes((prev) => [...prev, vote]);
    resetChoices();
  }

  const lb = leaderboard(dishes, votes, roundIdx);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Section
        title="Votar Top 3 (3-2-1)"
        right={<div className="flex gap-2 items-center text-white/70"><Pill>Vuelta {roundIdx + 1}</Pill><Pill>{remaining} votos pendientes</Pill></div>}
      >
        <form onSubmit={submitVote} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="text-white/80 text-sm">Vuelta</label>
            <select value={roundIdx} onChange={(e) => setRoundIdx(Number(e.target.value))} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20">
              <option value={0}>1</option>
              <option value={1}>2</option>
              <option value={2}>3</option>
              <option value={3}>4</option>
            </select>
          </div>
          <div>
            <label className="text-white/80 text-sm">Tu nombre</label>
            <select value={voter} onChange={(e) => setVoter(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20">
              {eligibleVoters.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/80 text-sm">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20" />
          </div>
          <div className="md:col-span-2">
            <label className="text-white/80 text-sm">1° puesto (3 pts)</label>
            <select value={first} onChange={(e) => setFirst(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20">
              <option value="">— Elegir —</option>
              {dishesByRound.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-white/80 text-sm">2° puesto (2 pts)</label>
            <select value={second} onChange={(e) => setSecond(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20">
              <option value="">— Elegir —</option>
              {dishesByRound.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-white/80 text-sm">3° puesto (1 pt)</label>
            <select value={third} onChange={(e) => setThird(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20">
              <option value="">— Elegir —</option>
              {dishesByRound.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2 mt-2">
            <button className="px-4 py-2 rounded-xl bg-white/90 text-[#0a2342] font-semibold hover:bg-white" disabled={hasVoted}>Enviar voto</button>
            <button type="button" onClick={resetChoices} className="px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:bg-white/10">Limpiar</button>
            {hasVoted && <span className="text-emerald-300 text-sm mt-2">Ya votaste esta vuelta ✔️</span>}
          </div>
        </form>
      </Section>

      <Section title="Ranking parcial de la vuelta">
        {lb.length === 0 ? (
          <div className="text-white/60">No hay platos en esta vuelta.</div>
        ) : (
          <div className="relative">
            <div className={isRoundComplete ? "" : "blur-sm pointer-events-none select-none"}>
              <ol className="space-y-2">
                {lb.map((row, i) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${BRAND_GRADIENT} text-white`}>{i + 1}</div>
                      <div>
                        <div className="text-white font-semibold">{row.name}</div>
                        <div className="text-white/60 text-xs">Votos: {row.votes}</div>
                      </div>
                    </div>
                    <div className={`${BRAND_GOLD_TEXT} font-bold text-lg`}>{row.points} pts</div>
                  </li>
                ))}
              </ol>
            </div>
            {!isRoundComplete && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="px-4 py-2 rounded-lg bg-black/60 border border-white/10 text-white/80 text-sm">
                  El ranking se revela cuando voten las 9 personas.
                </div>
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}

function ManageDishes({ dishes, setDishes }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const rounds = groupByRound(dishes);

  function addDish(data) {
    const newDish = { id: uid("dish"), ...data };
    setDishes((prev) => [newDish, ...prev]);
    setShowForm(false);
  }

  function updateDish(id, data) {
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
    setEditing(null);
  }

  function deleteDish(id) {
    if (confirm("¿Borrar este plato?")) setDishes((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-6">
      <Section
        title="Platos de Discoteca"
        right={<button onClick={() => { setShowForm(true); setEditing(null); }} className="px-4 py-2 rounded-xl bg-white/90 text-[#0a2342] font-semibold hover:bg-white">Añadir plato</button>}
      >
        {showForm && (
          <div className="mb-6">
            <DishForm onSave={addDish} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {[...rounds.keys()].sort((a, b) => a - b).map((r) => (
          <div key={r} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h4 className={`${BRAND_GOLD_TEXT} text-lg font-bold`}>Vuelta {r + 1}</h4>
              <Pill>{rounds.get(r).length} platos</Pill>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rounds.get(r).map((d) => (
                <DishCard
                  key={d.id}
                  dish={d}
                  onEdit={() => setEditing(d)}
                  onDelete={() => deleteDish(d.id)}
                />
              ))}
            </div>
          </div>
        ))}

        {editing && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <h4 className={`${BRAND_GOLD_TEXT} text-lg font-bold mb-3`}>Editar plato</h4>
            <DishForm initial={editing} onSave={(data) => updateDish(editing.id, data)} onCancel={() => setEditing(null)} />
          </div>
        )}
      </Section>
    </div>
  );
}

function Rankings({ dishes, votes }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const perRound = leaderboard(dishes, votes, roundIdx);
  const overall = leaderboard(dishes, votes, null);

  const totalVotes = votes.length;
  const totalDishes = dishes.length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Section title="Ranking general (todas las vueltas)">
        <ol className="space-y-2">
          {overall.map((row, i) => (
            <li key={row.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${BRAND_GRADIENT} text-white`}>{i + 1}</div>
                <div>
                  <div className="text-white font-semibold">{row.name}</div>
                  <div className="text-white/60 text-xs">Vuelta {row.roundIdx + 1}</div>
                </div>
              </div>
              <div className={`${BRAND_GOLD_TEXT} font-bold text-lg`}>{row.points} pts</div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="Ranking por vuelta"
        right={(
          <select value={roundIdx} onChange={(e) => setRoundIdx(Number(e.target.value))} className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20">
            <option value={0}>Vuelta 1</option>
            <option value={1}>Vuelta 2</option>
            <option value={2}>Vuelta 3</option>
            <option value={3}>Vuelta 4</option>
          </select>
        )}
      >
        <ol className="space-y-2">
          {perRound.map((row, i) => (
            <li key={row.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${BRAND_GRADIENT} text-white`}>{i + 1}</div>
                <div>
                  <div className="text-white font-semibold">{row.name}</div>
                  <div className="text-white/60 text-xs">Platos con votos: {row.votes}</div>
                </div>
              </div>
              <div className={`${BRAND_GOLD_TEXT} font-bold text-lg`}>{row.points} pts</div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Estadísticas rápidas">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white/70 text-sm">Platos registrados</div>
            <div className={`${BRAND_GOLD_TEXT} text-3xl font-black`}>{totalDishes}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white/70 text-sm">Votos emitidos</div>
            <div className={`${BRAND_GOLD_TEXT} text-3xl font-black`}>{totalVotes}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 col-span-2">
            <div className="text-white/70 text-sm">Top 3 (sistema)</div>
            <div className="text-white/90">1° = 3 pts • 2° = 2 pts • 3° = 1 pt</div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Settings({ settings, setSettings }) {
  const [list, setList] = useState(settings.eligibleVoters.join(", "));

  return (
    <Section title="Ajustes de votación">
      <div className="space-y-3">
        <div>
          <label className="text-white/80 text-sm">Miembros habilitados para votar (separar por coma). Sugerido: 8 por vuelta.</label>
          <textarea rows={3} value={list} onChange={(e) => setList(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20" />
        </div>
        <button
          onClick={() => setSettings({ ...settings, eligibleVoters: list.split(",").map((s) => s.trim()).filter(Boolean) })}
          className="px-4 py-2 rounded-xl bg-white/90 text-[#0a2342] font-semibold hover:bg-white"
        >Guardar cambios</button>
        <div className="mt-4">
          <div className="text-white/80 text-sm mb-2">Contraseñas de votación</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {(settings.passwords || {}) && (settings.eligibleVoters || []).map((name) => (
              <div key={name} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-white/80 text-sm">{name}</span>
                <span className="text-white/60 text-xs font-mono">{settings.passwords?.[name]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function DataIO({ dishes, votes }) {
  function exportJSON() {
    const payload = { version: 1, exportedAt: new Date().toISOString(), dishes, votes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `discoteca_ranking_${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (!obj || !Array.isArray(obj.dishes) || !Array.isArray(obj.votes)) throw new Error("Formato inválido");
        localStorage.setItem(KEYS.dishes, JSON.stringify(obj.dishes));
        localStorage.setItem(KEYS.votes, JSON.stringify(obj.votes));
        location.reload();
      } catch (err) {
        alert("Error importando JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <Section title="Exportar / Importar">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={exportJSON} className="px-4 py-2 rounded-xl bg-white/90 text-[#0a2342] font-semibold hover:bg-white">Exportar JSON</button>
        <label className="px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 cursor-pointer">
          Importar JSON
          <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
        </label>
        <div className="text-white/60 text-sm">Útil para respaldos y para mover datos entre dispositivos.</div>
      </div>
    </Section>
  );
}

export default function App() {
  const { dishes, setDishes, votes, setVotes, settings, setSettings } = useDiscotecaData();
  const [tab, setTab] = useState("home");

  return (
    <div className={`min-h-screen ${BRAND_GRADIENT} text-white`}>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <HeaderBadge />

        <nav className="flex flex-wrap gap-2">
          {[
            { id: "home", label: "Votación" },
            { id: "dishes", label: "Platos" },
            { id: "rankings", label: "Ranking" },
            { id: "settings", label: "Ajustes" },
            { id: "data", label: "Exportar" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl border ${BORDER_GOLD} ${tab === t.id ? "bg-white/90 text-[#0a2342] font-semibold" : "bg-white/5 text-white/90 hover:bg-white/10"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "home" && (
          <Voting dishes={dishes} votes={votes} setVotes={setVotes} eligibleVoters={settings.eligibleVoters} settings={settings} />
        )}
        {tab === "dishes" && <ManageDishes dishes={dishes} setDishes={setDishes} />}
        {tab === "rankings" && <Rankings dishes={dishes} votes={votes} />}
        {tab === "settings" && <Settings settings={settings} setSettings={setSettings} />}
        {tab === "data" && <DataIO dishes={dishes} votes={votes} />}

        <footer className="opacity-70 text-xs text-center pt-6">
          Discoteca • Ranking App — estética inspirada en 50 Best (no oficial). Hecho con ❤️ para los jueves.
        </footer>
      </div>
    </div>
  );
}



