// Expense Tracker JavaScript with AI Features

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expensesContainer = document.getElementById('expenses-container');
const suggestionsContainer = document.getElementById('suggestions-container');
const sessionInfo = document.getElementById('session-info');
const budgetAmountInput = document.getElementById('budget-amount');
const setBudgetBtn = document.getElementById('set-budget-btn');
const resetBudgetBtn = document.getElementById('reset-budget-btn');
const incomeForm = document.getElementById('income-form');
const incomeContainer = document.getElementById('income-container');
const incomeAmountInput = document.getElementById('income-amount');
const incomeSourceInput = document.getElementById('income-source');
const incomeDateInput = document.getElementById('income-date');
const netSavingsValue = document.getElementById('net-savings-value');
const goalForm = document.getElementById('goal-form');
const goalsContainer = document.getElementById('goals-container');
const exportCsvBtn = document.getElementById('export-csv');
const exportExcelBtn = document.getElementById('export-excel');
const splitExpenseCheckbox = document.getElementById('split-expense');
const splitExpenseGroup = document.getElementById('split-expense-group');
const categorySelect = document.getElementById('category');

// AI Analysis Button
const aiAnalyzeBtn = document.getElementById('ai-analyze-btn');

// Chart instances
let categoryChart = null;
let trendChart = null;
let savingsChart = null;

// Data arrays
let expenses = [];
let income = [];
let savingsGoals = [];
let customCategories = [];
let smartInsights = []; // New array to store smart insights

// Budget data
let monthlyBudget = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set session info
    const now = new Date();
    sessionInfo.textContent = now.toLocaleString();
    
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    incomeDateInput.valueAsDate = new Date();
    
    // Load data from localStorage
    loadData();
    
    // Update displays
    updateNetSavingsDisplay();
    renderIncome();
    renderGoals();
    
    // Render expenses
    renderExpenses();
    
    // Render charts
    renderCharts();
    
    // Keep suggestions container empty initially
    suggestionsContainer.innerHTML = '';
    
    // Always update budget summary on initialization
    updateBudgetSummary();
    
    // Event listeners
    expenseForm.addEventListener('submit', handleExpenseFormSubmit);
    incomeForm.addEventListener('submit', handleIncomeFormSubmit);
    goalForm.addEventListener('submit', handleGoalFormSubmit);
    setBudgetBtn.addEventListener('click', setBudget);
    if (resetBudgetBtn) {
        resetBudgetBtn.addEventListener('click', resetBudget);
    }
    exportCsvBtn.addEventListener('click', exportToExcel);
    exportExcelBtn.addEventListener('click', exportToTextFile);
    splitExpenseCheckbox.addEventListener('change', toggleSplitExpense);
    categorySelect.addEventListener('change', handleCategoryChange);
    
    // Add event listener for AI analysis button
    if (aiAnalyzeBtn) {
        aiAnalyzeBtn.addEventListener('click', analyzeExpensesWithAI);
    }
    
    // Check if it's end of month and show summary if needed
    checkEndOfMonth();
    
    // Check for recurring expenses
    checkRecurringExpenses();
});

// Analyze expenses with AI
async function analyzeExpensesWithAI() {
    // Show loading message
    suggestionsContainer.innerHTML = '<p>Analyzing your expenses with AI... This may take a moment.</p>';
    
    try {
        // Prepare expense data for AI analysis
        const expenseData = prepareExpenseDataForAI();
        
        // Get AI insights
        const aiInsights = await getAIExpenseInsights(expenseData);
        
        // Save insights for export
        const insightEntry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            type: 'AI Analysis',
            content: aiInsights
        };
        smartInsights.push(insightEntry);
        saveData();
        
        // Display AI insights
        displayAIInsights(aiInsights);
    } catch (error) {
        console.error('Error analyzing expenses with AI:', error);
        suggestionsContainer.innerHTML = `<p>Error analyzing expenses: ${error.message}</p>`;
        showNotification('Failed to analyze expenses with AI. Please try again.', 'error');
    }
}

// Prepare expense data for AI analysis
function prepareExpenseDataForAI() {
    // Get recent expenses (last 50 or all if less)
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 50);
    
    // Calculate summary statistics
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avgExpense = totalExpenses / expenses.length || 0;
    
    // Group by category
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    
    // Find highest spending category
    let highestCategory = '';
    let highestAmount = 0;
    for (const category in categoryTotals) {
        if (categoryTotals[category] > highestAmount) {
            highestAmount = categoryTotals[category];
            highestCategory = category;
        }
    }
    
    return {
        totalExpenses,
        avgExpense,
        expenseCount: expenses.length,
        recentExpenses,
        categoryTotals,
        highestCategory,
        highestAmount
    };
}

