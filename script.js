'use strict';

// data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200.5, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    '2024-10-11T23:36:17.929Z',
    '2025-12-04T10:51:36.790Z',
  ],
  interestRate: 1.2,
  pin: 1111,
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-10-13T18:49:59.371Z',
    '2024-03-23T12:01:20.894Z',
  ],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-05-26T17:01:17.194Z',
    '2024-08-11T23:36:17.929Z',
    '2025-01-04T10:51:36.790Z',
  ],
  interestRate: 0.7,
  pin: 3333,
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2022-05-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
  ],
  interestRate: 1,
  pin: 4444,
  currency: 'EUR',
  locale: 'de-DE',
};


const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let sorted = false;

const startLogTimer=()=>{
  time=10
  const tick=()=>{
    const minutes=String(Math.floor(time/60)).padStart(2,0);
    const second=String(Math.floor(time%60)).padStart(2,0);
    labelTimer.textContent=`${minutes}:${second}`
    console.log(time);
    
    if (time===0) {
      clearInterval(timer);
      labelWelcome.textContent= 'Log in to get started'
      containerApp.style.opacity=0
    } 
    time--  
  }

  tick()
  const timer=setInterval(tick,1000)
  return timer
}

const now = new Date();
const options = {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};
labelDate.textContent = new Intl.DateTimeFormat(
  navigator.language,
  options
).format(now);

// Helper function: date formater
const dateFomatter = dateStr => {
  const today = new Date();
  const transactionDate = new Date(dateStr);
  const dateDifference = Math.abs(today - transactionDate); // return in mili second
  const second =Math.floor(dateDifference / 1000)
  const minute =Math.floor(dateDifference / (1000 * 60))
  const hour =Math.floor(dateDifference / ( 1000 * 60 * 60))
  const dayPassed = Math.round(dateDifference / (1000 * 60 * 60 * 24)) // return in days

  console.log("The day passed:",dayPassed);
  if(second<10) return `Just Now`
  if(second<60) return `Few second ago`
  if(minute<60) return `${minute} minutes ago`
  if(hour<6) return `${hour} ago`
  if(hour<24) return `Today`
  if (dayPassed <= 7) return `${dayPassed} day ago`;
  
  
  const formateDate = new Intl.DateTimeFormat(navigator.language, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(dateStr);
  
  console.log("The formated date:",formateDate);
    return formateDate
};

const formateCurrency=(locale,cur,mov)=> new Intl.NumberFormat(locale,{style:"currency",currency:`${cur}`}).format(mov)
// const currencyFormatter=curr=>{
//   return new Intl.NumberFormat()
// }

const updateBalance = () => {
  clearInterval(timer)
  timer = startLogTimer()
  displayMovements(currentUser);
  calDisplayBalance(currentUser);
  calcDisplaySummary(currentUser);
};

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';

  acc.movements.forEach((movement, index) => {
    const date = new Date(acc.movementsDates[index]);
    const formateDate=dateFomatter(date)
  
  const formateMovement= formateCurrency(acc.locale,acc.currency ,movement)

    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type} </div>
          <div class="movements__date">${formateDate}</div>
          <div class="movements__value">${formateMovement}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Current balance calculation
const calDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, cur) => {
    return acc + cur;
  }, 0);

  labelBalance.textContent = `${formateCurrency(account.locale,account.currency ,account.balance)}`;
};

// user name creation
const createUserNames = accounts => {
  accounts.forEach(user => {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};
createUserNames(accounts);

// calDisplaySummary

const calcDisplaySummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  const interestAmount = acc.movements
    .filter(desposite => desposite > 0)
    .map(des => (des * `${acc.interestRate}`) / 100)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${formateCurrency(acc.locale,acc.currency,income)} `;
  labelSumOut.textContent = `${formateCurrency(acc.locale,acc.currency,out)} `;
  labelSumInterest.textContent = `${formateCurrency(acc.locale,acc.currency,interestAmount.toFixed(2))} `;
};

// login functionality
let currentUser, timer,time;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  // username and pin
  if (currentUser && currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    updateBalance();

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    
    if(timer) clearInterval(timer)
    timer = startLogTimer()
    // console.log(currentUser);
  } else {
    alert('Invalid pass');
  }
});

// Transfer functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferUser = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmount = Number(inputTransferAmount.value);
  // console.log(transferUser,transferAmount,currentUser.balance);

  if (
    currentUser.username !== transferUser.username &&
    transferUser?.username &&
    transferAmount > 0 &&
    transferAmount <= currentUser.balance
  ) {
    const date = new Date().toISOString();

    currentUser.movements.push(-transferAmount);
    currentUser.movementsDates.push(date);

    transferUser.movements.push(transferAmount);
    transferUser.movementsDates.push(date);

    console.log(currentUser);
    console.log(transferUser);
    updateBalance();
  } else {
    console.log('transfer failed');
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

// Request Loan Functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  let amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => amount > mov * 0.1)) {
    const date = new Date().toISOString();

    currentUser.movements.push(amount);
    currentUser.movementsDates.push(date);
    updateBalance(currentUser);
  }
});

// sorting functionality
btnSort.addEventListener('click', function () {
  sorted = !sorted;
  console.log('Sort 1:', sorted);

  console.log('Before:', currentUser.movements);

  const sortedMov = currentUser.movements.slice().sort((a, b) => a - b);

  if (sorted) {
    displayMovements(sortedMov);
  } else {
    displayMovements(currentUser);
  }
  console.log('sort 2:', sorted);
});

// Close account functionality
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    // find the index
    const index = accounts.findIndex(
      acc => acc.username === currentUser.username
    );
    // splice
    accounts.splice(index, 1);
  } else console.log('no');

  inputCloseUsername.value = inputClosePin.value = '';
});

