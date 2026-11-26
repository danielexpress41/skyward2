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

const returnField = document.querySelector(".return-field");
const departureDate = document.querySelector('input[name="depart"]');
const returnDate = document.querySelector('input[name="return"]');
const statusDate = document.querySelector('input[name="departureDate"]');
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const todayValue = today.toISOString().slice(0, 10);
departureDate.min = todayValue;
returnDate.min = todayValue;
statusDate.min = todayValue;

const syncReturnField = () => {
  const selectedTripType = document.querySelector('input[name="trip-type"]:checked');
  const oneWay = selectedTripType.value === "One-way";
  returnField.hidden = oneWay;
  returnDate.disabled = oneWay;
  returnDate.min = departureDate.value || todayValue;
  if (returnDate.value && returnDate.value < returnDate.min) returnDate.value = "";
};

document.querySelectorAll('input[name="trip-type"]').forEach((radio) => {
  radio.addEventListener("change", syncReturnField);
});
departureDate.addEventListener("change", syncReturnField);
window.addEventListener("pageshow", syncReturnField);
syncReturnField();

const passengerCounts = { adults: 1, children: 0, infants: 0 };
const passengerField = document.querySelector(".passenger-field");
const passengerToggle = document.querySelector("#passenger-toggle");
const passengerMenu = document.querySelector("#passenger-menu");
const passengerValue = document.querySelector("#passenger-value");
const passengerSummary = document.querySelector("#passenger-summary");

const updatePassengerControls = () => {
  const total = passengerCounts.adults + passengerCounts.children + passengerCounts.infants;
  document.querySelector("#adult-count").textContent = passengerCounts.adults;
  document.querySelector("#child-count").textContent = passengerCounts.children;
  document.querySelector("#infant-count").textContent = passengerCounts.infants;
  passengerSummary.textContent = `${passengerCounts.adults} Adult${passengerCounts.adults === 1 ? "" : "s"}, ${passengerCounts.infants} Infant${passengerCounts.infants === 1 ? "" : "s"}, ${passengerCounts.children} ${passengerCounts.children === 1 ? "Child" : "Children"}`;
  passengerValue.value = `${passengerCounts.adults} adult${passengerCounts.adults === 1 ? "" : "s"}, ${passengerCounts.children} child${passengerCounts.children === 1 ? "" : "ren"}, ${passengerCounts.infants} infant${passengerCounts.infants === 1 ? "" : "s"}`;

  passengerMenu.querySelectorAll("[data-passenger-type]").forEach((button) => {
    const type = button.dataset.passengerType;
    const change = Number(button.dataset.change);
    const minimum = type === "adults" ? 1 : 0;
    const atLimit = total >= 6 && change > 0;
    const tooManyInfants = type === "infants" && passengerCounts.infants >= passengerCounts.adults && change > 0;
    button.disabled = change < 0 ? passengerCounts[type] <= minimum : atLimit || tooManyInfants;
  });
};

passengerToggle.addEventListener("click", () => {
  const expanded = passengerToggle.getAttribute("aria-expanded") === "true";
  passengerToggle.setAttribute("aria-expanded", String(!expanded));
  passengerMenu.hidden = expanded;
  if (!expanded) {
    const fieldBounds = passengerField.getBoundingClientRect();
    const spaceBelow = window.innerHeight - fieldBounds.bottom;
    passengerMenu.classList.toggle("opens-up", spaceBelow < passengerMenu.offsetHeight + 12);
  } else {
    passengerMenu.classList.remove("opens-up");
  }
});

passengerMenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-passenger-type]");
  if (!button) return;
  const type = button.dataset.passengerType;
  passengerCounts[type] += Number(button.dataset.change);
  updatePassengerControls();
});

document.querySelector(".passenger-accept").addEventListener("click", () => {
  passengerMenu.hidden = true;
  passengerMenu.classList.remove("opens-up");
  passengerToggle.setAttribute("aria-expanded", "false");
  passengerToggle.focus();
});

document.addEventListener("click", (event) => {
  if (!passengerField.contains(event.target)) {
    passengerMenu.hidden = true;
    passengerMenu.classList.remove("opens-up");
    passengerToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !passengerMenu.hidden) {
    passengerMenu.hidden = true;
    passengerMenu.classList.remove("opens-up");
    passengerToggle.setAttribute("aria-expanded", "false");
    passengerToggle.focus();
  }
});
updatePassengerControls();

document.querySelectorAll(".scroll-button").forEach((button) => {
  button.addEventListener("click", () => {
    const track = document.getElementById(button.dataset.target);
    const direction = button.dataset.scroll === "right" ? 1 : -1;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  });
});

const bookingDialog = document.querySelector("#booking-dialog");
const searchResultsStep = document.querySelector("#search-results-step");
const bookingDetailsStep = document.querySelector("#booking-details-step");
const dialogTitle = document.querySelector("#dialog-title");
const searchSummary = document.querySelector("#search-summary");
const selectedFlightSummary = document.querySelector("#selected-flight-summary");
const estimatedFare = document.querySelector("#estimated-fare");
const fareLabel = document.querySelector("#fare-label");
const flexibleDates = document.querySelector('input[name="flexible"]');
let currentSearch;
let lastBookingFocus;

const formatFare = (fare) => new Intl.NumberFormat("en-KE").format(fare);

const closeBookingDialog = () => {
  bookingDialog.close();
};

