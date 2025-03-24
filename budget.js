function registerUser() {
    let username = document.getElementById("username").value;
    if (username === "") {
        alert("Please enter your name!");
        return;
    }

    fetch(`https://broken-like-flame.glitch.me/users?name=${username}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                showApp(users[0]); // Existing user
            } else {
                // New user - Ask for budget
                document.getElementById("register").style.display = "none";
                document.getElementById("budget-section").style.display = "block";
                document.getElementById("budget-section").setAttribute("data-username", username);
            }
        })
        .catch(error => console.error("Error fetching user:", error));
}

function setBudget() {
    let budget = document.getElementById("monthly-budget").value;
    let username = document.getElementById("budget-section").getAttribute("data-username");

    if (!budget || budget <= 0) {
        alert("Please enter a valid budget!");
        return;
    }

    let newUser = { name: username, budget: Number(budget), expenses: [] };

    fetch("https://broken-like-flame.glitch.me/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => showApp(data))
    .catch(error => console.error("Error saving budget:", error));
}

function showApp(user) {
    document.getElementById("budget-section").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("user-name").innerText = user.name;
    let remainingBudget = user.budget - calculateTotalExpenses(user.expenses);
    document.getElementById("remaining-budget").innerText = remainingBudget;

    displayExpenses(user.expenses);
}

function addExpense() {
    let category = document.getElementById("category").value;
    let amount = document.getElementById("amount").value;
    let username = document.getElementById("user-name").innerText;

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    fetch(`https://broken-like-flame.glitch.me/users?name=${username}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                let user = users[0];
                let expense = { category, amount: Number(amount) };

                user.expenses.push(expense);

                return fetch(`https://broken-like-flame.glitch.me/users/${user.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user)
                })
                .then(() => {
                    document.getElementById("amount").value = "";
                    showApp(user); // Update UI after adding expense
                });
            }
        })
        .catch(error => console.error("Error adding expense:", error));
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
