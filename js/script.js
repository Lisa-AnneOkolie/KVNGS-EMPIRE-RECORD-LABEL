/* ==========================================================================
   KVNGS EMPIRE — site script
   Everything here is written so a non-developer can update content by
   editing the CONFIG objects at the top. No build step required.
   ========================================================================== */

/* ---------------------------------------------------------------------
   1. CONFIG — edit these to update site content
   --------------------------------------------------------------------- */

// Replace with the studio's real WhatsApp number, digits only, country code
// first, no + or spaces. Example for a Nigerian number: "2348012345678"
const WHATSAPP_NUMBER = "[WHATSAPP NUMBER TO BE ADDED]";

function buildWhatsAppLink(message){
  const text = encodeURIComponent(message || "Hi KVNGS EMPIRE, I'd like to book a studio session.");
  // If the placeholder hasn't been replaced yet, this still opens WhatsApp's
  // generic composer so the link never dead-ends for a visitor.
  const numberIsSet = /^\d{6,}$/.test(WHATSAPP_NUMBER);
  return numberIsSet
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

const TRACKS = [
  { title: "Track Title Placeholder 1", artist: "Artist Name Placeholder", length: "3:12", src: "assets/audio/track-1.mp3" },
  { title: "Track Title Placeholder 2", artist: "Artist Name Placeholder", length: "2:48", src: "assets/audio/track-2.mp3" },
  { title: "Track Title Placeholder 3", artist: "Artist Name Placeholder", length: "3:35", src: "assets/audio/track-3.mp3" },
  { title: "Track Title Placeholder 4", artist: "Artist Name Placeholder", length: "4:02", src: "assets/audio/track-4.mp3" },
];

const ARTISTS = [
  { name: "Artist Name 1", role: "Vocalist" },
  { name: "Artist Name 2", role: "Rapper / Songwriter" },
  { name: "Artist Name 3", role: "Producer" },
  { name: "Artist Name 4", role: "Vocalist" },
];

const TESTIMONIALS = [
  { quote: "Placeholder testimonial — the engineers here understood the record before I finished explaining it.", name: "Client Name", role: "Recording Artist" },
  { quote: "Placeholder testimonial — best mix I've had on a record, and it was ready before the deadline.", name: "Client Name", role: "Independent Artist" },
  { quote: "Placeholder testimonial — the studio feels like home. That matters when you're in there for twelve hours.", name: "Client Name", role: "Producer" },
];

/* ---------------------------------------------------------------------
   2. Preloader
   --------------------------------------------------------------------- */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader){
    setTimeout(() => preloader.classList.add("is-hidden"), 350);
  }
});

/* ---------------------------------------------------------------------
   3. Header scroll state + mobile nav
   --------------------------------------------------------------------- */
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

function onScroll(){
  if (window.scrollY > 40){ header.classList.add("is-scrolled"); }
  else { header.classList.remove("is-scrolled"); }
}
window.addEventListener("scroll", onScroll, { passive:true });
onScroll();

if (navToggle){
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  siteNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded","false");
  }));
}

/* ---------------------------------------------------------------------
   4. Scroll reveal
   --------------------------------------------------------------------- */
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------------------------------------------------------------------
   5. Animated stat counters
   --------------------------------------------------------------------- */
const statEls = document.querySelectorAll(".stat__num");
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObserver.observe(el));

/* ---------------------------------------------------------------------
   6. Audio player
   --------------------------------------------------------------------- */
const audio = document.getElementById("playerAudio");
const playBtn = document.getElementById("playerPlayBtn");
const iconPlay = playBtn ? playBtn.querySelector(".icon-play") : null;
const iconPause = playBtn ? playBtn.querySelector(".icon-pause") : null;
const titleEl = document.getElementById("playerTitle");
const artistEl = document.getElementById("playerArtist");
const timeEl = document.getElementById("playerTime");
const seekEl = document.getElementById("playerSeek");
const waveEl = document.getElementById("playerWave");
const tracklistEl = document.getElementById("tracklist");

let currentTrack = 0;

