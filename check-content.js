// Content checks. Run: node check-content.js   (exit code 1 on failure)
const fs = require("fs");
const path = require("path");
const G = require("./content.js");
const generate = require("./build-backup.js");

const errors = [];
const notes = [];
const TAGS = ["HOLDING", "OBITER", "COMMENTARY", "STATUTE"];
const TYPES = ["CORRECT", "ARGUABLE", "DEAD END", "VALID ROUTE"];
// Pinpoints: "at [63]", "at [14.115A]", "at 565", "at [75]-[76]"
const PINPOINT = /\bat \[\d+(\.\d+)?[A-Z]?\]|\bat \d{2,4}\b/;

// 1. No em dash or semicolon in any string in the content object.
(function walk(v, where) {
  if (typeof v === "string") {
    if (v.includes("—")) errors.push(`Em dash in ${where}: ${v.slice(0, 80)}`);
    if (v.includes(";")) errors.push(`Semicolon in ${where}: ${v.slice(0, 80)}`);
    if (/\bs \d/.test(v)) errors.push(`Spaced section reference in ${where}: ${v.slice(0, 80)}`);
  } else if (v && typeof v === "object") {
    for (const k of Object.keys(v)) walk(v[k], `${where}.${k}`);
  }
})(G, "GAME");

// Also no em dash in the UI shell.
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
if (html.includes("—")) errors.push("Em dash in index.html");
if (/<(script|link)[^>]+(src|href)=["']https?:/i.test(html)) errors.push("index.html makes an external request");

// 2. Card references and tags are valid.
for (const [id, segs] of Object.entries(G.cards)) {
  segs.forEach((s, i) => { if (s.tag && !TAGS.includes(s.tag)) errors.push(`Bad tag "${s.tag}" in card ${id}[${i}]`); });
}
const cardText = ids => ids.map(id => {
  if (!G.cards[id]) { errors.push(`Missing card id: ${id}`); return { text: "", tags: [] }; }
  return { text: G.cards[id].map(s => s.text).join(" "), tags: G.cards[id].map(s => s.tag).filter(Boolean) };
});
function checkScreen(ids, where, exempt) {
  const parts = cardText(ids);
  const text = parts.map(p => p.text).join(" ");
  const tags = parts.flatMap(p => p.tags);
  const ok = PINPOINT.test(text) || tags.includes("STATUTE");
  if (!ok) {
    if (exempt) notes.push(`Exempt (factsOnly): ${where}`);
    else errors.push(`No pinpoint or STATUTE tag: ${where}`);
  }
}

// 3. Every node has exactly one CORRECT. Every screen of cards has an authority.
for (const [id, n] of Object.entries(G.nodes)) {
  if (!G.stages.includes(n.stage)) errors.push(`Unknown stage "${n.stage}" in ${id}`);
  const correct = n.choices.filter(c => c.type === "CORRECT").length;
  const routes = n.choices.filter(c => c.type === "VALID ROUTE").length;
  // Either exactly one CORRECT, or (for a deliberate fork) no CORRECT and two or more VALID ROUTEs.
  if (!((correct === 1 && routes === 0) || (correct === 0 && routes >= 2)))
    errors.push(`Node ${id} has ${correct} CORRECT and ${routes} VALID ROUTE choices (needs exactly 1 CORRECT, or 2+ VALID ROUTE and no CORRECT)`);
  if (n.choices.length < 2 || n.choices.length > 4) errors.push(`Node ${id} has ${n.choices.length} choices`);
  if (n.sharedCard) checkScreen(n.sharedCard, `${id} shared card`);
  n.choices.forEach((c, i) => {
    const w = `${id} choice ${"ABCD"[i]}`;
    if (!TYPES.includes(c.type)) errors.push(`Bad type "${c.type}" at ${w}`);
    if (!c.card && !n.sharedCard) errors.push(`${w} has no card`);
    if (c.card) checkScreen(c.card, `${w} card`, c.factsOnly);
    if (c.type === "ARGUABLE" && !c.rebuttal && !n.sharedCard) errors.push(`${w} is ARGUABLE but has no rebuttal`);
    if (c.rebuttal) checkScreen(c.rebuttal, `${w} rebuttal`);
    if (c.followUp) checkScreen(c.followUp.card, `${w} follow-up`);
    if (c.followUp && c.type !== "VALID ROUTE") errors.push(`${w} has a followUp but is not a VALID ROUTE`);
  });
}
for (const [k, e] of Object.entries(G.emails)) {
  e.nodes.forEach(id => { if (!G.nodes[id]) errors.push(`Email ${k} references missing node ${id}`); });
  if (e.whatIf && !G.nodes[e.whatIf]) errors.push(`Email ${k} references missing whatIf node ${e.whatIf}`);
}
G.debrief.panels.forEach((p, i) => checkScreen(p.card, `debrief panel ${i + 1}`));

// 3b. Story scenes reference real characters.
for (const [k, sc] of Object.entries(G.scenes || {})) {
  if (!G.emails[k]) errors.push(`Scene for unknown email ${k}`);
  sc.cast.forEach(c => { if (!G.characters[c]) errors.push(`Scene ${k} cast has unknown character ${c}`); });
  sc.beats.forEach((b, i) => {
    const w = `scene ${k} beat ${i + 1}`;
    if (b.speaker !== "narrator" && !G.characters[b.speaker]) errors.push(`${w}: unknown speaker ${b.speaker}`);
    if (b.focus && !G.characters[b.focus]) errors.push(`${w}: unknown focus ${b.focus}`);
    if (b.email && !G.characters[b.email.to]) errors.push(`${w}: unknown email recipient ${b.email.to}`);
    if (!b.text && !(b.lines && b.lines.length)) errors.push(`${w}: no text`);
  });
}

// 4. backup-slides.md is generated from the current content.
const mdPath = path.join(__dirname, "backup-slides.md");
const expected = generate(G);
if (!fs.existsSync(mdPath)) errors.push("backup-slides.md missing. Run: node build-backup.js");
else if (fs.readFileSync(mdPath, "utf8") !== expected) errors.push("backup-slides.md is out of date. Run: node build-backup.js");

notes.forEach(n => console.log("NOTE  " + n));
if (errors.length) {
  errors.forEach(e => console.log("FAIL  " + e));
  console.log(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(`PASS  ${Object.keys(G.nodes).length} nodes, ${Object.keys(G.cards).length} cards, backup-slides.md in sync.`);
