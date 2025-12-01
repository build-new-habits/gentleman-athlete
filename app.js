// --- DATA STORE ---
let state = {
    credits: 420,
    moneySaved: 24.50,
    level: 1,
    status: {
        hamstringInjured: true,
        energy: 'Fresh' 
    },
    rehabStreak: 0,
    xp: 0,
    settings: {
        fontSize: '100%' 
    },
    daily: {
        mentalChecked: false,
        shaved: false
    },
    weeklyPlan: {
        Mon: { meal: null, exercise: null },
        Tue: { meal: null, exercise: null },
        Wed: { meal: null, exercise: null },
        Thu: { meal: null, exercise: null },
        Fri: { meal: null, exercise: null },
        Sat: { meal: null, exercise: null },
        Sun: { meal: null, exercise: null }
    },
    customMeals: [] // New storage for your added meals
};

// --- SMART INGREDIENT DATABASE (The Calculator) ---
// Average values per typical serving
const ingredientDB = {
    // PROTEINS
    "salmon": { c: 200, p: 25, f: 10 },
    "tuna": { c: 130, p: 28, f: 1 },
    "chicken": { c: 165, p: 31, f: 3 },
    "steak": { c: 270, p: 26, f: 19 },
    "tofu": { c: 90, p: 10, f: 5 },
    "egg": { c: 70, p: 6, f: 5 },
    "prawn": { c: 100, p: 20, f: 1 },
    "whey": { c: 120, p: 24, f: 1 },
    
    // CARBS
    "rice": { c: 200, p: 4, f: 0 },
    "pasta": { c: 220, p: 8, f: 1 },
    "oats": { c: 150, p: 5, f: 3 },
    "potato": { c: 160, p: 4, f: 0 },
    "bread": { c: 90, p: 3, f: 1 },
    "wrap": { c: 180, p: 5, f: 4 },
    
    // FATS / OTHERS
    "avocado": { c: 240, p: 3, f: 22 },
    "oil": { c: 120, p: 0, f: 14 },
    "nuts": { c: 180, p: 6, f: 16 },
    "cheese": { c: 110, p: 7, f: 9 },
    "milk": { c: 100, p: 8, f: 5 },
    "yogurt": { c: 100, p: 10, f: 0 },
    
    // VEG (Low cal, mostly ignored or base value)
    "salad": { c: 20, p: 1, f: 0 },
    "broccoli": { c: 30, p: 2, f: 0 },
    "spinach": { c: 10, p: 1, f: 0 }
};

// --- EXERCISE DATABASE ---
const activities = [
    {
        id: 'commute_run',
        title: "Football Commute",
        type: 'cardio',
        credits: 150,
        risk: 'medium',
        icon: 'fa-person-running',
        color: 'var(--accent-green)',
        desc: "2.5 Miles. Zone 2 Only."
    },
    {
        id: 'sprint_session',
        title: "Track Sprints",
        type: 'cardio',
        credits: 300,
        risk: 'high',
        icon: 'fa-wind',
        color: 'var(--accent-pink)',
        desc: "8 x 100m. Feel the speed."
    },
    {
        id: 'core_rehab',
        title: "Disc Protection",
        type: 'rehab',
        credits: 100,
        risk: 'low',
        icon: 'fa-shield-heart',
        color: 'var(--accent-blue)',
        desc: "Deadbugs & Suitcase Carry."
    },
    {
        id: 'tennis_match',
        title: "Tennis Match",
        type: 'sport',
        credits: 250,
        risk: 'medium',
        icon: 'fa-table-tennis-paddle-ball',
        color: 'var(--accent-green)',
        desc: "Lateral movement. Watch the knees."
    },
    {
        id: 'vanity_arms',
        title: "Sleeve Fillers",
        type: 'strength',
        credits: 80,
        risk: 'low',
        icon: 'fa-dumbbell',
        color: 'var(--accent-pink)',
        desc: "Biceps & Triceps. Look good."
    }
];