// Get AI insights for expenses
async function getAIExpenseInsights(expenseData) {
    // For now, we'll simulate AI insights since we don't have an API key
    // In a real implementation, this would call an AI service
    
    // Create a simulated AI response
    const insights = [
        "Spending Analysis:",
        `Total Expenses: ₹${expenseData.totalExpenses.toFixed(2)}`,
        `Average Expense: ₹${expenseData.avgExpense.toFixed(2)}`,
        `Number of Transactions: ${expenseData.expenseCount}`,
        `Highest Spending Category: ${expenseData.highestCategory} (₹${expenseData.highestAmount.toFixed(2)})`,
        "",
        "General Financial Hygiene:",
        "1. Review your expense categories monthly and adjust budgets accordingly.",
        `2. Use cash or prepaid cards for discretionary spending—it limits impulse buys. (Consider setting aside ₹${(expenseData.avgExpense * 0.2).toFixed(2)} daily for discretionary spending)`,
        "3. Consolidate payments to track them easily and avoid late fees.",
        "4. Always verify if an expense is need-based or mood-based before confirming it.",
        "",
        "Savings & Investments:",
        "5. Automate a small recurring transfer to a savings or investment account.",
        "6. Set short-term financial goals (like saving for a gadget or trip) to make saving less painful.",
        "7. Explore low-risk investment options once your emergency fund is steady.",
        "",
        "AI & Data Insights:",
        "8. Let the system flag outlier transactions (like sudden big purchases) for confirmation.",
        "9. Use past months' data to forecast next month's balance and spending pressure points.",
        "10. Identify the top three expense categories growing fastest and suggest action.",
        "",
        "Smart Lifestyle Tweaks:",
        "11. Replace frequent small orders (like daily takeout) with planned bulk spending—it's cheaper.",
        "12. Monitor subscriptions; cancel or downgrade unused ones.",
        "13. Compare your spending trends with similar users (anonymously, obviously) to get perspective.",
        `14. Schedule notifications when your spending crosses 80% of the set limit. ${monthlyBudget ? `(Current threshold: ₹${(monthlyBudget * 0.8).toFixed(2)})` : '(Please set a budget to enable this feature)'}`,
        "",
        `Budget Status: ${monthlyBudget ? `₹${monthlyBudget.toFixed(2)} allocated, ₹${(monthlyBudget - expenseData.totalExpenses).toFixed(2)} remaining` : 'No budget set - consider setting one to track your spending'}`
    ];
    
    return insights.join('\n');
}

// Display AI insights
function displayAIInsights(insights) {
    suggestionsContainer.innerHTML = `
        <div class="suggestion-item info">
            <h3><i class="fas fa-robot"></i> AI Expense Analysis</h3>
            <div class="ai-advice-content">${insights.replace(/\n/g, '<br>')}</div>
        </div>
    `;
}

// Toggle split expense field
function toggleSplitExpense() {
    splitExpenseGroup.style.display = splitExpenseCheckbox.checked ? 'block' : 'none';
}

// Show add category prompt
function showAddCategory() {
    const newCategory = prompt('Enter new category name:');
    if (newCategory && newCategory.trim() !== '') {
        const categoryName = newCategory.trim();
        if (!customCategories.includes(categoryName) && !getDefaultCategories().includes(categoryName)) {
            customCategories.push(categoryName);
            saveData();
            updateCategorySelect();
            // Select the newly added category
            categorySelect.value = categoryName;
            showNotification(`Category "${categoryName}" added successfully!`, 'success');
        } else {
            // Reset to default selection
            categorySelect.value = '';
            showNotification('Category already exists!', 'warning');
        }
    } else if (newCategory !== null) {
        // Reset to default selection if user cancelled but didn't select a category
        categorySelect.value = '';
    }
}

// Handle category selection change
function handleCategoryChange(e) {
    if (e.target.value === 'add-new-category') {
        // Show add category prompt
        showAddCategory();
    }
}

// Update category select dropdown
function updateCategorySelect() {
    // Clear existing options except the first one
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }
    
    // Add default categories
    getDefaultCategories().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Add custom categories
    customCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Add "Add New Category" option
    const addNewOption = document.createElement('option');
    addNewOption.value = 'add-new-category';
    addNewOption.textContent = '+ Add New Category';
    categorySelect.appendChild(addNewOption);
}

// Get default categories
function getDefaultCategories() {
    return ['Food', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping'];
}

// Handle expense form submission
function handleExpenseFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const isRecurring = document.getElementById('recurring').checked;
    const splitWith = splitExpenseCheckbox.checked ? document.getElementById('split-with').value : '';
    
    if (!category) {
        showNotification('Please select a category', 'warning');
        return;
    }
    
    // Check if user selected to add a new category
    if (category === 'add-new-category') {
        showNotification('Please select a valid category or add a new one', 'warning');
        return;
    }
    
    // Handle split expense
    if (splitExpenseCheckbox.checked && splitWith) {
        const names = splitWith.split(',').map(name => name.trim()).filter(name => name);
        if (names.length > 0) {
            const splitAmount = amount / (names.length + 1); // +1 for the user
            
            // Add user's share
            const userExpense = {
                id: Date.now(),
                amount: splitAmount,
                category,
                description: `${description} (Your share)`,
                date,
                isRecurring,
                isSplit: true
            };
            
            expenses.push(userExpense);
            
            // Add shares for others (as separate entries)
            names.forEach(name => {
                const otherExpense = {
                    id: Date.now() + Math.random(),
                    amount: splitAmount,
                    category,
                    description: `${description} (${name}'s share)`,
                    date,
                    isRecurring,
                    isSplit: true
                };
                expenses.push(otherExpense);
            });
        }
    } else {
        // Create expense object
        const expense = {
            id: Date.now(),
            amount,
            category,
            description,
            date,
            isRecurring
        };
        
        // Add to expenses array
        expenses.push(expense);
    }
    
    // Save to localStorage
    saveData();
    
    // Update displays
    updateNetSavingsDisplay();
    
    // Render expenses
    renderExpenses();
    
    // Render charts
    renderCharts();
    
    // Keep suggestions container empty
    suggestionsContainer.innerHTML = '';
    
    // Update budget summary
    if (monthlyBudget > 0) {
        updateBudgetSummary();
    }
    
    // Reset form
    expenseForm.reset();
    document.getElementById('date').valueAsDate = new Date();
    splitExpenseGroup.style.display = 'none';
    
    // Show success message
    showNotification('Expense added successfully!', 'success');
}

