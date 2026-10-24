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
  if (themeMeta) themeMeta.content = isDark ? "#0a0a0c" : "#111111";
};

let preferredTheme = "dark";
try {
  preferredTheme = localStorage.getItem("ride-site-theme") || "dark";
  if (preferredTheme !== "dark" && preferredTheme !== "light") preferredTheme = "dark";
} catch (error) {
  preferredTheme = "dark";
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
    if (window.innerWidth > 900) closeMenu();
  });
}

// Navigation Dropdown interaction (click/touch/keyboard)
const navDropdowns = selectAll(".nav-dropdown");
navDropdowns.forEach(dropdown => {
  const toggleBtn = dropdown.querySelector(".nav-dropdown-toggle");
  if (!toggleBtn) return;
  toggleBtn.addEventListener("click", event => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });
});

document.addEventListener("click", event => {
  navDropdowns.forEach(dropdown => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
      const toggleBtn = dropdown.querySelector(".nav-dropdown-toggle");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    navDropdowns.forEach(dropdown => {
      dropdown.classList.remove("is-open");
      const toggleBtn = dropdown.querySelector(".nav-dropdown-toggle");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    });
  }
});

const form = document.getElementById("quote-form");
if (form) {
  const submit = document.getElementById("submit-inquiry");
  const status = document.getElementById("form-status");
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const isArabic = document.body.classList.contains("arabic-page");
    const data = new FormData(form);
    const fields = isArabic ? [
      ["الاسم", data.get("name")],
      ["رقم الهاتف", data.get("phone")],
      ["منطقة الانطلاق", data.get("pickup")],
      ["وجهة الوصول", data.get("destination")],
      ["تاريخ السفر", data.get("date")],
      ["موعد الفترة", data.get("shiftTime")],
      ["نوع المشوار", data.get("rideType")],
      ["السيارة المفضلة", data.get("vehicle")],
      ["تفاصيل إضافية", data.get("details")]
    ] : [
      ["Name", data.get("name")],
      ["Phone number", data.get("phone")],
      ["Pickup area", data.get("pickup")],
      ["Destination", data.get("destination")],
      ["Travel date", data.get("date")],
      ["Shift timing", data.get("shiftTime")],
      ["Ride type", data.get("rideType")],
      ["Preferred vehicle", data.get("vehicle")],
      ["Other details", data.get("details")]
    ];
    const filtered = fields.filter(item => String(item[1] || "").trim());
    const intro = isArabic
      ? "مرحباً، أود حجز مشوار بين دبي وأبوظبي.\n\n"
      : "Hello, I would like to book a Dubai to Abu Dhabi ride.\n\n";
    const message = intro + filtered.map(item => item[0] + ": " + String(item[1]).trim()).join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    if (status) {
      if (isArabic) {
        status.textContent = whatsappNumber
          ? "تم فتح تطبيق واتساب برسالتك. يرجى مراجعتها والضغط على إرسال للتواصل معنا."
          : "تم فتح تطبيق واتساب برسالتك. اختر محادثة الخدمة، وراجع المسودة واضغط إرسال.";
      } else {
        status.textContent = whatsappNumber
          ? "WhatsApp opened with your message. Review it and press Send to contact the service."
          : "WhatsApp opened with your message. Choose the service chat, review the draft, and press Send.";
      }
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

// Logo Track Auto Scroll (Continuous Infinite Seamless Loop in One Direction)
const initLogoRingTrack = () => {
  const ringTracks = document.querySelectorAll("#logo-ring-track, #logo-ring-track-ar");
  if (!ringTracks.length) return;

  ringTracks.forEach(ringTrack => {
    let isInteracting = false;
    let lastTime = performance.now();
    const speedPxPerSec = 36; // Smooth, continuous drift speed

    // Pause on hover or touch
    ringTrack.addEventListener("mouseenter", () => { isInteracting = true; });
    ringTrack.addEventListener("mouseleave", () => {
      isInteracting = false;
      lastTime = performance.now();
    });
    ringTrack.addEventListener("touchstart", () => { isInteracting = true; }, { passive: true });
    ringTrack.addEventListener("touchend", () => {
      isInteracting = false;
      lastTime = performance.now();
    });

    const isRtl = document.documentElement.dir === "rtl" || document.body.classList.contains("arabic-page");

    // Distance between item 0 and the duplicated set gives the exact seamless wrap distance
    const getLoopDistance = () => {
      const halfIndex = Math.floor(ringTrack.children.length / 2);
      if (halfIndex > 0 && ringTrack.children[halfIndex] && ringTrack.children[0]) {
        const dist = Math.abs(ringTrack.children[halfIndex].offsetLeft - ringTrack.children[0].offsetLeft);
        if (dist > 50) return dist;
      }
      return ringTrack.scrollWidth / 2;
    };

    const animate = (currentTime) => {
      const deltaMs = Math.min(currentTime - lastTime, 50);
      lastTime = currentTime;

      if (!isInteracting) {
        const move = (speedPxPerSec * deltaMs) / 1000;
        const loopDist = getLoopDistance();

        if (isRtl) {
          // Continuous circular motion in RTL mode
          if (ringTrack.scrollLeft <= 0) {
            ringTrack.scrollLeft -= move;
            if (Math.abs(ringTrack.scrollLeft) >= loopDist) {
              ringTrack.scrollLeft += loopDist;
            }
          } else {
            ringTrack.scrollLeft -= move;
            if (ringTrack.scrollLeft <= 0) {
              ringTrack.scrollLeft += loopDist;
            }
          }
        } else {
          // Continuous circular motion in one direction
          ringTrack.scrollLeft += move;
          if (ringTrack.scrollLeft >= loopDist) {
            ringTrack.scrollLeft -= loopDist;
          }
        }
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });
};

initLogoRingTrack();

// ===== INTERACTIVE HIGHWAY CORRIDOR SCROLLER =====
const initCorridorScroller = () => {
  const scroller = document.getElementById("corridor-scroller");
  if (!scroller) return;

  const road = document.getElementById("corridor-road");
  const fill = document.getElementById("road-progress-fill");
  const handle = document.getElementById("road-car-handle");
  const kmBadge = document.getElementById("car-km-badge");
  const statusPill = document.getElementById("corridor-status-pill");
  const milestones = scroller.querySelectorAll(".corridor-milestone");
  const isRtl = document.documentElement.dir === "rtl" || document.body.classList.contains("arabic-page");

  let currentPercent = 0;
  let isDragging = false;
  let userInteracted = false;

  const updatePosition = (percent, triggerSource = "script") => {
    percent = Math.max(0, Math.min(100, percent));
    currentPercent = percent;

    if (fill) fill.style.width = `${percent}%`;
    if (handle) {
      if (isRtl) {
        handle.style.left = "auto";
        handle.style.right = `${percent}%`;
      } else {
        handle.style.left = `${percent}%`;
      }
    }

    const currentKm = Math.round((percent / 100) * 150);
    if (kmBadge) kmBadge.textContent = `${currentKm} KM`;

    let activeMilestone = milestones[0];
    milestones.forEach(m => {
      const p = parseFloat(m.dataset.percent);
      if (percent >= p - 8) {
        m.classList.add("active");
        activeMilestone = m;
      } else {
        m.classList.remove("active");
      }
    });

    if (statusPill && activeMilestone) {
      const name = activeMilestone.dataset.name;
      const km = activeMilestone.dataset.km;
      const time = activeMilestone.dataset.time;
      const label = isRtl
        ? `المحطة الحالية: <strong>${name} (${km})</strong> · ${time}`
        : `Current Point: <strong>${name} (${km})</strong> · ~${time}`;
      const statusText = statusPill.querySelector(".corridor-status-text");
      if (statusText) statusText.innerHTML = label;
    }
  };

  milestones.forEach(m => {
    m.addEventListener("click", () => {
      userInteracted = true;
      const targetPercent = parseFloat(m.dataset.percent);
      updatePosition(targetPercent, "click");
    });
  });

  const handleDrag = e => {
    if (!isDragging || !road) return;
    const rect = road.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let fraction = (clientX - rect.left) / rect.width;
    if (isRtl) fraction = 1 - fraction;
    updatePosition(fraction * 100, "drag");
  };

  if (handle) {
    handle.addEventListener("mousedown", () => { isDragging = true; userInteracted = true; });
    handle.addEventListener("touchstart", () => { isDragging = true; userInteracted = true; }, { passive: true });
  }

  window.addEventListener("mousemove", handleDrag);
  window.addEventListener("touchmove", handleDrag, { passive: true });

  const stopDrag = () => { isDragging = false; };
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchend", stopDrag);

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (userInteracted && isDragging) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = scroller.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.88 && rect.bottom > windowHeight * 0.12) {
          const totalDistance = windowHeight * 0.75;
          const currentProgress = (windowHeight * 0.88 - rect.top) / totalDistance;
          const progressPercent = Math.max(0, Math.min(100, currentProgress * 100));
          updatePosition(progressPercent, "scroll");
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updatePosition(0);
};

initCorridorScroller();

