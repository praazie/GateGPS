document.addEventListener('DOMContentLoaded', function () {
  const heroCarousel = document.querySelector('#heroCarousel');
  new bootstrap.Carousel(heroCarousel, {
    interval: 3000,
    ride: 'carousel',
    pause: false,
    touch: true
  });
});


// map.js
// Usage: include this after the SVG is in the DOM. It expects:
// - a container div with id="svg-map" that holds the inline SVG (as you provided)
// - group with id="features" that contains <path> for states
// - group with id="label_points" that contains <circle class="State Name" cx=... cy=...>
// - input with id="stateSearch", element with id="selected-state" and id="installer-details"

const installers = [
  { name: "John Doe", phone: "0xxxxxxxxxxx", state: "Lagos" },
  { name: "Praise", phone: "0xxxxxxxxxxx", state: "Lagos" },
  { name: "Praise", phone: "0xxxxxxxxx", state: "Lagos" },
  { name: "Ifeanyi Nwankwo", phone: "0xxxxxxxxx", state: "Enugu" },
  { name: "Chinedu Obi", phone: "0xxxxxxxxxx", state: "Enugu" },
  { name: "Bola Akin", phone: "0xxxxxxxxxxx", state: "Abuja" },
  { name: "Musa Abdullahi", phone: "0xxxxxxxxx", state: "Kano" },
  { name: "Musa", phone: "0xxxxxxxxxxx", state: "Kastina" }
];