// Handle income form submission
function handleIncomeFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const amount = parseFloat(incomeAmountInput.value);
    const source = incomeSourceInput.value;
    const date = incomeDateInput.value;
    
    // Create income object
    const incomeEntry = {
        id: Date.now(),
        amount,
        source,
        date
    };
    
    // Add to income array
    income.push(incomeEntry);
    
    // Save to localStorage
    saveData();
    
    // Update displays
    updateNetSavingsDisplay();
    renderIncome();
    renderCharts();
    
    // Keep suggestions container empty
    suggestionsContainer.innerHTML = '';
    
    // Reset form
    incomeForm.reset();
    incomeDateInput.valueAsDate = new Date();
    
    // Show success message
    showNotification('Income added successfully!', 'success');
}

// Handle goal form submission
function handleGoalFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('goal-name').value;
    const targetAmount = parseFloat(document.getElementById('goal-amount').value);
    const currentSavings = parseFloat(document.getElementById('goal-current').value) || 0;
    
    // Create goal object
    const goal = {
        id: Date.now(),
        name,
        targetAmount,
        currentSavings
    };
    
    // Add to goals array
    savingsGoals.push(goal);
    
    // Save to localStorage
    saveData();
    
    // Render goals
    renderGoals();
    renderCharts();
    
    // Reset form
    goalForm.reset();
    
    // Show success message
    showNotification('Savings goal added successfully!', 'success');
}

// Set monthly budget
function setBudget() {
    const budget = parseFloat(budgetAmountInput.value);
    if (isNaN(budget) || budget <= 0) {
        showNotification('Please enter a valid budget amount', 'warning');
        return;
    }
    
    monthlyBudget = budget;
    saveData();
    
    // Keep suggestions container empty
    suggestionsContainer.innerHTML = '';
    
    // Clear input
    budgetAmountInput.value = '';
    
    // Update budget summary display
    updateBudgetSummary();
    
    showNotification('Monthly budget set successfully!', 'success');
}

// Reset monthly budget
function resetBudget() {
    if (monthlyBudget === 0) {
        showNotification('No budget is currently set', 'info');
        return;
    }
    
    // Confirm with user before resetting
    if (confirm('Are you sure you want to reset your monthly budget? This will remove your current budget amount.')) {
        monthlyBudget = 0;
        saveData();
        
        // Keep suggestions container empty
        suggestionsContainer.innerHTML = '';
        
        // Update budget summary display
        updateBudgetSummary();
        
        showNotification('Monthly budget reset successfully!', 'success');
    }
}

// Update budget summary display
function updateBudgetSummary() {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = monthlyBudget > 0 ? monthlyBudget - totalExpenses : 0;
    
    // Get the budget summary element
    const budgetSummary = document.getElementById('budget-summary');
    const currentBudgetElement = document.getElementById('current-budget');
    const totalSpentElement = document.getElementById('total-spent');
    const remainingElement = document.getElementById('remaining-amount');
    const utilizationPercentElement = document.getElementById('utilization-percent');
    const progressFillElement = document.getElementById('progress-fill');
    
    // Update the values
    currentBudgetElement.textContent = `₹${monthlyBudget.toFixed(2)}`;
    totalSpentElement.textContent = `₹${totalExpenses.toFixed(2)}`;
    remainingElement.textContent = `₹${remaining.toFixed(2)}`;
    
    // Set color based on remaining amount
    remainingElement.style.color = remaining >= 0 ? 'var(--success)' : 'var(--danger)';
    
    // Update budget utilization percentage and progress bar
    if (monthlyBudget > 0) {
        const utilizationPercent = Math.min(100, (totalExpenses / monthlyBudget) * 100);
        utilizationPercentElement.textContent = `${utilizationPercent.toFixed(1)}%`;
        progressFillElement.style.width = `${utilizationPercent}%`;
        
        // Change progress bar color based on utilization
        if (utilizationPercent > 90) {
            progressFillElement.style.background = 'linear-gradient(90deg, #ff4d4d, #ff9999)';
        } else if (utilizationPercent > 75) {
            progressFillElement.style.background = 'linear-gradient(90deg, #ffd166, #ffe166)';
        } else {
            progressFillElement.style.background = 'linear-gradient(90deg, var(--gold), var(--neon-green))';
        }
    } else {
        utilizationPercentElement.textContent = '0%';
        progressFillElement.style.width = '0%';
    }
    
    // Show the summary if a budget is set
    if (monthlyBudget > 0) {
        budgetSummary.style.display = 'block';
    } else {
        budgetSummary.style.display = 'none';
    }
}