function formatTime(sec){
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

function buildWaveBars(){
  if (!waveEl) return;
  waveEl.innerHTML = "";
  for (let i=0; i<40; i++){
    const bar = document.createElement("span");
    bar.style.height = `${20 + Math.round(Math.sin(i*0.7)*15) + Math.round(Math.random()*20)}%`;
    waveEl.appendChild(bar);
  }
}
buildWaveBars();

function renderTracklist(){
  if (!tracklistEl) return;
  tracklistEl.innerHTML = "";
  TRACKS.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "track-row" + (i === currentTrack ? " is-active" : "");
    li.innerHTML = `
      <span class="track-row__idx">${String(i+1).padStart(2,"0")}</span>
      <button class="track-row__play" aria-label="Play ${t.title}">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <span class="track-row__info">
        <h4>${t.title}</h4>
        <p>${t.artist}</p>
      </span>
      <span class="track-row__len">${t.length}</span>
    `;
    li.querySelector(".track-row__play").addEventListener("click", () => loadTrack(i, true));
    li.addEventListener("dblclick", () => loadTrack(i, true));
    tracklistEl.appendChild(li);
  });
}

function loadTrack(index, autoplay){
  currentTrack = index;
  const t = TRACKS[index];
  if (!t || !audio) return;
  audio.src = t.src;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;
  seekEl.value = 0;
  timeEl.textContent = `0:00 / ${t.length}`;
  renderTracklist();
  if (autoplay){
    audio.play().catch(() => {
      // Placeholder audio files aren't included in this template — swap in
      // real mp3s under assets/audio/ and this will play normally.
      titleEl.textContent = t.title + " (add audio file to enable playback)";
    });
  }
}

if (playBtn && audio){
  playBtn.addEventListener("click", () => {
    if (audio.paused){
      audio.play().catch(() => {
        titleEl.textContent = TRACKS[currentTrack].title + " (add audio file to enable playback)";
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    iconPlay.hidden = true; iconPause.hidden = false;
    waveEl.classList.add("is-playing");
  });
  audio.addEventListener("pause", () => {
    iconPlay.hidden = false; iconPause.hidden = true;
    waveEl.classList.remove("is-playing");
  });
  audio.addEventListener("timeupdate", () => {
    if (audio.duration){
      seekEl.value = (audio.currentTime / audio.duration) * 100;
      timeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  });
  audio.addEventListener("ended", () => {
    loadTrack((currentTrack + 1) % TRACKS.length, true);
  });
  seekEl.addEventListener("input", () => {
    if (audio.duration){
      audio.currentTime = (seekEl.value / 100) * audio.duration;
    }
  });
}

renderTracklist();
if (TRACKS.length) loadTrack(0, false);

/* ---------------------------------------------------------------------
   7. Artists roster
   --------------------------------------------------------------------- */
const artistsGrid = document.getElementById("artistsGrid");
if (artistsGrid){
  ARTISTS.forEach(a => {
    const card = document.createElement("article");
    card.className = "artist-card reveal";
    card.innerHTML = `
      <div class="artist-card__ph">Photo Placeholder</div>
      <div class="artist-card__info">
        <h3>${a.name}</h3>
        <p>${a.role}</p>
      </div>
    `;
    artistsGrid.appendChild(card);
    revealObserver.observe(card);
  });
}

/* ---------------------------------------------------------------------
   8. Testimonials slider
   --------------------------------------------------------------------- */
const track = document.getElementById("testimonialTrack");
const dotsWrap = document.getElementById("testimonialDots");
let tIndex = 0;

if (track && dotsWrap){
  TESTIMONIALS.forEach((t, i) => {
    const slide = document.createElement("div");
    slide.className = "testimonial";
    slide.innerHTML = `
      <p class="testimonial__quote">${t.quote}</p>
      <p class="testimonial__name">${t.name}</p>
      <p class="testimonial__role">${t.role}</p>
    `;
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Show testimonial ${i+1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goToTestimonial(i));
    dotsWrap.appendChild(dot);
  });

  function goToTestimonial(i){
    tIndex = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    [...dotsWrap.children].forEach((d, idx) => d.classList.toggle("is-active", idx === i));
  }

  let autoplayTimer = setInterval(() => {
    goToTestimonial((tIndex + 1) % TESTIMONIALS.length);
  }, 6000);

  dotsWrap.addEventListener("click", () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      goToTestimonial((tIndex + 1) % TESTIMONIALS.length);
    }, 6000);
  });
}

/* ---------------------------------------------------------------------
   9. Real-time-style availability calendar
   ---------------------------------------------------------------------
   This renders a live month grid in the visitor's browser and marks
   each day as Available / Limited / Booked from a deterministic mock
   schedule below. Swap MOCK_SCHEDULE for a real feed (e.g. Google
   Calendar API or your booking backend) to make it truly live.
   --------------------------------------------------------------------- */
const calMonthLabel = document.getElementById("calMonthLabel");
const calGrid = document.getElementById("calGrid");
const calPrev = document.getElementById("calPrev");
const calNext = document.getElementById("calNext");
const calSelected = document.getElementById("calSelected");

let viewDate = new Date();
viewDate.setDate(1);
let selectedDateStr = null;

function statusForDate(date){
  // Deterministic mock pattern so it looks alive without a backend:
  // Sundays booked, a couple of "limited" days each week, rest open.
  const day = date.getDay();
  const d = date.getDate();
  if (day === 0) return "full";
  if (d % 7 === 0 || d % 5 === 0) return "limited";
  return "open";
}

function renderCalendar(){
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  calMonthLabel.textContent = `${monthNames[month]} ${year}`;

  calGrid.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);

  for (let i=0; i<firstDay; i++){
    const empty = document.createElement("div");
    empty.className = "cal-day is-empty";
    calGrid.appendChild(empty);
  }

  for (let d=1; d<=daysInMonth; d++){
    const date = new Date(year, month, d);
    const cell = document.createElement("div");
    const isPast = date < today;
    const status = statusForDate(date);
    cell.className = "cal-day" + (isPast ? " is-past" : "");
    const dateStr = date.toISOString().slice(0,10);
    if (dateStr === selectedDateStr) cell.classList.add("is-selected");

    cell.innerHTML = `${d}${isPast ? "" : `<span class="dot dot--${status}"></span>`}`;

    if (!isPast){
      cell.addEventListener("click", () => {
        selectedDateStr = dateStr;
        const label = date.toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"long", day:"numeric" });
        const statusLabel = status === "open" ? "looks wide open" : status === "limited" ? "has limited slots left" : "is fully booked — pick another date or ask about a waitlist";
        calSelected.textContent = `${label} ${statusLabel}.`;
        const waLink = buildWhatsAppLink(`Hi KVNGS EMPIRE, I'd like to book a session on ${label}.`);
        document.getElementById("waCta").href = waLink;
        renderCalendar();
      });
    }
    calGrid.appendChild(cell);
  }
}