document.addEventListener("DOMContentLoaded", () => {
  const svgContainer = document.getElementById("svg-map");
  const selectedStateEl = document.getElementById("selected-state");
  const installerDetailsEl = document.getElementById("installer-details");
  const searchInput = document.getElementById("stateSearch");

  if (!svgContainer) {
    console.error("svg-map container not found.");
    return;
  }

  const svg = svgContainer.querySelector("svg");
  if (!svg) {
    console.error("No inline <svg> found inside #svg-map.");
    return;
  }

  const featuresGroup = svg.querySelector("#features") || svg;
  const labelPointsGroup = svg.querySelector("#label_points");

  // create results container under input
  const resultsDiv = document.createElement("div");
  resultsDiv.id = "searchResults";
  resultsDiv.className = "list-group";
  // append right after the input for layout; keep parent positioned (map-wrapper)
  searchInput.parentNode.appendChild(resultsDiv);

  /* -----------------------
     Helpers
     ----------------------- */
  function normalize(s) {
    return (s || "").toString().toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
  }

  function findPathByStateName(stateName) {
    const norm = normalize(stateName);
    const paths = featuresGroup.querySelectorAll("path");
    // Try exact id/name match
    for (const p of paths) {
      if (normalize(p.id) === norm || normalize(p.getAttribute("name")) === norm) return p;
    }
    // Try contains-match fallback
    for (const p of paths) {
      if (normalize(p.id).includes(norm) || normalize(p.getAttribute("name")).includes(norm)) return p;
    }
    return null;
  }

  // resolve an installer state (like "Abuja") to something we can use to find the path/label.
  // First try exact path; then try circles in label_points; then try alias map.
  const aliasMap = {
    "abuja": "Federal Capital Territory",
    "kastina": "Katsina", // handle common misspelling in your data
    "fct": "Federal Capital Territory"
  };

  function resolveStateToSvgStateName(stateName) {
    const norm = normalize(stateName);
    // direct path match
    const path = findPathByStateName(stateName);
    if (path) return path.id || path.getAttribute("name");

    // try label_points circles (they carry class tokens representing state)
    if (labelPointsGroup) {
      for (const c of labelPointsGroup.querySelectorAll("circle")) {
        const classStr = Array.from(c.classList).join(" ").trim();
        if (!classStr) continue;
        if (normalize(classStr) === norm) return classStr;
      }
      // partial match
      for (const c of labelPointsGroup.querySelectorAll("circle")) {
        const classStr = Array.from(c.classList).join(" ").toLowerCase();
        if (classStr.includes(stateName.toLowerCase())) return Array.from(c.classList).join(" ");
      }
    }

    // alias fallback
    if (aliasMap[norm]) return aliasMap[norm];

    // fallback to original
    return stateName;
  }

  /* -----------------------
     Draw labels (use label_points circles)
     ----------------------- */
  function createLabelsFromPoints() {
    if (!labelPointsGroup) return;
    const svgNS = "http://www.w3.org/2000/svg";
    // Append text labels to svg (after existing elements so text is on top)
    labelPointsGroup.querySelectorAll("circle").forEach(c => {
      const classes = Array.from(c.classList).filter(t => t.trim() !== "");
      if (classes.length === 0) return;
      const displayName = classes.join(" ");
      const cx = c.getAttribute("cx");
      const cy = c.getAttribute("cy");

      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", cx);
      text.setAttribute("y", cy);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("alignment-baseline", "middle");
      text.setAttribute("font-size", "12");
      text.setAttribute("fill", "#082b17");
      text.classList.add("state-label");
      text.dataset.state = displayName;
      text.textContent = displayName;

      // click the text to select state
      text.addEventListener("click", (evt) => {
        evt.stopPropagation();
        handleStateSelect(displayName);
      });

      svg.appendChild(text);
    });
  }

  /* -----------------------
     Highlighting & selection
     ----------------------- */
  function clearActive() {
    (featuresGroup.querySelectorAll("path") || []).forEach(p => p.classList.remove("active"));
    (svg.querySelectorAll(".state-label") || []).forEach(t => t.classList.remove("active"));
  }

  function highlightState(stateName) {
    clearActive();
    const resolved = resolveStateToSvgStateName(stateName);
    // highlight path
    const p = findPathByStateName(resolved) || findPathByStateName(stateName);
    if (p) p.classList.add("active");
    // highlight label text
    const labels = Array.from(svg.querySelectorAll(".state-label"));
    const targetLabel = labels.find(t => normalize(t.dataset.state) === normalize(stateName) || normalize(t.dataset.state) === normalize(resolved) || normalize(t.dataset.state).includes(normalize(stateName)));
    if (targetLabel) targetLabel.classList.add("active");
    // set selection text
    selectedStateEl.textContent = stateName;
  }

  function handleStateSelect(stateName) {
    highlightState(stateName);
    showInstallers(stateName);
  }

  /* -----------------------
     Show installers (list)
     ----------------------- */
  function showInstallers(stateName) {
    const matched = installers.filter(inst => inst.state.toLowerCase() === stateName.toLowerCase());
    installerDetailsEl.innerHTML = `<h5 class="mt-2">${stateName} Installers</h5>`;

    if (matched.length === 0) {
      installerDetailsEl.innerHTML += `<p>No installers found for this state.</p>`;
      return;
    }

    const list = document.createElement("ul");
    list.className = "list-group mb-3";

    matched.forEach(installer => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
        <strong>${installer.name}</strong><br>
        <a href="tel:${installer.phone}">${installer.phone}</a>
      `;
      // clicking item will emphasize (optional: scroll to label)
      li.addEventListener("click", () => {
        highlightState(installer.state);
      });
      list.appendChild(li);
    });

    installerDetailsEl.appendChild(list);
  }

  /* -----------------------
     Search input behavior
     ----------------------- */
  // Get all state names from the SVG map
  const allStates = Array.from(featuresGroup.querySelectorAll("path"))
    .map(p => p.id || p.getAttribute("name"))
    .filter(Boolean);

  // Merge with installers' states
  const uniqueStates = [...new Set([...allStates, ...installers.map(i => i.state)])];


  searchInput.addEventListener("input", function () {
    const q = this.value.trim();
    resultsDiv.innerHTML = "";
    if (q.length === 0) return;

    const ql = q.toLowerCase();
    const matches = uniqueStates.filter(s => s.toLowerCase().includes(ql));

    if (matches.length === 0) {
      const no = document.createElement("div");
      no.className = "list-group-item";
      no.textContent = "No state found";
      resultsDiv.appendChild(no);
      return;
    }

    matches.forEach(s => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "list-group-item list-group-item-action";
      btn.textContent = s;
      btn.addEventListener("click", () => {
        searchInput.value = s;
        resultsDiv.innerHTML = "";
        handleStateSelect(s);
      });
      resultsDiv.appendChild(btn);
    });

    // If there's an exact match, auto-select it
    const exact = matches.find(m => m.toLowerCase() === ql);
    if (exact) {
      // small timeout so user sees suggestions briefly — remove if you want immediate
      setTimeout(() => {
        resultsDiv.innerHTML = "";
        handleStateSelect(exact);
      }, 60);
    }
  });

  // Hide results when clicking outside
  document.addEventListener("click", (ev) => {
    if (!ev.target.closest("#stateSearch") && !ev.target.closest("#searchResults")) {
      resultsDiv.innerHTML = "";
    }
  });

  /* -----------------------
     SVG path click delegation (click the shape)
     ----------------------- */
  svg.addEventListener("click", (e) => {
    const path = e.target.closest("path");
    if (!path) return;
    // get state name from path id or name attribute
    const stateName = path.id || path.getAttribute("name") || null;
    if (!stateName) return;
    handleStateSelect(stateName);
  });

  // build labels and done
  createLabelsFromPoints();

  // optional: show all installers initially? (commented out)
  // installerDetailsEl.innerHTML = '<p>Click a state or use search to see installers.</p>';
});


document.querySelectorAll(".svg-map path").forEach(state => {
  const label = document.getElementById("label-" + state.id);

  if (label) {
    state.addEventListener("mouseenter", () => {
      label.setAttribute("fill", "red"); // hover color
    });

    state.addEventListener("mouseleave", () => {
      label.setAttribute("fill", "black"); // default color
    });
  }
});

