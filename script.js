// === Movie Streaming SPA Logic ===

// DOM elements
const GRID = document.getElementById("movie-grid");
const SEARCH = document.getElementById("search");
const MODAL = document.getElementById("movie-modal");
const PLAYER_CONTAINER = document.getElementById("player-container");
const CLOSE_BTN = document.getElementById("close-modal");

let currentPlayerInstance = null;

// Render movies on grid
function renderGrid(list) {
  GRID.innerHTML = "";

  if (!list || list.length === 0) {
    GRID.innerHTML = "<p style='color:#ccc;text-align:center;'>No movies found.</p>";
    return;
  }

  list.forEach((movie, index) => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.thumbnail}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.category || ""}</p>
      <button class="play-btn" data-id="${movie.id}">Play</button>
    `;
    GRID.appendChild(card);

    // Insert ad slot after every 4 movies
    if ((index + 1) % 4 === 0) {
      const adSlot = document.createElement("div");
      adSlot.className = "ad-slot";
      adSlot.innerHTML = `<!-- Adsterra ad code here -->`;
      GRID.appendChild(adSlot);
    }
  });
}

// Open movie player modal
function openPlayer(movie) {
  MODAL.classList.remove("hidden");
  PLAYER_CONTAINER.innerHTML = `
    <video id="fp-video" controls>
      <source src="${movie.video}" type="video/mp4" />
    </video>
  `;

  // Fluid Player configuration
  const vastTag = movie.vastTag || "";
  const config = {
    layoutControls: { controlBar: { autoHide: true } },
    vastOptions: {
      adList: vastTag ? [{ roll: "preRoll", vastTag: vastTag }] : [],
      vpaidControls: true,
    },
  };

  try {
    currentPlayerInstance = fluidPlayer("fp-video", config);
  } catch (err) {
    console.warn("Fluid Player init failed", err);
  }
}

// Close modal and destroy player
function closePlayer() {
  try {
    if (currentPlayerInstance && currentPlayerInstance.destroy)
      currentPlayerInstance.destroy();
  } catch (e) {}
  PLAYER_CONTAINER.innerHTML = "";
  MODAL.classList.add("hidden");
}

// Event listeners
GRID.addEventListener("click", (e) => {
  const btn = e.target.closest(".play-btn");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  const movie = MOVIES.find((m) => m.id === id);
  if (movie) openPlayer(movie);
});

CLOSE_BTN.addEventListener("click", () => closePlayer());
MODAL.addEventListener("click", (e) => {
  if (e.target === MODAL) closePlayer();
});

// Search functionality
SEARCH.addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      (m.category || "").toLowerCase().includes(q)
  );
  renderGrid(filtered);
});

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  console.log("Movies loaded:", MOVIES);
  renderGrid(MOVIES);
});

// Keyboard close
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePlayer();
});