document.querySelector(".dialog-close").addEventListener("click", closeBookingDialog);
bookingDialog.addEventListener("click", (event) => {
  if (event.target === bookingDialog) closeBookingDialog();
});
bookingDialog.addEventListener("close", () => {
  if (lastBookingFocus && document.contains(lastBookingFocus)) lastBookingFocus.focus();
});

document.querySelector("#flight-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const destinationOption = event.currentTarget.elements.destination.selectedOptions[0];
  const tripType = document.querySelector('input[name="trip-type"]:checked').value;
  const destination = destinationOption.value;
  const baseFare = Number(destinationOption.dataset.fare);
  const returnTrip = tripType === "Roundtrip";
  const passengerTotal = passengerCounts.adults + passengerCounts.children + passengerCounts.infants;
  const flexible = flexibleDates.checked;
  const dateDescription = [
    form.get("depart") ? `departing ${form.get("depart")}` : "",
    returnTrip && form.get("return") ? `returning ${form.get("return")}` : "",
    flexible ? "dates are flexible" : ""
  ].filter(Boolean).join(" and ");
  const fare = baseFare * (returnTrip ? 2 : 1) * passengerTotal;

  currentSearch = {
    origin: form.get("origin"),
    destination,
    tripType,
    depart: form.get("depart"),
    returnDate: returnTrip ? form.get("return") : "",
    passengers: passengerValue.value,
    passengerTotal,
    coupon: form.get("coupon"),
    currency: form.get("currency"),
    flexible
  };

  searchSummary.textContent = `${tripType}: ${currentSearch.origin} to ${destination} for ${currentSearch.passengers}${dateDescription ? `, ${dateDescription}` : ""}.`;
  estimatedFare.textContent = `From KSh ${formatFare(fare)}`;
  fareLabel.textContent = `Indicative ${returnTrip ? "roundtrip" : "one-way"} fare for ${passengerTotal} passenger${passengerTotal === 1 ? "" : "s"}`;
  document.querySelector("#fare-note").textContent = currentSearch.currency.startsWith("USD")
    ? "Estimate uses the published KSh fare per passenger and trip leg. Our team will confirm the final fare, currency, any child or infant pricing, schedule, and availability on WhatsApp."
    : "Estimate uses the published fare per passenger and trip leg. Our team will confirm the final fare, any child or infant pricing, schedule, and availability on WhatsApp.";
  dialogTitle.textContent = "Choose your flight";
  searchResultsStep.hidden = false;
  bookingDetailsStep.hidden = true;
  lastBookingFocus = document.activeElement;
  bookingDialog.showModal();
  document.querySelector(".dialog-close").focus();
});

document.querySelector("#choose-flight").addEventListener("click", () => {
  searchResultsStep.hidden = true;
  bookingDetailsStep.hidden = false;
  dialogTitle.textContent = "Complete your booking enquiry";
  selectedFlightSummary.textContent = `${currentSearch.tripType}: ${currentSearch.origin} to ${currentSearch.destination} for ${currentSearch.passengers}${currentSearch.depart ? `, departing ${currentSearch.depart}` : ""}${currentSearch.returnDate ? ` and returning ${currentSearch.returnDate}` : ""}. Selected fare: ${estimatedFare.textContent}.`;
  document.querySelector('input[name="fullName"]').focus();
});

document.querySelector("#back-to-results").addEventListener("click", () => {
  bookingDetailsStep.hidden = true;
  searchResultsStep.hidden = false;
  dialogTitle.textContent = "Choose your flight";
  document.querySelector("#choose-flight").focus();
});

document.querySelector("#booking-enquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const details = new FormData(event.currentTarget);
  const message = [
    "Hey there! I'd like to enquire about booking a flight.",
    `Route: ${currentSearch.origin} to ${currentSearch.destination}`,
    `Trip: ${currentSearch.tripType}`,
    currentSearch.depart ? `Depart: ${currentSearch.depart}` : "",
    currentSearch.returnDate ? `Return: ${currentSearch.returnDate}` : "",
    `Passengers: ${currentSearch.passengers}`,
    `Lead passenger type: ${details.get("passengerType")}`,
    currentSearch.flexible ? "Dates are flexible" : "",
    `Indicative fare: ${estimatedFare.textContent}`,
    currentSearch.coupon ? `Coupon: ${currentSearch.coupon}` : "",
    `Currency preference: ${currentSearch.currency}`,
    `Name: ${details.get("fullName")}`,
    `Phone: ${details.get("phone")}`,
    `Email: ${details.get("email")}`,
    details.get("specialRequest") ? `Special request: ${details.get("specialRequest")}` : ""
  ].filter(Boolean).join("\n");

  window.location.href = `https://wa.me/254785195669?text=${encodeURIComponent(message)}`;
});

document.querySelector("#existing-booking-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const details = new FormData(event.currentTarget);
  const message = [
    "Hey there! I need help with an existing booking.",
    `Booking reference: ${details.get("reference")}`,
    `Passenger surname: ${details.get("surname")}`
  ].join("\n");
  window.location.href = `https://wa.me/254785195669?text=${encodeURIComponent(message)}`;
});

document.querySelector("#flight-status-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const details = new FormData(event.currentTarget);
  const message = [
    "Hey there! I'd like to check a flight status.",
    `Flight number: ${details.get("flightNumber")}`,
    `Departure date: ${details.get("departureDate")}`
  ].join("\n");
  window.location.href = `https://wa.me/254785195669?text=${encodeURIComponent(message)}`;
});
