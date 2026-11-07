import {
  SCENARIOS, DECK, SUITS, analyze, beliefRows, cardColor, cardLabel,
  outcomeFor, points, probabilityAt,
} from "./model.mjs?v=2";

const STEPS = [
  ["Start here", "A lower hand wins", "You are deciding what to do on your turn. We will build the decision from the cards you can see."],
  ["The card axis", "One fixed list of 52 cards", "Every probability in this model points to the same ordered deck, from A♣ through K♠."],
  ["Position states", "Give every possible place a row", "A card can sit in a player's hand, the draw pile, or the discard pile. Positions are the rows of Q."],
  ["Your information", "Only three cards are visible to you", "You know two cards in your hand and the top discard. The other 49 cards are somewhere in the other occupied positions."],
  ["The matrix Q", "What could be in this position?", "Choose a position below. Its row of Q assigns a probability to each of the 52 cards."],
  ["Expected points", "Turn the probabilities into points", "Multiply each possible card's probability by its point value, then add. This gives one expected point value for a position."],
  ["Action A", "Take the top discard", "You see this card before acting. If you take it, you must swap it with one card in your hand."],
  ["Action B", "Draw, then decide", "The draw is unknown now. After you see it, you may swap it into your hand or discard it."],
  ["The decision", "Compare the two averages", "Expected value here means expected points removed from your hand. A larger number is better."],
  ["Update", "Move cards, update beliefs", "The move changes positions in Q. Any newly seen card also removes a possibility from every other unknown position."],
];

const $ = (id) => document.getElementById(id);
const els = Object.fromEntries(["scenario-select", "chapter-label", "step-count", "progress", "slide-kicker", "slide-title", "slide-intro", "visual", "explain", "back-button", "next-button", "lesson"].map((id) => [id, $(id)]));
const state = {
  scenarioIndex: Math.max(0, SCENARIOS.findIndex((entry) => location.hash === `#${entry.id}`)),
  step: 0,
  selectedRow: "H3",
  selectedTarget: null,
  choice: null,
};
const scenario = () => SCENARIOS[state.scenarioIndex];
const info = () => analyze(scenario());
const result = () => state.choice ? outcomeFor(scenario(), info(), state.choice) : null;
const fmt = (value, signed = false) => `${value < -0.00001 ? "−" : signed && value > 0.00001 ? "+" : ""}${Math.abs(value).toFixed(2)}`;
const pct = (value) => `${(100 * value).toFixed(value < 0.1 ? 2 : 0)}%`;
const code = (card) => `${card.slice(0, -1)}${SUITS.find((suit) => suit.code === card.slice(-1)).symbol}`;
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function card(cardName, options = {}) {
  const { small = false, hidden = false, muted = false, caption = "" } = options;
  if (hidden) return `<div class="card back-card ${small ? "small-card" : ""} ${muted ? "muted-card" : ""}" aria-label="Unknown card"><span class="back-mark">?</span></div>`;
  return `<div class="card ${cardColor(cardName)} ${small ? "small-card" : ""} ${muted ? "muted-card" : ""}" aria-label="${cardLabel(cardName)}, ${points(cardName)} points"><span class="card-rank">${escape(cardName.slice(0, -1))}</span><span class="card-suit">${escape(code(cardName).slice(cardName.slice(0, -1).length))}</span>${caption ? `<span class="card-caption">${escape(caption)}</span>` : ""}</div>`;
}

function handCards(known = scenario().known, selected = null) {
  return `<div class="hand">${known.map((value, index) => `<div class="hand-slot ${selected === index ? "is-focus" : ""}">${value ? card(value) : card(null, { hidden: true })}<span class="slot-label">Position ${index + 1}</span></div>`).join("")}</div>`;
}

