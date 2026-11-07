import assert from "node:assert/strict";
import { SCENARIOS, DECK, analyze, beliefRows, outcomeFor, points, probabilityAt } from "../public/dutch-game-modeling/model.mjs";

const expected = [
  ["red-king", "top", 9.000, 2.980],
  ["costly-jack", "draw", -4.469, 1.661],
  ["close-call", "draw", 2.000, 2.449],
  ["blind-slot", "top", 4.755, 1.633],
];

for (const [index, scenario] of SCENARIOS.entries()) {
  const result = analyze(scenario);
  const [id, recommendation, top, draw] = expected[index];
  assert.equal(scenario.id, id);
  assert.equal(result.recommendation, recommendation);
  assert.ok(Math.abs(result.topBest.ev - top) < .001);
  assert.ok(Math.abs(result.drawEV - draw) < .001);
  assert.equal(result.unseen.length, 49);

  const totalUnknownPoints = result.unseen.reduce((sum, card) => sum + points(card), 0);
  const averagePosterior = result.drawOutcomes.reduce((sum, item) => sum + item.conditionedMean, 0) / 49;
  assert.ok(Math.abs(averagePosterior - totalUnknownPoints / 49) < 1e-10);

  for (const choice of ["top", "draw"]) {
    const outcome = outcomeFor(scenario, result, choice);
    const state = beliefRows(scenario, result, outcome);
    for (const row of state.rows) {
      const total = DECK.reduce((sum, card) => sum + probabilityAt(row, card, state.unseen), 0);
      assert.ok(Math.abs(total - 1) < 1e-10, `${id}: ${row.id} does not sum to one`);
    }
  }

  const initial = beliefRows(scenario, result);
  const knownRows = initial.rows.filter((row) => row.card);
  const unknownRow = initial.rows.find((row) => row.id === "H3");
  for (const card of DECK) {
    const mass = knownRows.reduce((sum, row) => sum + probabilityAt(row, card, initial.unseen), 0)
      + 49 * probabilityAt(unknownRow, card, initial.unseen);
    assert.ok(Math.abs(mass - 1) < 1e-10, `${id}: card ${card} is not conserved`);
  }
  console.log(`${id}: take ${result.topBest.ev.toFixed(3)}, draw ${result.drawEV.toFixed(3)}, choose ${recommendation}`);
}

console.log("All scenario and probability checks passed.");
