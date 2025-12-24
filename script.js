'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnToScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1')
const section2 = document.querySelector('#section--2')
const section3 = document.querySelector('#section--3')

console.log("section", section1);

// console.log("nodelist:",btnsOpenModal);


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);


document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnToScroll.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" })
})

document.querySelector('.nav__links').addEventListener("click", function (e) {

  e.preventDefault();

  // Match pattern
  if (e.target.classList.contains('nav__link')) {
    let id = e.target.getAttribute('href')
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})


// Tab components
const tabs = document.querySelectorAll('.operations__tab')
const tabContainer = document.querySelector('.operations__tab-container')
const tabContent = document.querySelectorAll('.operations__content')

// Using event delegation
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  console.log(clicked.dataset.tab);

  if (!clicked) return

  // remove active class
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"))
  tabContent.forEach((content) => content.classList.remove("operations__content--active"))

  // activate tab
  clicked.classList.add("operations__tab--active")
  // activate content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')

})


// menu fade animation
const nav = document.querySelector('.nav')

const handleNavHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const sibiling = link.closest('.nav__links').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    // select all sibiling and make them fade out ,expect the select one 
    sibiling.forEach(el => {
      if (el !== link) el.style.opacity = opacity
    })
    logo.style.opacity = opacity
  }

}
nav.addEventListener('mouseover', (e) => { handleNavHover(e, 0.5) })
nav.addEventListener('mouseout', (e) => { handleNavHover(e, 1) })


// sticky nav bar => intersection observer API
const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height

const stickyNav = (entries) => {
  const [enter] = entries
  // console.log(enter);
  if (!enter.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')

}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
})
headerObserver.observe(header)


// reveal section 
const allSection = document.querySelectorAll('.section')

const revealSection=(entries,observer)=>{
  const [enter]=entries
  console.log("enter:",enter);
  
  if(!enter.isIntersecting) return
  
  enter.target.classList.remove('section--hidden')

  observer.unobserve(enter.target)
  

}

const sectionObserver = new IntersectionObserver(revealSection, {
  root:null,
  threshold:0.15
})

allSection.forEach((section) => {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

// const h1 = document.querySelector('.header__title');

// const showAlret=function(){
//   alert("hey")
//   h1.removeEventListener('mouseenter',showAlret)
// }
// h1.addEventListener('mouseenter',showAlret)