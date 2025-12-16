'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnToScroll=document.querySelector('.btn--scroll-to');
const section1=document.querySelector('#section--1')

console.log("section",section1);

// console.log("nodelist:",btnsOpenModal);


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)


  btnsOpenModal.forEach(btn=>btn.addEventListener('click', openModal)) 

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);


document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnToScroll.addEventListener("click",function(){
  
      section1.scrollIntoView({behavior:"smooth"})
})