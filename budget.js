// let userName = "";
// let totalBudget = parseInt("");
// let remainingBudget = 0;
// let expenses = [];
// let url ="https://wistful-dirt-anatosaurus.glitch.me/expenses";



// function registerUser() {
//     userName = document.getElementById("username").value;
//     budgetInput = document.getElementById("monthly-budget").value;
    
//     if (userName === "") {
//         alert("Please enter a valid name.");
//         return;
//     }


//     document.getElementById("register").style.display = "none";
//     document.getElementById("budget-section").style.display = "block";
// }

// function setBudget() {  
//     let budgetInput = document.getElementById("monthly-budget").value;  
    
//     if (budgetInput === "" || budgetInput <= 0) {
//         alert("Please enter a valid budget.");
//         return;
//     }

//     totalBudget = budgetInput;
//     remainingBudget = totalBudget;

//     document.getElementById("budget-section").style.display = "none";
//     document.getElementById("app").style.display = "block";
//     document.getElementById("user-name").innerText = userName;
//     document.getElementById("remaining-budget").innerText = remainingBudget;

    
// }


// function addExpense() {
//     let category = document.getElementById("category").value;
//     let amount = document.getElementById("amount").value;

//     document.getElementById("amount").value="";

//     if (amount === "" || amount <= 0) {
//         alert("Enter a valid expense amount.");
//         return;
//     }

    

//     fetch("https://wistful-dirt-anatosaurus.glitch.me/expenses", {
//         "method": "POST",
//         "headers": { 
//             "Content-Type": "application/json" 
//         },
//         "body": JSON.stringify({
//             "category" : category,
//             "amount" : amount,
//     })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log("Expense saved:", data);
//         expenses.push(data);
//         remainingBudget = remainingBudget - amount;
//         document.getElementById("remaining-budget").innerText = remainingBudget;        
//         renderExpenses(expenses);
//     })
//     .catch(error => console.error("Error saving expense:", error));
// }

// function renderExpenses(expensesSpent) {
//     let expenseList = document.getElementById("expense-list");
//     expenseList.innerHTML = "";
//     console.log(expenseList)
//     expensesSpent.forEach(exp => {
//         let li = document.createElement("li");
//         li.innerText = `${exp.category}: ₹ ${exp.amount}`;
//         expenseList.appendChild(li);
//     });
// }

function registerUser() {
    let username = document.getElementById("username").value;
    if (username === "" ) {
        alert("Please enter your name!");
        return;
    }

    fetch(`https://broken-like-flame.glitch.me/users?name=${username}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                
                let user = users[0];
                showApp(user);
            } else {
                // New user - Ask for budget
                document.getElementById("register").style.display = "none";
                document.getElementById("budget-section").style.display = "block";
                document.getElementById("budget-section").setAttribute("data-username", username);
            }
        });
}
function setBudget() {
    let budget = document.getElementById("monthly-budget").value;
    let username = document.getElementById("budget-section").getAttribute("data-username");

    if (!budget) return alert("Please enter a budget!");

    let newUser = { name: username, budget: Number(budget), expenses: [] };

    fetch("https://broken-like-flame.glitch.me/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => {
        showApp(data);
    });
}


function showApp(user) {
    document.getElementById("budget-section").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("user-name").innerText = user.name;
    document.getElementById("remaining-budget").innerText = user.budget - calculateTotalExpenses(user.expenses);
    
    displayExpenses(user.expenses);
}
function addExpense() {
    let category = document.getElementById("category").value;
    let amount = document.getElementById("amount").value;
    let username = document.getElementById("user-name").innerText;

    if (amount == "" ) {
        alert("Please enter an amount!");
        return;
    }

    fetch(`https://broken-like-flame.glitch.me/users?name=${username}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                let user = users[0];

                user.expenses.push({ category, amount: Number(amount) });

                fetch(`https://broken-like-flame.glitch.me/users?id=${user.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user)
                })
                .then(() => {
                    document.getElementById("amount").value = "";
                    
                });
            }
        });
        showApp(user); 
}



function displayExpenses(expenses) {
    let expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    expenses.forEach(exp => {
        let li = document.createElement("li");
        li.textContent = `${exp.category}: ₹${exp.amount}`;
        expenseList.appendChild(li);
    });
}


function calculateTotalExpenses(expenses) {
    return expenses.reduce((total, exp) => total + exp.amount, 0);
}