function tableScene() {
  const s = scenario();
  return `<div class="table-scene">
    <div class="opponents"><div class="opponent"><span class="avatar">1</span><span>${s.opponent[0]}<small>4 hidden</small></span></div><div class="opponent"><span class="avatar">2</span><span>${s.opponent[1]}<small>4 hidden</small></span></div></div>
    <div class="piles"><div class="pile"><span class="object-label">Draw pile</span>${card(null, { hidden: true, small: true })}<span class="sub-label">39 cards</span></div><span class="or">or</span><div class="pile"><span class="object-label">Top discard</span>${card(s.top, { small: true })}<span class="sub-label">${points(s.top)} points</span></div></div>
    <div class="you-label">Your hand <span>2 known · 2 unknown</span></div>${handCards()}</div>`;
}

function axis(visible = []) {
  const seen = new Set(visible);
  return `<div class="axis" role="img" aria-label="The 52 cards in one fixed order, grouped by suit">${SUITS.map((suit) => `<div class="axis-row"><span class="axis-suit ${suit.color}">${suit.symbol}</span><div class="axis-cards">${DECK.filter((deckCard) => deckCard.endsWith(suit.code)).map((deckCard) => `<span class="axis-cell ${seen.has(deckCard) ? "seen" : ""}" title="${cardLabel(deckCard)}">${deckCard.slice(0, -1)}</span>`).join("")}</div></div>`).join("")}</div>`;
}

function note(label, html) { return `<div class="plain-note"><span class="note-label">${label}</span><p>${html}</p></div>`; }
function stat(value, label) { return `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`; }
function formula(plain, math) { return `<div class="formula"><span>${plain}</span><code>${math}</code></div>`; }

function positionDiagram() {
  const opponents = scenario().opponent;
  const collections = [
    ["Your hand", 4, "H₁"], [`${opponents[0]}'s hand`, 4, "H₂"], [`${opponents[1]}'s hand`, 4, "H₃"],
    ["Draw pile", 39, "D"], ["Discard pile", 1, "P"],
  ];
  return `<div class="positions"><div class="positions-heading"><span>Collection</span><span>Occupied positions</span><span>Rows in Q</span></div>${collections.map(([name, count, symbol]) => `<div class="position-row"><strong>${name}<small>${symbol}</small></strong><div class="occupancy"><span style="width:${count / 52 * 100}%"></span></div><span>${count} / 52</span></div>`).join("")}</div><div class="total-line">${stat("52", "occupied positions")}${stat("260", "possible rows")}${stat("52", "card columns")}</div>`;
}

function rowInspector(after = false) {
  const s = scenario();
  const a = info();
  const data = beliefRows(s, a, after ? result() : null);
  const row = data.rows.find((item) => item.id === state.selectedRow) || data.rows[2];
  const isCertain = Boolean(row.card);
  const rowDescription = isCertain
    ? `<strong>${cardLabel(row.card)} is certain here.</strong> Its column is 100%. Every other card is 0%.`
    : `<strong>We do not know this card.</strong> Each of the ${data.unseen.length} unseen cards has ${pct(1 / data.unseen.length)} probability here. The ${52 - data.unseen.length} observed cards have 0%.`;
  return `<div class="inspector"><div class="row-tabs" role="tablist" aria-label="Choose a position">${data.rows.map((item) => `<button type="button" role="tab" data-row="${item.id}" aria-selected="${item.id === row.id}" class="row-tab ${item.id === row.id ? "active" : ""}">${item.id === "P" ? "Discard" : item.id === "D1" ? "Draw" : `Slot ${item.id.slice(1)}`}</button>`).join("")}</div><div class="row-explanation"><span>Q row: ${row.id}</span><p>${rowDescription}</p></div><div class="q-axis">${SUITS.map((suit) => `<div class="q-suit-group"><span class="q-suit ${suit.color}">${suit.symbol}</span><div class="q-cells">${DECK.filter((deckCard) => deckCard.endsWith(suit.code)).map((deckCard) => { const p = probabilityAt(row, deckCard, data.unseen); return `<span class="q-cell ${p === 1 ? "certain" : p > 0 ? "possible" : "excluded"}" title="${cardLabel(deckCard)}: ${pct(p)}" aria-label="${cardLabel(deckCard)} ${pct(p)}">${deckCard.slice(0, -1)}</span>`; }).join("")}</div></div>`).join("")}</div><div class="legend"><span><i class="legend-box certain"></i>100%</span><span><i class="legend-box possible"></i>${pct(1 / data.unseen.length)}</span><span><i class="legend-box excluded"></i>0%</span></div></div>`;
}

