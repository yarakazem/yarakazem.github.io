// Coded recreation of the Glyptik meeting-summary screen used in the thesis study.
// Renders Versions A, B and C, plus the redesign proposed in the product plan,
// from one set of meeting data. Clicking a source highlights its transcript line.
(() => {
  const ICONS = {
    "house": '<path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z"/>',
    "video-camera": '<path d="M251.77,73a8,8,0,0,0-8.21.39L208,97.05V72a16,16,0,0,0-16-16H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V159l35.56,23.71A8,8,0,0,0,248,184a8,8,0,0,0,8-8V80A8,8,0,0,0,251.77,73ZM192,184H32V72H192V184Zm48-22.95-32-21.33V116.28L240,95Z"/>',
    "calendar-blank": '<path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/>',
    "check-square": '<path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/>',
    "bell": '<path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"/>',
    "gear": '<path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"/>',
    "info": '<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>',
    "play-fill": '<path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"/>',
    "copy": '<path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/>',
    "arrow-square-out": '<path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"/>',
    "warning-circle": '<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"/>',
    "caret-left": '<path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>',
    "sparkle": '<path d="M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"/>',
    "share-fat": '<path d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z"/>',
    "lightbulb": '<path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z"/>',
    "list-checks": '<path d="M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.69,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"/>',
    "file-text": '<path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"/>',
    "shield-check": '<path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"/>',
  };
  const icon = (name, cls = "") => `<svg class="gx-i ${cls}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${ICONS[name]}</svg>`;

  const PEOPLE = {
    john: { name: "John Smith", initials: "JS", tone: "a" },
    nina: { name: "Nina Perez", initials: "NP", tone: "b" },
    alex: { name: "Alex Johnson", initials: "AJ", tone: "c" },
  };
  const avatar = (id, size = "") => `<span class="gx-avatar gx-tone-${PEOPLE[id].tone} ${size}" title="${PEOPLE[id].name}">${PEOPLE[id].initials}</span>`;

  // Demo meeting (fictional content, as in the study prototype)
  const TRANSCRIPT = [
    { ts: "00:00", who: "john", text: "Alright, let's get started. Today we'll finalize the dates and the steps ahead of our launch on May 15. Nina, could you update us on the prototype?" },
    { ts: "00:02", who: "nina", text: "The prototype is nearly finished; we're refining the UX. We expect to complete it by May 5, as planned." },
    { ts: "00:05", who: "john", text: "Thanks, Nina. Alex, how is the marketing campaign going?" },
    { ts: "00:06", who: "alex", text: "We're on track. Budget adjustments are ongoing, and we aim to finalize all campaign materials by May 10, pending final approval." },
    { ts: "00:08", who: "john", text: "Good. Let's keep May 15 locked for launch." },
    { ts: "00:12", who: "alex", text: "For paid ads we'll focus on Instagram, LinkedIn and Google Ads." },
    { ts: "00:17", who: "john", text: "Then internal review and engineering hand-off by May 3. Nina, can you share the final mock-ups by the 5th?" },
  ];
  const line = (ts) => TRANSCRIPT.find((l) => l.ts === ts);

  const POINTS = [
    { html: "<b>Launch date</b> locked for 15 May", ts: "00:00" },
    { html: "<b>UX prototype</b> completes 5 May", ts: "00:02" },
    { html: "<b>Internal review</b> and hand-off by 3 May", ts: "00:17" },
    { html: "<b>Marketing approval</b> aimed for 10 May", ts: "00:06", unsure: "Depends on final approval" },
    { html: "<b>Ad platforms:</b> Instagram, LinkedIn, Google Ads", ts: "00:12" },
  ];
  const TASKS = [
    { text: "Share final design mock-ups", owner: "nina", due: "5 May", ts: "00:17" },
    { text: "Internal review and engineering hand-off", owner: "john", due: "3 May", ts: "00:17" },
    { text: "Finalise campaign materials", owner: "alex", due: "10 May", ts: "00:06" },
  ];
  const SUMMARY = "The team locked <b>15 May</b> for launch, set the UX prototype for <b>5 May</b> and internal review for <b>3 May</b>, aimed for marketing approval by <b>10 May</b>, and chose <b>Instagram, LinkedIn and Google Ads</b> for paid ads.";

  const CAPTIONS = {
    a: { label: "Version A, minimal", bet: "A clean, neutral layout reads as credible. A small AI tag, plain lists, transcript behind a link.", result: "1 of 15 chose it. Most found it too thin to trust." },
    b: { label: "Version B, confidence", bet: "Telling people how sure the AI is earns trust. A confidence badge, a warning box, icons, transcript open.", result: "1 of 15 chose it. The badge split the room: 6 found it useful, 6 were confused or put off, 3 didn't notice it." },
    c: { label: "Version C, sources", bet: "Letting people check the AI beats asking them to believe it. Every point links to its moment in the meeting.", result: "10 of 15 chose it, and 13 of 15 valued the timestamps. The big warning banner still put 6 people off." },
    plan: { label: "Next, from the product plan", bet: "Show, don't vouch. A quiet label, a named source on every claim, uncertainty only where it's real, and tasks with owners.", result: "Designed from all 15 transcripts. Not yet tested with users." },
  };

  // ---------- Parts ----------
  const sidebar = () => `
    <nav class="gx-side" aria-hidden="true">
      <span class="gx-mark">G</span>
      ${["house", "video-camera", "calendar-blank", "check-square", "bell"].map((n, i) => `<span class="gx-side-i ${i === 1 ? "is-on" : ""}">${icon(n)}</span>`).join("")}
      <span class="gx-side-i gx-side-end">${icon("gear")}</span>
    </nav>`;

  const header = (v) => `
    <div class="gx-head">
      <div class="gx-head-row">
        <span class="gx-back">${icon("caret-left")}Back to meetings</span>
        ${v === "b" ? `<span class="gx-chip gx-chip-green">${icon("shield-check")}AI Confidence: High</span>` : ""}
        ${v === "plan" ? `<span class="gx-btn-ghost">${icon("share-fat")}Share</span>` : ""}
      </div>
      <h3 class="gx-title">Product Launch Planning</h3>
      <div class="gx-meta"><span>23 Apr 2025</span><span>11:00</span><span>45 min</span>
        <span class="gx-avatars">${avatar("john", "sm")}${avatar("nina", "sm")}${avatar("alex", "sm")}</span><span>3 members</span></div>
    </div>`;

  const disclosure = (v) => {
    if (v === "a") return `<span class="gx-tag">AI-generated. May contain errors</span>`;
    if (v === "b") return `<div class="gx-note">${icon("sparkle")}<div><b>AI-generated. May contain errors</b><span>This summary may be incomplete. Please double-check critical details with your team.</span></div></div>`;
    if (v === "c") return `<div class="gx-banner">${icon("sparkle", "gx-banner-i")}<div><b>AI-generated. May contain errors</b><span>Click the timestamps to read the transcript lines behind each point. Please verify anything critical before acting.</span><u>Learn more</u></div></div>`;
    return "";
  };

  const sectionTitle = (v, iconName, text, extra = "") => `
    <div class="gx-sec-title">${v === "b" ? icon(iconName, "gx-brand") : ""}<span>${text}</span>${extra}</div>`;

  const sourceBtn = (ts, v) => {
    const l = line(ts);
    if (v === "plan") return `<button type="button" class="gx-src" data-ts="${ts}" aria-label="Show source: ${PEOPLE[l.who].name} at ${ts}">${ts} · ${PEOPLE[l.who].name.split(" ")[0]}</button>`;
    return `<button type="button" class="gx-ts" data-ts="${ts}" aria-label="Jump to transcript at ${ts}">${ts}</button>${icon("info", "gx-info")}`;
  };

  const summary = (v) => `
    <section class="gx-sec">
      ${sectionTitle(v, "file-text", "Meeting summary",
        v === "c" ? `<span class="gx-chip gx-chip-brand">${icon("sparkle")}AI generated</span>` :
        v === "plan" ? `<span class="gx-chip gx-chip-brand">${icon("sparkle")}Summarized by Glyptik</span>` : "")}
      <p class="gx-p">${SUMMARY}</p>
    </section>`;

  const points = (v) => {
    const title = v === "b" ? "Highlights" : "Key points";
    const items = POINTS.map((p, i) => {
      const lead = v === "a" ? `<span class="gx-num">${i + 1}.</span>` : `<span class="gx-dot"></span>`;
      const src = v === "c" || v === "plan" ? sourceBtn(p.ts, v) : "";
      const unsure = v === "plan" && p.unsure ? `<span class="gx-chip gx-chip-amber" title="Why this is uncertain">${icon("warning-circle")}${p.unsure}</span>` : "";
      return `<li class="gx-li" data-row="${p.ts}">${lead}<span class="gx-li-body"><span class="gx-li-text">${p.html}</span>${src}${unsure}</span><span class="gx-quote" hidden></span></li>`;
    }).join("");
    return `<section class="gx-sec">${sectionTitle(v, "lightbulb", title)}<ul class="gx-ul">${items}</ul></section>`;
  };

  const tasks = (v) => {
    const action = v === "plan" ? `<span class="gx-sec-actions"><span class="gx-btn-ghost">${icon("copy")}Copy</span><span class="gx-btn-ghost">${icon("arrow-square-out")}Send to Jira</span></span>` : "";
    const title = v === "plan" ? "Tasks" : "Action items";
    const rows = TASKS.map((t) => {
      if (v === "a") return `<li class="gx-task"><span class="gx-check"></span><span>${t.text}</span><span class="gx-due-plain">${t.due}</span></li>`;
      if (v === "b") return `<li class="gx-task gx-task-box">${icon("check-square", "gx-muted-i")}<span>${t.text} by <b>${t.due}</b></span></li>`;
      const owner = `<span class="gx-owner">${avatar(t.owner, "sm")}${v === "plan" ? PEOPLE[t.owner].name.split(" ")[0] : ""}</span>`;
      const src = v === "plan" ? sourceBtn(t.ts, v) : "";
      return `<li class="gx-task gx-task-line" data-row="${t.ts}"><span class="gx-check"></span><span class="gx-task-text">${t.text}</span>${src}${owner}<span class="gx-due">${t.due}</span><span class="gx-quote" hidden></span></li>`;
    }).join("");
    return `<section class="gx-sec">${sectionTitle(v, "list-checks", title, action)}<ul class="gx-tasks">${rows}</ul></section>`;
  };

  const footer = (v) => v === "plan"
    ? `<p class="gx-foot">${icon("info")}Summaries can miss context. Every point links to its source. <u>How this works</u></p>` : "";

  const WAVE = Array.from({ length: 56 }, (_, i) => Math.round(28 + 22 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31)) + 18 * Math.abs(Math.sin(i * 2.3))));
  const recording = () => `
    <div class="gx-rec" aria-hidden="true">
      <span class="gx-play">${icon("play-fill")}</span>
      <div class="gx-wave">${WAVE.map((h) => `<i style="height:${h}%"></i>`).join("")}</div>
      <div class="gx-rec-meta"><span>Recording</span><span>45:12</span></div>
    </div>`;

  const transcript = (v) => {
    if (v === "a") return `<div class="gx-panel-foot"><span class="gx-link">View full transcript</span></div>`;
    const rows = TRANSCRIPT.map((l) => `
      <li class="gx-line" data-line="${l.ts}">
        <div class="gx-line-head">${avatar(l.who, "xs")}<b>${PEOPLE[l.who].name}</b><span class="gx-line-ts">${l.ts}</span></div>
        <p>${l.text}</p>
      </li>`).join("");
    return `<div class="gx-tr-head"><b>Transcript</b>${v === "plan" ? `<span class="gx-muted">Auto-generated, may mishear names</span>` : `<span class="gx-link">Hide transcript</span>`}</div><ol class="gx-tr" tabindex="0" aria-label="Transcript">${rows}</ol>`;
  };

  const render = (v) => `
    <div class="gx-chrome" aria-hidden="true"><span class="gx-lights"><i></i><i></i><i></i></span><span class="gx-url">glyptik.app/meetings/product-launch-planning</span></div>
    <div class="gx-body">
      ${sidebar()}
      <div class="gx-main">
        ${header(v)}
        ${disclosure(v)}
        ${summary(v)}
        ${points(v)}
        ${tasks(v)}
        ${footer(v)}
      </div>
      <aside class="gx-right">${recording()}${transcript(v)}</aside>
    </div>`;

  // ---------- Mount ----------
  document.querySelectorAll("[data-gx]").forEach((root) => {
    const win = root.querySelector(".gx");
    const tabs = [...root.querySelectorAll("[role=tab]")];
    const indicator = root.querySelector(".gx-tab-indicator");
    const cap = root.querySelector("[data-gx-caption]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interactive = !root.hasAttribute("data-gx-static");

    const moveIndicator = (tab) => {
      if (!indicator || !tab) return;
      indicator.style.width = `${tab.offsetWidth}px`;
      indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
    };

    const show = (v, focus) => {
      win.innerHTML = render(v);
      win.dataset.version = v;
      tabs.forEach((t) => {
        const on = t.dataset.v === v;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        if (on) { moveIndicator(t); if (focus) t.focus(); }
      });
      if (cap) {
        const c = CAPTIONS[v];
        cap.innerHTML = `<p class="meta">${c.label}</p><p class="mt-2 font-semibold">${c.bet}</p><p class="body mt-3 text-sm">${c.result}</p>${v !== "a" ? `<p class="meta mt-4">Try clicking a ${v === "plan" ? "source" : "timestamp"}.</p>` : ""}`;
      }
      if (!reduce && interactive) win.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    };

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(t.dataset.v));
      t.addEventListener("keydown", (e) => {
        const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const next = tabs[(i + step + tabs.length) % tabs.length];
        show(next.dataset.v, true);
      });
    });

    // Sources: highlight the transcript line; in the plan version also show the quote inline
    win.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-ts]");
      if (!btn) return;
      const ts = btn.dataset.ts;
      win.querySelectorAll(".gx-line.is-hit, [data-ts].is-on").forEach((el) => el.classList.remove("is-hit", "is-on"));
      btn.classList.add("is-on");
      const target = win.querySelector(`.gx-line[data-line="${ts}"]`);
      if (target) {
        target.classList.add("is-hit");
        const list = target.parentElement;
        list.scrollTo({ top: target.offsetTop - list.offsetTop - 8, behavior: reduce ? "auto" : "smooth" });
      }
      if (win.dataset.version === "plan") {
        const row = btn.closest("[data-row]");
        win.querySelectorAll(".gx-quote").forEach((q) => { if (!row || q.parentElement !== row) q.hidden = true; });
        const q = row?.querySelector(".gx-quote");
        if (q) {
          const l = line(ts);
          q.innerHTML = `“${l.text}” <span>${PEOPLE[l.who].name}, ${ts}</span>`;
          q.hidden = !q.hidden;
        }
      }
    });

    show(root.dataset.gx || "c");
    window.addEventListener("resize", () => moveIndicator(tabs.find((t) => t.getAttribute("aria-selected") === "true")));
    document.fonts?.ready.then(() => moveIndicator(tabs.find((t) => t.getAttribute("aria-selected") === "true")));
  });
})();