// --- DEFAULT MEAL DATABASE ---
const defaultMeals = {
    breakfast: [
        { name: "Oats & Whey", ingredients: ["Oats", "Whey", "Berries"], nutrients: "C:40 P:25 F:5", prep: "5m" },
        { name: "Smoked Salmon Eggs", ingredients: ["Eggs", "Salmon", "Spinach"], nutrients: "C:2 P:30 F:15", prep: "10m" }
    ],
    lunch: [
        { name: "Tuna Niçoise", ingredients: ["Tuna", "Egg", "Olives", "Green Beans"], nutrients: "C:10 P:35 F:12", prep: "15m" },
        { name: "Prawn Wrap", ingredients: ["Prawn", "Wrap", "Avocado"], nutrients: "C:30 P:20 F:10", prep: "5m" }
    ],
    dinner: [
        { name: "Monkfish Curry", ingredients: ["Monkfish", "Coconut Milk", "Turmeric"], nutrients: "C:10 P:30 F:20", prep: "25m" },
        { name: "Spicy Tofu Stir-fry", ingredients: ["Tofu", "Chilli", "Bok Choi", "Noodles"], nutrients: "C:45 P:20 F:8", prep: "15m" }
    ],
    snacks: [
        { name: "Greek Yogurt", ingredients: ["Yogurt", "Honey"], nutrients: "High Casein", prep: "1m" },
        { name: "Apple & Walnuts", ingredients: ["Apple", "Nuts"], nutrients: "Healthy Fats", prep: "1m" }
    ]
};

// --- TREAT DATABASE ---
const treatDatabase = [
    { id: 'espresso_home', title: "Home Brew", cost: -20, moneyValue: 3.40, icon: 'fa-mug-hot', desc: "Barista skills. Save £3.40." },
    { id: 'wine_glass', title: "Fine Wine", cost: 150, moneyValue: 0, icon: 'fa-wine-glass', desc: "Friday/Saturday Only." },
    { id: 'mince_pie', title: "Mince Pie", cost: 200, moneyValue: 0, icon: 'fa-cookie-bite', desc: "Seasonal Fuel." },
    { id: 'negroni', title: "Negroni", cost: 300, moneyValue: 0, icon: 'fa-cocktail', desc: "The Gentleman's Drink." }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    applySettings();
    updateHUD();
    renderDashboard();
    
    // Add Settings Button to Nav
    const nav = document.querySelector('.bottom-nav');
    if(nav && !document.getElementById('nav-settings')) {
        const btn = document.createElement('button');
        btn.id = 'nav-settings';
        btn.className = 'nav-btn';
        btn.innerHTML = '<i class="fa-solid fa-cog"></i>';
        btn.onclick = () => switchTab('settings');
        nav.appendChild(btn);
    }
});

// --- CORE LOGIC ---

function updateHUD() {
    document.getElementById('credit-count').innerText = state.credits;
    document.getElementById('money-saved').innerText = state.moneySaved.toFixed(2);
    
    const hamBtn = document.getElementById('injury-toggle');
    const hamStatus = document.getElementById('hamstring-status');
    if (state.status.hamstringInjured) {
        hamBtn.classList.add('active-warn');
        hamStatus.innerText = "Injured (Rehab Mode)";
    } else {
        hamBtn.classList.remove('active-warn');
        hamStatus.innerText = "Healed (Sprint Ready)";
    }
    
    saveState();
}

function toggleInjury() {
    state.status.hamstringInjured = !state.status.hamstringInjured;
    updateHUD();
    const activeSection = document.querySelector('.active-section');
    if(activeSection && activeSection.id === 'gym') renderGym(); 
}

function toggleTired() {
    state.status.energy = state.status.energy === 'Fresh' ? 'Tired' : 'Fresh';
    document.getElementById('energy-status').innerText = state.status.energy;
}

