document.addEventListener("DOMContentLoaded", function() {

  // Back To Top Button
  const backToTopButton = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTopButton.style.display = window.pageYOffset > 300 ? "block" : "none";
  });
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Slider Functionality for Project Images
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
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalImages;
      updateSlider();
    });
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      updateSlider();
    });
  });

  // Fullscreen Modal for Project Images
  document.querySelectorAll('.project-image img').forEach(img => {
    img.addEventListener('click', () => {
      const modal = document.getElementById("fullscreenModal");
      const modalImg = document.getElementById("modalImage");
      const captionText = document.getElementById("caption");
      modal.style.display = "block";
      modalImg.src = img.src;
      captionText.textContent = img.alt;
    });
  });
  document.getElementById("modalClose").addEventListener('click', () => {
    document.getElementById("fullscreenModal").style.display = "none";
  });
  document.getElementById("fullscreenModal").addEventListener('click', (e) => {
    if (e.target.id === "fullscreenModal") {
      e.target.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", function() {
  // Modal open for Project Images
  document.querySelectorAll('.project-image img').forEach(img => {
    img.addEventListener('click', () => {
      const modal = document.getElementById("fullscreenModal");
      const modalImg = document.getElementById("modalImage");
      const captionText = document.getElementById("caption");
      modal.style.display = "block";
      modalImg.src = img.src;
      captionText.textContent = img.alt;
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
    });
  });
  
  // Modal close using close button
  document.getElementById("modalClose").addEventListener('click', () => {
    const modal = document.getElementById("fullscreenModal");
    modal.style.display = "none";
    // Restore background scrolling
    document.body.style.overflow = "auto";
  });
  
  // Close modal if clicking outside the modal content
  document.getElementById("fullscreenModal").addEventListener('click', (e) => {
    if (e.target.id === "fullscreenModal") {
      e.target.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});