if (calGrid){
  renderCalendar();
  calPrev.addEventListener("click", () => { viewDate.setMonth(viewDate.getMonth()-1); renderCalendar(); });
  calNext.addEventListener("click", () => { viewDate.setMonth(viewDate.getMonth()+1); renderCalendar(); });
}

/* ---------------------------------------------------------------------
   10. WhatsApp CTAs
   ---------------------------------------------------------------------
   Every primary "Book a Session" button (header, hero, floating button,
   and the dedicated Book a Session section) opens WhatsApp directly, per
   the brief. Secondary "Book This" links on pricing cards still scroll
   to the calendar section first. All of them share buildWhatsAppLink()
   above, so replacing WHATSAPP_NUMBER updates every button at once.
   --------------------------------------------------------------------- */
const waCta = document.getElementById("waCta");
const fabBook = document.getElementById("fabBook");
const headerBookBtn = document.getElementById("headerBookBtn");
const heroBookBtn = document.getElementById("heroBookBtn");

[waCta, fabBook, headerBookBtn, heroBookBtn].forEach(btn => {
  if (!btn) return;
  btn.href = buildWhatsAppLink();
  btn.target = "_blank";
  btn.rel = "noopener";
});

// Floating button appears after the hero has been scrolled past.
function toggleFab(){
  if (!fabBook) return;
  if (window.scrollY > window.innerHeight * 0.7){ fabBook.classList.add("is-visible"); }
  else { fabBook.classList.remove("is-visible"); }
}
window.addEventListener("scroll", toggleFab, { passive:true });
toggleFab();

/* ---------------------------------------------------------------------
   11. Contact form (front-end only placeholder)
   ---------------------------------------------------------------------
   No backend is wired up yet. This validates the form and shows a
   confirmation message. Connect it to Formspree, Netlify Forms, EmailJS,
   or your own endpoint by replacing the submit handler below.
   --------------------------------------------------------------------- */
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
if (contactForm){
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formNote.textContent = "Thanks — your message is ready to send. Connect this form to your email/CRM to go live.";
    contactForm.reset();
  });
}

/* ---------------------------------------------------------------------
   12. Footer year
   --------------------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
