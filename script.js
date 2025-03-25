document.addEventListener("DOMContentLoaded", function() {
  /*-----------------------------
    BACK TO TOP BUTTON
  -----------------------------*/
  const backToTopButton = document.getElementById("backToTop");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      backToTopButton.style.display = window.pageYOffset > 300 ? "block" : "none";
    });
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /*-----------------------------
    SLIDER FUNCTIONALITY FOR PROJECT IMAGES
  -----------------------------*/
  document.querySelectorAll('.slider').forEach(slider => {
    const slides = slider.querySelector('.slides');
    const images = slides.querySelectorAll('img');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let currentIndex = 0;
    const totalImages = images.length;

    function updateSlider() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateSlider();
      });
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateSlider();
      });
    }
  });

  /*-----------------------------
    FULLSCREEN MODAL FOR PROJECT IMAGES
  -----------------------------*/
  document.querySelectorAll('.project-image img').forEach(img => {
    img.addEventListener('click', () => {
      const modal = document.getElementById("fullscreenModal");
      const modalImg = document.getElementById("modalImage");
      const captionText = document.getElementById("caption");
      if (modal) {
        modal.style.display = "block";
        modalImg.src = img.src;
        captionText.textContent = img.alt;
        document.body.style.overflow = "hidden";
      }
    });
  });
  const fullscreenModal = document.getElementById("fullscreenModal");
  if (fullscreenModal) {
    document.getElementById("modalClose").addEventListener('click', () => {
      fullscreenModal.style.display = "none";
      document.body.style.overflow = "auto";
    });
    fullscreenModal.addEventListener('click', (e) => {
      if (e.target.id === "fullscreenModal") {
        fullscreenModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  /*-----------------------------
    MOBILE NAVIGATION TOGGLE (Hamburger Menu)
  -----------------------------*/
  const menuToggle = document.getElementById("menuToggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", function(e) {
      e.stopPropagation();
      // Only toggle if screen width is less than 768px
      if (window.innerWidth < 768) {
        const navMenu = document.querySelector(".main-nav ul");
        if (navMenu) {
          if (navMenu.style.display === "flex") {
            navMenu.style.display = "none";
            menuToggle.classList.remove("active");
            menuToggle.innerHTML = "&#9776;"; // hamburger icon
          } else {
            navMenu.style.display = "flex";
            menuToggle.classList.add("active");
            menuToggle.innerHTML = "&times;"; // close icon
          }
        }
      }
    });
    // Hide nav menu when clicking outside (for mobile)
    document.addEventListener("click", function(e) {
      if (window.innerWidth < 768) {
        const navMenu = document.querySelector(".main-nav ul");
        if (navMenu && !navMenu.contains(e.target) && e.target.id !== "menuToggle") {
          navMenu.style.display = "none";
          menuToggle.classList.remove("active");
          menuToggle.innerHTML = "&#9776;";
        }
      }
    });
  }
  // On window resize, ensure nav is shown on big screens
  window.addEventListener("resize", function() {
    if (window.innerWidth >= 768) {
      const navMenu = document.querySelector(".main-nav ul");
      if (navMenu) {
        navMenu.style.display = "flex";
      }
    }
  });

  /*-----------------------------
    MAIN TABS (Materials, News, Quiz)
  -----------------------------*/
  const mainTabs = document.querySelectorAll(".main-tabs li");
  const tabContents = document.querySelectorAll(".tab-content");
  if (mainTabs.length) {
    mainTabs.forEach(tab => {
      tab.addEventListener("click", function() {
        mainTabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");
        const targetTab = this.getAttribute("data-tab");
        tabContents.forEach(content => {
          if (content.id === targetTab) {
            content.classList.add("active");
            content.style.display = "block";
          } else {
            content.classList.remove("active");
            content.style.display = "none";
          }
        });
        resetSearch();
      });
    });
  }

  /*-----------------------------
    SUBJECT TAB SWITCHING (Materials Page)
  -----------------------------*/
  const subjectTabs = document.querySelectorAll(".subject-tabs li");
  const subjectSections = document.querySelectorAll(".subject-section");
  if (subjectTabs.length) {
    subjectTabs.forEach(tab => {
      tab.addEventListener("click", function() {
        subjectTabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");
        const targetSubject = this.getAttribute("data-subject");
        subjectSections.forEach(section => {
          if (section.getAttribute("data-subject") === targetSubject) {
            section.style.display = "block";
            section.classList.add("active");
          } else {
            section.style.display = "none";
            section.classList.remove("active");
          }
        });
        resetSearch();
      });
    });
    subjectTabs[0] && subjectTabs[0].click();
  }

  /*-----------------------------
    SEARCH FUNCTIONALITY (Materials Page)
  -----------------------------*/
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const clearSearchButton = document.getElementById("clearSearch");
  const errorMessage = document.getElementById("errorMessage");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      if (clearSearchButton) {
        clearSearchButton.style.display = this.value ? "inline-block" : "none";
      }
      if (errorMessage) errorMessage.style.display = "none";
      liveFilterPDFs(this.value);
    });
    searchButton && searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") performSearch();
    });
    clearSearchButton && clearSearchButton.addEventListener("click", resetSearch);
  }
  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    let found = false;
    const pdfItems = document.querySelectorAll(".pdf-item");
    if (query === "") {
      resetSearch();
      return;
    }
    pdfItems.forEach(item => {
      const title = item.querySelector(".pdf-details h3").textContent.toLowerCase();
      const description = item.querySelector(".pdf-details p").textContent.toLowerCase();
      if (title.includes(query) || description.includes(query)) {
        item.style.display = "block";
        found = true;
      } else {
        item.style.display = "none";
      }
    });
    if (!found) {
      errorMessage.innerHTML = `<span id="errorClose" title="Close">&times;</span> ❌ No content found. Try again or request material on <a href="https://t.me/icseverse" target="_blank">ICSEverse</a>.`;
      errorMessage.style.display = "block";
      document.getElementById("errorClose").addEventListener("click", resetSearch);
    }
    clearSearchButton.style.display = "none";
  }
  function liveFilterPDFs(query) {
    query = query.toLowerCase().trim();
    const pdfItems = document.querySelectorAll(".pdf-item");
    pdfItems.forEach(item => {
      const title = item.querySelector(".pdf-details h3").textContent.toLowerCase();
      const description = item.querySelector(".pdf-details p").textContent.toLowerCase();
      if (query === "" || title.includes(query) || description.includes(query)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
  function resetSearch() {
    if (searchInput) searchInput.value = "";
    const pdfItems = document.querySelectorAll(".pdf-item");
    pdfItems.forEach(item => item.style.display = "block");
    if (clearSearchButton) clearSearchButton.style.display = "none";
    if (errorMessage) errorMessage.style.display = "none";
  }

  /*-----------------------------
    NEWS MODAL FUNCTIONALITY (News Page & Materials News Tab)
  -----------------------------*/
  const newsModal = document.getElementById("newsModal");
  // Updated selector: Check both .news-card and .news-item for .read-more
  const newsButtons = document.querySelectorAll(".news-card .read-more, .news-item .read-more");
  function openNewsModal(card) {
    const titleElement = card.querySelector("h2") || card.querySelector("h3");
    const contentElement = card.querySelector("p");
    const modalTitle = document.getElementById("newsModalTitle") || document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    if (titleElement && modalTitle) {
      modalTitle.textContent = titleElement.textContent;
    }
    if (contentElement && modalContent) {
      modalContent.textContent = contentElement.textContent;
    }
    newsModal.style.display = "flex";
  }
  if (newsModal) {
    if (newsButtons.length > 0) {
      newsButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
          e.preventDefault();
          const card = this.closest(".news-card, .news-item");
          openNewsModal(card);
        });
      });
    } else {
      const newsCards = document.querySelectorAll(".news-card, .news-item");
      newsCards.forEach(card => {
        card.addEventListener("click", function() {
          openNewsModal(card);
        });
      });
    }
    const newsCloseBtn = newsModal.querySelector(".close-modal");
    if (newsCloseBtn) {
      newsCloseBtn.addEventListener("click", function() {
        newsModal.style.display = "none";
      });
    }
    window.addEventListener("click", function(event) {
      if (event.target === newsModal) {
        newsModal.style.display = "none";
      }
    });
  }

  /*-----------------------------
    POPUP NOTIFICATION FOR MAHA QUIZ (Materials Page)
  -----------------------------*/
  const quizPopup = document.getElementById("quizPopup");
  const gotoQuiz = document.getElementById("gotoQuiz");
  const closePopupButton = document.querySelector(".popup-notification .close-popup");
  function showQuizPopup() {
    const activeTab = document.querySelector(".main-tabs li.active")?.getAttribute("data-tab");
    if (activeTab === "materials") {
      if (quizPopup) {
        quizPopup.style.display = "flex";
        setTimeout(() => {
          quizPopup.style.display = "none";
        }, 2000);
      }
    } else {
      if (quizPopup) quizPopup.style.display = "none";
    }
  }
  setTimeout(showQuizPopup, 1000);
  gotoQuiz && gotoQuiz.addEventListener("click", function(e) {
    e.preventDefault();
    const quizTab = document.querySelector('.main-tabs li[data-tab="quiz"]');
    quizTab && quizTab.click();
    if (quizPopup) quizPopup.style.display = "none";
  });
  closePopupButton && closePopupButton.addEventListener("click", function() {
    if (quizPopup) quizPopup.style.display = "none";
  });
  mainTabs.forEach(tab => {
    tab.addEventListener("click", showQuizPopup);
  });

  /*-----------------------------
    DYNAMIC ANNOUNCEMENT (Rotate Messages)
  -----------------------------*/
  const announcements = [
    "Maha Quiz For Chemistry, Physics And Mathematics Out Now!",
    "New Study Materials Updated Daily!",
    "Explore Latest News and Quizzes on ThrillyVerse!"
  ];
  let announcementIndex = 0;
  const announcementText = document.getElementById("announcementText");
  if (announcementText) {
    setInterval(() => {
      announcementIndex = (announcementIndex + 1) % announcements.length;
      announcementText.style.opacity = 0;
      setTimeout(() => {
        announcementText.textContent = announcements[announcementIndex];
        announcementText.style.opacity = 1;
      }, 500);
    }, 5000);
  }
});