function meanList() {
  const a = info();
  return `<div class="mean-list">${a.handMeans.map((mean, index) => `<div class="mean-row"><span class="mean-position">Position ${index + 1}</span>${scenario().known[index] ? card(scenario().known[index], { small: true }) : card(null, { small: true, hidden: true })}<span class="mean-math">${scenario().known[index] ? `${points(scenario().known[index])} × 100%` : `Σ possible cards × 1/49`}</span><strong>${fmt(mean)} <small>points</small></strong></div>`).join("")}</div>`;
}

function topOptions() {
  const a = info();
  const target = state.selectedTarget ?? a.topBest.index;
  return `<div class="swap-summary"><div class="swap-card"><span>Take</span>${card(scenario().top, { small: true })}<strong>${points(scenario().top)} pts</strong></div><span class="swap-arrow">→</span><div class="swap-target"><span>Replace position ${target + 1}</span>${scenario().known[target] ? card(scenario().known[target], { small: true }) : card(null, { small: true, hidden: true })}<strong>${fmt(a.topCandidates[target].ev, true)} expected points saved</strong></div></div><div class="target-list">${a.topCandidates.map((candidate) => `<button type="button" data-target="${candidate.index}" class="target-row ${target === candidate.index ? "active" : ""}"><span>Position ${candidate.index + 1}${scenario().known[candidate.index] ? ` · ${cardLabel(scenario().known[candidate.index])}` : " · unknown"}</span><strong>${fmt(candidate.ev, true)}</strong></button>`).join("")}</div>`;
}

function drawTree() {
  const a = info();
  return `<div class="draw-tree"><div class="draw-start">${card(null, { hidden: true, small: true })}<span>One of <strong>${a.unseen.length}</strong> unseen cards</span></div><div class="branch-lines" aria-hidden="true"></div><div class="branches"><div class="branch"><span class="branch-symbol">↙</span><strong>Helpful draw</strong><p>Swap it into the position that saves the most points.</p></div><div class="branch"><span class="branch-symbol">↘</span><strong>Unhelpful draw</strong><p>Discard it. Your hand points do not rise.</p></div></div></div><div class="draw-average"><span>Average across all ${a.unseen.length} possible draws</span><strong>${fmt(a.drawEV, true)} <small>points saved</small></strong></div>`;
}

function decisions() {
  const a = info();
  const selected = state.choice;
  const recommendation = a.recommendation;
  return `<div class="decision-list"><button type="button" data-choice="top" class="decision-option ${selected === "top" ? "chosen" : ""}"><span class="decision-text"><small>Take discard · best position ${a.topBest.index + 1}</small><strong>${cardLabel(scenario().top)} in your hand</strong></span><span class="decision-value">${fmt(a.topBest.ev, true)}<small>EV</small></span></button><button type="button" data-choice="draw" class="decision-option ${selected === "draw" ? "chosen" : ""}"><span class="decision-text"><small>Draw first · decide after seeing it</small><strong>Keep the option to discard</strong></span><span class="decision-value">${fmt(a.drawEV, true)}<small>EV</small></span></button></div>${selected ? `<div class="choice-feedback"><strong>${recommendation === "top" ? "The model chooses the discard." : "The model chooses the draw."}</strong><span>${selected === recommendation ? "Your choice has the higher average point reduction." : "Your choice can still work on a particular reveal, but its average is lower."}</span></div>` : `<p class="select-prompt">Tap an action to make your choice.</p>`}`;
}