// Update net savings display
function updateNetSavingsDisplay() {
    const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    
    netSavingsValue.textContent = `₹${netSavings.toFixed(2)}`;
    netSavingsValue.style.color = netSavings >= 0 ? 'var(--success)' : 'var(--danger)';
    
    // Update budget summary as well
    if (monthlyBudget > 0) {
        updateBudgetSummary();
    }
}

// Check if it's end of month and show summary
function checkEndOfMonth() {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    // Check if it's the last 3 days of the month
    if (now.getDate() >= lastDay - 2) {
        showEndOfMonthSummary();
    }
}

// Show end of month summary
function showEndOfMonthSummary() {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
    });
    
    if (currentMonthExpenses.length === 0) return;
    
    const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Category breakdown
    const categoryBreakdown = {};
    currentMonthExpenses.forEach(expense => {
        if (categoryBreakdown[expense.category]) {
            categoryBreakdown[expense.category] += expense.amount;
        } else {
            categoryBreakdown[expense.category] = expense.amount;
        }
    });
    
    // Create summary message
    let summaryMessage = `End of Month Summary for ${now.toLocaleString('default', { month: 'long' })}:\n\n`;
    summaryMessage += `Total Spent: ₹${totalSpent.toFixed(2)}\n\n`;
    summaryMessage += `Category Breakdown:\n`;
    
    for (const category in categoryBreakdown) {
        const amount = categoryBreakdown[category];
        const percentage = ((amount / totalSpent) * 100).toFixed(1);
        summaryMessage += `- ${category}: ₹${amount.toFixed(2)} (${percentage}%)\n`;
    }
    
    // Save summary as insight for export
    const insightEntry = {
        id: Date.now(),
        date: now.toISOString().split('T')[0],
        type: 'Monthly Summary',
        content: summaryMessage
    };
    smartInsights.push(insightEntry);
    saveData();
    
    // Show summary in suggestions only if it's the end of month and user requested analysis
    // Otherwise, keep it empty as per user preference
}

// Check for recurring expenses
function checkRecurringExpenses() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Check if we already added recurring expenses today
    const addedToday = localStorage.getItem('recurringExpensesAdded') === todayString;
    if (addedToday) return;
    
    // Find recurring expenses from previous months
    const recurringExpenses = expenses.filter(expense => expense.isRecurring);
    
    // Add them for this month if not already added
    recurringExpenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() < today.getMonth() || expenseDate.getFullYear() < today.getFullYear()) {
            // Create new expense for this month
            const newExpense = {
                id: Date.now() + Math.random(),
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                date: todayString,
                isRecurring: true
            };
            
            expenses.push(newExpense);
        }
    });
    
    if (recurringExpenses.length > 0) {
        saveData();
        updateNetSavingsDisplay();
        renderExpenses();
        renderCharts();
        
        // Keep suggestions container empty
        suggestionsContainer.innerHTML = '';
        
        showNotification(`${recurringExpenses.length} recurring expenses added for this month`, 'info');
    }
    
    // Mark that we've added recurring expenses today
    localStorage.setItem('recurringExpensesAdded', todayString);
}

// AI-like categorization
function aiCategorize(description) {
    const lowerDesc = description.toLowerCase();
    
    // Food keywords
    const foodKeywords = ['pizza', 'burger', 'food', 'restaurant', 'cafe', 'coffee', 'sandwich', 'meal', 'lunch', 'dinner', 'breakfast', 'dinner', 'lunch', 'snack'];
    
    // Travel keywords
    const travelKeywords = ['uber', 'taxi', 'flight', 'airline', 'hotel', 'bus', 'train', 'gas', 'fuel', 'parking', 'ola', 'ola money', 'ola foods'];
    
    // Entertainment keywords
    const entertainmentKeywords = ['movie', 'cinema', 'concert', 'ticket', 'netflix', 'spotify', 'game', 'subscription', 'play', 'youtube', 'prime'];
    
    // Utilities keywords
    const utilitiesKeywords = ['electricity', 'water', 'internet', 'phone', 'bill', 'rent', 'mortgage', 'wifi', 'data', 'broadband'];
    
    // Healthcare keywords
    const healthcareKeywords = ['doctor', 'hospital', 'medicine', 'pharmacy', 'dentist', 'insurance', 'medical', 'clinic', 'treatment'];
    
    // Shopping keywords
    const shoppingKeywords = ['clothes', 'shoes', 'shopping', 'mall', 'store', 'purchase', 'buy', 'amazon', 'flipkart', 'myntra'];
    
    // Check for matches
    if (foodKeywords.some(keyword => lowerDesc.includes(keyword))) {
        return 'Food';
    } else if (travelKeywords.some(keyword => lowerDesc.includes(keyword))) {
        return 'Travel';
    } else if (entertainmentKeywords.some(keyword => lowerDesc.includes(keyword))) {
        return 'Entertainment';
    } else if (utilitiesKeywords.some(keyword => lowerDesc.includes(keyword))) {
        return 'Utilities';
    } else if (healthcareKeywords.some(keyword => lowerDesc.includes(keyword))) {
        return 'Healthcare';
    } else if (shoppingKeywords.some(keyword => lowerDesc.includes(keyword))) {
        return 'Shopping';
    } else {
        return 'Other';
    }
}

