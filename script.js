/* =========================================================
   MERIDIAN & STONE — script.js
   Vanilla JS only. Organized by section, no dependencies.
   MULTI-PAGE VERSION (corrected)
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     0. SMALL UTILITIES
  --------------------------------------------------------- */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

  function debounce(fn, wait = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function img(id, w = 900, h = 650) {
    return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
  }

  // FIX: guard against double-binding — only attach the fallback once per element
  function withFallback(imgEl, seed) {
    if (!imgEl || imgEl.dataset.fallbackBound === "1") return;
    imgEl.dataset.fallbackBound = "1";
    imgEl.addEventListener("error", function once() {
      imgEl.removeEventListener("error", once);
      imgEl.src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/650`;
    });
  }

  function mapEmbed(query) {
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }

  /* ---------------------------------------------------------
     1. DATA
  --------------------------------------------------------- */
  const IMG = {
    villaExt1: img("1600585154340-be6161a56a0c"),
    interior1: img("1600607687939-ce8a6c25118c"),
    livingRoom1: img("1600566753086-00f18fb6b3ea"),
    houseExt1: img("1512917774080-9991f1c4c750"),
    villaExt2: img("1580587771525-78b9dba3b914"),
    livingRoom2: img("1600047509807-ba8f99d2cdde"),
    bedroom1: img("1600210492486-724fe5c67fb0"),
    kitchen1: img("1600585154526-990dced4db0d"),
    interior2: img("1502005229762-cf1b2da7c5d6"),
    houseNight: img("1521783988139-89397d761dcc"),
    penthouse1: img("1568605114967-8130f3a36994"),
    loft1: img("1502672260266-1c1ef2d93688"),
    cabinExt1: img("1449158743715-0a90ebb6d2d8"),
    cabinExt2: img("1449844908441-8829872d2607"),
    apartment1: img("1518481612222-68bbe828ecd1"),
    kitchen2: img("1484154218962-a197022b5858"),
    bathroom1: img("1600566752355-35792bedcfea"),
    mansion1: img("1613977257363-707ba9348227"),
    interior3: img("1493809842364-78817add7ffb"),
  };

  const AMENITY_POOL = [
    "Infinity pool",
    "Wine cellar",
    "Private cinema",
    "Smart home system",
    "Chef's kitchen",
    "Heated floors",
    "Guest house",
    "Home gym",
    "Elevator",
    "Ocean view",
    "Mountain view",
    "Solar power",
    "Wraparound terrace",
    "Fireplace",
    "4-car garage",
    "Spa bathroom",
    "Rooftop deck",
    "Gated entry",
    "Boat dock",
    "Sauna",
  ];

  function pickAmenities(seed) {
    const list = [];
    for (let i = 0; i < 7; i++) {
      list.push(AMENITY_POOL[(seed + i * 3) % AMENITY_POOL.length]);
    }
    return [...new Set(list)];
  }

  let PROPERTIES = [
    {
      id: "p1",
      title: "The Glasshouse",
      type: "villa",
      city: "Malibu",
      region: "California",
      price: 8250000,
      beds: 5,
      baths: 6,
      size: 6200,
      year: 2021,
      tag: "Featured",
      lat: "Malibu, CA",
      images: [IMG.villaExt1, IMG.interior1, IMG.livingRoom1, IMG.bedroom1],
      description:
        "Set into the bluff above Point Dume, The Glasshouse is a single continuous plane of retractable glass framing an uninterrupted Pacific horizon. Walnut and limestone throughout; the pool cantilevers over the slope below.",
      amenities: pickAmenities(1),
    },
    {
      id: "p2",
      title: "Aldbury Manor",
      type: "estate",
      city: "Cotswolds",
      region: "England",
      price: 12500000,
      beds: 8,
      baths: 9,
      size: 11400,
      year: 1897,
      tag: "Featured",
      lat: "Cotswolds, UK",
      images: [IMG.mansion1, IMG.interior2, IMG.livingRoom2, IMG.kitchen1],
      description:
        "A restored Victorian estate on 42 acres, Aldbury Manor keeps its original stonework and adds a discreet geothermal system beneath the walled garden. Stables, a lake, and a gatehouse cottage included.",
      amenities: pickAmenities(2),
    },
    {
      id: "p3",
      title: "Sky Residence 41",
      type: "penthouse",
      city: "Manhattan",
      region: "New York",
      price: 18900000,
      beds: 4,
      baths: 5,
      size: 4800,
      year: 2019,
      tag: "New",
      lat: "Manhattan, New York",
      images: [IMG.penthouse1, IMG.loft1, IMG.interior3, IMG.kitchen2],
      description:
        "Two floors atop a Billionaires' Row tower, Sky Residence 41 wraps Central Park in floor-to-ceiling glass. Private elevator landing, a 1,200-bottle cellar, and a wraparound terrace with an outdoor kitchen.",
      amenities: pickAmenities(3),
    },
    {
      id: "p4",
      title: "Casa Serrano",
      type: "villa",
      city: "Marbella",
      region: "Spain",
      price: 6400000,
      beds: 6,
      baths: 7,
      size: 7100,
      year: 2018,
      tag: "Featured",
      lat: "Marbella, Spain",
      images: [IMG.villaExt2, IMG.livingRoom1, IMG.bathroom1, IMG.kitchen1],
      description:
        "Andalusian in bone structure, entirely contemporary inside. Casa Serrano steps down four terraces to a Mediterranean-facing infinity pool, with a separate guest pavilion at the lowest level.",
      amenities: pickAmenities(4),
    },
    {
      id: "p5",
      title: "Timberline Retreat",
      type: "cabin",
      city: "Aspen",
      region: "Colorado",
      price: 4750000,
      beds: 4,
      baths: 4,
      size: 3600,
      year: 2016,
      tag: "New",
      lat: "Aspen, Colorado",
      images: [IMG.cabinExt1, IMG.cabinExt2, IMG.interior2, IMG.bedroom1],
      description:
        "Cedar and blackened steel against the Elk Mountains. Timberline Retreat is ski-in/ski-out, ten minutes from town, with a double-height great room built around a single hand-set stone chimney.",
      amenities: pickAmenities(5),
    },
    {
      id: "p6",
      title: "The Archive Loft",
      type: "apartment",
      city: "Chicago",
      region: "Illinois",
      price: 2150000,
      beds: 2,
      baths: 2,
      size: 2400,
      year: 1929,
      tag: "",
      lat: "Chicago, Illinois",
      images: [IMG.apartment1, IMG.loft1, IMG.kitchen2, IMG.interior3],
      description:
        "A former print-house floor in the West Loop, kept raw: original timber columns, factory windows, and a kitchen built into what was once the composing room.",
      amenities: pickAmenities(6),
    },
    {
      id: "p7",
      title: "Villa Corallo",
      type: "villa",
      city: "Positano",
      region: "Italy",
      price: 9800000,
      beds: 5,
      baths: 6,
      size: 5300,
      year: 2015,
      tag: "Featured",
      lat: "Positano, Italy",
      images: [IMG.villaExt2, IMG.houseNight, IMG.livingRoom2, IMG.bathroom1],
      description:
        "Terraced into the cliff above the Tyrrhenian Sea, Villa Corallo is reachable by private funicular. Every room opens onto the water; the lowest terrace has direct sea access.",
      amenities: pickAmenities(7),
    },
    {
      id: "p8",
      title: "North Pier House",
      type: "estate",
      city: "Lake Como",
      region: "Italy",
      price: 15400000,
      beds: 7,
      baths: 8,
      size: 8900,
      year: 1932,
      tag: "",
      lat: "Lake Como, Italy",
      images: [IMG.houseExt1, IMG.interior1, IMG.livingRoom1, IMG.kitchen1],
      description:
        "A lakefront estate with its own boathouse and stone pier, restored over three years with the original frescoes intact. Formal gardens run the full 200 feet of waterfront.",
      amenities: pickAmenities(8),
    },
    {
      id: "p9",
      title: "Ridgeline House",
      type: "villa",
      city: "Queenstown",
      region: "New Zealand",
      price: 5600000,
      beds: 4,
      baths: 5,
      size: 4200,
      year: 2020,
      tag: "New",
      lat: "Queenstown, New Zealand",
      images: [IMG.houseExt1, IMG.interior2, IMG.bedroom1, IMG.kitchen2],
      description:
        "Cut into the ridge above Lake Wakatipu, Ridgeline House uses a single material palette — board-formed concrete and schist — to disappear into the landscape it overlooks.",
      amenities: pickAmenities(9),
    },
    {
      id: "p10",
      title: "Harbourside 12",
      type: "penthouse",
      city: "Sydney",
      region: "Australia",
      price: 11200000,
      beds: 3,
      baths: 4,
      size: 3900,
      year: 2022,
      tag: "",
      lat: "Sydney, Australia",
      images: [IMG.penthouse1, IMG.interior3, IMG.loft1, IMG.livingRoom2],
      description:
        "Two apartments combined into one, Harbourside 12 looks directly down the harbour to the Opera House. A private rooftop plunge pool is accessed by internal stair.",
      amenities: pickAmenities(10),
    },
    {
      id: "p11",
      title: "Cedar Hollow",
      type: "cabin",
      city: "Whistler",
      region: "British Columbia",
      price: 3400000,
      beds: 3,
      baths: 3,
      size: 2800,
      year: 2017,
      tag: "",
      lat: "Whistler, BC",
      images: [IMG.cabinExt2, IMG.cabinExt1, IMG.bedroom1, IMG.interior2],
      description:
        "A forest-set retreat with a detached sauna house and cold plunge, five minutes from the gondola. Built almost entirely from timber milled on the property.",
      amenities: pickAmenities(11),
    },
    {
      id: "p12",
      title: "The Lindqvist",
      type: "apartment",
      city: "Stockholm",
      region: "Sweden",
      price: 2900000,
      beds: 3,
      baths: 2,
      size: 2600,
      year: 2020,
      tag: "",
      lat: "Stockholm, Sweden",
      images: [IMG.apartment1, IMG.kitchen2, IMG.interior3, IMG.bathroom1],
      description:
        "A quiet, considered apartment on Strandvägen with unbroken water views and a facade protected by the city's heritage board — updated inside with radiant floors and a sauna suite.",
      amenities: pickAmenities(12),
    },
  ];

  const AGENTS = [
    {
      id: "a1",
      name: "Isabelle Moreau",
      role: "Senior Partner",
      photo: img("1522075469751-3a6694fb2f61", 600, 700),
      sales: "$412M career sales",
      phone: "15550001",
      email: "isabelle@meridianandstone.com",
    },
    {
      id: "a2",
      name: "Marcus Webb",
      role: "Coastal Properties",
      photo: img("1519085360753-af0119f7cbe7", 600, 700),
      sales: "$298M career sales",
      phone: "15550002",
      email: "marcus@meridianandstone.com",
    },
    {
      id: "a3",
      name: "Priya Nandan",
      role: "Urban Residences",
      photo: img("1580489944761-15a19d654956", 600, 700),
      sales: "$355M career sales",
      phone: "15550003",
      email: "priya@meridianandstone.com",
    },
    {
      id: "a4",
      name: "Theo Bergman",
      role: "International Estates",
      photo: img("1500648767791-00dcc994a43e", 600, 700),
      sales: "$521M career sales",
      phone: "15550004",
      email: "theo@meridianandstone.com",
    },
  ];

  const TEAM = [
    {
      name: "Eleanor Voss",
      role: "Founding Partner",
      photo: img("1580489944761-15a19d654956", 400, 400),
    },
    {
      name: "Nathaniel Cross",
      role: "Managing Director",
      photo: img("1500648767791-00dcc994a43e", 400, 400),
    },
    {
      name: "Sofia Larsen",
      role: "Head of Marketing",
      photo: img("1522075469751-3a6694fb2f61", 400, 400),
    },
    {
      name: "David Odum",
      role: "Head of Legal",
      photo: img("1519085360753-af0119f7cbe7", 400, 400),
    },
  ];

  const TESTIMONIALS = [
    {
      quote:
        "They found us a house before it ever reached a listing site. Three viewings, no drama, done in eleven days.",
      name: "R. Halston",
      role: "Buyer, Malibu",
    },
    {
      quote:
        "Meridian & Stone priced our estate correctly the first time. We didn't sit on the market for a single week.",
      name: "The Aldbury Family",
      role: "Seller, Cotswolds",
    },
    {
      quote:
        "Every viewing was accompanied by someone who actually understood the architecture. Rare, at this level.",
      name: "C. Iwata",
      role: "Buyer, Manhattan",
    },
    {
      quote:
        "Discreet is the right word. Nobody outside our desk ever knew the sale was happening.",
      name: "Anonymous",
      role: "Seller, Lake Como",
    },
    {
      quote:
        "We compared four brokerages. Meridian & Stone was the only one that had already walked every comparable in the area.",
      name: "J. Okafor",
      role: "Buyer, Sydney",
    },
  ];

  const FAQS = [
    {
      q: "Do you only represent off-market residences?",
      a: "No — roughly a third of our current collection is fully public. The rest is shown by appointment only, prior to any public listing.",
    },
    {
      q: "Can international buyers arrange a private viewing remotely?",
      a: "Yes. We run accompanied video walkthroughs for any residence in the collection, followed by a live call with the listing partner.",
    },
    {
      q: "What is your commission structure?",
      a: "Standard representation is 5–6%, split between listing and buyer-side partners, disclosed in full before any agreement is signed.",
    },
    {
      q: "Do you handle new-construction and off-plan sales?",
      a: "Selectively. We currently represent four private developments; each is vetted by our own desk before it is added to the collection.",
    },
    {
      q: "Is financing assistance available?",
      a: "We work with a small panel of private banks experienced in jumbo and cross-border lending, and can make an introduction on request.",
    },
    {
      q: "How quickly can a viewing be arranged?",
      a: "Most viewings are confirmed within one business day. Same-day viewings are possible for serious, pre-qualified buyers.",
    },
  ];

  const JOURNAL = [
    {
      title: "What Actually Holds Coastal Value in 2026",
      excerpt:
        "Setback rules, insurance markets and the quiet re-pricing of waterfront.",
      img: img("1600566753086-00f18fb6b3ea", 700, 500),
      cat: "Market",
      date: "Jun 2026",
    },
    {
      title: "Inside the Restoration of Aldbury Manor",
      excerpt:
        "Eighteen months, one walled garden, and a geothermal system nobody can see.",
      img: img("1600607687939-ce8a6c25118c", 700, 500),
      cat: "Case Study",
      date: "May 2026",
    },
    {
      title: "The Case for Buying Off-Market",
      excerpt:
        "Why the best residences we sell never appear on a public search.",
      img: img("1512917774080-9991f1c4c750", 700, 500),
      cat: "Advisory",
      date: "Apr 2026",
    },
    {
      title: "Reading an Architect's Floor Plan Like a Buyer",
      excerpt: "Five things worth flagging before you fall for the render.",
      img: img("1600047509807-ba8f99d2cdde", 700, 500),
      cat: "Guide",
      date: "Mar 2026",
    },
    {
      title: "Alpine Retreats: The New Long Stay",
      excerpt:
        "Why four-season mountain houses are outperforming pure ski chalets.",
      img: img("1449158743715-0a90ebb6d2d8", 700, 500),
      cat: "Market",
      date: "Feb 2026",
    },
    {
      title: "Provenance, Explained",
      excerpt:
        "What we actually check before a residence enters the collection.",
      img: img("1568605114967-8130f3a36994", 700, 500),
      cat: "Advisory",
      date: "Jan 2026",
    },
  ];

  const MAP_REGIONS = [
    { name: "California, USA", query: "Malibu, California" },
    { name: "Cotswolds, England", query: "Cotswolds, UK" },
    { name: "Manhattan, New York", query: "Manhattan, New York" },
    { name: "Costa del Sol, Spain", query: "Marbella, Spain" },
    { name: "Amalfi Coast, Italy", query: "Positano, Italy" },
    { name: "Lake Como, Italy", query: "Lake Como, Italy" },
  ];

  /* ---------------------------------------------------------
     2. STATE (persisted to localStorage)
  --------------------------------------------------------- */
  const STORE_KEYS = {
    fav: "ms_favorites",
    recent: "ms_recent",
    compare: "ms_compare",
    search: "ms_search",
  };

  const state = {
    favorites: JSON.parse(localStorage.getItem(STORE_KEYS.fav) || "[]"),
    recent: JSON.parse(localStorage.getItem(STORE_KEYS.recent) || "[]"),
    compare: JSON.parse(localStorage.getItem(STORE_KEYS.compare) || "[]"),
    visibleCount: 6,
    testiIndex: 0,
    currentModalId: null, // FIX: track which property modal is open so fav/compare can update in place
  };

  function persist(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function getProperty(id) {
    return PROPERTIES.find((p) => p.id === id);
  }

  /* ---------------------------------------------------------
     3. TOASTS
  --------------------------------------------------------- */
  function toast(message, type = "success") {
    const stack = qs("#toastStack");
    if (!stack) return;
    const el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " toast--error" : "");
    el.textContent = message;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-shown"));
    setTimeout(() => {
      el.classList.remove("is-shown");
      setTimeout(() => el.remove(), 500);
    }, 3800);
  }

  /* ---------------------------------------------------------
     4. CARD BUILDERS
  --------------------------------------------------------- */
  function propertyCardHTML(p) {
    const isFav = state.favorites.includes(p.id);
    const isCompare = state.compare.includes(p.id);
    return `
    <article class="property-card" data-id="${p.id}">
      <div class="property-card__media">
        <img src="${p.images[0]}" alt="${p.title} exterior" loading="lazy" data-seed="${p.id}-0">
        ${p.tag ? `<span class="property-card__badge">${p.tag}</span>` : ""}
        <span class="property-card__price-tag">${money(p.price)}</span>
        <button class="property-card__fav ${isFav ? "is-active" : ""}" data-action="fav" data-id="${p.id}" aria-label="Save residence">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18 5 19.6 8.4 18 11.8 15.5 16.4 8 21 8 21z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
      </div>
      <div class="property-card__body">
        <p class="property-card__loc">${p.city}, ${p.region}</p>
        <h3 class="property-card__title">${p.title}</h3>
        <div class="property-card__specs">
          <span>${p.beds} beds</span><span>${p.baths} baths</span><span>${p.size.toLocaleString()} sqft</span>
        </div>
        <div class="property-card__footer">
          <span class="property-card__price">${money(p.price)}</span>
          <div class="property-card__actions">
            <button data-action="view" data-id="${p.id}">View</button>
            <button data-action="compare" data-id="${p.id}" class="${isCompare ? "is-active" : ""}">Compare</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function bindCardImageFallbacks(container) {
    if (!container) return;
    qsa("img[data-seed]", container).forEach((im) =>
      withFallback(im, im.dataset.seed),
    );
  }

  /* ---------------------------------------------------------
     5. RENDER: FEATURED (Only on home page)
  --------------------------------------------------------- */
  function renderFeatured() {
    const grid = qs("#featuredGrid");
    if (!grid) return;
    const featured = PROPERTIES.filter((p) => p.tag === "Featured").slice(0, 4);
    grid.innerHTML = featured
      .map(
        (p) => `
      <div class="feature-card" data-id="${p.id}" data-action="view">
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy" data-seed="feat-${p.id}">
        <div class="feature-card__info">
          <span class="feature-card__tag">${p.city}, ${p.region}</span>
          <h3 class="feature-card__title">${p.title}</h3>
          <span class="feature-card__price">${money(p.price)}</span>
        </div>
      </div>`,
      )
      .join("");
    bindCardImageFallbacks(grid);
    qsa(".feature-card", grid).forEach((c) =>
      c.addEventListener("click", () => openPropertyModal(c.dataset.id)),
    );
  }

  /* ---------------------------------------------------------
     6. RENDER: LISTINGS (with filters) - Only on listings page
  --------------------------------------------------------- */
  function currentFilters() {
    return {
      keyword: qs("#filterKeyword")?.value?.trim()?.toLowerCase() || "",
      type: qs("#filterType")?.value || "",
      beds: qs("#filterBeds")?.value || "",
      maxPrice: Number(qs("#filterPriceRange")?.value || 25000000),
      sort: qs("#filterSort")?.value || "curated",
    };
  }

  function applyFilters(list, f) {
    let out = list.filter((p) => {
      const matchesKeyword =
        !f.keyword ||
        (p.title + p.city + p.region + p.type)
          .toLowerCase()
          .includes(f.keyword);
      const matchesType = !f.type || p.type === f.type;
      const matchesBeds = !f.beds || p.beds >= Number(f.beds);
      const matchesPrice = p.price <= f.maxPrice;
      return matchesKeyword && matchesType && matchesBeds && matchesPrice;
    });
    switch (f.sort) {
      case "price-asc":
        out.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        out.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        out.sort((a, b) => b.year - a.year);
        break;
      case "size-desc":
        out.sort((a, b) => b.size - a.size);
        break;
      default:
        break;
    }
    return out;
  }

  function renderListings() {
    const grid = qs("#listingGrid");
    if (!grid) return;
    const f = currentFilters();
    const filtered = applyFilters(PROPERTIES, f);
    const visible = filtered.slice(0, state.visibleCount);

    const resultsCount = qs("#resultsCount");
    const emptyMsg = qs("#listingEmpty");
    const loadMoreBtn = qs("#loadMoreBtn");

    if (resultsCount) resultsCount.textContent = filtered.length;
    if (emptyMsg) emptyMsg.hidden = filtered.length !== 0;
    if (loadMoreBtn)
      loadMoreBtn.style.display =
        filtered.length > state.visibleCount ? "inline-flex" : "none";

    grid.innerHTML = visible.map(propertyCardHTML).join("");
    bindCardImageFallbacks(grid);
    bindCardActions(grid);
  }

  function bindCardActions(container) {
    if (!container) return;
    qsa(".property-card__media img, .property-card__title", container).forEach(
      (el) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", () =>
          openPropertyModal(el.closest(".property-card").dataset.id),
        );
      },
    );
    qsa('[data-action="view"]', container).forEach((btn) =>
      btn.addEventListener("click", () => openPropertyModal(btn.dataset.id)),
    );
    qsa('[data-action="fav"]', container).forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(btn.dataset.id);
      }),
    );
    qsa('[data-action="compare"]', container).forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleCompare(btn.dataset.id);
      }),
    );
  }

  /* ---------------------------------------------------------
     7. FAVORITES
  --------------------------------------------------------- */
  function toggleFavorite(id) {
    const idx = state.favorites.indexOf(id);
    if (idx > -1) {
      state.favorites.splice(idx, 1);
      toast("Removed from saved residences");
    } else {
      state.favorites.push(id);
      toast("Saved to your favorites");
    }
    persist(STORE_KEYS.fav, state.favorites);
    refreshFavUI();
  }

  function refreshFavUI() {
    const favCount = qs("#favCount");
    if (favCount) favCount.textContent = state.favorites.length;
    qsa(".property-card").forEach((card) => {
      const btn = qs('[data-action="fav"]', card);
      if (btn)
        btn.classList.toggle(
          "is-active",
          state.favorites.includes(card.dataset.id),
        );
    });
    // FIX: if the property modal is open, update its fav button label in place instead of re-rendering the whole modal
    if (state.currentModalId) updateModalActionButtons(state.currentModalId);
    renderFavModal();
  }

  function renderFavModal() {
    const grid = qs("#favGrid");
    if (!grid) return;
    const items = state.favorites.map(getProperty).filter(Boolean);
    const emptyMsg = qs("#favEmpty");
    if (emptyMsg) emptyMsg.hidden = items.length !== 0;
    grid.innerHTML = items.map(propertyCardHTML).join("");
    bindCardImageFallbacks(grid);
    bindCardActions(grid);
  }

  /* ---------------------------------------------------------
     8. COMPARE
  --------------------------------------------------------- */
  function toggleCompare(id) {
    const idx = state.compare.indexOf(id);
    if (idx > -1) {
      state.compare.splice(idx, 1);
    } else {
      if (state.compare.length >= 3) {
        toast("You can compare up to 3 residences at a time", "error");
        return;
      }
      state.compare.push(id);
    }
    persist(STORE_KEYS.compare, state.compare);
    refreshCompareUI();
  }

  function refreshCompareUI() {
    const dock = qs("#compareDock");
    const items = state.compare.map(getProperty).filter(Boolean);
    const compareCount = qs("#compareCount");
    const compareSlots = qs("#compareSlots");

    if (compareCount) compareCount.textContent = items.length;
    if (compareSlots) {
      compareSlots.innerHTML = items
        .map((p) => `<span><img src="${p.images[0]}" alt="${p.title}"></span>`)
        .join("");
    }
    if (dock) dock.classList.toggle("is-visible", items.length > 0);

    qsa(".property-card").forEach((card) => {
      const btn = qs('[data-action="compare"]', card);
      if (btn)
        btn.classList.toggle(
          "is-active",
          state.compare.includes(card.dataset.id),
        );
    });

    // FIX: keep the open property modal's compare button in sync
    if (state.currentModalId) updateModalActionButtons(state.currentModalId);
  }

  function renderCompareTable() {
    const items = state.compare.map(getProperty).filter(Boolean);
    const table = qs("#compareTable");
    if (!table) return;
    if (items.length === 0) {
      table.innerHTML =
        "<tr><td>Add up to 3 residences from any listing card to compare them here.</td></tr>";
      return;
    }
    // FIX: photo row was duplicated (once in rows[], once appended at bottom). Now single, at top.
    const rows = [
      ["Photo", (p) => `<img src="${p.images[0]}" alt="${p.title}">`],
      ["Residence", (p) => `<strong>${p.title}</strong>`],
      ["Location", (p) => `${p.city}, ${p.region}`],
      ["Price", (p) => money(p.price)],
      ["Type", (p) => p.type],
      ["Bedrooms", (p) => p.beds],
      ["Bathrooms", (p) => p.baths],
      ["Size", (p) => `${p.size.toLocaleString()} sqft`],
      ["Year built", (p) => p.year],
    ];
    table.innerHTML = `
      <tr><th>—</th>${items.map((p) => `<th>${p.title}</th>`).join("")}</tr>
      ${rows.map(([label, fn]) => `<tr><th>${label}</th>${items.map((p) => `<td>${fn(p)}</td>`).join("")}</tr>`).join("")}
    `;
  }

  /* ---------------------------------------------------------
     9. RECENTLY VIEWED
  --------------------------------------------------------- */
  function addRecent(id) {
    state.recent = state.recent.filter((r) => r !== id);
    state.recent.unshift(id);
    state.recent = state.recent.slice(0, 8);
    persist(STORE_KEYS.recent, state.recent);
    renderRecent();
  }

  function renderRecent() {
    const items = state.recent.map(getProperty).filter(Boolean);
    const section = qs("#recentSection");
    if (!section) return;
    section.hidden = items.length === 0;
    const grid = qs("#recentGrid");
    if (!grid) return;
    grid.innerHTML = items.map(propertyCardHTML).join("");
    bindCardImageFallbacks(grid);
    bindCardActions(grid);
  }

  /* ---------------------------------------------------------
     10. PROPERTY MODAL
  --------------------------------------------------------- */
  function openPropertyModal(id) {
    const p = getProperty(id);
    if (!p) return;
    addRecent(id);
    state.currentModalId = id; // FIX: remember which property is open

    const body = qs("#modalBody");
    if (!body) return;
    body.innerHTML = `
      <div class="pm-gallery"><img src="${p.images[0]}" alt="${p.title}" id="pmMainImage"></div>
      <div class="pm-thumbs">
        ${p.images.map((src, i) => `<img src="${src}" alt="View ${i + 1}" class="${i === 0 ? "is-active" : ""}" data-idx="${i}">`).join("")}
      </div>
      <div class="pm-header">
        <div>
          <h2 id="modalTitle">${p.title}</h2>
          <p class="pm-loc">${p.city}, ${p.region} · ${p.type}</p>
        </div>
        <span class="pm-price">${money(p.price)}</span>
      </div>
      <div class="pm-specs">
        <div><strong>${p.beds}</strong>Bedrooms</div>
        <div><strong>${p.baths}</strong>Bathrooms</div>
        <div><strong>${p.size.toLocaleString()}</strong>Sq. ft</div>
        <div><strong>${p.year}</strong>Year built</div>
      </div>
      <p class="pm-desc">${p.description}</p>
      <ul class="pm-amenities">${p.amenities.map((a) => `<li>${a}</li>`).join("")}</ul>
      <iframe class="pm-map" src="${mapEmbed(p.lat)}" loading="lazy" title="Map of ${p.title}"></iframe>
      <div class="pm-actions">
        <button class="btn btn--brass" id="pmBookBtn">Book a Private Viewing</button>
        <button class="btn btn--ghost" id="pmFavBtn">${state.favorites.includes(p.id) ? "Remove Favorite" : "Save to Favorites"}</button>
        <button class="btn btn--outline" id="pmCompareBtn">${state.compare.includes(p.id) ? "Remove from Compare" : "Add to Compare"}</button>
      </div>
    `;

    qsa(".pm-thumbs img", body).forEach((thumb) =>
      thumb.addEventListener("click", () => {
        const mainImg = qs("#pmMainImage", body);
        if (mainImg) mainImg.src = thumb.src;
        qsa(".pm-thumbs img", body).forEach((t) =>
          t.classList.remove("is-active"),
        );
        thumb.classList.add("is-active");
      }),
    );

    const bookBtn = qs("#pmBookBtn", body);
    if (bookBtn) {
      bookBtn.addEventListener("click", () => {
        closeModal(qs("#propertyModal"));
        const bookingProp = qs("#bookingProperty");
        const bookingLabel = qs("#bookingSelectedLabel");
        if (bookingProp) bookingProp.value = p.title;
        if (bookingLabel)
          bookingLabel.textContent = `Requesting a viewing for: ${p.title}, ${p.city}`;
        setTimeout(() => {
          window.location.href = "booking.html";
        }, 300);
      });
    }

    const favBtn = qs("#pmFavBtn", body);
    // FIX: was calling openPropertyModal(p.id) which reset scroll & re-added to recent. Now just toggles + updates the button.
    if (favBtn)
      favBtn.addEventListener("click", () => {
        toggleFavorite(p.id);
      });

    const compareBtn = qs("#pmCompareBtn", body);
    // FIX: same — no full re-render, just toggle + label update.
    if (compareBtn)
      compareBtn.addEventListener("click", () => {
        toggleCompare(p.id);
      });

    // FIX: do not bind image fallbacks on modal images — they don't have data-seed and the URL is already valid
    openModal(qs("#propertyModal"));
  }

  // NEW: updates only the fav/compare button labels in the open modal
  function updateModalActionButtons(id) {
    const p = getProperty(id);
    if (!p) return;
    const favBtn = qs("#pmFavBtn");
    if (favBtn)
      favBtn.textContent = state.favorites.includes(p.id)
        ? "Remove Favorite"
        : "Save to Favorites";
    const compareBtn = qs("#pmCompareBtn");
    if (compareBtn)
      compareBtn.textContent = state.compare.includes(p.id)
        ? "Remove from Compare"
        : "Add to Compare";
  }

  /* ---------------------------------------------------------
     11. MODAL OPEN/CLOSE (generic)
  --------------------------------------------------------- */
  let lastFocused = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // NEW: move focus into the modal for keyboard/screen-reader users
    const focusTarget =
      modal.querySelector(".modal__close") ||
      modal.querySelector("button, a, input");
    if (focusTarget) setTimeout(() => focusTarget.focus(), 60);
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (modal.id === "propertyModal") state.currentModalId = null;
    // NEW: return focus to whatever opened the modal
    if (lastFocused && typeof lastFocused.focus === "function")
      lastFocused.focus();
    lastFocused = null;
  }

  function bindModalDismissers() {
    qsa("[data-close-modal]").forEach((el) =>
      el.addEventListener("click", () => {
        const modal = el.closest(".modal");
        if (modal) closeModal(modal);
      }),
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") qsa(".modal.is-open").forEach(closeModal);
    });
    // NEW: simple focus trap — Tab cycles inside the open modal
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const open = qs(".modal.is-open");
      if (!open) return;
      const focusables = qsa(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        open,
      ).filter((el) => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0],
        last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------------------------------------------------------
     12. AGENTS / TEAM / TESTIMONIALS / FAQ / JOURNAL / MAP LEGEND
  --------------------------------------------------------- */
  function renderAgents() {
    const grid = qs("#agentsGrid");
    if (!grid) return;
    grid.innerHTML = AGENTS.map(
      (a) => `
      <div class="agent-card">
        <div class="agent-card__media"><img src="${a.photo}" alt="${a.name}" loading="lazy" data-seed="${a.id}"></div>
        <div class="agent-card__body">
          <h3 class="agent-card__name">${a.name}</h3>
          <p class="agent-card__role">${a.role}</p>
          <p class="agent-card__stat">${a.sales}</p>
          <div class="agent-card__contact">
            <a href="mailto:${a.email}" aria-label="Email ${a.name}"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.8 6.2L19.8 6H4.2Z"/></svg></a>
            <a href="tel:+${a.phone}" aria-label="Call ${a.name}"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"/></svg></a>
          </div>
        </div>
      </div>`,
    ).join("");
    bindCardImageFallbacks(grid);
  }

  function renderTeam() {
    const grid = qs("#teamGrid");
    if (!grid) return;
    grid.innerHTML = TEAM.map(
      (t) => `
      <div class="team-card">
        <div class="team-card__media"><img src="${t.photo}" alt="${t.name}" loading="lazy" data-seed="${t.name}"></div>
        <h4 class="team-card__name">${t.name}</h4>
        <p class="team-card__role">${t.role}</p>
      </div>`,
    ).join("");
    bindCardImageFallbacks(grid);
  }

  function renderTestimonials() {
    const track = qs("#testimonialTrack");
    if (!track) return;
    track.innerHTML = TESTIMONIALS.map(
      (t, i) => `
      <div class="testimonial-slide ${i === 0 ? "is-active" : ""}" data-idx="${i}">
        <p>&ldquo;${t.quote}&rdquo;</p>
        <strong>${t.name}</strong><em>${t.role}</em>
      </div>`,
    ).join("");

    const dots = qs("#testiDots");
    if (dots) {
      dots.innerHTML = TESTIMONIALS.map(
        (_, i) =>
          `<span class="${i === 0 ? "is-active" : ""}" data-idx="${i}"></span>`,
      ).join("");
      qsa("#testiDots span").forEach((dot) =>
        dot.addEventListener("click", () =>
          showTestimonial(Number(dot.dataset.idx)),
        ),
      );
    }

    const prevBtn = qs("#testiPrev");
    const nextBtn = qs("#testiNext");
    if (prevBtn)
      prevBtn.addEventListener("click", () =>
        showTestimonial(
          (state.testiIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
        ),
      );
    if (nextBtn)
      nextBtn.addEventListener("click", () =>
        showTestimonial((state.testiIndex + 1) % TESTIMONIALS.length),
      );

    // FIX: auto-advance was never cleared on mouseleave (leaked) and paused only once.
    let auto = setInterval(
      () => showTestimonial((state.testiIndex + 1) % TESTIMONIALS.length),
      6000,
    );
    const container = track.closest(".testimonials");
    if (container) {
      container.addEventListener("mouseenter", () => clearInterval(auto));
      container.addEventListener("mouseleave", () => {
        clearInterval(auto);
        auto = setInterval(
          () => showTestimonial((state.testiIndex + 1) % TESTIMONIALS.length),
          6000,
        );
      });
    }
  }

  function showTestimonial(i) {
    state.testiIndex = i;
    qsa(".testimonial-slide").forEach((s) =>
      s.classList.toggle("is-active", Number(s.dataset.idx) === i),
    );
    qsa("#testiDots span").forEach((d) =>
      d.classList.toggle("is-active", Number(d.dataset.idx) === i),
    );
  }

  function renderFAQ() {
    const list = qs("#faqList");
    if (!list) return;
    list.innerHTML = FAQS.map(
      (f, i) => `
      <div class="faq-item" data-idx="${i}">
        <button class="faq-q" aria-expanded="false">${f.q}<span class="plus" aria-hidden="true">+</span></button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`,
    ).join("");
    qsa(".faq-item").forEach((item) => {
      const q = qs(".faq-q", item);
      const a = qs(".faq-a", item);
      q.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        qsa(".faq-item").forEach((other) => {
          other.classList.remove("is-open");
          const otherQ = qs(".faq-q", other);
          if (otherQ) otherQ.setAttribute("aria-expanded", "false");
          qs(".faq-a", other).style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("is-open");
          q.setAttribute("aria-expanded", "true");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  }

  function renderJournal() {
    const grid = qs("#journalGrid");
    if (!grid) return;
    grid.innerHTML = JOURNAL.map(
      (j, i) => `
      <article class="journal-card">
        <div class="journal-card__media"><img src="${j.img}" alt="${j.title}" loading="lazy" data-seed="journal-${i}"></div>
        <div class="journal-card__body">
          <p class="journal-card__meta">${j.cat} · ${j.date}</p>
          <h3 class="journal-card__title">${j.title}</h3>
          <p class="journal-card__excerpt">${j.excerpt}</p>
          <a href="#" class="journal-card__link" data-idx="${i}">Read the note</a>
        </div>
      </article>`,
    ).join("");
    bindCardImageFallbacks(grid);
    qsa(".journal-card__link").forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        toast("This is a demo — full articles aren't wired up yet.");
      }),
    );
  }

  function renderMapLegend() {
    const wrap = qs("#mapRegionList");
    if (!wrap) return;
    wrap.innerHTML = MAP_REGIONS.map(
      (r, i) =>
        `<div class="map-legend__item" data-query="${r.query}"><span>${r.name}</span> <span>&rarr;</span></div>`,
    ).join("");
    qsa(".map-legend__item", wrap).forEach((item) =>
      item.addEventListener("click", () => {
        const mapFrame = qs("#mapFrame");
        if (mapFrame) mapFrame.src = mapEmbed(item.dataset.query);
      }),
    );
  }

  /* ---------------------------------------------------------
     13. ANIMATED COUNTERS + SCROLL REVEAL
  --------------------------------------------------------- */
  function initCounters() {
    const counters = qsa(".stat__num");
    if (counters.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const decimals = Number(el.dataset.decimal || 0);
          const duration = 1600;
          const start = performance.now();
          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toFixed(decimals);
          }
          requestAnimationFrame(step);
          io.unobserve(el);
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach((c) => io.observe(c));
  }

  function initRevealObserver() {
    const elements = qsa("[data-reveal]");
    if (elements.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    elements.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     14. NAVIGATION: sticky state, mobile menu
  --------------------------------------------------------- */
  function initNav() {
    const nav = qs("#siteNav");
    if (!nav) return;
    window.addEventListener("scroll", () =>
      nav.classList.toggle("is-scrolled", window.scrollY > 40),
    );

    const burger = qs("#navBurger");
    const links = qs("#navLinks");
    const backdrop = qs("#navBackdrop");

    function closeMenu() {
      if (links) links.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      if (burger) {
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
      document.body.style.overflow = "";
    }
    function openMenu() {
      if (links) links.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
      if (burger) {
        burger.classList.add("is-open");
        burger.setAttribute("aria-expanded", "true");
      }
    }

    if (burger && links) {
      // FIX: aria-expanded was never set; open/close now toggles it and syncs the backdrop + body scroll lock
      burger.addEventListener("click", () => {
        const willOpen = !links.classList.contains("is-open");
        if (willOpen) openMenu();
        else closeMenu();
      });
      qsa(".nav__link", links).forEach((link) =>
        link.addEventListener("click", closeMenu),
      );
    }
    if (backdrop) backdrop.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links && links.classList.contains("is-open"))
        closeMenu();
    });
  }

  function initBackToTop() {
    const btn = qs("#backToTop");
    if (!btn) return;
    window.addEventListener("scroll", () =>
      btn.classList.toggle("is-visible", window.scrollY > 600),
    );
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  /* ---------------------------------------------------------
     15. FORM VALIDATION HELPERS
  --------------------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[+]?[\d\s().-]{7,}$/;

  function setError(fieldEl, message) {
    if (!fieldEl) return !message;
    const id = fieldEl.id;
    const errorEl = qs(`[data-error-for="${id}"]`);
    const wrapper = fieldEl.closest(".field") || fieldEl.parentElement;
    if (message) {
      if (wrapper) wrapper.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
    } else {
      if (wrapper) wrapper.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }
    return !message;
  }

  function validateRequired(el, label) {
    if (!el) return false;
    return setError(el, el.value.trim() ? "" : `${label} is required.`);
  }
  function validateEmail(el) {
    if (!el) return false;
    if (!el.value.trim()) return setError(el, "Email is required.");
    return setError(
      el,
      EMAIL_RE.test(el.value.trim()) ? "" : "Enter a valid email address.",
    );
  }
  function validatePhone(el) {
    if (!el) return false;
    if (!el.value.trim()) return setError(el, "Phone number is required.");
    return setError(
      el,
      PHONE_RE.test(el.value.trim()) ? "" : "Enter a valid phone number.",
    );
  }
  function validateDateNotPast(el) {
    if (!el) return false;
    if (!el.value) return setError(el, "Choose a date.");
    const chosen = new Date(el.value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return setError(
      el,
      chosen >= today ? "" : "Choose a date from today onward.",
    );
  }

  /* ---------------------------------------------------------
     16. BOOKING FORM
  --------------------------------------------------------- */
  function initBookingForm() {
    const form = qs("#bookingForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = qs("#bkName"),
        email = qs("#bkEmail"),
        phone = qs("#bkPhone"),
        date = qs("#bkDate"),
        time = qs("#bkTime");
      const validName = validateRequired(name, "Full name");
      const validEmail = validateEmail(email);
      const validPhone = validatePhone(phone);
      const validDate = validateDateNotPast(date);
      const validTime = setError(time, time?.value ? "" : "Choose a time.");

      if (validName && validEmail && validPhone && validDate && validTime) {
        toast(
          `Viewing requested for ${date.value} at ${time.value}. We'll confirm shortly.`,
        );
        form.reset();
        const bookingProp = qs("#bookingProperty");
        const bookingLabel = qs("#bookingSelectedLabel");
        if (bookingProp) bookingProp.value = "";
        if (bookingLabel)
          bookingLabel.textContent = "General enquiry — no residence selected";
      } else {
        toast("Please fix the highlighted fields.", "error");
      }
    });
  }

  /* ---------------------------------------------------------
     17. UPLOAD FORM (front-end demo)
  --------------------------------------------------------- */
  function initUploadForm() {
    const form = qs("#uploadForm");
    if (!form) return;
    const fileInput = qs("#upImages");
    const preview = qs("#uploadPreview");
    let dataUrls = [];

    if (fileInput && preview) {
      fileInput.addEventListener("change", () => {
        preview.innerHTML = "";
        dataUrls = [];
        const files = Array.from(fileInput.files).slice(0, 6);
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            dataUrls.push(e.target.result);
            const im = document.createElement("img");
            im.src = e.target.result;
            preview.appendChild(im);
          };
          reader.readAsDataURL(file);
        });
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = qs("#upTitle"),
        location = qs("#upLocation"),
        price = qs("#upPrice"),
        contact = qs("#upContact");
      const validTitle = validateRequired(title, "Property name");
      const validLoc = validateRequired(location, "Location");
      const validPrice = setError(
        price,
        price?.value && Number(price.value) > 0
          ? ""
          : "Enter a valid asking price.",
      );
      const validContact = validateEmail(contact);

      if (validTitle && validLoc && validPrice && validContact) {
        const newProp = {
          id: "user-" + Date.now(),
          title: title.value.trim(),
          type: qs("#upType")?.value || "estate",
          city: location.value.split(",")[0].trim(),
          region:
            location.value.split(",").slice(1).join(",").trim() ||
            location.value.trim(),
          price: Number(price.value),
          beds: Number(qs("#upBeds")?.value) || 0,
          baths: Number(qs("#upBaths")?.value) || 0,
          size: Number(qs("#upSize")?.value) || 0,
          year: new Date().getFullYear(),
          tag: "New",
          lat: location.value.trim(),
          images: dataUrls.length
            ? dataUrls
            : [IMG.houseExt1, IMG.interior1, IMG.livingRoom1, IMG.kitchen1],
          description:
            qs("#upDesc")?.value?.trim() ||
            "Description to be finalized with the listing partner.",
          amenities: pickAmenities(Math.floor(Math.random() * 20)),
        };
        PROPERTIES.unshift(newProp);
        state.visibleCount += 1;
        renderListings();
        renderFeatured();
        toast("Submitted for review — added to this session's collection.");
        form.reset();
        if (preview) preview.innerHTML = "";
        dataUrls = [];
      } else {
        toast("Please fix the highlighted fields.", "error");
      }
    });
  }

  /* ---------------------------------------------------------
     18. CONTACT FORM
  --------------------------------------------------------- */
  function initContactForm() {
    const form = qs("#contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = qs("#cName"),
        email = qs("#cEmail"),
        message = qs("#cMessage");
      const validName = validateRequired(name, "Name");
      const validEmail = validateEmail(email);
      const validMessage = validateRequired(message, "Message");
      if (validName && validEmail && validMessage) {
        toast("Message sent — we'll reply within one business day.");
        form.reset();
      } else {
        toast("Please fix the highlighted fields.", "error");
      }
    });
  }

  /* ---------------------------------------------------------
     19. NEWSLETTER FORM
  --------------------------------------------------------- */
  function initNewsletterForm() {
    const form = qs("#newsletterForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = qs("#newsletterEmail");
      if (validateEmail(email)) {
        toast("You're on the list — welcome to the Quiet List.");
        form.reset();
      } else {
        toast("Enter a valid email to subscribe.", "error");
      }
    });
  }

  /* ---------------------------------------------------------
     20. HERO SEARCH + FILTER SYNC
  --------------------------------------------------------- */
  function initHeroSearch() {
    const searchBar = qs("#searchBar");
    if (!searchBar) return;
    searchBar.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchData = {
        keyword: qs("#searchKeyword")?.value || "",
        type: qs("#searchType")?.value || "",
        beds: qs("#searchBeds")?.value || "",
        price: qs("#searchPrice")?.value || "",
      };
      localStorage.setItem(STORE_KEYS.search, JSON.stringify(searchData));
      window.location.href = "listings.html";
    });
  }

  function initFilters() {
    // FIX: restore hero search correctly — the price must be applied to the *range slider* on listings,
    // not read from a non-existent #searchPrice element.
    const savedSearch = localStorage.getItem(STORE_KEYS.search);
    if (savedSearch) {
      try {
        const data = JSON.parse(savedSearch);
        const keyword = qs("#filterKeyword");
        const type = qs("#filterType");
        const beds = qs("#filterBeds");
        const priceRange = qs("#filterPriceRange");
        const priceOut = qs("#priceRangeOut");

        if (keyword) keyword.value = data.keyword || "";
        if (type) type.value = data.type || "";
        if (beds) beds.value = data.beds || "";
        if (priceRange && data.price) {
          priceRange.value = Math.min(
            Number(data.price),
            Number(priceRange.max),
          );
          if (priceOut) priceOut.textContent = money(priceRange.value);
        }
      } catch (_) {
        /* ignore malformed payload */
      }
      localStorage.removeItem(STORE_KEYS.search);
    }

    const rerender = () => {
      state.visibleCount = 6;
      renderListings();
    };
    const keyword = qs("#filterKeyword");
    const type = qs("#filterType");
    const beds = qs("#filterBeds");
    const sort = qs("#filterSort");
    const priceRange = qs("#filterPriceRange");
    const resetBtn = qs("#filterResetBtn");
    const loadMore = qs("#loadMoreBtn");

    if (keyword) keyword.addEventListener("input", debounce(rerender, 200));
    if (type) type.addEventListener("change", rerender);
    if (beds) beds.addEventListener("change", rerender);
    if (sort) sort.addEventListener("change", rerender);
    if (priceRange) {
      priceRange.addEventListener("input", () => {
        const output = qs("#priceRangeOut");
        if (output) output.textContent = money(priceRange.value);
        rerender();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (keyword) keyword.value = "";
        if (type) type.value = "";
        if (beds) beds.value = "";
        if (sort) sort.value = "curated";
        if (priceRange) {
          priceRange.value = priceRange.max;
          const output = qs("#priceRangeOut");
          if (output) output.textContent = money(priceRange.max);
        }
        rerender();
      });
    }
    if (loadMore) {
      loadMore.addEventListener("click", () => {
        state.visibleCount += 6;
        renderListings();
      });
    }

    // Apply restored filters on first paint
    if (savedSearch) renderListings();
  }

  /* ---------------------------------------------------------
     21. NAV / DOCK BUTTON BINDINGS
  --------------------------------------------------------- */
  function initTopLevelButtons() {
    const favBtn = qs("#favToggleBtn");
    if (favBtn)
      favBtn.addEventListener("click", () => {
        renderFavModal();
        openModal(qs("#favModal"));
      });

    const openCompare = qs("#openCompareBtn");
    if (openCompare)
      openCompare.addEventListener("click", () => {
        renderCompareTable();
        openModal(qs("#compareModal"));
      });

    const clearCompare = qs("#clearCompareBtn");
    if (clearCompare) {
      clearCompare.addEventListener("click", () => {
        state.compare = [];
        persist(STORE_KEYS.compare, state.compare);
        refreshCompareUI();
      });
    }

    const listPropBtn = qs("#listPropertyBtn");
    if (listPropBtn)
      listPropBtn.addEventListener("click", () => {
        window.location.href = "upload.html";
      });
  }

  /* ---------------------------------------------------------
     22. LOADER
  --------------------------------------------------------- */
  function initLoader() {
    const loader = qs("#loader");
    if (!loader) return;
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("is-hidden"), 350);
    });
    // Safety net in case 'load' already fired
    setTimeout(() => loader.classList.add("is-hidden"), 3000);
  }

  /* ---------------------------------------------------------
     23. ACTIVE NAV LINK (Multi-page)
  --------------------------------------------------------- */
  function setActiveNavLink() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href) link.classList.toggle("active", href === currentPage);
    });
  }

  /* ---------------------------------------------------------
     24. INIT
  --------------------------------------------------------- */
  function init() {
    const yearSpan = qs("#year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const priceRange = qs("#filterPriceRange");
    const priceOut = qs("#priceRangeOut");
    if (priceRange && priceOut) {
      priceOut.textContent = money(priceRange.value);
    }

    renderFeatured();
    renderListings();
    renderAgents();
    renderTeam();
    renderTestimonials();
    renderFAQ();
    renderJournal();
    renderMapLegend();
    renderRecent();
    refreshFavUI();
    refreshCompareUI();

    initNav();
    initBackToTop();
    initHeroSearch();
    initFilters();
    initTopLevelButtons();
    initBookingForm();
    initUploadForm();
    initContactForm();
    initNewsletterForm();
    bindModalDismissers();
    initCounters();
    initRevealObserver();
    initLoader();

    setActiveNavLink();

    const bkDate = qs("#bkDate");
    if (bkDate) bkDate.min = new Date().toISOString().split("T")[0];
  }

  document.addEventListener("DOMContentLoaded", init);
})();