function reveal() {
  const s = scenario();
  const a = info();
  const o = result();
  const before = o.target === null ? null : s.known[o.target] || s.hidden[o.target];
  return `<div class="reveal"><div class="reveal-cards"><div><span>Card entering hand</span>${o.target === null ? card(o.incoming, { small: true, muted: true }) : card(o.incoming, { small: true })}</div><span class="swap-arrow">→</span><div><span>Card on discard</span>${card(o.outgoing, { small: true })}</div></div><p>${o.target === null ? `You drew ${cardLabel(o.incoming)} and discarded it. No hand card changed.` : `Position ${o.target + 1} held ${cardLabel(before)}. You replaced it with ${cardLabel(o.incoming)}.`}</p><div class="result-stats">${stat(`${fmt(o.expected, true)}`, "expected points saved")}${stat(`${fmt(o.realized, true)}`, "points saved this time")}${stat(`${beliefRows(s, a, o).unseen.length}`, "still unseen")}</div></div>`;
}

function content() {
  const s = scenario();
  const a = info();
  switch (state.step) {
    case 0: return [tableScene(), note("The question", `Which move is expected to remove more points from your hand? Aces are 1, Jacks 11, Queens 12, black Kings 13, and red Kings 0.`)];
    case 1: return [axis([s.top, ...s.known.filter(Boolean)]), note("Why the order matters", `Column 1 is always A♣ and column 52 is always K♠. Every row of Q uses this same card axis. The highlighted cards are the ones you have seen.`)];
    case 2: return [positionDiagram(), note("Shape of Q", `With three players, Q has 5 collections × 52 possible positions = <strong>260 rows</strong>. Each row has 52 card probabilities. Empty positions remain as zero rows.`)];
    case 3: return [`<div class="visibility"><div><span>What you see</span><div class="visible-cards">${card(s.known[0], { small: true })}${card(s.known[1], { small: true })}${card(s.top, { small: true })}</div></div><div><span>What you do not see</span><div class="hidden-count">${stat("49", "unseen cards")}${stat("49", "unknown occupied positions")}</div></div></div>`, note("The constraint", `The deck has one copy of each card. A card you have seen cannot be in another unknown position. The 49 unseen cards must fill the 49 unknown occupied positions, without replacement.`)];
    case 4: return [rowInspector(), note("Read one row", `A row's probabilities add to 1 when its position is occupied. These are <em>marginal</em> probabilities: unknown positions are linked because the same card cannot occupy two places.`)];
    case 5: return [meanList(), formula("Expected points for a position", "μ(h) = Σ Q(h,j) × vⱼ") + note("In plain words", `For a known card, the answer is just its point value. For an unknown position here, it is the average of the ${a.unseen.length} unseen card values: <strong>${fmt(a.unknownMean)} points</strong>.`)];
    case 6: return [topOptions(), formula("Expected gain from replacing position h", "EV(top,h) = μ(h) − points(top)") + note("Pick a target", `Tap each position to see its gain. The best discard swap is position <strong>${a.topBest.index + 1}</strong> at <strong>${fmt(a.topBest.ev, true)} points</strong>. A negative gain means your expected hand gets worse.`)];
    case 7: return [drawTree(), note("Why drawing has value", `For each possible drawn card, update what remains unseen, then choose the best swap or discard the draw. Average those best responses to get <strong>${fmt(a.drawEV, true)} expected points saved</strong>.`)];
    case 8: return [decisions(), note("Decision rule", `Compare <strong>${fmt(a.topBest.ev, true)}</strong> for the best top discard swap with <strong>${fmt(a.drawEV, true)}</strong> for drawing. Choose the larger expected reduction. This does not predict a guaranteed result.`)];
    default: {
      const o = result();
      const seenBefore = new Set([s.top, ...s.known.filter(Boolean)]);
      const newlySeen = [...new Set([o.incoming, o.outgoing])].filter((cardName) => !seenBefore.has(cardName));
      const observation = newlySeen.length === 0
        ? `Both moved cards were already known, so no new card identity was learned.`
        : `You newly saw ${newlySeen.map(cardLabel).join(" and ")}. ${newlySeen.length === 1 ? "That card is" : "Those cards are"} removed from every other unknown row.`;
      return [reveal() + rowInspector(true), note("The update", `${observation} The outgoing card is now the top discard. ${beliefRows(s, a, o).unseen.length} cards remain unseen.`)];
    }
  }
}

