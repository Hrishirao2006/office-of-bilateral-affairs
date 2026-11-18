// Runs after the chamber content loads. Handles viewer controls and the decision form.
function initChamber() {
  const q = s => document.querySelector(s), all = s => document.querySelectorAll(s);
  q("#expandAll").onclick = () => all(".art").forEach(d => d.open = true);
  q("#collapseAll").onclick = () => all(".art").forEach(d => d.open = false);
  all(".chnav a").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); q(a.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
  }));
  const text = () => {
    const d = q('input[name="dec"]:checked'), r = q("#remarks").value.trim();
    if (!d) return null;
    return "RESOLUTION HR-TR/2026/001 — DECISION OF HER SUPREME EXCELLENCY\n\n" + d.value + (r ? "\n\nREMARKS:\n" + r : "");
  };
  const say = m => q("#decMsg").textContent = m;
  q("#decCopy").onclick = async () => {
    const t = text(); if (!t) return say("PLEASE SELECT A DECISION FIRST. NOTHING HAS BEEN COPIED.");
    try { await navigator.clipboard.writeText(t); say("COPIED. NOTHING HAS BEEN SENT."); }
    catch { say("COPY NOT AVAILABLE — USE DOWNLOAD INSTEAD."); }
  };
  q("#decSave").onclick = () => {
    const t = text(); if (!t) return say("PLEASE SELECT A DECISION FIRST. NOTHING HAS BEEN SAVED.");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([t], { type: "text/plain" })), download: "Decision-HR-TR-2026-001.txt" });
    a.click(); URL.revokeObjectURL(a.href); say("DOWNLOADED. NOTHING HAS BEEN SENT.");
  };
}
