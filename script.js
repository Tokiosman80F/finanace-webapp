'use strict';
const nav = document.querySelector('.nav');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');

//===================================
// MODAL COMPONENT
//===================================

const ModalComponent = (function () {
  // Element
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.btn--close-modal');
  const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
  function init() {
    // Guard : if element doesnt exit return
    if (!modal || !overlay) return;

    btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

    btnCloseModal.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  return { init };
})();

//===================================
// SMOOTH SCROLL COMPONENT
//===================================

const SmoothScrollComponent = (function () {
  // Element
  const btnToScroll = document.querySelector('.btn--scroll-to');
  const section1 = document.querySelector('#section--1');
  const navLinks = document.querySelector('.nav__links');

  function init() {
    if (!btnToScroll || !section1 || !navLinks) return;

    btnToScroll.addEventListener('click', function () {
      section1.scrollIntoView({ behavior: 'smooth' });
    });

    navLinks.addEventListener('click', function (e) {
      e.preventDefault();

      // Match pattern
      if (e.target.classList.contains('nav__link')) {
        let id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  return { init };
})();

//===================================
// TAB COMPONENT
//===================================

const TabComponent = (function () {
  // Element
  const tabs = document.querySelectorAll('.operations__tab');
  const tabContainer = document.querySelector('.operations__tab-container');
  const tabContent = document.querySelectorAll('.operations__content');

  function init() {
    if (!tabContainer) return;

    // Using event delegation
    tabContainer.addEventListener('click', function (e) {
      const clicked = e.target.closest('.operations__tab');
      console.log(clicked);
      console.log(clicked.dataset.tab);

      if (!clicked) return;

      // remove active class
      tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
      tabContent.forEach(content =>
        content.classList.remove('operations__content--active'),
      );

      // activate tab
      clicked.classList.add('operations__tab--active');
      // activate content
      document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
    });
  }

  return { init };
})();

//===================================
// NAV FADE COMPONENT
//===================================

const NavFadeComponent = (function () {
  // element
  const nav = document.querySelector('.nav');

  function handleNavHover(e, opacity) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const sibiling = link
        .closest('.nav__links')
        .querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      // select all sibiling and make them fade out ,expect the select one
      sibiling.forEach(el => {
        if (el !== link) el.style.opacity = opacity;
      });
      logo.style.opacity = opacity;
    }
  }

  function init() {
    if (!nav) return;

    nav.addEventListener('mouseover', e => {
      handleNavHover(e, 0.5);
    });
    nav.addEventListener('mouseout', e => {
      handleNavHover(e, 1);
    });
  }

  return { init };
})();

// Slider components

const sliderComponent = () => {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  const maxSlide = slides.length;
  let currentSlide = 0;

  // function
  const goToSlider = slideNumber => {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${(index - slideNumber) * 100}%)`;
    });
  };

  const createDot = () => {
    slides.forEach((_, index) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`,
      );
    });
  };

  const activateDot = currentSlide => {
    document.querySelectorAll('.dots__dot').forEach((dot, index) => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
      .classList.add('dots__dot--active');
  };

  const previousSlide = () => {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlider(currentSlide);
    activateDot(currentSlide);
  };

  const nextSlide = () => {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlider(currentSlide);
    activateDot(currentSlide);
  };

  // init function
  const init = () => {
    goToSlider(0);
    createDot();
    activateDot(0);
  };
  init();

  // Event listener
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  // dot event
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlider(slide);
    }
  });
  //  keyboard event
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && previousSlide();
  });
};

sliderComponent();

// menu fade animation

// sticky nav bar => intersection observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const [enter] = entries;
  // console.log(enter);
  if (!enter.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// reveal section
const allSection = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const [enter] = entries;
  // console.log("enter:",enter);

  if (!enter.isIntersecting) return;

  enter.target.classList.remove('section--hidden');

  observer.unobserve(enter.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading image
const allImg = document.querySelectorAll('img[data-src]');

const lazyImg = (enteries, observer) => {
  const [enter] = enteries;
  // replacing src with data-src
  if (!enter.isIntersecting) return;
  // console.log(enter);
  enter.target.src = enter.target.dataset.src;

  enter.target.addEventListener('load', function () {
    enter.target.classList.remove('lazy-img');
  });

  observer.unobserve(enter.target);
};

const imgObserver = new IntersectionObserver(lazyImg, {
  root: null,
  threshold: 0.15,
  rootMargin: '200px',
});

allImg.forEach(img => imgObserver.observe(img));

//===================================
// APP - signle entry point that start everything
//===================================
function App() {
  ModalComponent.init();
  SmoothScrollComponent.init();
  TabComponent.init();
  NavFadeComponent.init();
}
App();