function render() {
  const s = scenario();
  const step = STEPS[state.step];
  els["chapter-label"].textContent = `SCENARIO ${s.number} · ${s.title.toUpperCase()}`;
  els["step-count"].textContent = `${String(state.step + 1).padStart(2, "0")} / ${STEPS.length}`;
  els["slide-kicker"].textContent = step[0];
  els["slide-title"].textContent = step[1];
  els["slide-intro"].textContent = step[2];
  els["progress"].innerHTML = STEPS.map((_, index) => `<span class="progress-segment ${index <= state.step ? "active" : ""}" aria-hidden="true"></span>`).join("");
  const [visual, explain] = content();
  els["visual"].innerHTML = visual;
  els["explain"].innerHTML = explain;
  els["back-button"].disabled = state.step === 0;
  els["next-button"].disabled = state.step === 8 && !state.choice;
  els["next-button"].innerHTML = state.step === 9 ? `Next scenario <span aria-hidden="true">→</span>` : state.step === 8 ? `See what happens <span aria-hidden="true">→</span>` : `Continue <span aria-hidden="true">→</span>`;
  els["scenario-select"].value = s.id;
  els["visual"].querySelectorAll("[data-row]").forEach((button) => button.addEventListener("click", () => { state.selectedRow = button.dataset.row; render(); }));
  els["visual"].querySelectorAll("[data-target]").forEach((button) => button.addEventListener("click", () => { state.selectedTarget = Number(button.dataset.target); render(); }));
  els["visual"].querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => { state.choice = button.dataset.choice; render(); }));
}

function selectScenario(index) {
  state.scenarioIndex = (index + SCENARIOS.length) % SCENARIOS.length;
  state.step = 0;
  state.selectedRow = "H3";
  state.selectedTarget = null;
  state.choice = null;
  history.replaceState(null, "", `#${scenario().id}`);
  render();
  requestAnimationFrame(() => window.scrollTo(0, 0));
}
function go(step) {
  if (step < 0 || step >= STEPS.length || (step === 9 && !state.choice)) return;
  state.step = step;
  if (step === 4) state.selectedRow = "H3";
  if (step === 9) state.selectedRow = result().target === null ? "P" : `H${result().target + 1}`;
  render();
  requestAnimationFrame(() => window.scrollTo(0, 0));
}

els["scenario-select"].innerHTML = SCENARIOS.map((entry) => `<option value="${entry.id}">${entry.number} · ${entry.title}</option>`).join("");
els["scenario-select"].addEventListener("change", (event) => selectScenario(SCENARIOS.findIndex((entry) => entry.id === event.target.value)));
els["back-button"].addEventListener("click", () => go(state.step - 1));
els["next-button"].addEventListener("click", () => state.step === 9 ? selectScenario(state.scenarioIndex + 1) : go(state.step + 1));
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(document.activeElement?.tagName)) return;
  if (event.key === "ArrowRight") { event.preventDefault(); state.step === 9 ? selectScenario(state.scenarioIndex + 1) : go(state.step + 1); }
  if (event.key === "ArrowLeft") { event.preventDefault(); go(state.step - 1); }
});
window.addEventListener("hashchange", () => {
  const index = SCENARIOS.findIndex((entry) => `#${entry.id}` === location.hash);
  if (index >= 0 && index !== state.scenarioIndex) selectScenario(index);
});
history.scrollRestoration = "manual";
render();
requestAnimationFrame(() => window.scrollTo(0, 0));
