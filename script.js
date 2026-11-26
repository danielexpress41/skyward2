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
const seatSelectionStep = document.querySelector("#seat-selection-step");
const dialogTitle = document.querySelector("#dialog-title");
const searchSummary = document.querySelector("#search-summary");
const selectedFlightSummary = document.querySelector("#selected-flight-summary");
const seatGrid = document.querySelector("#seat-grid");
const seatMessage = document.querySelector("#seat-message");
const seatStepCopy = document.querySelector("#seat-step-copy");
const whatsappConfirmButton = document.querySelector("#send-booking-enquiry");
const bookingEnquiryForm = document.querySelector("#booking-enquiry-form");
const flightOptions = [...document.querySelectorAll(".flight-option")];
const flexibleDates = document.querySelector('input[name="flexible"]');
let currentSearch;
let currentFlight;
let passengerDetails;
let selectedSeats = [];
let lastBookingFocus;

const formatFare = (fare) => new Intl.NumberFormat("en-KE").format(fare);
const passengerDescription = (counts) =>
  `${counts.adults} adult${counts.adults === 1 ? "" : "s"}, ${counts.children} child${counts.children === 1 ? "" : "ren"}, ${counts.infants} infant${counts.infants === 1 ? "" : "s"}`;

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
  const journeyCount = returnTrip ? 2 : 1;
  const flexible = flexibleDates.checked;
  const dateDescription = [
    form.get("depart") ? `departing ${form.get("depart")}` : "",
    returnTrip && form.get("return") ? `returning ${form.get("return")}` : "",
    flexible ? "dates are flexible" : ""
  ].filter(Boolean).join(" and ");

  currentSearch = {
    origin: form.get("origin"),
    destination,
    tripType,
    depart: form.get("depart"),
    returnDate: returnTrip ? form.get("return") : "",
    passengers: passengerDescription(passengerCounts),
    passengerTotal,
    journeyCount,
    coupon: form.get("coupon"),
    currency: form.get("currency"),
    flexible
  };

  searchSummary.textContent = `${tripType}: ${currentSearch.origin} to ${destination} for ${currentSearch.passengers}${dateDescription ? `, ${dateDescription}` : ""}.`;
  flightOptions.forEach((option, index) => {
    const farePerJourney = baseFare + index * 1500;
    const totalFare = farePerJourney * journeyCount * passengerTotal;
    option.dataset.farePerJourney = String(farePerJourney);
    option.querySelector(".flight-option-fare strong").textContent = `From KSh ${formatFare(totalFare)}`;
    option.querySelector(".flight-option-fare span").textContent = `${returnTrip ? "Indicative roundtrip" : "Indicative one-way"} fare`;
  });
  document.querySelector("#fare-note").textContent = currentSearch.currency.startsWith("USD")
    ? "Estimate uses the published KSh fare per passenger and trip leg. Our team will confirm the final fare, currency, any child or infant pricing, schedule, and availability on WhatsApp."
    : "Estimate uses the published fare per passenger and trip leg. Our team will confirm the final fare, any child or infant pricing, schedule, and availability on WhatsApp.";
  dialogTitle.textContent = "Choose your flight";
  searchResultsStep.hidden = false;
  bookingDetailsStep.hidden = true;
  seatSelectionStep.hidden = true;
  bookingEnquiryForm.reset();
  currentFlight = undefined;
  passengerDetails = undefined;
  selectedSeats = [];
  seatGrid.querySelectorAll(".seat-button").forEach((seat) => {
    seat.classList.remove("is-selected");
    seat.setAttribute("aria-pressed", "false");
  });
  whatsappConfirmButton.hidden = true;
  seatMessage.textContent = "";
  lastBookingFocus = document.activeElement;
  bookingDialog.showModal();
  document.querySelector(".dialog-close").focus();
});

document.querySelectorAll(".flight-book-button").forEach((button) => {
  button.addEventListener("click", () => {
    const option = button.closest(".flight-option");
    const optionIndex = Number(option.dataset.optionIndex);
    const farePerJourney = Number(option.dataset.farePerJourney);
    currentFlight = {
      label: optionIndex === 0 ? "Lowest fare" : "Alternative fare",
      farePerJourney,
      totalFare: farePerJourney * currentSearch.journeyCount * currentSearch.passengerTotal
    };
    selectedSeats = [];
    seatGrid.querySelectorAll(".seat-button").forEach((seat) => {
      seat.classList.remove("is-selected");
      seat.setAttribute("aria-pressed", "false");
    });
    whatsappConfirmButton.hidden = true;
    seatMessage.textContent = "";
    searchResultsStep.hidden = true;
    bookingDetailsStep.hidden = false;
    seatSelectionStep.hidden = true;
    dialogTitle.textContent = "Complete your booking enquiry";
    selectedFlightSummary.textContent = `${currentFlight.label}: ${currentSearch.tripType}, ${currentSearch.origin} to ${currentSearch.destination} for ${currentSearch.passengers}. Indicative total: KSh ${formatFare(currentFlight.totalFare)}.`;
    document.querySelector('input[name="fullName"]').focus();
  });
});

