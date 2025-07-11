// --- Utility: Debounce Function ---
// This function delays the execution of a callback until a specified wait time has passed.
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// --- Movie Card Click & Search Functionality ---
document.addEventListener("DOMContentLoaded", function () {
  // Event delegation for movie card clicks.
  document.body.addEventListener("click", function (event) {
    const card = event.target.closest(".movie-card");
    if (card) {
      const movieId = card.dataset.movieId;
      const movieTitle = card.querySelector("h3").innerText;
      const movieImage = card.querySelector("img").src;
      openMoviePage(movieId, movieTitle, movieImage);
    }
  });

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const movieSections = document.querySelectorAll(".movie-section");
  const movieCards = document.querySelectorAll(".movie-card");
  const errorMessage = document.getElementById("noResultsMessage");
  const fuzzySearchThreshold = 0.6;

  // Filter movies based on search term using Jaccard Similarity
function filterMovies(searchTerm) {
  let foundMovie = false;
  // Hide all movie sections initially
  movieSections.forEach((section) => {
    section.style.display = "none";
  });
  movieCards.forEach((card) => {
    const title = card.querySelector("h3").innerText.toLowerCase();
    const section = card.closest(".movie-section");
    const similarity = jaccardSimilarity(title, searchTerm.toLowerCase());
    if (
      similarity >= fuzzySearchThreshold ||
      title.includes(searchTerm.toLowerCase())
    ) {
      card.style.display = "block";
      section.style.display = "block";
      foundMovie = true;
    } else {
      card.style.display = "none";
    }
  });

  if (!foundMovie && searchTerm.trim() !== "") {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `
      No matches found for "<strong>${searchTerm}</strong>".<br>
      Movie not available? Request it on Instagram DM:
      <a href="https://instagram.com/thrillyverse" target="_blank">@thrillyverse</a>
    `;
  } else {
    errorMessage.style.display = "none";
  }
}


  // Jaccard Similarity for fuzzy search
  function jaccardSimilarity(str1, str2) {
    const set1 = new Set(str1);
    const set2 = new Set(str2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    return intersection.size / (set1.size + set2.size - intersection.size);
  }

  // Create a debounced version of the filterMovies function to reduce main-thread blocking.
  const debouncedFilterMovies = debounce(() => {
    filterMovies(searchInput.value.toLowerCase());
  }, 300);

  // Use the debounced function for input and keypress events.
  searchInput.addEventListener("input", debouncedFilterMovies);
  searchBtn.addEventListener("click", debouncedFilterMovies);
  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      debouncedFilterMovies();
    }
  });
});

