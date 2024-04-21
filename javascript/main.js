
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', function() {
      const heroText = document.querySelector('.hero-text');
      const heroImg = document.querySelector('.hero-img');

      if (isInViewport(heroText)) {
          heroText.classList.add('animate-text');
      }

      if (isInViewport(heroImg)) {
          heroImg.classList.add('animate-img');
      }
  });

  function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  }
});




const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting || entry.intersectionRatio > 0.1) { 
      entry.target.classList.add('active');
    } else {
      entry.target.classList.remove('active');
    }
  });
}, { threshold: 0.1 }); 

cards.forEach(card => {
  observer.observe(card);
});


