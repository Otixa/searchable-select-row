import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalise,
  matchOptions,
  mergeRanges,
  highlightParts,
} from "../searchable-select-row.js";

const TEAS = [
  "—",
  "Assam",
  "Crème Brûlée Rooibos",
  "Darjeeling First Flush",
  "Earl Grey",
  "Earl Grey Cream",
  "Lady Grey",
  "Sencha",
];

const names = (matches) => matches.map((m) => m.option);

test("normalise lower-cases and strips diacritics", () => {
  assert.equal(normalise("Crème Brûlée"), "creme brulee");
  assert.equal(normalise(42), "42");
});

test("empty query lists every option in order, minus the excluded one", () => {
  assert.deepEqual(names(matchOptions(TEAS, "", { exclude: "—" })), TEAS.slice(1));
  assert.deepEqual(names(matchOptions(TEAS, "   ", { exclude: "—" })), TEAS.slice(1));
});

test("without exclude, every option is listed", () => {
  assert.deepEqual(names(matchOptions(TEAS, "")), TEAS);
});

test("words match anywhere, in any order", () => {
  assert.deepEqual(names(matchOptions(TEAS, "grey earl")), ["Earl Grey", "Earl Grey Cream"]);
  assert.deepEqual(names(matchOptions(TEAS, "cream grey")), ["Earl Grey Cream"]);
});

test("matching ignores case and accents in both directions", () => {
  assert.deepEqual(names(matchOptions(TEAS, "CREME")), ["Crème Brûlée Rooibos"]);
  assert.deepEqual(names(matchOptions(["Creme"], "crème")), ["Creme"]);
});

test("no match returns an empty list", () => {
  assert.deepEqual(matchOptions(TEAS, "matcha"), []);
});

test("prefix matches rank first, then word starts, then anything", () => {
  // One prefix match, three word-start matches, one mid-word match.
  const opts = ["Oolong greyish", "Earl Grey", "Lady Grey", "Grey Lady", "Ungrey"];
  assert.deepEqual(names(matchOptions(opts, "grey")), [
    "Grey Lady",
    "Oolong greyish",
    "Earl Grey",
    "Lady Grey",
    "Ungrey",
  ]);
});

test("regex characters in the query are matched literally", () => {
  const opts = ["C++ blend", "Cx blend", "(special)"];
  assert.deepEqual(names(matchOptions(opts, "c++")), ["C++ blend"]);
  assert.deepEqual(names(matchOptions(opts, "(spec")), ["(special)"]);
});

test("ranges point at each word's first match", () => {
  const [m] = matchOptions(["Earl Grey Cream"], "cream earl");
  assert.deepEqual(m.ranges, [[10, 15], [0, 4]]);
});

test("mergeRanges sorts and joins overlapping or touching ranges", () => {
  assert.deepEqual(mergeRanges([[5, 8], [0, 2], [1, 3], [8, 9]]), [[0, 3], [5, 9]]);
  assert.deepEqual(mergeRanges([]), []);
});

test("mergeRanges does not mutate its input", () => {
  const input = [[3, 5], [0, 4]];
  mergeRanges(input);
  assert.deepEqual(input, [[3, 5], [0, 4]]);
});

test("highlightParts splits an option into matched and unmatched runs", () => {
  const [m] = matchOptions(["Earl Grey Cream"], "grey");
  assert.deepEqual(highlightParts(m.option, m.ranges), [
    { text: "Earl ", match: false },
    { text: "Grey", match: true },
    { text: " Cream", match: false },
  ]);
});

test("highlightParts keeps the original accented characters", () => {
  const [m] = matchOptions(["Crème Brûlée"], "brulee");
  assert.deepEqual(highlightParts(m.option, m.ranges), [
    { text: "Crème ", match: false },
    { text: "Brûlée", match: true },
  ]);
});

test("highlightParts gives up rather than mis-highlighting when lengths shift", () => {
  // Decomposed input: normalising drops the combining mark, so indices drift.
  const decomposed = "Crème";
  const [m] = matchOptions([decomposed], "me");
  assert.deepEqual(highlightParts(m.option, m.ranges), [{ text: decomposed, match: false }]);
});

test("highlightParts with no ranges returns the whole option", () => {
  assert.deepEqual(highlightParts("Assam", []), [{ text: "Assam", match: false }]);
});