function saveState() {
    localStorage.setItem('gentlemanAthleteState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('gentlemanAthleteState');
    if (saved) state = JSON.parse(saved);
}

function applySettings() {
    document.body.style.fontSize = state.settings.fontSize || '100%';
}

// --- RENDERERS ---

function renderDashboard() {
    const feed = document.getElementById('activity-feed');
    feed.innerHTML = '';
    
    // Mental Health Card
    const mentalCard = document.createElement('div');
    mentalCard.className = 'card';
    mentalCard.setAttribute('onclick', 'flipCard(this)');
    mentalCard.innerHTML = `
        <div class="card-inner">
            <div class="card-front mental-front">
                <i class="fa-solid fa-brain" style="font-size:2rem; margin-bottom:10px;"></i>
                <h3>Morning Protocol</h3>
                <p>Start the day right.</p>
                ${state.daily.mentalChecked ? '<span style="color:var(--accent-green); font-weight:bold;">COMPLETED</span>' : ''}
            </div>
            <div class="card-back mental-back">
                <h3>The Audit</h3>
                <label onclick="event.stopPropagation()" style="display:block; margin:5px 0;">
                    <input type="checkbox"> Shaved / Groomed
                </label>
                <label onclick="event.stopPropagation()" style="display:block; margin:5px 0;">
                    <input type="checkbox"> Drank Water
                </label>
                <label onclick="event.stopPropagation()" style="display:block; margin:5px 0;">
                    <input type="checkbox"> Plan Defined
                </label>
                <button class="action-btn" onclick="completeMental(event)">Complete (+50 CR)</button>
            </div>
        </div>
    `;
    feed.appendChild(mentalCard);

    // Weekly Plan Preview
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const plan = state.weeklyPlan[today];
    const planCard = document.createElement('div');
    planCard.className = 'card';
    planCard.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="border-left: 4px solid var(--accent-blue)">
                <i class="fa-solid fa-calendar-day" style="font-size:2rem; margin-bottom:10px;"></i>
                <h3>Today: ${today}</h3>
                <p>Meal: ${plan.meal || 'Not Set'}</p>
                <p>Exercise: ${plan.exercise || 'Rest'}</p>
            </div>
        </div>
    `;
    feed.appendChild(planCard);
}

function renderGym() {
    const feed = document.getElementById('gym-feed');
    feed.innerHTML = ''; 

    activities.forEach(act => {
        let isLocked = false;
        let lockReason = "";

        if (act.risk === 'high' && state.status.hamstringInjured) {
            isLocked = true;
            lockReason = "Hamstring Risk";
        }

        const card = document.createElement('div');
        card.className = `card ${isLocked ? 'locked' : ''}`;
        if (!isLocked) card.setAttribute('onclick', 'flipCard(this)');

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid ${act.color}">
                    <i class="fa-solid ${act.icon}" style="font-size: 2rem; color: ${act.color}; margin-bottom: 10px;"></i>
                    <h3>${act.title}</h3>
                    <p>${act.desc}</p>
                    ${isLocked ? `<div style="color:var(--accent-red); font-weight:bold; margin-top:5px;"><i class="fa-solid fa-lock"></i> ${lockReason}</div>` : ''}
                </div>
                <div class="card-back">
                    <h3>Action</h3>
                    <p>Reward: ${act.credits} CR</p>
                    <button class="action-btn" onclick="completeActivity(${act.credits}, '${act.type}', event)">Complete</button>
                    <button class="action-btn" style="background:#475569; font-size:0.8rem; margin-top:5px;" onclick="addToPlan('${act.title}', event)">Add to Plan</button>
                </div>
            </div>
        `;
        feed.appendChild(card);
    });
}

function renderKitchen() {
    const feed = document.getElementById('kitchen-advice');
    feed.innerHTML = '';
    
    // ADD MEAL BUTTON
    const addBtn = document.createElement('div');
    addBtn.className = 'card';
    addBtn.style.height = '80px';
    addBtn.style.borderStyle = 'dashed';
    addBtn.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100%; cursor:pointer;" onclick="showAddMealForm()">
            <i class="fa-solid fa-plus-circle" style="color:var(--accent-green); margin-right:10px;"></i>
            <h3>ADD NEW MEAL</h3>
        </div>
    `;
    feed.appendChild(addBtn);

    // RENDER CUSTOM MEALS
    if (state.customMeals.length > 0) {
        const customTitle = document.createElement('h3');
        customTitle.innerText = "MY CUSTOM MEALS";
        customTitle.className = 'section-title';
        feed.appendChild(customTitle);
        
        state.customMeals.forEach(meal => {
            feed.appendChild(createMealCard(meal, 'var(--accent-blue)'));
        });
    }
    
    // RENDER DEFAULT MEALS
    const categories = Object.keys(defaultMeals);
    categories.forEach(cat => {
        const catTitle = document.createElement('h3');
        catTitle.innerText = cat.toUpperCase();
        catTitle.className = 'section-title';
        catTitle.style.marginTop = '20px';
        feed.appendChild(catTitle);

        defaultMeals[cat].forEach(meal => {
            feed.appendChild(createMealCard(meal, 'var(--accent-green)'));
        });
    });
    
    renderShop();
}

function createMealCard(meal, color) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.height = '140px';
    card.setAttribute('onclick', 'flipCard(this)');
    
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="border-left: 4px solid ${color}">
                <h4>${meal.name}</h4>
                <p style="font-size:0.8rem">${meal.ingredients.join(', ')}</p>
                <p style="font-size:0.7rem; color:#888;">${meal.prep}</p>
            </div>
            <div class="card-back">
                <h4>Nutrients</h4>
                <p>${meal.nutrients}</p>
                <button class="action-btn" onclick="addToPlan('${meal.name}', event)">Plan This</button>
            </div>
        </div>
    `;
    return card;
}

