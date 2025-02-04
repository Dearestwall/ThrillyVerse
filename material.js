document.addEventListener("DOMContentLoaded", function () {
  /* ---------------------------
     MAIN TAB SWITCHING (Study Materials vs. News)
  --------------------------- */
  const mainTabs = document.querySelectorAll(".main-tabs li");
  const tabContents = document.querySelectorAll(".tab-content");
  const searchBarContainer = document.getElementById("searchBarContainer");
  const errorMessage = document.getElementById("errorMessage");

  mainTabs.forEach(tab => {
    tab.addEventListener("click", function () {
      // Update active tab styles
      mainTabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      // Show only the selected tab's content
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

      // For the News tab, hide the search bar and error messages;
      // For the Materials tab, show the search bar and reset search.
      if (targetTab === "news") {
        searchBarContainer.style.display = "none";
        errorMessage.style.display = "none";
      } else {
        searchBarContainer.style.display = "flex";
        resetSearch();
      }
    });
  });

  // Activate the Materials tab by default
  document.querySelector('[data-tab="materials"]').click();

  /* ---------------------------
     SUBJECT TAB SWITCHING (Within Study Materials)
  --------------------------- */
  const subjectTabs = document.querySelectorAll(".subject-tabs li");
  const subjectSections = document.querySelectorAll(".subject-section");

  subjectTabs.forEach(tab => {
    tab.addEventListener("click", function () {
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

  // Activate the first subject tab by default if available
  if (subjectTabs.length > 0) {
    subjectTabs[0].click();
  }

  /* ---------------------------
     SEARCH FUNCTIONALITY (Only for Study Materials)
     Debounced for smoother live filtering.
  --------------------------- */
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const clearSearchButton = document.getElementById("clearSearch");

  let debounceTimeout;
  searchInput.addEventListener("input", function () {
    clearSearchButton.style.display = this.value.trim() ? "inline-flex" : "none";
    errorMessage.style.display = "none";

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      liveFilterPDFs(this.value);
    }, 300);
  });

  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });
  clearSearchButton.addEventListener("click", resetSearch);

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (query === "") {
      resetSearch();
      return;
    }

    let found = false;
    const pdfItems = document.querySelectorAll(".pdf-item");

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
      errorMessage.innerHTML = `<span id="errorClose" title="Close">&times;</span>No content found. Try another search or request material on <a href="https://t.me/icseverse" target="_blank">ICSEverse</a>.`;
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
    searchInput.value = "";
    const pdfItems = document.querySelectorAll(".pdf-item");
    pdfItems.forEach(item => (item.style.display = "block"));
    clearSearchButton.style.display = "none";
    errorMessage.style.display = "none";
  }

  /* ---------------------------
     BACK TO TOP BUTTON
  --------------------------- */
  const backToTopButton = document.createElement("button");
  backToTopButton.id = "backToTop";
  backToTopButton.innerHTML = "⬆";
  document.body.appendChild(backToTopButton);

  window.addEventListener("scroll", function () {
    backToTopButton.style.display = window.pageYOffset > 300 ? "block" : "none";
  });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------
     NEWS MODAL FUNCTIONALITY (For News tab)
  --------------------------- */
  const newsLinks = document.querySelectorAll(".news-item .read-more");
  const newsModal = document.getElementById("newsModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeModalButton = document.querySelector(".close-modal");

  newsLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const newsItem = this.closest(".news-item");
      const title = newsItem.querySelector("h3").textContent;
      const content = newsItem.querySelector("p").textContent;

      modalTitle.textContent = title;
      modalContent.textContent = content;
      newsModal.style.display = "flex";
    });
  });

  closeModalButton.addEventListener("click", function () {
    newsModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === newsModal) {
      newsModal.style.display = "none";
    }
  });

  /* ---------------------------
     QUIZ TAB FUNCTIONALITY (Maha Quiz and Others)
  --------------------------- */
  const quizTabLink = document.getElementById('quizTab');
  const quizTabContent = document.getElementById('quizTabContent');

  // Show quiz tab content when clicked
  quizTabLink.addEventListener('click', function() {
    quizTabContent.style.display = 'block';  // Show the quiz tab content
  });

  // Function to display a popup notification about the new quiz
  function showQuizNotification() {
    const notification = document.createElement('div');
    notification.classList.add('quiz-notification');
    notification.innerHTML = `New Quiz Alert: The Maha Quiz is now live! <a href="https://docs.google.com/forms/d/e/1FAIpQLSf01oDsCf11o6JJ6_FiQfzqckur39VGAeq2muZ_xOSrLdZEVw/viewform?usp=sharing" target="_blank">Click Here to Take the Quiz</a><button class="close-notification">X</button>`;
    
    // Add notification to the body
    document.body.appendChild(notification);

    // Add event listener to close the notification
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', function() {
      notification.remove();
    });

    // Automatically hide notification after 5 seconds
    setTimeout(function() {
      notification.remove();
    }, 10000);

    // Redirect to quiz tab when notification is clicked
    notification.addEventListener('click', function () {
      const quizTab = document.querySelector('li[data-tab="quiz"]');
      if (quizTab) {
        quizTab.click();
      }
    });
  }

  // Trigger notification for Maha Quiz
  showQuizNotification();

  // Example of handling dynamic quizzes (add more in future)
  const quizList = [
    {
      title: "Maha Quiz: Physics, Chemistry, and Mathematics",
      description: "A challenging quiz that tests your knowledge in Physics, Chemistry, and Mathematics. It includes a variety of questions to challenge students at all levels.",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSf01oDsCf11o6JJ6_FiQfzqckur39VGAeq2muZ_xOSrLdZEVw/viewform?usp=sharing"
    }
  ];

  // Dynamically add quizzes to the quiz tab
  const quizTabContentContainer = document.getElementById('quizTabContent');
  quizList.forEach(function(quiz) {
    const quizItem = document.createElement('div');
    quizItem.classList.add('quiz-item');
    quizItem.innerHTML = `<h4>${quiz.title}</h4><p>${quiz.description}</p><a href="${quiz.link}" target="_blank">Take Quiz</a>`;
    quizTabContentContainer.appendChild(quizItem);
  });
});
