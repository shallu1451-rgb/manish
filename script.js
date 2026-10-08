/* ==========================================================================
   MANISH TOUR AND TRAVELS — JAVASCRIPT LOGIC & INTERACTIVITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initDestinationsTrack();
  initDateConstraints();
  calculateTripEstimate();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
const mobileToggle = document.getElementById('mobileToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const closeDrawer = document.getElementById('closeDrawer');

function initMobileMenu() {
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeDrawer && mobileDrawer) {
    closeDrawer.addEventListener('click', closeMobileMenu);
  }
}

function closeMobileMenu() {
  if (mobileDrawer) {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   3. DESTINATIONS CAROUSEL DATA & POPULATION
   -------------------------------------------------------------------------- */
const destinationsData = [
  {
    title: 'Srinagar & Dal Lake',
    desc: 'Houseboats, tranquil shikara cruises, and historic Mughal Pleasure Gardens.',
    tag: 'Heart of Kashmir',
    img: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Gulmarg Meadows',
    desc: 'The world-famous gondola ride, snow slopes, and Apharwat mountain peak.',
    tag: 'Snow & Skiing',
    img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Pahalgam Valley',
    desc: 'Lidder river rapids, pine forests, Betaab Valley, and picturesque Aru valley.',
    tag: 'Valley of Shepherds',
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Sonmarg',
    desc: 'Gateway to the rugged Thajiwas Glacier and roaring Sindh River.',
    tag: 'Meadow of Gold',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Doodhpathri',
    desc: 'Unspoiled carpet of lush green meadows and rushing Shaliganga stream.',
    tag: 'Valley of Milk',
    img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Gurez Valley',
    desc: 'Pristine offbeat border valley with Habba Khatoon peak and Kishan Ganga river.',
    tag: 'Untouched Paradise',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
  }
];

function initDestinationsTrack() {
  const track = document.getElementById('destTrack');
  if (!track) return;

  const cardsHtml = destinationsData.map(d => `
    <div class="dest-card-item">
      <img src="${d.img}" alt="${d.title}" loading="lazy">
      <div class="dest-card-gradient">
        <span class="dest-card-chip">${d.tag}</span>
        <h3 class="dest-card-title">${d.title}</h3>
        <p class="dest-card-desc">${d.desc}</p>
      </div>
    </div>
  `).join('');

  // Duplicate for seamless infinite marquee loop
  track.innerHTML = cardsHtml + cardsHtml;
}

/* --------------------------------------------------------------------------
   4. PACKAGE FILTER TABS
   -------------------------------------------------------------------------- */
