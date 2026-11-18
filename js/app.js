const $ = id => document.getElementById(id);
let token = null; // kept in memory only: never saved to the browser

$("enter").addEventListener("click", () => {
  $("home").hidden = true; $("gate").hidden = false; $("answer").focus();
  document.querySelector('nav a[href="#gate"]').setAttribute("aria-current", "page");
});

$("gateForm").addEventListener("submit", async e => {
  e.preventDefault();
  const msg = $("msg"), answer = $("answer").value.trim();
  msg.className = "";
  if (!answer) { msg.textContent = "PLEASE ENTER THE NAME OF YOUR NATION"; msg.className = "bad"; return; }
  if (!window.SITE.workerUrl) { msg.textContent = "CHECKPOINT NOT YET CONNECTED"; msg.className = "bad"; return; }
  msg.textContent = "VERIFYING CREDENTIALS…";
  try {
    const r = await fetch(SITE.workerUrl + "/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer }) });
    const d = await r.json().catch(() => ({}));
    $("answer").value = "";
    if (d.ok) { token = d.token; msg.textContent = "ACCESS GRANTED"; msg.className = "ok"; await openChamber(); }
    else { msg.textContent = r.status === 429 ? "TOO MANY ATTEMPTS — PLEASE WAIT AND TRY AGAIN LATER" : "ACCESS DENIED — PLEASE TRY AGAIN"; msg.className = "bad"; }
  } catch { msg.textContent = "CONNECTION ERROR — PLEASE TRY AGAIN"; msg.className = "bad"; }
});

async function openChamber() {
  const r = await fetch(SITE.workerUrl + "/chamber", { headers: { Authorization: "Bearer " + token } });
  const d = await r.json();
  if (!d.ok) { $("msg").textContent = "SESSION EXPIRED — PLEASE VERIFY AGAIN"; $("msg").className = "bad"; return; }
  await new Promise(res => setTimeout(res, 900));
  $("gate").hidden = true;
  $("chamber-body").innerHTML = d.html;
  $("chamber").hidden = false;
  $("chamber").focus();
  $("dlpdf").addEventListener("click", downloadPdf); initChamber();
}

async function downloadPdf() {
  const m = $("dlmsg");
  try {
    const r = await fetch(SITE.workerUrl + "/pdf", { headers: { Authorization: "Bearer " + token } });
    if (!r.ok) throw 0;
    const url = URL.createObjectURL(await r.blob());
    const a = Object.assign(document.createElement("a"), { href: url, download: "Restoration-Resolution-HR-TR-2026-001.pdf" });
    a.click(); URL.revokeObjectURL(url);
    m.textContent = "DOWNLOAD STARTED";
  } catch { m.textContent = "DOWNLOAD FAILED — PLEASE VERIFY AGAIN"; }
}
