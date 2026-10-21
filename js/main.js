const fleet = [
  ["Comfort Sedan","images/comfort-sedan.jpg","Up to 4 Passengers","e.g. Toyota Camry / Hybrid Executive","Smooth, quiet, climate-controlled ride ideal for single or dual daily commuters traveling between Dubai and Abu Dhabi."],
  ["Spacious 7-Seater Van / SUV","images/spacious-van.jpg","Up to 7 Passengers","e.g. Toyota Innova / Large MPV","Spacious seating and generous boot capacity designed for colleague carpools, families, and airport transfers with luggage."]
];
const prices = [
  ["Shared Daily Ride","AED 100","One-way (AED 100) or round trip (AED 180)",["Door-to-door pickup & drop","Regular morning & evening slots","All Salik tolls & fuel included"]],
  ["Monthly Commuter Pass","AED 2,500","Mon–Fri (20–22 workdays) morning drop & return",["Guaranteed daily reserved seat","Consistent driver & pickup time","Free pause option for leave"],true],
  ["Private Dedicated Ride","AED 200","Dedicated car reserved exclusively for you or your party",["Exclusive car (zero other stops)","Choose your exact departure time","Full boot space for luggage"]]
];
const from = ["Dubai Airport","Deira","Bur Dubai","Al Nahda","Dubai Marina","JLT","Business Bay","Downtown","International City","Al Quoz","Jebel Ali","Investment Park"];
const to = ["City Centre","Khalifa City","Mussafah","Yas Island","Al Reem Island","Al Maryah Island","Corniche","Al Bateen","Saadiyat Island","Zayed Sports City","Abu Dhabi Airport"];

const wa = t => "https://wa.me/" + CONFIG.phoneIntl + "?text=" + encodeURIComponent(t);
const $ = s => document.querySelectorAll(s);

if (typeof CONFIG !== "undefined") {
  $("[data-brand]").forEach(e => e.textContent = CONFIG.brand);
  $("[data-phone]").forEach(e => e.textContent = CONFIG.phoneDisplay);
  $("[data-tel]").forEach(e => e.href = "tel:+" + CONFIG.phoneIntl);
  $("[data-mail]").forEach(e => { e.href = "mailto:" + CONFIG.email; e.textContent = CONFIG.email; });
}
const yrEl = document.getElementById("yr");
if (yrEl) yrEl.textContent = new Date().getFullYear();

const fleetGrid = document.getElementById("fleetGrid");
if (fleetGrid && fleetGrid.children.length === 0) {
  fleetGrid.innerHTML = fleet.map(f =>
    `<div class="card car-card"><div class="car-media"><img src="${f[1]}" alt="${f[0]}" loading="lazy"><span class="car-badge">${f[2]}</span></div><div class="car-content"><h3>${f[0]}</h3><span class="car-model-hint">${f[3]}</span><p>${f[4]}</p><a class="btn btn-wa" data-wa="👋 Hello Faisal! I would like to book the ${f[0]} car lift between Dubai and Abu Dhabi.">Book on WhatsApp</a></div></div>`).join("");
}

const priceGrid = document.getElementById("priceGrid");
if (priceGrid && priceGrid.children.length === 0) {
  priceGrid.innerHTML = prices.map(p =>
    `<div class="card price${p[4] ? " pop" : ""}">${p[4] ? '<span class="tag">Most popular</span>' : ""}<h3>${p[0]}</h3><div class="amt"><small>from </small>${p[1]}</div><p style="margin:0">${p[2]}</p><ul>${p[3].map(i => `<li>${i}</li>`).join("")}</ul><a class="btn btn-wa" data-wa="👋 Hello! I’d like to book: ${p[0]} (${p[1]}). Please share driver availability."><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.17-.47-.29"/></svg>Book on WhatsApp</a></div>`).join("");
}

const fromChips = document.getElementById("fromChips");
if (fromChips && fromChips.children.length === 0) {
  fromChips.innerHTML = from.map(a => `<a data-wa="👋 Hello! I’d like a car lift quote from ${a} to Abu Dhabi.">${a}</a>`).join("");
}

const toChips = document.getElementById("toChips");
if (toChips && toChips.children.length === 0) {
  toChips.innerHTML = to.map(a => `<a data-wa="👋 Hello! I’d like a car lift quote from Dubai to ${a}.">${a}</a>`).join("");
}

/* wire every WhatsApp button (runs after the lists above are built) */
$("[data-wa]").forEach(e => { e.href = wa(e.dataset.wa); e.target = "_blank"; e.rel = "noopener"; });

/* mobile menu */
const burger = document.querySelector(".burger"), nav = document.querySelector("nav");
if (burger && nav) {
  burger.onclick = () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
  nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
}