document.querySelector("#back-to-results").addEventListener("click", () => {
  bookingDetailsStep.hidden = true;
  searchResultsStep.hidden = false;
  dialogTitle.textContent = "Choose your flight";
  document.querySelector(".flight-book-button").focus();
});

bookingEnquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  passengerDetails = Object.fromEntries(new FormData(event.currentTarget));
  bookingDetailsStep.hidden = true;
  seatSelectionStep.hidden = false;
  dialogTitle.textContent = "Choose your seat";
  seatStepCopy.textContent = `Select ${currentSearch.passengerTotal} preferred seat${currentSearch.passengerTotal === 1 ? "" : "s"}. Seat availability is confirmed by our team on WhatsApp.`;
  seatMessage.textContent = `Choose ${currentSearch.passengerTotal} seat preference${currentSearch.passengerTotal === 1 ? "" : "s"} to continue.`;
  seatGrid.querySelector(".seat-button").focus();
});

document.querySelector("#back-to-details").addEventListener("click", () => {
  seatSelectionStep.hidden = true;
  bookingDetailsStep.hidden = false;
  dialogTitle.textContent = "Complete your booking enquiry";
  document.querySelector('input[name="fullName"]').focus();
});

for (let row = 1; row <= 8; row += 1) {
  for (const column of ["A", "B", "C", "D"]) {
    const seat = document.createElement("button");
    seat.type = "button";
    seat.className = "seat-button";
    seat.textContent = `${row}${column}`;
    seat.dataset.seat = `${row}${column}`;
    seat.setAttribute("aria-pressed", "false");
    seat.setAttribute("aria-label", `Choose seat ${row}${column}`);
    seatGrid.append(seat);
  }
}

seatGrid.addEventListener("click", (event) => {
  const seat = event.target.closest(".seat-button");
  if (!seat) return;
  const seatCode = seat.dataset.seat;
  const selectedIndex = selectedSeats.indexOf(seatCode);
  if (selectedIndex >= 0) {
    selectedSeats.splice(selectedIndex, 1);
    seat.classList.remove("is-selected");
    seat.setAttribute("aria-pressed", "false");
  } else if (selectedSeats.length < currentSearch.passengerTotal) {
    selectedSeats.push(seatCode);
    seat.classList.add("is-selected");
    seat.setAttribute("aria-pressed", "true");
  } else {
    seatMessage.textContent = `You have selected ${currentSearch.passengerTotal} seat preferences. Remove one before choosing another.`;
    return;
  }

  if (selectedSeats.length < currentSearch.passengerTotal) {
    const remaining = currentSearch.passengerTotal - selectedSeats.length;
    seatMessage.textContent = `Select ${remaining} more seat preference${remaining === 1 ? "" : "s"}.`;
    whatsappConfirmButton.hidden = true;
    return;
  }

  const details = passengerDetails;
  const totalFare = currentFlight.farePerJourney * currentSearch.journeyCount * currentSearch.passengerTotal;
  const message = [
    "Hey there! I'd like to enquire about confirming a flight booking.",
    `Route: ${currentSearch.origin} to ${currentSearch.destination}`,
    `Trip: ${currentSearch.tripType}`,
    currentSearch.depart ? `Depart: ${currentSearch.depart}` : "",
    currentSearch.returnDate ? `Return: ${currentSearch.returnDate}` : "",
    `Passengers: ${currentSearch.passengers}`,
    `Fare option: ${currentFlight.label}`,
    `Fare per passenger per journey: KSh ${formatFare(currentFlight.farePerJourney)}`,
    `Journeys: ${currentSearch.journeyCount}`,
    `Indicative total fare: KSh ${formatFare(totalFare)}`,
    `Preferred seats (subject to confirmation): ${selectedSeats.join(", ")}`,
    currentSearch.flexible ? "Dates are flexible" : "",
    currentSearch.coupon ? `Coupon: ${currentSearch.coupon}` : "",
    `Currency preference: ${currentSearch.currency}`,
    `Name: ${details.fullName}`,
    `ID/Passport: ${details.idNumber}`,
    `Passenger type: ${details.passengerType}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    details.specialRequest ? `Special request: ${details.specialRequest}` : "",
    "Please confirm the schedule, seat availability, and final fare."
  ].filter(Boolean).join("\n");

  seatMessage.textContent = `Seat preferences: ${selectedSeats.join(", ")}.`;
  whatsappConfirmButton.href = `https://wa.me/254785195669?text=${encodeURIComponent(message)}`;
  whatsappConfirmButton.hidden = false;
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