// Predict end-of-month spending
function predictEndOfMonthSpending() {
    if (expenses.length === 0) return 0;
    
    // Get current date
    const now = new Date();
    const currentDay = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - currentDay;
    
    // Calculate daily average spending so far this month
    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
    });
    
    if (currentMonthExpenses.length === 0) return 0;
    
    const totalSpentThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const dailyAverage = totalSpentThisMonth / currentDay;
    
    // Predict remaining spending
    const predictedRemaining = dailyAverage * remainingDays;
    
    // Total predicted spending for the month
    return totalSpentThisMonth + predictedRemaining;
}

// Detect anomalies (unusually high expenses)
function detectAnomalies() {
    if (expenses.length < 5) return []; // Need at least 5 expenses for meaningful analysis
    
    const anomalies = [];
    
    // Group expenses by category
    const categoryExpenses = {};
    expenses.forEach(expense => {
        if (!categoryExpenses[expense.category]) {
            categoryExpenses[expense.category] = [];
        }
        categoryExpenses[expense.category].push(expense.amount);
    });
    
    // Calculate average and standard deviation for each category
    const categoryStats = {};
    for (const category in categoryExpenses) {
        const amounts = categoryExpenses[category];
        const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const variance = amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length;
        const stdDev = Math.sqrt(variance);
        
        categoryStats[category] = { avg, stdDev };
    }
    
    // Check each expense for anomalies
    expenses.forEach(expense => {
        const stats = categoryStats[expense.category];
        if (stats && expense.amount > stats.avg + 2 * stats.stdDev) {
            anomalies.push({
                expense,
                message: `Unusually high ${expense.category} expense: ₹${expense.amount.toFixed(2)} 
                         (Average: ₹${stats.avg.toFixed(2)})`
            });
        }
    });
    
    return anomalies;
}

// Generate weekly natural-language insights
function generateWeeklyInsights() {
    if (expenses.length === 0) return [];
    
    const insights = [];
    
    // Get current week expenses
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const currentWeekExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= oneWeekAgo && expenseDate <= now;
    });
    
    if (currentWeekExpenses.length === 0) return insights;
    
    // Calculate category distribution for current week
    const currentWeekCategorySpending = {};
    currentWeekExpenses.forEach(expense => {
        if (currentWeekCategorySpending[expense.category]) {
            currentWeekCategorySpending[expense.category] += expense.amount;
        } else {
            currentWeekCategorySpending[expense.category] = expense.amount;
        }
    });
    
    // Get previous week expenses for comparison
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);
    
    const previousWeekExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= twoWeeksAgo && expenseDate < oneWeekAgo;
    });
    
    // Calculate category distribution for previous week
    const previousWeekCategorySpending = {};
    previousWeekExpenses.forEach(expense => {
        if (previousWeekCategorySpending[expense.category]) {
            previousWeekCategorySpending[expense.category] += expense.amount;
        } else {
            previousWeekCategorySpending[expense.category] = expense.amount;
        }
    });
    
    // Generate insights
    const totalCurrentWeek = Object.values(currentWeekCategorySpending).reduce((a, b) => a + b, 0);
    
    // Find highest spending category this week
    const highestCategory = Object.keys(currentWeekCategorySpending).reduce((a, b) => 
        currentWeekCategorySpending[a] > currentWeekCategorySpending[b] ? a : b);
    
    const percentage = ((currentWeekCategorySpending[highestCategory] / totalCurrentWeek) * 100).toFixed(1);
    
    const insightText = `This week, ${percentage}% of your spending went to ${highestCategory}.`;
    
    // Save insight for export
    const insightEntry = {
        id: Date.now(),
        date: now.toISOString().split('T')[0],
        type: 'Weekly Insight',
        content: insightText
    };
    smartInsights.push(insightEntry);
    
    insights.push(insightText);
    
    // Compare with previous week if data exists
    if (Object.keys(previousWeekCategorySpending).length > 0) {
        const totalPreviousWeek = Object.values(previousWeekCategorySpending).reduce((a, b) => a + b, 0);
        
        if (previousWeekCategorySpending[highestCategory]) {
            const previousPercentage = (previousWeekCategorySpending[highestCategory] / totalPreviousWeek) * 100;
            const difference = percentage - previousPercentage;
            
            if (Math.abs(difference) > 5) { // More than 5% difference
                const direction = difference > 0 ? 'higher' : 'lower';
                const comparisonText = `That's ${(Math.abs(difference)).toFixed(1)}% ${direction} than last week.`;
                
                // Save comparison insight for export
                const comparisonEntry = {
                    id: Date.now() + 1,
                    date: now.toISOString().split('T')[0],
                    type: 'Weekly Insight',
                    content: comparisonText
                };
                smartInsights.push(comparisonEntry);
                
                insights.push(comparisonText);
            }
        }
    }
    
    return insights;
}

