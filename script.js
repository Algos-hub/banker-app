"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKER APP

// Data
const account1 = {
  owner: "Hedi Rivas",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"], // WHAT THE FUCK IS A KILOMETER RAAAAHHHHHHHHHHHHHHHHHHH 🇺🇸🇺🇸🇺🇸🇺🇸🇺🇸🦅🦅🦅🦅🦅
  ["EUR", "Euro"], // WHAT THE FUCK IS A MILE RAAAAHHHHHHHHHHHHHHHHHHH 🇪🇺🇪🇺🇪🇺🇪🇺🇪🇺🥐🥐🥐🥐🥐
  ["GBP", "Pound sterling"], // WHAT THE FUCK IS A MILE RAAAAHHHHHHHHHHHHHHHHHHH 🍵🍵🍵🍵🍵🇬🇧🇬🇧🇬🇧🇬🇧🇬🇧
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

function displayMovements(currAcc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? currAcc.movements.slice().sort((a, b) => a - b)
    : currAcc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
<div class="movements__type movements__type--${type}">
${i + 1} ${type}</div>
<div class="movements__date">5 days ago</div>
<div class="movements__value">${mov}</div>
</div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}
displayMovements(account1);

function createUsernames(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}

createUsernames(accounts);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});

const withdrawalsFor = [];
for (const mov of movements) {
  if (mov < 0) {
    withdrawalsFor.push(mov);
  }
}

const balance = movements.reduce(function (acc, cur, i) {
  return acc + cur;
}, 0);

console.log(balance);

let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}

console.log(balance2);

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log("max", max);

function calcDisplayBalance(currAcc) {
  currAcc.balance = currAcc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${currAcc.balance} EUR WHAT THE FUCK IS A MILE RAAAAHHHHHHHHHHHHHHHHHHH 🇪🇺🇪🇺🇪🇺🇪🇺🇪🇺🥐🥐🥐🥐🥐`;
}
calcDisplayBalance(account1);

let eurToUsd = 1.06;
const totalDepositUSD = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

function calcDisplaySummary(currAcc) {
  const income = currAcc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income}€`;

  const out = currAcc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  // What the fuck is this Jesus Chirst, ain't no fucking way this is the best way of coding this
  const interest = currAcc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * currAcc.interestRate) / 100)
    .filter((int) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}
calcDisplaySummary(account1);

const firstWithdrawal = movements.find((mov) => mov < 0);

const account = accounts.find((acc) => acc.owner === "Jessica Davis");

let currentAccount;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;

    updateUI(currentAccount);
  }
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

function updateUI(acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}

const index = movements.findIndex((mov) => mov === -130);

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (user === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

console.log(movements);
console.log(movements.includes(-130));
console.log(movements.some((mov) => mov === -130));
console.log(movements.every((mov) => mov > 0));

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const requestedAmount = Math.floor(inputLoanAmount.value);
  const loanAmount = currentAccount.movements.some(
    (mov) => mov >= requestedAmount * 0.1
  );
  console.log(requestedAmount);
  console.log(loanAmount);
  if (requestedAmount > 0 && loanAmount) {
    currentAccount.movements.push(requestedAmount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

const array = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(array.flat());

const arrayDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrayDeep.flat(2));

const overallBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

const overallBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

const owners = ["Hedi", "Zied", "Rami", "Amine"];
console.log(owners);
console.log(owners.sort());

console.log(movements);
console.log(movements.sort());

// Ascending
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
movements.sort((a, b) => b - a);
console.log(movements);

let sorted = false;
btnSort.addEventListener("click", function (e) {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
