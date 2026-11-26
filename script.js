const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const heroImage = document.querySelector(".hero-image");
const heroTitle = document.querySelector("#hero-title");
const heroDescription = document.querySelector(".hero-content > p:not(.hero-kicker)");
const heroSlides = [
  {
    image: "images/skyward-09.jpg",
    alt: "Skyward Express aircraft on the runway",
    title: "Discover Kenya",
    description: "Start your next story from the heart of Kenya."
  },
  {
    image: "images/skyward-10.jpg",
    alt: "Skyward Express aircraft at the airport",
    title: "The coast is calling",
    description: "Fly closer to your next coastal escape."
  },
  {
    image: "images/skyward-17.jpg",
    alt: "Skyward aircraft against a bright Kenyan sky",
    title: "Your next story starts here",
    description: "Connect with the places you love across Kenya."
  }
];
let activeSlide = 0;
const hero = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let slideTimer;

const stopAutoSlide = () => {
  window.clearInterval(slideTimer);
  slideTimer = undefined;
};

const startAutoSlide = () => {
  if (reduceMotion.matches || slideTimer !== undefined) return;
  slideTimer = window.setInterval(() => showSlide(1), 6000);
};

const showSlide = (direction) => {
  activeSlide = (activeSlide + direction + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[activeSlide];
  heroImage.classList.add("is-changing");
  heroImage.src = slide.image;
  heroImage.alt = slide.alt;
  heroTitle.textContent = slide.title;
  heroDescription.textContent = slide.description;
  window.setTimeout(() => heroImage.classList.remove("is-changing"), 240);
};

document.querySelectorAll(".hero-arrow").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.classList.contains("hero-arrow-right") ? 1 : -1;
    showSlide(direction);
    stopAutoSlide();
    startAutoSlide();
  });
});

hero.addEventListener("mouseenter", stopAutoSlide);
hero.addEventListener("mouseleave", startAutoSlide);
hero.addEventListener("focusin", stopAutoSlide);
hero.addEventListener("focusout", (event) => {
  if (!hero.contains(event.relatedTarget)) startAutoSlide();
});
startAutoSlide();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

document.querySelectorAll(".booking-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".booking-tab").forEach((otherTab) => {
      const selected = otherTab === tab;
      otherTab.classList.toggle("is-active", selected);
      otherTab.setAttribute("aria-selected", String(selected));
      document.getElementById(otherTab.getAttribute("aria-controls")).hidden = !selected;
    });
  });
});

document.querySelectorAll('input[name="trip-type"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    document.querySelector(".return-field").hidden = radio.value === "One-way" && radio.checked;
  });
});

document.querySelectorAll(".scroll-button").forEach((button) => {
  button.addEventListener("click", () => {
    const track = document.getElementById(button.dataset.target);
    const direction = button.dataset.scroll === "right" ? 1 : -1;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  });
});

document.querySelector("#flight-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const destination = form.get("destination");
  if (!destination) {
    event.currentTarget.elements.destination.focus();
    return;
  }

  const tripType = form.get("trip-type") || document.querySelector('input[name="trip-type"]:checked').value;
  const message = [
    "Hello Skyward Airlines, I would like to enquire about a flight.",
    `Route: Nairobi to ${destination}`,
    `Trip: ${tripType}`,
    form.get("depart") ? `Depart: ${form.get("depart")}` : "",
    tripType === "Roundtrip" && form.get("return") ? `Return: ${form.get("return")}` : "",
    `Passengers: ${form.get("passengers")}`,
    form.get("coupon") ? `Coupon: ${form.get("coupon")}` : "",
    `Currency: ${form.get("currency")}`
  ].filter(Boolean).join("\n");

  window.location.href = `https://wa.me/254785195669?text=${encodeURIComponent(message)}`;
});