// --- Movie Page & Modal Handling ---
function openMoviePage(movieId, movieTitle, movieImage) {
  const movieLinks = {
    
    /*Hindi Movies starts Here copy from "Skyforce" till }; to add new movies*/ 
      /*change movie name,description,links in MovieLinks replacing # if series then in series link*/
    
   // Sitaare Zameen Par
  sitaareZameenPar: {
    description: "A heart-warming drama about a teacher who changes lives.",
    movieLinks: {
      "480p": "https://www.filmyzilla13.com/downloads/30787/1/server_1/",
      "720p": "https://www.filmyzilla13.com/downloads/30624/1/server_1/",
      "1080p": "https://www.filmyzilla13.com/downloads/30623/1/server_1/"
    }
  },

  // Housefull 5A
  housefull5A: {
    description: "The latest installment in the madcap Housefull comedy franchise.",
    movieLinks: {
      "480p": "https://www.filmyzilla13.com/downloads/30781/1/server_1/",
      "720p": "https://www.filmyzilla13.com/downloads/30780/1/server_1/",
      "1080p": "https://www.filmyzilla13.com/downloads/30778/1/server_1/"
    }
  },
    
// Kesari 2
  kesari2: {
    description: "The epic sequel continuing the saga of bravery and honor.",
    movieLinks: {
      "480p": "https://www.filmyzilla13.com/downloads/30446/1/server_1/",
      "720p": "https://www.filmyzilla13.com/downloads/30445/1/server_1/",
      "1080p": "https://www.filmyzilla13.com/downloads/30444/1/server_1/",
      "2060p": "https://www.filmyzilla13.com/downloads/30443/1/server_1/"
    }
  },

  // Housefull 5B
  housefull5b: {
    description: "More laughter and chaos in the blockbuster Housefull series.",
    movieLinks: {
      "480p": "https://www.filmyzilla13.com/downloads/30776/1/server_1/",
      "720p": "https://www.filmyzilla13.com/downloads/30774/1/server_1/",
      "1080p": "https://www.filmyzilla13.com/downloads/30773/1/server_1/"
      
    }
  },
   
     /*Punjabi Movies starts Here copy from "punjabi1" till }; to add new movies*/ 
      /*change movie name,description,links in MovieLinks replacing # if series then in series link*/
    
    // Pind Peya Saara Jombieland bniya
  pindPeyaSaara: {
    description: "Jeeti and Kokos romance faces family opposition, but their battle for acceptance becomes a struggle to stay alive.",
    movieLinks: {
      "480p": "https://www.filmyzilla13.com/downloads/30682/1/server_1/",
      "720p": "https://www.filmyzilla13.com/downloads/30681/1/server_1/",
      "1080p": "https://www.filmyzilla13.com/downloads/30680/1/server_1/"
    }
  },
   
    /*Hollywood Movies starts Here copy from "Hollywood1" till }; to add new movies*/ 
      /*change movie name,description,links in MovieLinks replacing # if series then in series link*/
    
     // Captain America Brave New World
  captainAmerica: {
    description: "Sam Wilson, the new Captain America, finds himself in the middle of an international incident and must discover the motive behind a nefarious global plan.",
    movieLinks: {
      "480p": "https://www.filmyzilla13.com/downloads/30060/1/server_1/",
      "720p": "https://www.filmyzilla13.com/downloads/30059/1/server_1/",
      "1080p": "https://www.filmyzilla13.com/downloads/30058/1/server_1/"
    }
  },
   
 
    
    /*Webseries starts Here copy from "Webseries" till }; to add new movies*/ 
      /*change movie name,description,links in MovieLinks replacing # if series then in series link*/
    
   PanchayatS04: {
    description: " A comedy-drama, which captures the journey of an engineering graduate Abhishek, who for lack of a better job option joins as secretary of a Panchayat office in a remote village of Uttar Pradesh.",
  
    seriesLinks: {
      
        "S06Complete 480p": "https://www.filmyzilla13.com/downloads/30706/1/server_1/",
        "S06Complete 720p": "https://www.filmyzilla13.com/downloads/30704/1/server_1/",
        "S06Complete 1080p": "https://www.filmyzilla13.com/downloads/30703/1/server_1/"
      }
    },
   Ironheart: {
  description: "A Marvel Studios web series following Riri Williams, a young engineering genius who builds her own suit of armor inspired by Iron Man, navigating challenges of tech, identity, and heroism.",

  seriesLinks: {
    "Episode 01 (480p)": "https://www.filmyzilla13.com/downloads/30789/1/server_1/",
    "Episode 01 (720p)": "https://www.filmyzilla13.com/downloads/30789/1/server_1/",
    "Episode 01 (1080p)": "https://www.filmyzilla13.com/downloads/30788/1/server_1/",

    "Episode 02 (480p)": "https://www.filmyzilla13.com/downloads/30791/1/server_1/",
    "Episode 02 (720p)": "https://www.filmyzilla13.com/downloads/30791/1/server_1/",
    "Episode 02 (1080p)": "https://www.filmyzilla13.com/downloads/30790/1/server_1/",

    "Episode 03 (480p)": "https://www.filmyzilla13.com/downloads/30793/1/server_1/",
    "Episode 03 (720p)": "https://www.filmyzilla13.com/downloads/30793/1/server_1/",
    "Episode 03 (1080p)": "https://www.filmyzilla13.com/downloads/30792/1/server_1/",

   /* "Episode 04 (480p)": "https://www.filmyzilla13.com/downloads/30910/1/server_1/",
    "Episode 04 (720p)": "https://www.filmyzilla13.com/downloads/30911/1/server_1/",
    "Episode 04 (1080p)": "https://www.filmyzilla13.com/downloads/30912/1/server_1/",

    "Episode 05 (480p)": "https://www.filmyzilla13.com/downloads/30913/1/server_1/",
    "Episode 05 (720p)": "https://www.filmyzilla13.com/downloads/30914/1/server_1/",
    "Episode 05 (1080p)": "https://www.filmyzilla13.com/downloads/30915/1/server_1/",

    "Episode 06 (480p)": "https://www.filmyzilla13.com/downloads/30916/1/server_1/",
    "Episode 06 (720p)": "https://www.filmyzilla13.com/downloads/30917/1/server_1/",
    "Episode 06 (1080p)": "https://www.filmyzilla13.com/downloads/30918/1/server_1/" */
  }
}

  };
  
  const movieData = movieLinks[movieId];
  if (!movieData) {
    alert("Movie details not available!");
    return;
  }
  const moviePageContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="RMG Movies - Stream latest Hindi, Punjabi, Hollywood movies in HD quality">
      <title>${movieTitle}</title>
      <style>
        body
        {
        font-family: Arial,
        sans-serif; text-align: center; 
        padding: 20px;
        background: #111; color: white;
        }
        .container {
        max-width: 600px; 
        margin: auto; padding: 20px;
        border-radius: 10px; 
        background: #222; 
        box-shadow: 0px 0px 10px rgba(255,255,255,0.2); 
        }
        img { 
        max-width: 100%; 
        height: auto; border-radius: 10px;
        }
        .description {
        font-size: 18px;
        margin-top: 10px; color: #ccc;
        }
        .buttons {
        margin-top: 20px; 
        }
        .btn {
        display: block;
        width: 100%; padding: 12px; 
        margin: 10px 0; 
        font-size: 16px; 
        text-decoration: none;
        color: white; 
        background: linear-gradient(45deg, #007BFF, #00D4FF); 
        border: none; 
        border-radius: 8px;
        cursor: pointer; 
        transition: 0.3s; 
        }
        .btn:hover { 
        background: linear-gradient(45deg, #00D4FF, #007BFF);
        }
        .modal { 
        display: none; 
        position: fixed; top: 0;
        left: 0;
        width: 100%;
        height: 100%; 
        background: rgba(0, 0, 0, 0.8);
        }
        /* Base modal content style */
.modal-content {
  background: #fff;
  padding: 20px;
  margin: 5% auto;
  width: 80%;
  max-width: 400px;
  border-radius: 5px;
  color: black;
  text-align: left;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
}

/* Mobile-first responsive styles */
@media (max-width: 600px) {
  .modal-content {
    width: 95vw !important;
    height: auto;
    max-height: 95vh !important;
    margin: 2vh auto !important;
    padding: 1rem !important;
    border-radius: 10px;
    overflow-y: auto;
    box-sizing: border-box;
  }


        
        }
        .close-modal { font-size: 20px; 
        cursor: pointer; 
        float: right;
        }
        .download-links { 
        display: flex;
        flex-direction: column; 
        align-items: center;
        }
        .download-links a {
        display: block; 
        width: 80%; padding: 12px; 
        margin-top: 8px; 
        font-size: 16px; 
        text-align: center; 
        text-decoration: none; 
        color: white;
        background: linear-gradient(45deg, #FF416C, #FF4B2B); 
        border-radius: 8px;
        transition: 0.3s; 
        }
        .download-links a:hover { 
        background: linear-gradient(45deg, #FF4B2B, #FF416C);
        }
        /* add to your <style> block */
      .warning-message {
  color: #e74c3c;                /* bold red text */
  background-color: #fdecea;   /* pale red background */
  border: 1px solid #e74c3c;     /* red border */
  border-radius: 5px;
  padding: 12px;
  margin-top: 16px;
  text-align: center;
  font-weight: bold;
}
/* On small screens, make modal-content fill almost entire screen */
@media (max-width: 600px) {
    .modal-content {
        width: 95vw !important;
        height: 95vh !important;
        max-width: none !important;
        max-height: none !important;
        margin: 0;            /* no auto margins */
        border-radius: 0;     /* square corners for full-screen look */
        padding: 1rem;
        overflow-y: auto;     /* scroll if content overflows */
    }
}
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${movieTitle}</h1>
        <img src="${movieImage}" alt="${movieTitle}">
        <p class="description">${movieData.description}</p>
        <div class="buttons">
          <button class="btn" onclick="openLinks('Movie Links')">🎬 Movie Links</button>
          <button class="btn" onclick="openLinks('Series Links')">📺 Series Links</button>
         
        </div>
        <button id="homeBtn" class="btn">🏠 Go to Home</button>
      </div>

      <div id="linksModal" class="modal">
        <div class="modal-content">
          <span class="close-modal" onclick="closeModal()">×</span>
          <h2 id="modalTitle"></h2>
          <div class="download-links" id="modalLinks"></div>
        </div>
      </div>

      <div id="tutorialModal" class="modal">
        <div class="modal-content">
          <span class="close-modal" onclick="closeModal()">×</span>
          <h2>Tutorial for ${movieTitle}</h2>
          <h3>🎬 Tutorial for Movies</h3>
          <a href="#">Movie Tutorial Link 1</a>
          <a href="#">Movie Tutorial Link 2</a>
          <h3>📺 Tutorial for Series</h3>
          <a href="#">Series Tutorial Link 1</a>
          <a href="#">Series Tutorial Link 2</a>
        </div>
      </div>

      <script>
        const movieData = ${JSON.stringify(movieData)};
        // Updated Home Button event: Explicitly redirect to the homepage URL.
        document.getElementById("homeBtn").addEventListener("click", function() {
     window.location.href="https://dearestwall.github.io/ThrillyVerse/movies.html";  // Replace with your actual homepage URL
        });
        function openLinks(category) {
          const categoryKey = category.toLowerCase().includes("movie") ? "movieLinks" : "seriesLinks";
          document.getElementById("modalTitle").innerText = category;
          const linksContainer = document.getElementById("modalLinks");
          if (!movieData[categoryKey]) {
  // set up a styled warning inside the modal
  const linksModal = document.getElementById("linksModal");
  document.getElementById("modalTitle").innerText = category;
  document.getElementById("modalLinks").innerHTML =
    '<p class="warning-message">No links available for this category.</p>';
  linksModal.style.display = "flex";   // or "block" depending on your centering
  return;
          }
          linksContainer.innerHTML = Object.keys(movieData[categoryKey]).map(resolution => {
            const link = movieData[categoryKey][resolution];
            return \`
              <h3>\${resolution}</h3>
              <a href="\${link}" target="_blank">Download Now</a>
            \`;
          }).join("");
          document.getElementById("linksModal").style.display = "block";
        }
        function openTutorial() {
          document.getElementById("tutorialModal").style.display = "block";
        }
        function closeModal() {
          document.getElementById("linksModal").style.display = "none";
          document.getElementById("tutorialModal").style.display = "none";
        }
        window.onclick = function(event) {
          if (event.target.classList.contains("modal")) {
            closeModal();
          }
        };
      </script>
    </body>
    </html>
  `;
  const movieWindow = window.open("", "_blank");
  movieWindow.document.write(moviePageContent);
  movieWindow.document.close();
}

// --- In-Page Modal Functions (if needed) ---
function closeMovieModal() {
  document.getElementById("movieModal").style.display = "none";
}

function closeLinksModal() {
  document.getElementById("linksModal").style.display = "none";
}

function closeTutorialModal() {
  document.getElementById("tutorialModal").style.display = "none";
}

// Close modals on Escape key press
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeLinksModal();
    closeTutorialModal();
  }
});

/* MOBILE NAVIGATION TOGGLE (Hamburger Menu) */
const menuToggle = document.getElementById("menuToggle");
if (menuToggle) {
  menuToggle.addEventListener("click", function(e) {
    e.stopPropagation();
    if (window.innerWidth < 768) {
      const navMenu = document.querySelector(".main-nav ul");
      if (navMenu) {
        const isOpen = navMenu.style.display === "flex";
        navMenu.style.display = isOpen ? "none" : "flex";
        menuToggle.classList.toggle("active", !isOpen);
        menuToggle.innerHTML = isOpen ? "&#9776;" : "&times;";
      }
    }
  });

  document.addEventListener("click", function(e) {
    if (window.innerWidth < 768) {
      const navMenu = document.querySelector(".main-nav ul");
      if (
        navMenu &&
        !navMenu.contains(e.target) &&
        e.target.id !== "menuToggle"
      ) {
        navMenu.style.display = "none";
        menuToggle.classList.remove("active");
        menuToggle.innerHTML = "&#9776;";
      }
    }
  });

  window.addEventListener("resize", function() {
    const navMenu = document.querySelector(".main-nav ul");
    if (window.innerWidth >= 768 && navMenu) {
      navMenu.style.display = "flex";
      menuToggle.classList.remove("active");
      menuToggle.innerHTML = "&#9776;";
    }
  });
}
