// Variables and selectors
const formulary = document.querySelector('#agregar-gasto');
const expenseList = document.querySelector('#gastos ul')

// Events 
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);

    formulary.addEventListener('submit', addExpense);
};
// Classes
class Budget {
    constructor(budget) {
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    };

    newExpense(expense) {                                // is a new methods
        this.expenses = [...this.expenses, expense];
        // console.log(this.expenses);
        this.calculatedRemaining();
    };
    calculatedRemaining() {
        // in arrow function  const expended = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        const expended = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        console.log(expended);
        this.remaining = this.budget - expended;

        console.log(this.remaining);
    };
    eliminateExpense(id){
        this.expenses = this.expenses.filter( expense => expense.id !== id);
        console.log(this.expenses);
        this.calculatedRemaining();
    };

};

class UI {
    insertBudget(amount) {
        //Extracting the values
        const { budget, remaining } = amount;

        // add in the HTML 
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remaining;
    };

    printAlert(message, type) {
        // Create the div
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert');

        if (type === 'error') {
            divMessage.classList.add('alert-danger');
        } else {
            divMessage.classList.add('alert-success');
        };

        //Message of error
        divMessage.textContent = message;

        //Insert on the HTML 
        document.querySelector('.primario').insertBefore(divMessage, formulary);

        // Remove of the HTML
        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    };

    showExpenses(expenses) {
        cleanerHTML();
        // Interact over the expenses
        expenses.forEach(expense => {
            // Destructuring
            const { name, amount, id } = expense;

            // Create a LI 
            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
            // newExpense.setAttribute('data-id', id);
            newExpense.dataset.id = id

            // Add the HTML of te expense 
            newExpense.innerHTML = `${name}<span class ="badge badge-primary badge-pill">$${amount}</span>`;

            // Button for remove the expense
            const btnEraser = document.createElement('button');
            btnEraser.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnEraser.innerHTML = 'Eraser &times';
            newExpense.appendChild(btnEraser);
            btnEraser.onclick = ()=>{
                eliminateExpense(id);
            };

            // Add in the HTML 
            expenseList.appendChild(newExpense);
        });
    };

    checkBudget(budgetObj){
        const {budget, remaining} = budgetObj;
        const remainingDiv = document.querySelector('.restante');

        //Check twenty five percent
        if((budget/4) > remaining){
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add('alert-danger');
        }else if((budget/2) > remaining){
            remainingDiv.classList.remove('alert-success');
            remainingDiv.classList.add('alert-warning');
        }else{
            remainingDiv.classList.remove('alert-danger', 'alert-warning');
            remainingDiv.classList.add('alert-success');
        };

        // If the total is zero or less
        if(remaining<0){
            ui.printAlert('The budget is already spent','error');
            formulary.querySelector('button[type="submit"]').disabled = true;
        }
    };

    updateRemaining(remaining) {
        document.querySelector('#restante').textContent = remaining;
    };
};

//Instantiate
const ui = new UI();
let budget;

// Functions 
function askBudget() {
    const budgetUser = prompt('What is your budget?');

    //console.log(Number (parseFloat(budgetUser)));

    if (budgetUser === '' || budgetUser === null || isNaN(budgetUser) || budgetUser <= 0) {
        window.location.reload();
    };

    // Valid Budget
    budget = new Budget(budgetUser);
    console.log(budget);

    ui.insertBudget(budget);
};

// Add expense
function addExpense(e) {
    e.preventDefault();

    // Read the data of the formulary
    const name = document.querySelector('#gasto').value;
    const amount = Number(document.querySelector('#cantidad').value);

    // Validate
    if (name === '' || amount === '') {
        ui.printAlert('Both filds are required');
        return;
    } else if (amount <= 0 || isNaN(amount)) {
        ui.printAlert('Amount no valid', 'error');
        return;
    };
    console.log('Add expense');

    // Generating 
    const expense = { name, amount, id: Date.now() };

    // Add a new expense
    budget.newExpense(expense);

    // Messeges when adding a new expense
    ui.printAlert('Expense added correctly');

    // Print the expenses 
    const { expenses, remaining} = budget;      //------------ extract before of the function Where is used
    ui.showExpenses(expenses);

    // Actualiza el presupuesto restante
    
    ui.updateRemaining(remaining);

    ui.checkBudget(budget);

    // Reset of the formulary
    formulary.reset();
};

// Eliminate the expenses of list-group
function cleanerHTML() {
    // Slow form
    // containerCart.innerHTML = '';
    while (expenseList.firstChild) {
        console.log(expenseList.firstChild);
        expenseList.removeChild(expenseList.firstChild);
    };
};

function eliminateExpense(id){
    // They Eliminated of the object
    budget.eliminateExpense(id);

    // Eliminated the expenses of the HTML
    const {expenses, remaining} = budget;
    ui.showExpenses(expenses);
    console.log(expenses);

    ui.updateRemaining(remaining);

    ui.checkBudget(budget);

};
