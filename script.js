const track = document.querySelector(".track");
const slides = document.querySelectorAll(".slide");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const pagination = document.querySelector(".pagination");

let current = 0;

/* --- DELAYS PER SLIDE --- */
function applyDelays(slide) {
  const desktop = slide.querySelector(".desktop");
  const mobile = slide.querySelector(".mobile");

  if (slide.classList.contains("active")) {
    desktop.style.transitionDelay = "0s";
    mobile.style.transitionDelay = "0.1s";
  } else {
    desktop.style.transitionDelay = "0.1s";
    mobile.style.transitionDelay = "0s";
  }
}

/* --- INIT --- */
slides.forEach((slide, i) => {

  applyDelays(slide);

  // switch button
  slide.querySelector(".switch").onclick = () => {
    slide.classList.toggle("active");
    applyDelays(slide);
  };

  // dots
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");

  dot.onclick = () => goToSlide(i);
  pagination.appendChild(dot);
});

/* --- PAGINATION --- */
function updatePagination() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
  });
}

/* --- SLIDE CHANGE --- */
function goToSlide(index) {
  current = index;
  track.style.transform = `translateX(-${current * 100}%)`;
  updatePagination();
}

/* --- NAV --- */
next.onclick = () => goToSlide((current + 1) % slides.length);
prev.onclick = () => goToSlide((current - 1 + slides.length) % slides.length);

/* --- SMOOTH SWIPE --- */
let startX = 0;
let startY = 0;
let currentTranslate = 0;
let isDragging = false;
let isHorizontal = null;

const slider = document.querySelector(".slider");

slider.addEventListener("touchstart", e => {
  if (
    e.target.closest(".nav") ||
    e.target.closest(".switch") ||
    e.target.closest(".pagination")
  ) return;

  isDragging = true;
  isHorizontal = null;

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

slider.addEventListener("touchmove", e => {
  if (!isDragging) return;

  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;

  const diffX = currentX - startX;
  const diffY = currentY - startY;

  // decidir dirección SOLO una vez
  if (isHorizontal === null) {
    isHorizontal = Math.abs(diffX) > Math.abs(diffY);
  }

  // si es vertical → no hacemos nada (deja hacer scroll)
  if (!isHorizontal) return;

  // evitar scroll vertical del navegador
  e.preventDefault();

  currentTranslate = -current * slider.offsetWidth + diffX;
  track.style.transform = `translateX(${currentTranslate}px)`;
});

slider.addEventListener("touchend", () => {
  if (!isDragging || !isHorizontal) return;

  isDragging = false;

  const moved = currentTranslate + current * slider.offsetWidth;

  if (moved < -50) current++;
  if (moved > 50) current--;

  if (current < 0) current = slides.length - 1;
  if (current >= slides.length) current = 0;

  goToSlide(current);
});