function filterPackages(category, tabBtn) {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (tabBtn) tabBtn.classList.add('active');

  const cards = document.querySelectorAll('.package-card');
  cards.forEach(card => {
    const cardCat = card.dataset.category;
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE TRIP ESTIMATOR & COST CALCULATOR
   -------------------------------------------------------------------------- */
function calculateTripEstimate() {
  const circuit = document.getElementById('calcCircuit').value;
  const days = parseInt(document.getElementById('calcDuration').value, 10) || 5;
  const pax = parseInt(document.getElementById('calcPax').value, 10) || 2;
  const tier = document.getElementById('calcTier').value;

  // Base per-person per-day rates
  let baseRatePerDay = 3500;
  if (circuit === 'kashmir-complete') baseRatePerDay = 4000;
  if (circuit === 'kashmir-ladakh') baseRatePerDay = 5500;
  if (circuit === 'kashmir-vaishno') baseRatePerDay = 3800;

  // Hotel Tier Multiplier
  let tierMultiplier = 1.0;
  if (tier === 'super-deluxe') tierMultiplier = 1.35;
  if (tier === 'luxury') tierMultiplier = 2.1;

  // Group discounts for pax >= 4
  let paxEconomy = 1.0;
  if (pax >= 4) paxEconomy = 0.88;
  if (pax >= 6) paxEconomy = 0.80;

  const totalEstimate = Math.round(baseRatePerDay * days * pax * tierMultiplier * paxEconomy);
  const formatted = '₹' + totalEstimate.toLocaleString('en-IN');

  const displayEl = document.getElementById('calcDisplayPrice');
  if (displayEl) {
    displayEl.textContent = formatted;
  }

  const breakdownEl = document.getElementById('calcBreakdown');
  if (breakdownEl) {
    breakdownEl.textContent = `For ${pax} Guests (${days}D/${days - 1}N) in ${tier.replace('-', ' ').toUpperCase()} stays. Includes private cab, driver allowance, tolls, breakfasts & dinners.`;
  }
}

function sendCalculatedToWhatsApp() {
  const circuitEl = document.getElementById('calcCircuit');
  const circuitText = circuitEl.options[circuitEl.selectedIndex].text;
  const days = document.getElementById('calcDuration').value;
  const pax = document.getElementById('calcPax').value;
  const tier = document.getElementById('calcTier').value;
  const price = document.getElementById('calcDisplayPrice').textContent;

  const message = `Hello Manish Tour and Travels! 🏔️
I calculated a custom trip package on your website:
• Circuit: ${circuitText}
• Duration: ${days} Days
• Guests: ${pax} Persons
• Hotel Tier: ${tier.toUpperCase()}
• Estimated Cost: ${price}

Kindly share the detailed itinerary and your best final quote. Thank you!`;

  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

/* --------------------------------------------------------------------------
   6. DAY-BY-DAY ITINERARY MODAL
   -------------------------------------------------------------------------- */
const itinerariesDatabase = {
  'srinagar-classic': {
    title: 'Srinagar Classic & Scenic Valleys (5 Days / 4 Nights)',
    days: [
      { day: 'Day 1', title: 'Arrival at Srinagar & Shikara Sunset Cruise', desc: 'Warm reception at Srinagar Airport. Transfer to Dal Lake luxury houseboat. Enjoy a romantic 1-hour sunset Shikara ride across floating gardens and Char Chinar.' },
      { day: 'Day 2', title: 'Srinagar to Gulmarg Excursion (Meadow of Flowers)', desc: 'Scenic drive to Gulmarg via Tangmarg pine slopes. Board the world-famous Gondola Cable Car up to Kongdoori & Apharwat Peak. Enjoy snow activities and return to Srinagar.' },
      { day: 'Day 3', title: 'Srinagar to Pahalgam (Valley of Shepherds)', desc: 'Journey past saffron fields in Pampore and Awantipora ruins. Arrive in Pahalgam on the banks of Lidder River. Visit Betaab Valley, Chandanwari, and lush Aru Valley.' },
      { day: 'Day 4', title: 'Pahalgam to Srinagar & Mughal Gardens Tour', desc: 'Return drive to Srinagar. Explore historical Nishat Bagh, Shalimar Garden, and Chashme Shahi. Evening stroll around the bustling Lal Chowk and old city bazars.' },
      { day: 'Day 5', title: 'Souvenir Shopping & Airport Departure', desc: 'Morning visit to local artisan workshops for authentic Pashmina shawls, saffron, and dry fruits. Private transfer to Srinagar Airport for your onward flight.' }
    ]
  },
  'honeymoon-romance': {
    title: 'Royal Kashmir Honeymoon Romance (6 Days / 5 Nights)',
    days: [
      { day: 'Day 1', title: 'VIP Arrival & Decorated Houseboat Experience', desc: 'Welcome garland and private cab transfer. Check in to your floral decorated honeymoon houseboat on Dal Lake. Enjoy a private couple photoshoot during a sunset shikara ride, followed by candlelight dinner and cake.' },
      { day: 'Day 2', title: 'Sonmarg Day Trip (The Golden Meadow)', desc: 'Drive through Sindh valley. Visit Thajiwas glacier by pony or sledge ride. Return for a cozy evening in Srinagar.' },
      { day: 'Day 3', title: 'Srinagar to Gulmarg Alpine Haven', desc: 'Transfer to Gulmarg. Check into a heated luxury resort. Enjoy Gondola Phase 1 & 2 rides and breathtaking snow views together.' },
      { day: 'Day 4', title: 'Gulmarg to Pahalgam Valley of Love', desc: 'Picturesque drive to Pahalgam. Check in to a riverside boutique resort. Evening riverside campfire and cozy dinner.' },
      { day: 'Day 5', title: 'Baisaran Valley (Mini Switzerland) & Betaab Valley', desc: 'Ride ponies up into the dense pine glades of Baisaran. Visit the film-famed Betaab Valley and scenic Aru waterfalls.' },
      { day: 'Day 6', title: 'Farewell & Transfer to Srinagar Airport', desc: 'Breakfast with panoramic mountain views. Transfer with warm memories and souvenirs to Srinagar Airport.' }
    ]
  },
  'gulmarg-snow': {
    title: 'Gulmarg Snow Peaks & Ski Escape (5 Days / 4 Nights)',
    days: [
      { day: 'Day 1', title: 'Srinagar Airport to Gulmarg Mountain Resort', desc: 'Pickup in private chain-fitted snow vehicle. Ascend through snowy pine forests to Gulmarg. Check in to heated alpine hotel.' },
      { day: 'Day 2', title: 'Gondola Phase 1 & 2 Apharwat Peak Skiing', desc: 'Priority tickets for Gondola Cable Car up to 13,780 ft. Introductory ski session with certified instructor and gear.' },
      { day: 'Day 3', title: 'Snowmobile Safari & Drung Frozen Waterfall', desc: 'Snowmobile across the golf course snow blanket. Day excursion to the magnificent ice crystals of Drung frozen waterfall.' },
      { day: 'Day 4', title: 'Gulmarg to Srinagar Dal Lake Experience', desc: 'Descend to Srinagar. Experience winter Dal Lake on a heated luxury houseboat with hot traditional Kashmiri Kahwa.' },
      { day: 'Day 5', title: 'Srinagar Departure', desc: 'Transfer to Srinagar Airport with unforgettable winter memories.' }
    ]
  },
  'complete-family': {
    title: 'Complete Kashmir Grand Family Tour (7 Days / 6 Nights)',
    days: [
      { day: 'Day 1', title: 'Arrival in Srinagar & Dal Lake Houseboat Check-in', desc: 'Family pickup in spacious Toyota Innova Crysta. Relax on a family suite houseboat with evening Shikara tour.' },
      { day: 'Day 2', title: 'Srinagar to Sonmarg Glacier Fun', desc: 'Family excursion to Sonmarg. Pony rides, snow sledging for kids, and lunch by the river.' },
      { day: 'Day 3', title: 'Srinagar to Gulmarg Gondola Experience', desc: 'Exciting cable car ride for the whole family, snowball fights, and visiting the historic St. Mary Church.' },
      { day: 'Day 4', title: 'Gulmarg to Pahalgam Valley', desc: 'Drive through saffron fields and Apple orchards. Check in to riverside family resort in Pahalgam.' },
      { day: 'Day 5', title: 'Pahalgam Sightseeing: Betaab, Aru & Chandanwari', desc: 'Full day exploring lush valleys, pine woods, and river rafting points.' },
      { day: 'Day 6', title: 'Doodhpathri Day Trip & Royal Wazwan Dinner', desc: 'Visit the pristine green meadows and crystal streams of Doodhpathri. Evening traditional 7-course Wazwan family banquet.' },
      { day: 'Day 7', title: 'Mughal Gardens Walk & Airport Drop', desc: 'Visit Shalimar & Nishat gardens before departure from Srinagar Airport.' }
    ]
  },
  'great-lakes': {
    title: 'Kashmir Great Lakes Alpine Trek (8 Days / 7 Nights)',
    days: [
      { day: 'Day 1', title: 'Srinagar to Sonmarg Base Camp (Shitkadi)', desc: 'Drive to Shitkadi basecamp. Acclimatization walk and trail briefing.' },
      { day: 'Day 2', title: 'Shitkadi to Nichnai via Shekdur', desc: 'Ascend through silver birch forests with views of Sonmarg valley to Nichnai campsite.' },
      { day: 'Day 3', title: 'Nichnai to Vishansar Lake via Nichnai Pass (13,500 ft)', desc: 'Cross the dramatic pass to reach the stunning alpine waters of Vishansar.' },
      { day: 'Day 4', title: 'Vishansar to Gadsar Lake via Gadsar Pass (13,750 ft)', desc: 'Trek past twin lake Kishansar. Cross the highest pass to Gadsar meadow of flowers.' },
      { day: 'Day 5', title: 'Gadsar to Satsar (Seven Lakes)', desc: 'Gentle walk over alpine meadows to Satsar emerald lake cluster.' },
      { day: 'Day 6', title: 'Satsar to Gangabal Twin Lakes via Zaj Pass', desc: 'Breathtaking descent with majestic views of Mt. Harmukh and Gangabal Lake.' },
      { day: 'Day 7', title: 'Rest & Exploration Day at Gangabal Lake', desc: 'Explore Nundkol lake, trout fishing, and Harmukh glacier views.' },
      { day: 'Day 8', title: 'Gangabal to Naranag & Srinagar Transfer', desc: 'Descend through pine forests to historic Naranag temple ruins. Transfer to Srinagar.' }
    ]
  },
  'royal-heritage': {
    title: 'Imperial Kashmir Royal Heritage Tour (8 Days / 7 Nights)',
    days: [
      { day: 'Day 1', title: 'VIP Arrival & Presidential Suite Houseboat', desc: 'Chauffeured in Mercedes / Fortuner. Private Maharaja suite houseboat with royal butler.' },
      { day: 'Day 2', title: 'Helicopter Sightseeing & Gulmarg Khyber Resort', desc: 'Scenic helicopter panoramic flight over the valley. Check in to the prestigious Khyber Himalayan Resort & Spa.' },
      { day: 'Day 3', title: 'VIP Gondola & High Alpine Dining', desc: 'Exclusive access to Apharwat peak with gourmet champagne picnic.' },
      { day: 'Day 4', title: 'Pahalgam Luxury Heritage Cottage', desc: 'Transfer to Pahalgam private cedar luxury cottage along the Lidder River.' },
      { day: 'Day 5', title: 'Private Aru Valley Exploration & Trout Fishing', desc: 'Angling experience with expert ghillies and bespoke afternoon high tea.' },
      { day: 'Day 6', title: 'Srinagar Old Heritage Walk & Saffron Dinner', desc: 'Curated historic walk through Jamia Masjid, Rozabal, and private saffron farm dining.' },
      { day: 'Day 7', title: 'Dal Lake Royal Shikara & Spa Rejuvenation', desc: 'Luxury Ayurvedic spa treatments followed by twilight private Shikara cruise.' },
      { day: 'Day 8', title: 'VIP Airport Protocol & Departure', desc: 'Airport assistance with dedicated lounge access.' }
    ]
  }
};

let currentSelectedPackage = 'Custom Kashmir Holiday';

function showItineraryModal(key) {
  const data = itinerariesDatabase[key];
  if (!data) return;

  currentSelectedPackage = data.title;
  document.getElementById('itinTitle').textContent = data.title;

  const content = `
    <div class="itinerary-timeline">
      ${data.days.map(d => `
        <div class="itinerary-day">
          <b>${d.day}</b>
          <h5>${d.title}</h5>
          <p>${d.desc}</p>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('itinContent').innerHTML = content;
  const modal = document.getElementById('itineraryModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeItineraryModal() {
  const modal = document.getElementById('itineraryModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function bookFromItinerary() {
  closeItineraryModal();
  openEnquiryModal(currentSelectedPackage);
}

/* --------------------------------------------------------------------------
   7. ENQUIRY / BOOKING MODAL
   -------------------------------------------------------------------------- */
function openEnquiryModal(packageName) {
  const modal = document.getElementById('enquiryModal');
  const title = document.getElementById('modalPackageTitle');
  const hidden = document.getElementById('modalHiddenPackage');

  if (title) title.textContent = packageName || 'Custom Kashmir Holiday';
  if (hidden) hidden.value = packageName || 'Custom Kashmir Holiday';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEnquiryModal() {
  const modal = document.getElementById('enquiryModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modals when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* --------------------------------------------------------------------------
   8. FORM SUBMISSIONS & WHATSAPP REDIRECTIONS
   -------------------------------------------------------------------------- */
function handleLeadSubmit(event, source) {
  event.preventDefault();
  const form = event.target;
  const name = form.querySelector('input[type="text"]')?.value || 'Guest';
  const phone = form.querySelector('input[type="tel"]')?.value || '';
  const date = form.querySelector('input[type="date"]')?.value || 'Upcoming';
  const packagePref = form.querySelector('select')?.value || 'Kashmir Tour';

  const waMessage = `Hello Manish Tour and Travels! 🏔️
I just submitted an enquiry on your website (${source}):
• Name: ${name}
• Phone: ${phone}
• Travel Date: ${date}
• Package: ${packagePref}

Please share a customized day-wise itinerary and quote. Thank you!`;

  alert(`Thank you, ${name}! Your travel enquiry has been received. Our senior holiday planner will contact you within 30 minutes.\n\nOpening WhatsApp so you can get an immediate quote...`);
  
  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(waMessage)}`;
  window.open(waUrl, '_blank');
  form.reset();
}

function handleModalSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('modalName').value;
  const phone = document.getElementById('modalPhone').value;
  const date = document.getElementById('modalDate').value;
  const pax = document.getElementById('modalPax').value;
  const pkg = document.getElementById('modalHiddenPackage').value;
  const msg = document.getElementById('modalMessage').value;

  const waMessage = `Hello Manish Tour and Travels! 🏔️
Booking request for: *${pkg}*
• Name: ${name}
• Mobile: ${phone}
• Arrival Date: ${date}
• Travelers: ${pax}
• Notes: ${msg || 'None'}

Please confirm availability and share payment/booking details.`;

  closeEnquiryModal();
  alert(`Thank you, ${name}! Your booking request for ${pkg} has been submitted.\n\nConnecting you directly to WhatsApp for priority confirmation.`);
  
  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(waMessage)}`;
  window.open(waUrl, '_blank');
}

function handleNewsletter(event) {
  event.preventDefault();
  event.target.reset();
  alert('🎉 Congratulations! You have subscribed to secret season deals and special promotions from Manish Tour and Travels.');
}

/* --------------------------------------------------------------------------
   9. FAQS ACCORDION
   -------------------------------------------------------------------------- */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasActive = item.classList.contains('active');

  // Close all
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

  // Toggle current
  if (!wasActive) {
    item.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   10. DATE CONSTRAINTS
   -------------------------------------------------------------------------- */
function initDateConstraints() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
  });
}
