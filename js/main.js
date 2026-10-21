const selectAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const config = window.CONFIG || {};
const whatsappNumber = String(config.whatsappIntl || "").replace(/\D/g, "");
const phoneNumber = String(config.phoneIntl || "").replace(/\D/g, "");
const email = String(config.email || "").trim();

const whatsappUrl = message => {
  const recipient = whatsappNumber ? whatsappNumber : "";
  return "https://wa.me/" + recipient + "?text=" + encodeURIComponent(message);
};

selectAll("[data-email]").forEach(link => {
  if (email) {
    link.href = "mailto:" + email;
    if (link.childElementCount === 0 || link.hasAttribute("data-email-text")) link.textContent = email;
  } else {
    link.hidden = true;
  }
});

selectAll("[data-whatsapp]").forEach(link => {
  const message = link.dataset.message || "Hello, I would like to ask about a Dubai to Abu Dhabi ride.";
  link.href = whatsappUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const canCall = phoneNumber.length >= 8;
selectAll("[data-call-now]").forEach(button => {
  button.disabled = !canCall;
  button.setAttribute("aria-disabled", String(!canCall));
  if (canCall) button.addEventListener("click", () => {
    window.location.href = "tel:+" + phoneNumber;
  });
});
selectAll("[data-call-note]").forEach(note => {
  note.hidden = canCall;
});

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const setTheme = theme => {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  if (themeToggle) {
    const isArabic = document.body.classList.contains("arabic-page");
    const label = isArabic
      ? (isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن")
      : (isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    const icon = themeToggle.querySelector("[data-theme-icon]");
    const text = themeToggle.querySelector("[data-theme-label]");
    if (icon) icon.textContent = isDark ? "☀" : "☾";
    if (text) text.textContent = isArabic ? (isDark ? "فاتح" : "داكن") : (isDark ? "Light" : "Dark");
  }
  if (themeMeta) themeMeta.content = isDark ? "#131c18" : "#154536";
};

let preferredTheme = "light";
try {
  preferredTheme = localStorage.getItem("ride-site-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (preferredTheme !== "dark" && preferredTheme !== "light") preferredTheme = "light";
} catch (error) {
  preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
setTheme(preferredTheme);
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    try {
      localStorage.setItem("ride-site-theme", theme);
    } catch (error) {
      // The toggle still works for this visit when storage is unavailable.
    }
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.getElementById("main-nav");
if (menuToggle && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", document.body.classList.contains("arabic-page") ? "فتح القائمة" : "Open navigation");
  };
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", document.body.classList.contains("arabic-page") ? (isOpen ? "إغلاق القائمة" : "فتح القائمة") : (isOpen ? "Close navigation" : "Open navigation"));
  });
  mainNav.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

const form = document.getElementById("quote-form");
if (form) {
  const submit = document.getElementById("submit-inquiry");
  const status = document.getElementById("form-status");
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const fields = [
      ["Name", data.get("name")],
      ["Phone number", data.get("phone")],
      ["Pickup area", data.get("pickup")],
      ["Destination", data.get("destination")],
      ["Travel date", data.get("date")],
      ["Ride type", data.get("rideType")],
      ["Preferred vehicle", data.get("vehicle")],
      ["Other details", data.get("details")]
    ].filter(item => String(item[1] || "").trim());
    const message = "Hello, I would like to book a Dubai to Abu Dhabi ride.\n\n" + fields.map(item => item[0] + ": " + String(item[1]).trim()).join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    if (status) {
      status.textContent = whatsappNumber
        ? "WhatsApp opened with your message. Review it and press Send to contact the service."
        : "WhatsApp opened with your message. Choose the service chat, review the draft, and press Send.";
    }
    if (submit) submit.blur();
  });
}

const vehicleGrid = document.getElementById("vehicle-grid");
if (vehicleGrid) {
  const vehicleCards = selectAll(".vehicle-card", vehicleGrid);
  const previousVehicle = document.querySelector("[data-vehicle-previous]");
  const nextVehicle = document.querySelector("[data-vehicle-next]");
  const vehicleCount = document.querySelector("[data-vehicle-count]");
  let currentVehicle = 0;

  const updateVehicleControls = () => {
    if (!vehicleCards.length) return;
    const gap = parseFloat(getComputedStyle(vehicleGrid).columnGap) || 0;
    const step = vehicleCards[0].getBoundingClientRect().width + gap;
    currentVehicle = step ? Math.max(0, Math.min(vehicleCards.length - 1, Math.round(vehicleGrid.scrollLeft / step))) : 0;
    if (vehicleCount) vehicleCount.textContent = (currentVehicle + 1) + " / " + vehicleCards.length;
    if (previousVehicle) previousVehicle.disabled = currentVehicle === 0;
    if (nextVehicle) nextVehicle.disabled = currentVehicle === vehicleCards.length - 1;
  };

  const showVehicle = offset => {
    const nextIndex = Math.max(0, Math.min(vehicleCards.length - 1, currentVehicle + offset));
    const gap = parseFloat(getComputedStyle(vehicleGrid).columnGap) || 0;
    const step = vehicleCards[0].getBoundingClientRect().width + gap;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    vehicleGrid.scrollTo({ left: nextIndex * step, behavior: reducedMotion ? "auto" : "smooth" });
    currentVehicle = nextIndex;
    if (vehicleCount) vehicleCount.textContent = (currentVehicle + 1) + " / " + vehicleCards.length;
    if (previousVehicle) previousVehicle.disabled = currentVehicle === 0;
    if (nextVehicle) nextVehicle.disabled = currentVehicle === vehicleCards.length - 1;
  };

  if (previousVehicle) previousVehicle.addEventListener("click", () => showVehicle(-1));
  if (nextVehicle) nextVehicle.addEventListener("click", () => showVehicle(1));
  vehicleGrid.addEventListener("scroll", updateVehicleControls, { passive: true });
  window.addEventListener("resize", updateVehicleControls);
  updateVehicleControls();
}

const faqList = document.querySelector(".faq-list");
if (faqList) {
  faqList.addEventListener("toggle", event => {
    const opened = event.target;
    if (opened instanceof HTMLDetailsElement && opened.open) {
      selectAll("details[open]", faqList).forEach(item => {
        if (item !== opened) item.open = false;
      });
    }
  }, true);
}
