// Generates backup-slides.md from content.js. Run: node build-backup.js
const fs = require("fs");
const path = require("path");

function generate(G) {
  const LETTERS = ["A", "B", "C", "D"];
  const terms = G.italicTerms.slice().sort((a, b) => b.length - a.length)
    .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp("(?<![A-Za-z0-9])(" + terms.join("|") + ")(?![A-Za-z0-9])", "g");
  const it = s => s.replace(re, "*$1*");
  const tag = t => (t ? " `" + t + "`" : "");

  function card(ids) {
    const paras = [];
    ids.forEach(id => {
      const segs = G.cards[id];
      if (!segs) throw new Error("Missing card: " + id);
      segs.forEach(sg => {
        const h = it(sg.text) + tag(sg.tag);
        if (sg.join && paras.length) paras[paras.length - 1] += (/^[,.;:)]/.test(sg.text) ? "" : " ") + h;
        else paras.push(h);
      });
    });
    return paras.map(p => "> " + p).join("\n>\n");
  }

  const out = [];
  out.push("# " + G.meta.title, "", G.meta.subtitle, "");
  out.push("<!-- Generated from content.js by build-backup.js. Do not edit by hand. -->", "");
  out.push("## Facts", "", it(G.facts.common), "", "**First Email:** " + it(G.facts.first), "",
    "**Second Email:** " + it(G.facts.second), "", "**The question:** " + it(G.facts.question), "");

  Object.keys(G.emails).forEach(key => {
    const e = G.emails[key];
    out.push("---", "", "# " + e.title, "");
    const sc = G.scenes && G.scenes[key];
    if (sc) {
      out.push("## Story", "");
      sc.beats.forEach(b => {
        const who = b.speaker === "narrator" ? G.ui.narrator : G.characters[b.speaker].name;
        if (b.email) out.push("**" + who + " to " + G.characters[b.email.to].name + " (" + b.email.subject + "):**", "", b.lines.map(l => "> " + it(l)).join("\n>\n"), "");
        else out.push("**" + who + ":** " + it(b.text), "");
      });
    }
    e.nodes.forEach((id, idx) => {
      const n = G.nodes[id];
      out.push("## Node " + idx + ": " + n.stage, "", "**" + it(n.question) + "**", "");
      n.choices.forEach((c, i) => out.push("- " + LETTERS[i] + ". " + it(c.label) + " `" + c.type + "`"));
      out.push("");
      if (n.sharedCard) {
        const ci = n.choices.findIndex(c => c.type === "CORRECT");
        out.push("**Card (all options). Answer: " + LETTERS[ci] + ".**", "", card(n.sharedCard), "");
      }
      n.choices.forEach((c, i) => {
        if (!c.card) return;
        out.push("**" + LETTERS[i] + ". " + it(c.label) + "** `" + c.type + "`", "", card(c.card), "");
        if (c.rebuttal) out.push("*" + G.ui.interstitial + "*", "", "**" + G.ui.rebuttal + "**", "", card(c.rebuttal), "");
        if (c.followUp) out.push("*" + G.ui.routesConverge + "*", "", "**" + c.followUp.label + "**", "", card(c.followUp.card), "");
      });
    });
    out.push("## " + e.verdict.title, "", "**" + it(e.verdict.headline) + "**", "");
    e.verdict.body.forEach(p => out.push(it(p), ""));
    out.push("*" + G.ui.routesConverge + "*", "");
    if (e.whatIf) {
      const n = G.nodes[e.whatIf];
      out.push("## " + G.ui.whatIf + " (optional, not scored)", "", "**" + it(n.question) + "**", "");
      n.choices.forEach((c, i) => out.push("- " + LETTERS[i] + ". " + it(c.label) + " `" + c.type + "`"));
      out.push("");
      n.choices.forEach((c, i) => out.push("**" + LETTERS[i] + ". " + it(c.label) + "** `" + c.type + "`", "", card(c.card), ""));
    }
  });

  out.push("---", "", "# " + G.ui.debrief + ": " + G.debrief.title, "");
  G.debrief.panels.forEach((p, i) => out.push("## " + (i + 1) + ". " + it(p.title), "", card(p.card), ""));
  out.push("**" + it(G.debrief.finalLine) + "**", "");
  return out.join("\n");
}

module.exports = generate;

if (require.main === module) {
  const G = require("./content.js");
  fs.writeFileSync(path.join(__dirname, "backup-slides.md"), generate(G));
  console.log("Wrote backup-slides.md");
}
