export const SUITS = [
  { code: "C", symbol: "♣", name: "clubs", color: "black" },
  { code: "D", symbol: "♦", name: "diamonds", color: "red" },
  { code: "H", symbol: "♥", name: "hearts", color: "red" },
  { code: "S", symbol: "♠", name: "spades", color: "black" },
];

export const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export const DECK = SUITS.flatMap((suit) => RANKS.map((rank) => `${rank}${suit.code}`));

export function points(card) {
  const rank = card.slice(0, -1);
  const suit = card.slice(-1);
  if (rank === "K" && (suit === "D" || suit === "H")) return 0;
  if (rank === "A") return 1;
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  return Number(rank);
}

export function cardLabel(card) {
  if (!card) return "?";
  const suit = SUITS.find((entry) => entry.code === card.slice(-1));
  return `${card.slice(0, -1)}${suit.symbol}`;
}

export function cardColor(card) {
  return SUITS.find((entry) => entry.code === card.slice(-1)).color;
}

export const SCENARIOS = [
  {
    id: "red-king",
    number: "01",
    title: "The free king",
    kicker: "A certain upgrade",
    level: "OPENING HAND",
    top: "KH",
    known: ["9S", "2H", null, null],
    hidden: [null, null, "QS", "6D"],
    draw: "4C",
    opponent: ["PLAYER 1", "PLAYER 2"],
    story: "A red king sits on the discard pile. Your nine is already known. How much is that certain replacement worth?",
    insight: "A red king scores zero. Replacing the known nine cuts nine points immediately.",
  },
  {
    id: "costly-jack",
    number: "02",
    title: "The costly jack",
    kicker: "The draw has an option",
    level: "DRAW CHOICE",
    top: "JC",
    known: ["3C", "4D", null, null],
    hidden: [null, null, "8H", "10S"],
    draw: "2H",
    opponent: ["PLAYER 1", "PLAYER 2"],
    story: "The visible jack is expensive. Drawing gives you a chance to inspect a card before deciding what to keep.",
    insight: "Taking the jack forces a swap. Drawing lets you discard an unhelpful card at no immediate hand cost.",
  },
  {
    id: "close-call",
    number: "03",
    title: "The close call",
    kicker: "A small edge matters",
    level: "TIGHT DECISION",
    top: "6H",
    known: ["8C", "2S", null, null],
    hidden: [null, null, "QD", "3D"],
    draw: "7H",
    opponent: ["PLAYER 1", "PLAYER 2"],
    story: "A six would replace your eight for a sure two points. The draw is uncertain, but you get to react after seeing it.",
    insight: "The draw can be worth more than the sure swap because you keep the right to discard a poor draw.",
  },
  {
    id: "blind-slot",
    number: "04",
    title: "The blind slot",
    kicker: "Trust the probability",
    level: "HIDDEN HAND",
    top: "2C",
    known: ["5D", "KH", null, null],
    hidden: [null, null, "10C", "7H"],
    draw: "AS",
    opponent: ["PLAYER 1", "PLAYER 2"],
    story: "Your known cards are already low. A two on the discard pile may be best used to replace an unseen card.",
    insight: "An unknown slot can be the best target when its expected points exceed every known card's points.",
  },
];

function observedCards(scenario) {
  return new Set([scenario.top, ...scenario.known.filter(Boolean)]);
}

function averagePoints(cards) {
  return cards.reduce((total, card) => total + points(card), 0) / cards.length;
}

export function analyze(scenario) {
  const observed = observedCards(scenario);
  const unseen = DECK.filter((card) => !observed.has(card));
  const unknownMean = averagePoints(unseen);
  const handMeans = scenario.known.map((card) => card ? points(card) : unknownMean);
  const topCandidates = handMeans.map((mean, index) => ({ index, ev: mean - points(scenario.top) }));
  const topBest = topCandidates.reduce((best, next) => next.ev > best.ev ? next : best);

  const drawOutcomes = unseen.map((card) => {
    const remaining = unseen.filter((candidate) => candidate !== card);
    const conditionedMean = averagePoints(remaining);
    const candidates = scenario.known.map((knownCard, index) => ({
      index,
      gain: (knownCard ? points(knownCard) : conditionedMean) - points(card),
    }));
    const best = candidates.reduce((winner, next) => next.gain > winner.gain ? next : winner);
    return { card, gain: Math.max(0, best.gain), target: best.gain > 0 ? best.index : null, conditionedMean };
  });
  const drawEV = drawOutcomes.reduce((total, outcome) => total + outcome.gain, 0) / unseen.length;

  return {
    unseen,
    unknownMean,
    handMeans,
    topCandidates,
    topBest,
    drawOutcomes,
    drawEV,
    recommendation: topBest.ev > drawEV ? "top" : "draw",
  };
}

export function outcomeFor(scenario, analysis, choice) {
  if (choice === "top") {
    const target = analysis.topBest.index;
    const outgoing = scenario.known[target] || scenario.hidden[target];
    return {
      choice,
      target,
      incoming: scenario.top,
      outgoing,
      realized: points(outgoing) - points(scenario.top),
      expected: analysis.topBest.ev,
      action: `Swapped the discard into slot ${target + 1}`,
    };
  }

  const draw = analysis.drawOutcomes.find((item) => item.card === scenario.draw);
  if (!draw) throw new Error("The scenario draw must be an unseen card.");
  const target = draw.target;
  const outgoing = target === null ? scenario.draw : scenario.known[target] || scenario.hidden[target];
  return {
    choice,
    target,
    incoming: scenario.draw,
    outgoing,
    realized: target === null ? 0 : points(outgoing) - points(scenario.draw),
    expected: analysis.drawEV,
    conditionalGain: draw.gain,
    action: target === null ? "Discarded the drawn card" : `Swapped the draw into slot ${target + 1}`,
  };
}

export function beliefRows(scenario, analysis, outcome = null) {
  const known = [...scenario.known];
  let top = scenario.top;
  const observed = observedCards(scenario);
  if (outcome) {
    observed.add(outcome.incoming);
    observed.add(outcome.outgoing);
    top = outcome.outgoing;
    if (outcome.target !== null) known[outcome.target] = outcome.incoming;
  }
  const unseen = DECK.filter((card) => !observed.has(card));
  const rows = known.map((card, index) => ({ id: `H${index + 1}`, title: `YOUR SLOT ${index + 1}`, card, mean: card ? points(card) : averagePoints(unseen) }));
  rows.push({ id: "D1", title: "DRAW TOP", card: null, mean: averagePoints(unseen) });
  rows.push({ id: "P", title: "DISCARD TOP", card: top, mean: points(top) });
  return { rows, unseen, observed };
}

export function probabilityAt(row, card, unseen) {
  if (row.card) return row.card === card ? 1 : 0;
  return unseen.includes(card) ? 1 / unseen.length : 0;
}

for (const scenario of SCENARIOS) {
  const cards = [scenario.top, scenario.draw, ...scenario.known.filter(Boolean), ...scenario.hidden.filter(Boolean)];
  if (new Set(cards).size !== cards.length || cards.some((card) => !DECK.includes(card))) {
    throw new Error(`Invalid cards in scenario ${scenario.id}`);
  }
}
