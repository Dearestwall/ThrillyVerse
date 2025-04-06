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
        document.body.style.overflow = "hidden"; // disable background scroll while modal is open
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
      if (window.innerWidth < 768) {
        const navMenu = document.querySelector(".main-nav ul");
        if (navMenu) {
          if (navMenu.style.display === "flex") {
            navMenu.style.display = "none";
            menuToggle.classList.remove("active");
            menuToggle.innerHTML = "&#9776;";
          } else {
            navMenu.style.display = "flex";
            menuToggle.classList.add("active");
            menuToggle.innerHTML = "&times;";
          }
        }
      }
    });
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
            content.style.display = "block";
            content.classList.add("active");
          } else {
            content.style.display = "none";
            content.classList.remove("active");
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
    if (subjectTabs[0]) subjectTabs[0].click();
  }

  /*==============================
    SEARCH FUNCTIONALITY (Materials Page)
  ==============================*/
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
    if (searchButton) searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") performSearch();
    });
    if (clearSearchButton) clearSearchButton.addEventListener("click", resetSearch);
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
      errorMessage.innerHTML = `<span id="errorClose" title="Close">&times;</span> No content found. Try again or request material on <a href="https://t.me/icseverse" target="_blank">ICSEverse</a>.`;
      errorMessage.style.display = "block";
      document.getElementById("errorClose").addEventListener("click", resetSearch);
    }
    if (clearSearchButton) clearSearchButton.style.display = "none";
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
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  function openNewsModal(card) {
    const titleElement = card.querySelector("h3");
    // Retrieve detailed content from data-detail attribute of the read-more button
    const detailHTML = card.querySelector(".read-more").getAttribute("data-detail");
    if (titleElement) {
      modalTitle.textContent = titleElement.textContent;
    } else {
      modalTitle.textContent = "News Update";
    }
    modalContent.innerHTML = detailHTML || "";
    newsModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
  document.querySelectorAll(".news-item .read-more").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const newsItem = this.closest(".news-item");
      openNewsModal(newsItem);
    });
  });
  if (newsModal) {
    const newsCloseBtn = newsModal.querySelector(".close-modal");
    if (newsCloseBtn) {
      newsCloseBtn.addEventListener("click", function() {
        newsModal.style.display = "none";
        document.body.style.overflow = "auto";
      });
    }
    window.addEventListener("click", function(event) {
      if (event.target === newsModal) {
        newsModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  /*-----------------------------
    POPUP NOTIFICATION FOR MAHA QUIZ & CLASS XI MATERIAL
  -----------------------------*/
  const quizPopup = document.getElementById("quizPopup");
  const gotoQuiz = document.getElementById("gotoQuiz");
  const closePopupButton = document.querySelector(".popup-notification .close-popup");
  // New popup for Class XI material availability
  const classXIAvailablePopup = document.getElementById("classXIAvailablePopup");

  function showQuizPopup() {
    const activeTab = document.querySelector(".main-tabs li.active")?.getAttribute("data-tab");
    if (activeTab === "materials") {
      if (quizPopup) {
        quizPopup.style.display = "flex";
        setTimeout(() => {
          quizPopup.style.display = "none";
        }, 2000);
      }
      // Show Class XI availability popup if applicable
      if (classXIAvailablePopup) {
        classXIAvailablePopup.style.display = "flex";
        setTimeout(() => {
          classXIAvailablePopup.style.display = "none";
        }, 3000);
      }
    } else {
      if (quizPopup) quizPopup.style.display = "none";
      if (classXIAvailablePopup) classXIAvailablePopup.style.display = "none";
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

/*-----------------------------
    ADDITIONAL BUTTON HANDLING & STREAM/SUBJECT SWITCHING
-----------------------------*/
document.addEventListener("DOMContentLoaded", function() {
  // --- Main Tabs Switching ---
  const mainTabs = document.querySelectorAll(".main-tabs li");
  const tabContents = document.querySelectorAll(".tab-content");
  const class10Section = document.getElementById("class10");
  const class11Section = document.getElementById("class11");

  mainTabs.forEach(tab => {
    tab.addEventListener("click", function() {
      const target = this.getAttribute("data-tab");
      mainTabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      tabContents.forEach(content => {
        if (content.id === target) {
          content.style.display = "block";
          content.classList.add("active");
        } else {
          content.style.display = "none";
          content.classList.remove("active");
        }
      });
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
  
  const subjectTabItems = document.querySelectorAll("#class11-subject-tabs li");
  const subjectSections = document.querySelectorAll("#class11-subjects-content .subject-section");

  function updateStream(selectedStream) {
    subjectTabItems.forEach(tab => {
      if (tab.dataset.stream === selectedStream) {
        tab.style.display = "inline-block";
      } else {
        tab.style.display = "none";
        tab.classList.remove("active");
      }
    });
    subjectSections.forEach(section => {
      if (section.dataset.stream === selectedStream) {
        section.style.display = "block";
        section.classList.add("active");
      } else {
        section.style.display = "none";
        section.classList.remove("active");
      }
    });
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

  streamButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      streamButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      streamContents.forEach((content) => (content.style.display = "none"));
      if (this.id === "btnCommerce") {
        document.getElementById("commerceStream").style.display = "block";
      } else if (this.id === "btnScience") {
        document.getElementById("scienceStream").style.display = "block";
      } else if (this.id === "btnArts") {
        document.getElementById("humanitiesStream").style.display = "block";
      }
    });
  });

  function handleSubjectClick(event) {
    const selectedSubject = event.target.getAttribute("data-subject");
    const parentNav = event.target.closest(".subject-tabs");
    const parentStream = event.target.closest(".stream-content");
    if (!selectedSubject) return;
    parentNav.querySelectorAll("li").forEach((tab) => tab.classList.remove("active"));
    event.target.classList.add("active");
    parentStream.querySelectorAll(".subject-section").forEach((section) => {
      section.style.display = "none";
    });
    parentStream.querySelector(`.subject-section[data-subject="${selectedSubject}"]`).style.display = "block";
  }
  document.querySelectorAll(".subject-tabs ul li").forEach((tab) => {
    tab.addEventListener("click", handleSubjectClick);
  });
  document.getElementById("btnCommerce").click();
});

document.addEventListener("DOMContentLoaded", function() {
  // Additional Function: Floating Bubble Animation
  const bubbleContainer = document.querySelector(".bubble-container");
  if (bubbleContainer) {
    const bubbleCount = 30;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div");
      bubble.classList.add("bubble");
      const size = Math.random() * 40 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = `${Math.random() * 100}%`;
      bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
      bubbleContainer.appendChild(bubble);
    }
  }
});

/*-----------------------------
    DONATE BUTTON VALIDATION
-----------------------------*/
const donateButton = document.querySelector(".cta-button");
if (donateButton) {
  donateButton.addEventListener("click", function(e) {
    if (!/Mobi|Android/i.test(navigator.userAgent)) {
      e.preventDefault();
      let errorPopup = document.getElementById("donateError");
      if (!errorPopup) {
        errorPopup = document.createElement("div");
        errorPopup.id = "donateError";
        errorPopup.textContent = "Donation can only be processed on mobile devices. Please use your mobile device to donate.";
        document.body.appendChild(errorPopup);
      }
      errorPopup.classList.add("show");
      setTimeout(() => {
        errorPopup.classList.remove("show");
      }, 3000);
      return;
    }
  });
}

/*-----------------------------
    NEWS MODAL FUNCTIONALITY
-----------------------------*/
document.addEventListener("DOMContentLoaded", function() {
  const newsModal = document.getElementById("newsModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  function openNewsModal(card) {
    const titleElement = card.querySelector("h3");
    const detailHTML = card.querySelector(".read-more").getAttribute("data-detail");
    if (titleElement) {
      modalTitle.textContent = titleElement.textContent;
    } else {
      modalTitle.textContent = "News Update";
    }
    modalContent.innerHTML = detailHTML || "";
    newsModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
  document.querySelectorAll(".news-item .read-more").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const newsItem = this.closest(".news-item");
      openNewsModal(newsItem);
    });
  });
  if (newsModal) {
    const newsCloseBtn = newsModal.querySelector(".close-modal");
    if (newsCloseBtn) {
      newsCloseBtn.addEventListener("click", function() {
        newsModal.style.display = "none";
        document.body.style.overflow = "auto";
      });
    }
    window.addEventListener("click", function(event) {
      if (event.target === newsModal) {
        newsModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
});

/*-----------------------------
    POPUP NOTIFICATION FOR MAHA QUIZ & CLASS XI MATERIAL
-----------------------------*/
document.addEventListener("DOMContentLoaded", function() {
  const quizPopup = document.getElementById("quizPopup");
  const gotoQuiz = document.getElementById("gotoQuiz");
  const closePopupButton = document.querySelector(".popup-notification .close-popup");
  const classXIAvailablePopup = document.getElementById("classXIAvailablePopup");

  function showQuizPopup() {
    const activeTab = document.querySelector(".main-tabs li.active")?.getAttribute("data-tab");
    if (activeTab === "materials") {
      if (quizPopup) {
        quizPopup.style.display = "flex";
        setTimeout(() => {
          quizPopup.style.display = "none";
        }, 2000);
      }
      if (classXIAvailablePopup) {
        classXIAvailablePopup.style.display = "flex";
        setTimeout(() => {
          classXIAvailablePopup.style.display = "none";
        }, 3000);
      }
    } else {
      if (quizPopup) quizPopup.style.display = "none";
      if (classXIAvailablePopup) classXIAvailablePopup.style.display = "none";
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
  document.querySelectorAll(".main-tabs li").forEach(tab => {
    tab.addEventListener("click", showQuizPopup);
  });
});

/*-----------------------------
    DYNAMIC ANNOUNCEMENT (Rotate Messages)
-----------------------------*/
document.addEventListener("DOMContentLoaded", function() {
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
document.addEventListener("DOMContentLoaded", function() {
  const homeAnnouncement = document.getElementById("homeAnnouncementText");
  if (homeAnnouncement) {
    // Define the array of announcements for the home page
    const homeAnnouncements = [
      "Welcome to ThrillyVerse! Explore dynamic updates and premium study resources.",
      "New study materials are live—check out our latest updates!",
      "Join our quizzes and test your knowledge every day!"
    ];
    
    let currentIndex = 0;
    // Initialize with the first announcement
    homeAnnouncement.textContent = homeAnnouncements[currentIndex];
    
    // Rotate announcements every 5 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % homeAnnouncements.length;
      homeAnnouncement.style.opacity = 0;
      setTimeout(() => {
        homeAnnouncement.textContent = homeAnnouncements[currentIndex];
        homeAnnouncement.style.opacity = 1;
      }, 500);
    }, 5000);
  }
});
document.addEventListener("DOMContentLoaded", function() {
  const desktopNotice = document.getElementById("desktopNotice");
  const marqueeText = desktopNotice.querySelector('.marquee');

  function updateDesktopNotice() {
    // Check if the viewport width is less than 768px (adjust threshold if needed)
    if (window.innerWidth < 768) {
      marqueeText.textContent = "View This Site On Desktop View For Better Experience!";
      desktopNotice.style.display = "block";
    } else {
      desktopNotice.style.display = "none";
    }
  }

  // Initial check
  updateDesktopNotice();

  // Update on window resize
  window.addEventListener("resize", updateDesktopNotice);
});

const openReviewBtn = document.getElementById('openReviewForm');
const reviewForm = document.getElementById('reviewForm');
const cancelReviewBtn = document.getElementById('cancelReview');
const sendReviewBtn = document.getElementById('sendReview');
const usernameInput = document.getElementById('usernameInput');
const reviewInput = document.getElementById('reviewInput');
const reviewError = document.getElementById('reviewError');
const reviewThanks = document.getElementById('reviewThanks');
const reviewsDisplay = document.getElementById('reviewsDisplay');
const reviewsList = document.getElementById('reviewsList');

const reviewModal = document.getElementById('reviewModal');
const modalReviewContent = document.getElementById('modalReviewContent');
const closeModal = document.querySelector('.close-modal');

// Open the review form when the "Write a Review" button is clicked
openReviewBtn.addEventListener('click', () => {
  reviewForm.style.display = 'block';
  reviewError.style.display = 'none';
  reviewThanks.style.display = 'none';
});

// Cancel button hides the review form and resets inputs
cancelReviewBtn.addEventListener('click', () => {
  reviewForm.style.display = 'none';
  usernameInput.value = '';
  reviewInput.value = '';
  reviewInput.style.height = 'auto';
});

// Auto-resize the textarea as the user types
reviewInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

// Send review button: validate input, store review, update display, then hide form
sendReviewBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const text = reviewInput.value.trim();
  reviewError.style.display = 'none';
  reviewThanks.style.display = 'none';

  if (!username || !text) {
    reviewError.style.display = 'block';
    return;
  }

  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  // Limit to 10 reviews by removing the oldest if needed
  if (reviews.length >= 10) {
    reviews.shift();
  }

  const review = {
    username: username,
    text: text,
    timestamp: new Date().toISOString()
  };

  reviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(reviews));

  reviewThanks.style.display = 'block';
  displayReviews();

  // Auto-close the review form after submission
  setTimeout(() => {
    reviewForm.style.display = 'none';
    usernameInput.value = '';
    reviewInput.value = '';
    reviewInput.style.height = 'auto';
    reviewThanks.style.display = 'none';
  }, 1500);
});

// Function to display reviews (newest first)
function displayReviews() {
  reviewsList.innerHTML = '';
  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  if (reviews.length === 0) {
    reviewsDisplay.style.display = 'none';
    return;
  }
  reviewsDisplay.style.display = 'block';
  reviews.slice().reverse().forEach(review => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${review.username}</strong><br>
                    <div class="review-text-container">${review.text}</div>
                    <small>${new Date(review.timestamp).toLocaleDateString()}</small>`;
    // Add click event to open modal with full review content
    li.addEventListener('click', () => {
      modalReviewContent.innerHTML = `<h3>${review.username}</h3>
                                      <p>${review.text}</p>
                                      <small>${new Date(review.timestamp).toLocaleString()}</small>`;
      reviewModal.style.display = 'block';
    });
    reviewsList.appendChild(li);
  });
}

// Close modal when the close button is clicked
closeModal.addEventListener('click', () => {
  reviewModal.style.display = 'none';
});

// Also close modal if user clicks outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === reviewModal) {
    reviewModal.style.display = 'none';
  }
});

// On page load, display any stored reviews
document.addEventListener('DOMContentLoaded', displayReviews);
