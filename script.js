'use strict';

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
let sorted=false

console.log("Global Sort:",sorted);


const updateBalance=()=>{

      displayMovements(currentUser.movements)
      calDisplayBalance(currentUser)
      calcDisplaySummary(currentUser)
}

const displayMovements= function(movements,sorted=false){
 
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
   account.balance = account.movements.reduce((acc,cur)=>{
    return acc+cur
  },0)

  labelBalance.textContent=`${account.balance} Euro`

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

    // username and pin 
    if( currentUser && currentUser?.pin===Number(inputLoginPin.value)){
  
      labelWelcome.textContent=`Welcome back, ${currentUser.owner.split(" ")[0]}`
      containerApp.style.opacity=1
      
     // displaying data after successful login 
      // displayMovements(currentUser)
      // calDisplayBalance(currentUser)
      // calcDisplaySummary(currentUser)
      updateBalance()


      inputLoginUsername.value=inputLoginPin.value=""
      inputLoginPin.blur()
      // console.log(currentUser);
    }else{
      alert("Invalid pass")
    }
  
    
    
})



// Transfer functionality 
/**
 * check if (input: transter to user) is valid or not 
 * create a "balance" element inside the accounts 
 * check if (input: amount ) balance is greater >0 ,if not aleart mesg : "insufficient balance"   
 * Current User :if (input: amount ) is transfer , substract is from total balance and show it in the table 
 * Receiver : added the transfer money in my balance
 * */ 

// inputTransferAmount inputTransferTo

btnTransfer.addEventListener('click',function(e){
  e.preventDefault()
  const transferUser=accounts.find((acc)=>acc.username === inputTransferTo.value )
  const transferAmount=Number(inputTransferAmount.value)
  // console.log(transferUser,transferAmount,currentUser.balance);
  
  if( currentUser.username!==transferUser.username && transferUser?.username && transferAmount>0  && transferAmount<=currentUser.balance )
  {
    currentUser.movements.push(-transferAmount)
    transferUser.movements.push(transferAmount)
    console.log(currentUser);
    console.log(transferUser);
    updateBalance()

    
    
  }else{
    console.log("transfer failed");  
  }
  
  inputTransferAmount.value=inputTransferTo.value=''
  
})

// Request Loan Functionality
// inputLoanAmount
btnLoan.addEventListener('click',function(e){
  e.preventDefault()
  
  let amount=Number(inputLoanAmount.value)

  if(amount>0 && currentUser.movements.some((mov)=> amount>mov*0.1))
  {
    currentUser.movements.push(amount)
    updateBalance(currentUser)
  }
  
})

// sorting functionality

/**
 * global variable toggle hbe
 * 
*/
btnSort.addEventListener('click',function(){
  
  sorted=!sorted
  console.log("Sort 1:",sorted);
  
  console.log("Before:",currentUser.movements);
  
  const sortedMov=currentUser.movements.slice().sort((a,b)=>a-b)
  
  if(sorted){
    displayMovements(sortedMov)
  }
  else{
    displayMovements(currentUser.movements)
  }
  console.log("sort 2:",sorted);
  
}) 

// Close account functionality
btnClose.addEventListener('click',function(e){
  e.preventDefault()

  if(currentUser.username === inputCloseUsername.value && currentUser.pin===Number(inputClosePin.value))  
  {
    // find the index
      const index=accounts.findIndex(acc=> acc.username===currentUser.username)
    // splice
    accounts.splice(index,1)
  }else console.log("no");

  inputCloseUsername.value=inputClosePin.value=''
})