/* quote form: opens beautifully structured WhatsApp chat */
const quoteForm = document.getElementById("quote");
if (quoteForm) {
  quoteForm.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target)), msg = document.getElementById("msg");
    if (!d.name.trim() || !d.phone.trim() || !d.from.trim()) { msg.style.display = "block"; return; }
    msg.style.display = "none";
    const text = `👋 Hello Dubai to Abu Dhabi Lift!\n\n📋 *NEW RIDE BOOKING INQUIRY*\n━━━━━━━━━━━━━━━━━━━━\n👤 *Passenger Name:* ${d.name.trim()}\n📱 *Phone / WhatsApp:* ${d.phone.trim()}\n📍 *Dubai Pickup Area:* ${d.from.trim()}\n⏰ *Preferred Time:* ${d.time ? d.time : "Flexible"}\n📝 *Trip Details:* ${d.note ? d.note.trim() : "Standard commute"}\n━━━━━━━━━━━━━━━━━━━━\nPlease confirm pricing & driver availability. Thank you!`;
    window.open(wa(text), "_blank", "noopener");
  });
}

/* ===== THEME SWITCHER (Light, Night/Dark, System Default) ===== */
const themeIcons = {
  light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  dark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
};

const themeLabels = {
  light: "Light",
  dark: "Night",
  system: "Auto"
};

function applyTheme(pref) {
  const isDarkOS = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const effectiveTheme = pref === "dark" || (pref === "system" && isDarkOS) ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", effectiveTheme);
  document.documentElement.setAttribute("data-theme-setting", pref);

  const iconEl = document.getElementById("themeCurrentIcon");
  const labelEl = document.getElementById("themeCurrentLabel");
  if (iconEl) iconEl.innerHTML = themeIcons[pref] || themeIcons.system;
  if (labelEl) labelEl.textContent = themeLabels[pref] || "Theme";

  document.querySelectorAll(".theme-opt").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.themeVal === pref);
  });
}

function initThemeSwitcher() {
  const saved = localStorage.getItem("theme_preference") || "system";
  applyTheme(saved);

  const switcher = document.getElementById("themeSwitch");
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (!switcher || !toggleBtn) return;

  toggleBtn.addEventListener("click", e => {
    e.stopPropagation();
    const isOpen = switcher.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".theme-opt").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const val = btn.dataset.themeVal;
      localStorage.setItem("theme_preference", val);
      applyTheme(val);
      switcher.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", e => {
    if (!switcher.contains(e.target)) {
      switcher.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && switcher.classList.contains("open")) {
      switcher.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.focus();
    }
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const current = localStorage.getItem("theme_preference") || "system";
    if (current === "system") {
      applyTheme("system");
    }
  });
}

initThemeSwitcher();

/* ===== INSTANT FARE ESTIMATOR ===== */
function initFareCalculator() {
  const fromSelect = document.getElementById("calc-from");
  const toSelect = document.getElementById("calc-to");
  const typeSelect = document.getElementById("calc-type");
  const resPickup = document.getElementById("resPickup");
  const resDrop = document.getElementById("resDrop");
  const calcPrice = document.getElementById("calcPrice");
  const calcWaBtn = document.getElementById("calcWaBtn");

  if (!fromSelect || !toSelect || !typeSelect || !calcWaBtn) return;

  function updateEstimate() {
    const fromVal = fromSelect.value;
    const toVal = toSelect.value;
    const opt = typeSelect.selectedOptions[0];
    const price = opt ? opt.dataset.price : "180";
    const label = opt ? opt.dataset.label : "Shared Round Trip";

    if (resPickup) resPickup.textContent = fromVal;
    if (resDrop) resDrop.textContent = toVal;
    if (calcPrice) calcPrice.textContent = "AED " + Number(price).toLocaleString();

    const msg = `👋 Hello! I'd like to book a ${label} from ${fromVal} to ${toVal} (Fare: AED ${price}). Please check driver availability.`;
    calcWaBtn.href = wa(msg);
  }

  fromSelect.addEventListener("change", updateEstimate);
  toSelect.addEventListener("change", updateEstimate);
  typeSelect.addEventListener("change", updateEstimate);
  updateEstimate();
}

/* ===== FAQ REAL-TIME SEARCH ===== */
function initFaqSearch() {
  const input = document.getElementById("faqSearch");
  const faqSection = document.getElementById("faq");
  const noMatch = document.getElementById("faqNoMatch");

  if (!input || !faqSection) return;

  const items = Array.from(faqSection.querySelectorAll("details"));

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    let matches = 0;

    items.forEach(d => {
      const text = d.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        d.style.display = "";
        if (q.length >= 2) {
          d.open = true;
        } else {
          d.open = false;
        }
        matches++;
      } else {
        d.style.display = "none";
        d.open = false;
      }
    });

    if (noMatch) {
      noMatch.style.display = (matches === 0 && q.length > 0) ? "block" : "none";
    }
  });
}

initFareCalculator();
initFaqSearch();
