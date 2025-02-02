document.addEventListener("DOMContentLoaded", function () {
  /* ==========================
     MAIN TAB SWITCHING (Study Materials vs. News)
  ========================== */
  const mainTabs = document.querySelectorAll(".main-tabs li");
  const tabContents = document.querySelectorAll(".tab-content");

  mainTabs.forEach(tab => {
    tab.addEventListener("click", function () {
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

  /* ==========================
     SUBJECT TAB SWITCHING (Inside Study Materials)
  ========================== */
  const subjectTabs = document.querySelectorAll(".subject-tabs li");
  const subjectSections = document.querySelectorAll(".subject-section");

  subjectTabs.forEach(tab => {
    tab.addEventListener("click", function () {
      subjectTabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      const targetSubject = this.getAttribute("data-subject");
      subjectSections.forEach(section => {
        section.style.display = section.getAttribute("data-subject") === targetSubject ? "block" : "none";
        section.classList.toggle("active", section.getAttribute("data-subject") === targetSubject);
      });
      resetSearch();
    });
  });

  // Activate first subject tab by default
  if (subjectTabs.length > 0) {
    subjectTabs[0].click();
  }

  /* ==========================
     SEARCH FUNCTIONALITY (Filter PDFs by Title & Description)
  ========================== */
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const clearSearchButton = document.getElementById("clearSearch");
  const errorMessage = document.getElementById("errorMessage");

  // Attach event to close error message
  const errorClose = document.getElementById("errorClose");
  if (errorClose) {
    errorClose.addEventListener("click", resetSearch);
  }

  searchInput.addEventListener("input", function () {
    clearSearchButton.style.display = this.value ? "inline-block" : "none";
    errorMessage.style.display = "none";
    liveFilterPDFs(this.value);
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
    searchInput.value = "";
    const pdfItems = document.querySelectorAll(".pdf-item");
    pdfItems.forEach(item => (item.style.display = "block"));
    clearSearchButton.style.display = "none";
    errorMessage.style.display = "none";
  }

  /* ==========================
     BACK TO TOP BUTTON
  ========================== */
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

  /* ==========================
     NEWS MODAL FUNCTIONALITY
  ========================== */
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
});