// Generate savings insights
function generateSavingsInsights() {
    if (income.length === 0 && expenses.length === 0) return [];
    
    const insights = [];
    const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    
    if (totalIncome > 0) {
        const savingsRate = (netSavings / totalIncome) * 100;
        const savingsText = `Your current savings rate is ${savingsRate.toFixed(1)}%.`;
        
        // Save savings insight for export
        const insightEntry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            type: 'Savings Insight',
            content: savingsText
        };
        smartInsights.push(insightEntry);
        
        insights.push(savingsText);
        
        let recommendationText = "";
        if (savingsRate < 10) {
            recommendationText = "Consider reducing expenses to improve your savings rate.";
        } else if (savingsRate > 20) {
            recommendationText = "Great job! You're saving well above the recommended 20% rate.";
        }
        
        if (recommendationText) {
            // Save recommendation for export
            const recommendationEntry = {
                id: Date.now() + 1,
                date: new Date().toISOString().split('T')[0],
                type: 'Savings Insight',
                content: recommendationText
            };
            smartInsights.push(recommendationEntry);
            
            insights.push(recommendationText);
        }
    }
    
    return insights;
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('income', JSON.stringify(income));
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
    localStorage.setItem('smartInsights', JSON.stringify(smartInsights)); // Save smart insights
}

// Load data from localStorage
function loadData() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    }
    
    const storedIncome = localStorage.getItem('income');
    if (storedIncome) {
        income = JSON.parse(storedIncome);
    }
    
    const storedGoals = localStorage.getItem('savingsGoals');
    if (storedGoals) {
        savingsGoals = JSON.parse(storedGoals);
    }
    
    const storedBudget = localStorage.getItem('monthlyBudget');
    if (storedBudget) {
        monthlyBudget = parseFloat(storedBudget);
    }
    
    const storedCategories = localStorage.getItem('customCategories');
    if (storedCategories) {
        customCategories = JSON.parse(storedCategories);
    }
    
    // Load smart insights
    const storedInsights = localStorage.getItem('smartInsights');
    if (storedInsights) {
        smartInsights = JSON.parse(storedInsights);
    }
    
    updateCategorySelect();
}

// Render expenses
function renderExpenses() {
    if (expenses.length === 0) {
        expensesContainer.innerHTML = '<p>No expenses recorded yet.</p>';
        return;
    }
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create expense items
    expensesContainer.innerHTML = sortedExpenses.map(expense => {
        // Check if this expense is an anomaly
        const anomalies = detectAnomalies();
        const isAnomaly = anomalies.some(a => a.expense.id === expense.id);
        
        return `
        <div class="expense-item ${isAnomaly ? 'anomaly' : ''}" data-id="${expense.id}">
            <div class="expense-details">
                <div>${expense.description} ${isAnomaly ? '<span class="anomaly-badge">⚠️ Anomaly</span>' : ''}</div>
                <div class="expense-category category-${expense.category.toLowerCase()}">${expense.category}</div>
                <div>${new Date(expense.date).toLocaleDateString()}</div>
            </div>
            <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})"><i class="fas fa-times"></i></button>
        </div>
    `;
    }).join('');
}