function renderShop() {
    const shopContainer = document.getElementById('treat-shop');
    shopContainer.innerHTML = '<h3 class="section-title" style="margin-top:30px; border-color:var(--accent-pink);">Dopamine Store</h3>';
    
    treatDatabase.forEach(item => {
        const isEarner = item.cost < 0; 
        const card = document.createElement('div');
        card.className = 'card';
        card.style.height = '120px'; 
        card.setAttribute('onclick', 'flipCard(this)');
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid ${isEarner ? 'var(--accent-green)' : 'var(--accent-pink)'}">
                    <i class="fa-solid ${item.icon}" style="font-size: 1.5rem; margin-bottom: 5px;"></i>
                    <h4>${item.title}</h4>
                </div>
                <div class="card-back">
                    <p>${isEarner ? 'EARN' : 'COST'}: ${Math.abs(item.cost)} CR</p>
                    <button class="action-btn" onclick="buyTreat(${item.cost}, ${item.moneyValue}, '${item.title}', event)">
                        ${isEarner ? 'Brew & Bank' : 'Purchase'}
                    </button>
                </div>
            </div>
        `;
        shopContainer.appendChild(card);
    });
}

function renderSettings() {
    const main = document.getElementById('app-container');
    let setSection = document.getElementById('settings-section');
    if (!setSection) {
        setSection = document.createElement('section');
        setSection.id = 'settings-section';
        setSection.className = 'hidden-section';
        main.appendChild(setSection);
    }
    
    setSection.innerHTML = `
        <h2 class="section-title">System Settings</h2>
        
        <div class="card">
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid white;">
                    <h3>Accessibility</h3>
                    <p>Current Font: ${state.settings.fontSize || '100%'}</p>
                </div>
                <div class="card-back">
                    <button class="action-btn" onclick="changeFontSize('100%', event)">Normal</button>
                    <button class="action-btn" onclick="changeFontSize('120%', event)">Large</button>
                    <button class="action-btn" onclick="changeFontSize('140%', event)">Extra Large</button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid var(--accent-blue);">
                    <h3>Weekly Plan</h3>
                    <p>Export your schedule.</p>
                </div>
                <div class="card-back">
                    <button class="action-btn" onclick="printPlan(event)">Print PDF</button>
                    <button class="action-btn" style="background:var(--accent-red); margin-top:10px;" onclick="resetData(event)">RESET APP DATA</button>
                </div>
            </div>
        </div>

        <h3 class="section-title">Weekly Schedule</h3>
        <div style="background:var(--card-bg); padding:15px; border-radius:10px;">
            ${Object.keys(state.weeklyPlan).map(day => `
                <div style="margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <strong style="color:var(--accent-green)">${day}</strong><br>
                    <small>Meal: ${state.weeklyPlan[day].meal || '-'}</small><br>
                    <small>Ex: ${state.weeklyPlan[day].exercise || '-'}</small>
                </div>
            `).join('')}
        </div>
    `;
}

// --- NEW FEATURES: ADD MEAL LOGIC ---

function showAddMealForm() {
    const name = prompt("Meal Name (e.g., Spicy Salmon Rice)");
    if (!name) return;
    
    const ingredientsString = prompt("Ingredients (comma separated, e.g., Salmon, Rice, Avocado)");
    if (!ingredientsString) return;
    
    // THE SMART ESTIMATOR
    const ingredients = ingredientsString.split(',').map(i => i.trim());
    let totalC = 0, totalP = 0, totalF = 0;
    
    ingredients.forEach(ing => {
        const key = ing.toLowerCase();
        // Fuzzy search in ingredientDB
        const dbKey = Object.keys(ingredientDB).find(k => key.includes(k));
        if (dbKey) {
            totalC += ingredientDB[dbKey].c;
            totalP += ingredientDB[dbKey].p;
            totalF += ingredientDB[dbKey].f;
        } else {
            // Default 50 cals if unknown
            totalC += 50; 
        }
    });
    
    const newMeal = {
        name: name,
        ingredients: ingredients,
        nutrients: `C:${totalC} P:${totalP} F:${totalF} (Est)`,
        prep: "Custom"
    };
    
    state.customMeals.push(newMeal);
    saveState();
    renderKitchen();
    alert("Meal Added to Library!");
}

// --- INTERACTION ---

function flipCard(cardElement) {
    if (cardElement.classList.contains('locked')) return;
    cardElement.classList.toggle('flipped');
}

function completeActivity(credits, type, event) {
    event.stopPropagation();
    state.credits += credits;
    if (type === 'rehab') state.rehabStreak++;
    updateHUD();
    alert(`+${credits} CR Earned!`);
}

function addToPlan(itemName, event) {
    event.stopPropagation();
    const day = prompt("Add to which day? (Mon, Tue, Wed, Thu, Fri, Sat, Sun)", "Mon");
    if (day && state.weeklyPlan[day]) {
        const isMeal = Object.values(defaultMeals).flat().concat(state.customMeals).some(m => m.name === itemName);
        
        if (isMeal) state.weeklyPlan[day].meal = itemName;
        else state.weeklyPlan[day].exercise = itemName;
        
        alert(`Added ${itemName} to ${day}`);
        saveState();
        if(document.getElementById('settings-section')) renderSettings();
    } else {
        alert("Invalid Day");
    }
}

function buyTreat(cost, moneySaved, title, event) {
    event.stopPropagation();
    if (cost > 0 && state.credits < cost) {
        alert("INSUFFICIENT FUNDS");
        return;
    }
    state.credits -= cost;
    if (moneySaved > 0) state.moneySaved += moneySaved;
    updateHUD();
    const card = event.target.closest('.card');
    card.classList.remove('flipped');
    alert(cost < 0 ? "Banked!" : "Purchased!");
}

function completeMental(event) {
    event.stopPropagation();
    if (state.daily.mentalChecked) return;
    const card = event.target.closest('.card');
    const checks = card.querySelectorAll('input:checked').length;
    const reward = checks * 20;
    state.credits += reward;
    state.daily.mentalChecked = true;
    updateHUD();
    card.classList.remove('flipped');
    alert(`Audit Complete. +${reward} CR.`);
}

function changeFontSize(size, event) {
    event.stopPropagation();
    state.settings.fontSize = size;
    applySettings();
    saveState();
    alert(`Font size set to ${size}`);
}

function resetData(event) {
    event.stopPropagation();
    if(confirm("Are you sure? This deletes all progress.")) {
        localStorage.removeItem('gentlemanAthleteState');
        location.reload();
    }
}

function printPlan(event) {
    event.stopPropagation();
    window.print();
}

function switchTab(tabId) {
    document.querySelectorAll('section').forEach(el => el.style.display = 'none');
    
    if (tabId === 'dashboard') {
        renderDashboard();
        document.getElementById('dashboard').style.display = 'block';
    } else if (tabId === 'gym') {
        renderGym();
        document.getElementById('gym').style.display = 'block';
    } else if (tabId === 'kitchen') {
        renderKitchen();
        document.getElementById('kitchen').style.display = 'block';
    } else if (tabId === 'settings') {
        renderSettings();
        document.getElementById('settings-section').style.display = 'block';
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.style.color = 'var(--text-mute)');
}

function triggerSOS() {
    document.getElementById('sos-modal').classList.remove('hidden');
}

function closeSOS() {
    document.getElementById('sos-modal').classList.add('hidden');
}
