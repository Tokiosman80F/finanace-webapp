'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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


const displayMovements= function(movements){
 
  containerMovements.innerHTML=""
  movements.forEach((movement,index)=>{
  
  const type=movement>0 ? 'deposit' : 'withdrawal'
  const html=`<div class="movements__row">
          <div class="movements__type movements__type--${type}">${index+1} ${type} </div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${movement}</div>
        </div>`
 
  containerMovements.insertAdjacentHTML('afterbegin',html)
})
}


// Current balance calculation
const calDisplayBalance=(account)=>{
  const balance = account.reduce((acc,cur)=>{
    return acc+cur
  },0)

  labelBalance.textContent=`${balance} Euro`

}

// user name creation
const createUserNames=(accounts)=>{

  accounts.forEach((user)=>{
    user.username=user.owner.toLowerCase().split(' ').map((user)=>user[0]).join("")
  })

}
createUserNames(accounts)

// calDisplaySummary 

const calcDisplaySummary=(acc)=>{
  const income=acc.movements.filter((mov)=>mov>0).reduce((acc,cur)=>acc+cur,0)
  const out=acc.movements.filter((mov)=>mov<0).reduce((acc,cur)=>acc+cur,0)
  const interestAmount=acc.movements.filter(desposite=> desposite>0).map(des=>des*`${acc.interestRate}`/100).reduce((acc,cur)=>acc+cur,0)

  labelSumIn.textContent=`${income} €`
  labelSumOut.textContent=`${Math.abs(out)} €`
  labelSumInterest.textContent=`${interestAmount}`

}


// login functionality
let currentUser;
btnLogin.addEventListener('click',function(e){
  e.preventDefault()
    currentUser=accounts.find((acc)=> acc.username===inputLoginUsername.value)
    console.log(currentUser);

    // username and pin 
    if( currentUser?.pin===Number(inputLoginPin.value)){
      console.log("logined");
      labelWelcome.textContent=`Welcome back, ${currentUser.owner.split(" ")[0]}`
      containerApp.style.opacity=100
      inputLoginUsername.value=inputLoginPin.value=""
      inputLoginPin.blur()
    }else{
      alert("Invalid pass")
    }
  
    // movement 
    displayMovements(currentUser.movements)
    // balance
    calDisplayBalance(currentUser.movements)
    // summery
    calcDisplaySummary(currentUser)
    
})

// Close account functionality
// inputClosePin inputCloseUsername
btnClose.addEventListener('click',function(e){
  e.preventDefault()

  if(currentUser.username === inputCloseUsername.value && currentUser.pin===Number(inputClosePin.value))  
  {
    // find the index
      const index=accounts.findIndex(acc=> acc.username===currentUser.username)
      console.log(index);
    // splice
    accounts.splice(index,1)
  }else console.log("no");

  inputCloseUsername.value=inputClosePin.value=''
})