// Render income
function renderIncome() {
    if (income.length === 0) {
        incomeContainer.innerHTML = '<p>No income recorded yet.</p>';
        return;
    }
    
    // Sort income by date (newest first)
    const sortedIncome = [...income].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create income items
    incomeContainer.innerHTML = sortedIncome.map(entry => `
        <div class="income-item" data-id="${entry.id}">
            <div class="income-details">
                <div>${entry.source}</div>
                <div>${new Date(entry.date).toLocaleDateString()}</div>
            </div>
            <div class="income-amount">₹${entry.amount.toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteIncome(${entry.id})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

// Render savings goals
function renderGoals() {
    if (savingsGoals.length === 0) {
        goalsContainer.innerHTML = '<p>No savings goals set yet.</p>';
        return;
    }
    
    goalsContainer.innerHTML = savingsGoals.map(goal => {
        const progress = Math.min(100, (goal.currentSavings / goal.targetAmount) * 100);
        
        return `
        <div class="goal-item" data-id="${goal.id}">
            <div class="goal-header">
                <div class="goal-name">${goal.name}</div>
                <div class="goal-amount">₹${goal.currentSavings.toFixed(2)} / ₹${goal.targetAmount.toFixed(2)}</div>
                <button class="delete-goal-btn" onclick="deleteGoal(${goal.id})"><i class="fas fa-times"></i></button>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="goal-details">
                <span>${progress.toFixed(1)}% completed</span>
                <span>₹${(goal.targetAmount - goal.currentSavings).toFixed(2)} to go</span>
            </div>
        </div>
    `;
    }).join('');
}

// Delete expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveData();
    updateNetSavingsDisplay();
    renderExpenses();
    renderCharts();
    
    // Keep suggestions container empty
    suggestionsContainer.innerHTML = '';
    
    // Update budget summary
    if (monthlyBudget > 0) {
        updateBudgetSummary();
    }
    
    showNotification('Expense deleted!', 'warning');
}

// Delete income
function deleteIncome(id) {
    income = income.filter(entry => entry.id !== id);
    saveData();
    updateNetSavingsDisplay();
    renderIncome();
    renderCharts();
    
    // Keep suggestions container empty
    suggestionsContainer.innerHTML = '';
    
    showNotification('Income deleted!', 'warning');
}

// Delete savings goal
function deleteGoal(id) {
    savingsGoals = savingsGoals.filter(goal => goal.id !== id);
    saveData();
    renderGoals();
    renderCharts();
    
    // Keep suggestions container empty
    suggestionsContainer.innerHTML = '';
    
    showNotification('Savings goal deleted!', 'warning');
}

// Render charts
function renderCharts() {
    // Destroy existing charts if they exist
    if (categoryChart) {
        categoryChart.destroy();
    }
    if (trendChart) {
        trendChart.destroy();
    }
    if (savingsChart) {
        savingsChart.destroy();
    }
    
    // Category distribution data
    const categoryData = getCategoryData();
    
    // Trend data
    const trendData = getTrendData();
    
    // Savings data
    const savingsData = getSavingsData();
    
    // Category Chart
    const categoryCtx = document.getElementById('category-chart').getContext('2d');
    categoryChart = new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        }
    });
    
    // Trend Chart
    const trendCtx = document.getElementById('trend-chart').getContext('2d');
    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: trendData.labels,
            datasets: [{
                label: 'Expenses',
                data: trendData.expenseValues,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }, {
                label: 'Income',
                data: trendData.incomeValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    // Savings Chart
    const savingsCtx = document.getElementById('savings-chart').getContext('2d');
    savingsChart = new Chart(savingsCtx, {
        type: 'doughnut',
        data: {
            labels: savingsData.labels,
            datasets: [{
                data: savingsData.values,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                animation: {
                    animateRotate: true
                }
            }
        }
    });
}

// Get category distribution data
function getCategoryData() {
    const categoryMap = {};
    
    expenses.forEach(expense => {
        if (categoryMap[expense.category]) {
            categoryMap[expense.category] += expense.amount;
        } else {
            categoryMap[expense.category] = expense.amount;
        }
    });
    
    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);
    
    return { labels, values };
}

// Get trend data (expenses and income over time)
function getTrendData() {
    // Group expenses by date
    const expenseDateMap = {};
    expenses.forEach(expense => {
        const date = new Date(expense.date).toLocaleDateString();
        if (expenseDateMap[date]) {
            expenseDateMap[date] += expense.amount;
        } else {
            expenseDateMap[date] = expense.amount;
        }
    });
    
    // Group income by date
    const incomeDateMap = {};
    income.forEach(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        if (incomeDateMap[date]) {
            incomeDateMap[date] += entry.amount;
        } else {
            incomeDateMap[date] = entry.amount;
        }
    });
    
    // Combine all dates
    const allDates = [...new Set([...Object.keys(expenseDateMap), ...Object.keys(incomeDateMap)])];
    
    // Sort dates
    const sortedDates = allDates.sort((a, b) => new Date(a) - new Date(b));
    
    const labels = sortedDates;
    const expenseValues = sortedDates.map(date => expenseDateMap[date] || 0);
    const incomeValues = sortedDates.map(date => incomeDateMap[date] || 0);
    
    return { labels, expenseValues, incomeValues };
}

// Get savings data for chart
function getSavingsData() {
    const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    
    // Get savings goals data
    const goalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentSavings, 0);
    
    const labels = ['Net Savings', 'Expenses', 'Savings Goals'];
    const values = [Math.max(0, netSavings), totalExpenses, goalSavings];
    
    return { labels, values };
}

// Export to Excel format
function exportToExcel() {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create expenses worksheet
    if (expenses.length > 0) {
        // Transform expenses data for worksheet
        const expensesData = expenses.map(expense => ({
            Date: expense.date,
            Description: expense.description,
            Category: expense.category,
            Amount: expense.amount
        }));
        
        const ws1 = XLSX.utils.json_to_sheet(expensesData);
        XLSX.utils.book_append_sheet(wb, ws1, "Expenses");
    } else {
        // Create empty expenses sheet
        const ws1 = XLSX.utils.aoa_to_sheet([["No expenses recorded"]]);
        XLSX.utils.book_append_sheet(wb, ws1, "Expenses");
    }
    
    // Create income worksheet
    if (income.length > 0) {
        // Transform income data for worksheet
        const incomeData = income.map(entry => ({
            Date: entry.date,
            Source: entry.source,
            Amount: entry.amount
        }));
        
        const ws2 = XLSX.utils.json_to_sheet(incomeData);
        XLSX.utils.book_append_sheet(wb, ws2, "Income");
    } else {
        // Create empty income sheet
        const ws2 = XLSX.utils.aoa_to_sheet([["No income recorded"]]);
        XLSX.utils.book_append_sheet(wb, ws2, "Income");
    }
    
    // Create smart insights worksheet
    if (smartInsights.length > 0) {
        // Transform insights data for worksheet
        const insightsData = smartInsights.map(insight => ({
            Date: insight.date,
            Type: insight.type,
            Content: insight.content
        }));
        
        const ws3 = XLSX.utils.json_to_sheet(insightsData);
        XLSX.utils.book_append_sheet(wb, ws3, "Smart Insights");
    } else {
        // Create empty insights sheet
        const ws3 = XLSX.utils.aoa_to_sheet([["No smart insights available"]]);
        XLSX.utils.book_append_sheet(wb, ws3, "Smart Insights");
    }
    
    // Create summary worksheet
    const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    
    const summaryData = [
        ["Summary", ""],
        ["Total Income", `₹${totalIncome.toFixed(2)}`],
        ["Total Expenses", `₹${totalExpenses.toFixed(2)}`],
        ["Net Savings", `₹${netSavings.toFixed(2)}`]
    ];
    
    if (monthlyBudget > 0) {
        const remaining = monthlyBudget - totalExpenses;
        summaryData.push(["Monthly Budget", `₹${monthlyBudget.toFixed(2)}`]);
        summaryData.push(["Budget Remaining", `₹${remaining.toFixed(2)}`]);
    }
    
    const ws4 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws4, "Summary");
    
    // Export the workbook
    XLSX.writeFile(wb, "expense_tracker_data.xlsx");
    
    showNotification('Data exported as Excel successfully!', 'success');
}

// Export to Text File format (with proper formatting)
function exportToTextFile() {
    // Create a well-formatted text content
    let textContent = "EXPENSE TRACKER DATA EXPORT\n";
    textContent += "============================\n\n";
    
    // Add export date
    const exportDate = new Date().toLocaleString();
    textContent += `Export Date: ${exportDate}\n\n`;
    
    // Add expenses section
    textContent += "EXPENSES\n";
    textContent += "--------\n";
    textContent += "Date       | Description          | Category    | Amount\n";
    textContent += "-----------|----------------------|-------------|----------\n";
    
    // Add expenses with proper formatting
    if (expenses.length > 0) {
        expenses.forEach(expense => {
            const formattedDate = new Date(expense.date).toLocaleDateString('en-GB');
            const description = expense.description.length > 20 ? expense.description.substring(0, 17) + "..." : expense.description;
            const category = expense.category.length > 11 ? expense.category.substring(0, 8) + "..." : expense.category;
            const amount = `₹${expense.amount.toFixed(2)}`;
            
            // Pad strings to ensure alignment
            const paddedDate = formattedDate.padEnd(10, ' ');
            const paddedDescription = description.padEnd(20, ' ');
            const paddedCategory = category.padEnd(11, ' ');
            const paddedAmount = amount.padStart(10, ' ');
            
            textContent += `${paddedDate} | ${paddedDescription} | ${paddedCategory} | ${paddedAmount}\n`;
        });
    } else {
        textContent += "No expenses recorded.\n";
    }
    
    textContent += "\n";
    
    // Add income section
    textContent += "INCOME\n";
    textContent += "------\n";
    textContent += "Date       | Source               | Amount\n";
    textContent += "-----------|----------------------|----------\n";
    
    // Add income with proper formatting
    if (income.length > 0) {
        income.forEach(entry => {
            const formattedDate = new Date(entry.date).toLocaleDateString('en-GB');
            const source = entry.source.length > 20 ? entry.source.substring(0, 17) + "..." : entry.source;
            const amount = `₹${entry.amount.toFixed(2)}`;
            
            // Pad strings to ensure alignment
            const paddedDate = formattedDate.padEnd(10, ' ');
            const paddedSource = source.padEnd(20, ' ');
            const paddedAmount = amount.padStart(10, ' ');
            
            textContent += `${paddedDate} | ${paddedSource} | ${paddedAmount}\n`;
        });
    } else {
        textContent += "No income recorded.\n";
    }
    
    textContent += "\n";
    
    // Add smart insights section
    textContent += "SMART INSIGHTS\n";
    textContent += "--------------\n";
    
    if (smartInsights.length > 0) {
        smartInsights.forEach(insight => {
            textContent += `Date: ${insight.date}\n`;
            textContent += `Type: ${insight.type}\n`;
            textContent += `Content: ${insight.content}\n\n`;
        });
    } else {
        textContent += "No smart insights available.\n\n";
    }
    
    // Add summary section
    textContent += "SUMMARY\n";
    textContent += "-------\n";
    const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    
    textContent += `Total Income:     ₹${totalIncome.toFixed(2)}\n`;
    textContent += `Total Expenses:   ₹${totalExpenses.toFixed(2)}\n`;
    textContent += `Net Savings:      ₹${netSavings.toFixed(2)}\n`;
    
    if (monthlyBudget > 0) {
        const remaining = monthlyBudget - totalExpenses;
        textContent += `Monthly Budget:   ₹${monthlyBudget.toFixed(2)}\n`;
        textContent += `Budget Remaining: ₹${remaining.toFixed(2)}\n`;
    }
    
    // Create download link with .txt extension
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "expense_tracker_data.txt");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data exported as Text File successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    // In a real app, you might use a more sophisticated notification system
    console.log(`${type}: ${message}`);
    
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.className = `suggestion-item ${type}`;
    notification.innerHTML = `<h3><i class="fas fa-info-circle"></i> ${type.charAt(0).toUpperCase() + type.slice(1)}</h3><p>${message}</p>`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1000';
    notification.style.maxWidth = '300px';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Reset all data
function resetAllData() {
    // Clear all data from localStorage
    localStorage.removeItem('expenses');
    localStorage.removeItem('income');
    localStorage.removeItem('savingsGoals');
    localStorage.removeItem('monthlyBudget');
    localStorage.removeItem('customCategories');
    localStorage.removeItem('smartInsights');
    localStorage.removeItem('recurringExpensesAdded');
    localStorage.removeItem('openrouterApiKey');
    
    // Reset arrays and variables
    expenses = [];
    income = [];
    savingsGoals = [];
    customCategories = [];
    smartInsights = [];
    monthlyBudget = 0;
    
    // Update displays
    updateNetSavingsDisplay();
    renderExpenses();
    renderIncome();
    renderGoals();
    renderCharts();
    suggestionsContainer.innerHTML = '';
    updateBudgetSummary();
    
    showNotification('All data has been reset successfully!', 'success');
}
