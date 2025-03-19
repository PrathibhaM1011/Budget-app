let userName = "";
let totalBudget = parseInt("");
let remainingBudget = 0;
let expenses = [];


// Register User
function registerUser() {
    userName = document.getElementById("username").value;
    budgetInput = document.getElementById("monthly-budget").value;
    
    if (userName === "") {
        alert("Please enter a valid name.");
        return;
    }

    fetch("https://wistful-dirt-anatosaurus.glitch.me/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            "name": userName, 
            "budget": budgetInput })
    });

    document.getElementById("register").style.display = "none";
    document.getElementById("budget-section").style.display = "block";
}

function setBudget() {  
    let budgetInput = document.getElementById("monthly-budget").value;  
    
    if (budgetInput === "" || budgetInput <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    totalBudget = budgetInput;
    remainingBudget = totalBudget;

    document.getElementById("budget-section").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("user-name").innerText = userName;
    document.getElementById("remaining-budget").innerText = remainingBudget;

    
}


function addExpense() {
    let category = document.getElementById("category").value;
    let amount = document.getElementById("amount").value;

    document.getElementById("amount").value="";

    if (amount === "" || amount <= 0) {
        alert("Enter a valid expense amount.");
        return;
    }

    

    fetch("https://wistful-dirt-anatosaurus.glitch.me/expenses", {
        "method": "POST",
        "headers": { 
            "Content-Type": "application/json" 
        },
        "body": JSON.stringify({
            "category" : category,
            "amount" : amount,
    })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Expense saved:", data);
        expenses.push(data);
        remainingBudget = remainingBudget - amount;
        document.getElementById("remaining-budget").innerText = remainingBudget;        
        renderExpenses();
    })
    .catch(error => console.error("Error saving expense:", error));
}

function renderExpenses() {
    let expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";
    expenses.forEach(exp => {
        let li = document.createElement("li");
        li.innerText = `${exp.category}: ₹ ${exp.amount}`;
        expenseList.appendChild(li);
    });
}