<!-- Additional Button Handling Script -->
document.addEventListener("DOMContentLoaded", function() {
  // --- Main Tabs Switching ---
  const mainTabs = document.querySelectorAll(".main-tabs li");
  const tabContents = document.querySelectorAll(".tab-content");
  const class10Section = document.getElementById("class10");
  const class11Section = document.getElementById("class11");

  mainTabs.forEach(tab => {
    tab.addEventListener("click", function() {
      const target = this.getAttribute("data-tab");
      // Update active state on main tabs
      mainTabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      // Show only the selected tab's content
      tabContents.forEach(content => {
        if (content.id === target) {
          content.style.display = "block";
          content.classList.add("active");
        } else {
          content.style.display = "none";
          content.classList.remove("active");
        }
      });
      
      // Hide study materials if not on "materials" tab
      if (target !== "materials") {
        if (class10Section) {
          class10Section.style.display = "none";
          class10Section.classList.remove("active");
        }
        if (class11Section) {
          class11Section.style.display = "none";
          class11Section.classList.remove("active");
        }
      }
    });
  });

  // --- Handle Class Buttons (Class 10 vs. Class 11) ---
  const btnClass10 = document.getElementById("btnClass10");
  const btnClass11 = document.getElementById("btnClass11");

  if (btnClass10 && btnClass11 && class10Section && class11Section) {
    btnClass10.addEventListener("click", function() {
      btnClass10.classList.add("active");
      btnClass11.classList.remove("active");
      class10Section.style.display = "block";
      class10Section.classList.add("active");
      class11Section.style.display = "none";
      class11Section.classList.remove("active");
    });
    btnClass11.addEventListener("click", function() {
      btnClass11.classList.add("active");
      btnClass10.classList.remove("active");
      class11Section.style.display = "block";
      class11Section.classList.add("active");
      class10Section.style.display = "none";
      class10Section.classList.remove("active");
    });
  }

  // --- Handle Stream Buttons in Class 11 ---
  const btnCommerce = document.getElementById("btnCommerce");
  const btnScience = document.getElementById("btnScience");
  const btnArts = document.getElementById("btnArts");
  
  // Get all subject tab items and content sections inside Class 11
  const subjectTabItems = document.querySelectorAll("#class11-subject-tabs li");
  const subjectSections = document.querySelectorAll("#class11-subjects-content .subject-section");

  function updateStream(selectedStream) {
    // For subject tabs: Show only those with matching data-stream
    subjectTabItems.forEach(tab => {
      if (tab.dataset.stream === selectedStream) {
        tab.style.display = "inline-block";
        // Optionally, you can set the first one as active
      } else {
        tab.style.display = "none";
        tab.classList.remove("active");
      }
    });
    // For subject sections: Show only those with matching data-stream
    subjectSections.forEach(section => {
      if (section.dataset.stream === selectedStream) {
        section.style.display = "block";
        section.classList.add("active");
      } else {
        section.style.display = "none";
        section.classList.remove("active");
      }
    });
    // Activate the first visible subject tab if available
    const visibleTabs = Array.from(subjectTabItems).filter(tab => tab.style.display !== "none");
    if (visibleTabs.length > 0) {
      visibleTabs[0].classList.add("active");
    }
  }

  if (btnCommerce && btnScience && btnArts) {
    btnCommerce.addEventListener("click", function() {
      btnCommerce.classList.add("active");
      btnScience.classList.remove("active");
      btnArts.classList.remove("active");
      updateStream("commerce");
    });
    btnScience.addEventListener("click", function() {
      btnScience.classList.add("active");
      btnCommerce.classList.remove("active");
      btnArts.classList.remove("active");
      updateStream("science");
    });
    btnArts.addEventListener("click", function() {
      btnArts.classList.add("active");
      btnCommerce.classList.remove("active");
      btnScience.classList.remove("active");
      updateStream("arts");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const streamButtons = document.querySelectorAll(".stream-btn");
  const streamContents = document.querySelectorAll(".stream-content");
  const subjectTabs = document.querySelectorAll(".subject-tabs ul li");
  const subjectSections = document.querySelectorAll(".subject-section");

  // Function to switch between streams
  streamButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove "active" class from all buttons
      streamButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Hide all stream contents
      streamContents.forEach((content) => (content.style.display = "none"));

      // Show the selected stream content
      if (this.id === "btnCommerce") {
        document.getElementById("commerceStream").style.display = "block";
      } else if (this.id === "btnScience") {
        document.getElementById("scienceStream").style.display = "block";
      } else if (this.id === "btnArts") {
        document.getElementById("humanitiesStream").style.display = "block";
      }
    });
  });

  // Function to switch between subjects within a stream
  function handleSubjectClick(event) {
    const selectedSubject = event.target.getAttribute("data-subject");
    const parentNav = event.target.closest(".subject-tabs");
    const parentStream = event.target.closest(".stream-content");

    if (!selectedSubject) return;

    // Remove active class from all subject tabs within the current stream
    parentNav.querySelectorAll("li").forEach((tab) => tab.classList.remove("active"));
    event.target.classList.add("active");

    // Hide all subjects in the current stream
    parentStream.querySelectorAll(".subject-section").forEach((section) => {
      section.style.display = "none";
    });

    // Show the selected subject
    parentStream.querySelector(`.subject-section[data-subject="${selectedSubject}"]`).style.display = "block";
  }

  // Attach event listeners to all subject tabs
  document.querySelectorAll(".subject-tabs ul li").forEach((tab) => {
    tab.addEventListener("click", handleSubjectClick);
  });

  // Initialize: Show Commerce by default
  document.getElementById("btnCommerce").click();
});
