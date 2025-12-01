// --- DATA STORE ---
let state = {
    credits: 420,
    moneySaved: 24.50,
    level: 1,
    status: {
        hamstringInjured: true,
        energy: 'Fresh' 
    },
    settings: {
        fontSize: '100%',
        calorieTarget: 2500
    },
    daily: {
        mentalChecked: false,
        shaved: false,
        caloriesIn: 0,
        caloriesOut: 0,
        weight: 174 // lbs
    },
    // Enhanced Weekly Plan Structure
    weeklyPlan: {
        Mon: { b: null, l: null, d: null, s: null, ex: null },
        Tue: { b: null, l: null, d: null, s: null, ex: null },
        Wed: { b: null, l: null, d: null, s: null, ex: null },
        Thu: { b: null, l: null, d: null, s: null, ex: null },
        Fri: { b: null, l: null, d: null, s: null, ex: null },
        Sat: { b: null, l: null, d: null, s: null, ex: null },
        Sun: { b: null, l: null, d: null, s: null, ex: null }
    },
    customMeals: [],
    favorites: [],
    weightLog: [] // Stores history of weight
};

// --- SMART INGREDIENT DATABASE ---
const ingredientDB = {
    "salmon": { c: 200 }, "tuna": { c: 130 }, "chicken": { c: 165 },
    "steak": { c: 270 }, "tofu": { c: 90 }, "egg": { c: 70 },
    "rice": { c: 200 }, "pasta": { c: 220 }, "oats": { c: 150 },
    "potato": { c: 160 }, "avocado": { c: 240 }, "nuts": { c: 180 },
    "yogurt": { c: 100 }
};

// --- EXERCISE DATABASE (Enhanced) ---
const activities = [
    {
        id: 'commute_run',
        title: "Football Commute",
        type: 'cardio',
        credits: 150,
        risk: 'medium',
        calories: 300,
        icon: 'fa-person-running',
        color: 'var(--accent-green)',
        desc: "2.5 Miles. Zone 2 Only.",
        motivation: "Builds aerobic base without cortisol spike.",
        formGuide: "https://www.youtube.com/results?search_query=zone+2+running+form"
    },
    {
        id: 'sprint_session',
        title: "Track Sprints",
        type: 'cardio',
        credits: 300,
        risk: 'high',
        calories: 450,
        icon: 'fa-wind',
        color: 'var(--accent-pink)',
        desc: "8 x 100m. Feel the speed.",
        motivation: "Shreds visceral fat and boosts HGH.",
        formGuide: "https://www.youtube.com/results?search_query=sprinting+technique+drills"
    },
    {
        id: 'core_rehab',
        title: "Disc Protection",
        type: 'rehab',
        credits: 100,
        risk: 'low',
        calories: 120,
        icon: 'fa-shield-heart',
        color: 'var(--accent-blue)',
        desc: "Deadbugs & Suitcase Carry.",
        motivation: "A bulletproof core prevents back pain.",
        formGuide: "https://www.youtube.com/results?search_query=mcgill+big+3+exercises"
    },
    {
        id: 'tennis_match',
        title: "Tennis Match",
        type: 'sport',
        credits: 250,
        risk: 'medium',
        calories: 400,
        icon: 'fa-table-tennis-paddle-ball',
        color: 'var(--accent-green)',
        desc: "Lateral movement. Watch the knees.",
        motivation: "Agility and reactive speed training.",
        formGuide: "https://www.youtube.com/results?search_query=tennis+footwork+drills"
    },
    {
        id: 'vanity_arms',
        title: "Sleeve Fillers",
        type: 'strength',
        credits: 80,
        risk: 'low',
        calories: 150,
        icon: 'fa-dumbbell',
        color: 'var(--accent-pink)',
        desc: "Biceps & Triceps. Look good.",
        motivation: "Sometimes you just need to look good in a t-shirt.",
        formGuide: "https://www.youtube.com/results?search_query=bicep+curl+form"
    }
];

// --- DEFAULT MEAL DATABASE ---
const defaultMeals = {
    breakfast: [
        { name: "Oats & Whey", ingredients: ["Oats", "Whey", "Berries"], nutrients: "C:40 P:25 F:5", calories: 350, prep: "5m" },
        { name: "Smoked Salmon Eggs", ingredients: ["Eggs", "Salmon", "Spinach"], nutrients: "C:2 P:30 F:15", calories: 400, prep: "10m" }
    ],
    lunch: [
        { name: "Tuna Niçoise", ingredients: ["Tuna", "Egg", "Olives", "Green Beans"], nutrients: "C:10 P:35 F:12", calories: 450, prep: "15m" },
        { name: "Prawn Wrap", ingredients: ["Prawn", "Wrap", "Avocado"], nutrients: "C:30 P:20 F:10", calories: 380, prep: "5m" }
    ],
    dinner: [
        { name: "Monkfish Curry", ingredients: ["Monkfish", "Coconut Milk", "Turmeric"], nutrients: "C:10 P:30 F:20", calories: 500, prep: "25m" },
        { name: "Spicy Tofu Stir-fry", ingredients: ["Tofu", "Chilli", "Bok Choi", "Noodles"], nutrients: "C:45 P:20 F:8", calories: 420, prep: "15m" }
    ],
    snacks: [
        { name: "Greek Yogurt", ingredients: ["Yogurt", "Honey"], nutrients: "High Casein", calories: 150, prep: "1m" },
        { name: "Apple & Walnuts", ingredients: ["Apple", "Nuts"], nutrients: "Healthy Fats", calories: 200, prep: "1m" }
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

    // Calorie Deficit Tracker
    const deficit = state.settings.calorieTarget - (state.daily.caloriesIn - state.daily.caloriesOut);
    const deficitCard = document.createElement('div');
    deficitCard.className = 'card';
    deficitCard.style.height = '120px';
    deficitCard.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="border-left: 4px solid var(--accent-blue)">
                <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:10px;">
                    <span><i class="fa-solid fa-fire"></i> Target: ${state.settings.calorieTarget}</span>
                    <span><i class="fa-solid fa-weight-scale"></i> ${state.daily.weight} lbs</span>
                </div>
                <h3>Remaining: ${deficit} kcal</h3>
                <div style="font-size:0.8rem; color:#888;">
                    In: ${state.daily.caloriesIn} | Out: ${state.daily.caloriesOut}
                </div>
                <button class="action-btn" style="margin-top:5px; font-size:0.7rem;" onclick="logWeight(event)">Log Weight</button>
            </div>
        </div>
    `;
    feed.appendChild(deficitCard);

    // Weekly Plan Preview (Today)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const plan = state.weeklyPlan[today];
    const planCard = document.createElement('div');
    planCard.className = 'card';
    planCard.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="border-left: 4px solid var(--accent-green)">
                <i class="fa-solid fa-calendar-day" style="font-size:2rem; margin-bottom:10px;"></i>
                <h3>Today: ${today}</h3>
                <div style="text-align:left; font-size:0.8rem; margin-top:5px;">
                    <p>🍳 B: ${plan.b || '-'}</p>
                    <p>🥗 L: ${plan.l || '-'}</p>
                    <p>🥘 D: ${plan.d || '-'}</p>
                    <p>🏃 Ex: ${plan.ex || '-'}</p>
                </div>
            </div>
        </div>
    `;
    feed.appendChild(planCard);
}

function renderGym() {
    const feed = document.getElementById('gym-feed');
    feed.innerHTML = ''; 
    
    // Manual Log Button
    const manualBtn = document.createElement('div');
    manualBtn.style.textAlign = 'center';
    manualBtn.style.marginBottom = '20px';
    manualBtn.innerHTML = `<button class="action-btn" style="background:#334155" onclick="manualLog(event)"><i class="fa-solid fa-watch"></i> Sync Garmin/Manual Log</button>`;
    feed.appendChild(manualBtn);

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
                    <h3 style="font-size:0.9rem">${act.motivation}</h3>
                    <p style="font-size:0.8rem; color:var(--accent-pink);">Burn: ~${act.calories} kcal</p>
                    <button class="action-btn" onclick="completeActivity(${act.credits}, '${act.type}', ${act.calories}, event)">Complete</button>
                    <div style="margin-top:10px;">
                        <button class="action-btn" style="background:#475569; font-size:0.7rem;" onclick="openFormGuide('${act.formGuide}', event)">How To (Video)</button>
                        <button class="action-btn" style="background:#475569; font-size:0.7rem;" onclick="addToPlan('${act.title}', event)">Plan</button>
                    </div>
                </div>
            </div>
        `;
        feed.appendChild(card);
    });
}

function renderKitchen() {
    const feed = document.getElementById('kitchen-advice');
    feed.innerHTML = '';
    
    // Search Bar
    const searchContainer = document.createElement('div');
    searchContainer.style.marginBottom = '20px';
    searchContainer.innerHTML = `
        <input type="text" id="meal-search" placeholder="Search ingredient (e.g. Salmon)..." 
               style="width:100%; padding:10px; border-radius:8px; border:1px solid #334155; background:#1e293b; color:white;"
               onkeyup="filterMeals()">
    `;
    feed.appendChild(searchContainer);

    // ADD MEAL BUTTON
    const addBtn = document.createElement('div');
    addBtn.className = 'card';
    addBtn.style.height = '60px';
    addBtn.style.borderStyle = 'dashed';
    addBtn.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100%; cursor:pointer;" onclick="showAddMealForm()">
            <i class="fa-solid fa-plus-circle" style="color:var(--accent-green); margin-right:10px;"></i>
            <h3>CREATE NEW MEAL</h3>
        </div>
    `;
    feed.appendChild(addBtn);

    // Container for results
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'meal-results';
    feed.appendChild(resultsContainer);

    // Initial Render of All Meals
    renderMealCards('');
    
    renderShop();
}

function renderMealCards(filterText) {
    const container = document.getElementById('meal-results');
    container.innerHTML = '';
    
    const allMeals = [
        ...Object.values(defaultMeals).flat(),
        ...state.customMeals
    ];

    allMeals.forEach(meal => {
        // Filter Logic
        if (filterText && !meal.name.toLowerCase().includes(filterText) && !meal.ingredients.some(i => i.toLowerCase().includes(filterText))) {
            return;
        }

        const isFav = state.favorites.includes(meal.name);
        const card = document.createElement('div');
        card.className = 'card';
        card.style.height = '150px';
        card.setAttribute('onclick', 'flipCard(this)');
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid ${isFav ? 'gold' : 'var(--accent-green)'}">
                    <div style="display:flex; justify-content:space-between;">
                        <h4>${meal.name}</h4>
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-star" onclick="toggleFav('${meal.name}', event)" style="color:${isFav ? 'gold' : '#666'}"></i>
                    </div>
                    <p style="font-size:0.8rem">${meal.ingredients.join(', ')}</p>
                    <p style="font-size:0.7rem; color:#888;">${meal.prep} | ~${meal.calories || 400} kcal</p>
                </div>
                <div class="card-back">
                    <h4>Nutrients</h4>
                    <p>${meal.nutrients}</p>
                    <button class="action-btn" onclick="addToPlan('${meal.name}', event, true)">Add to Planner</button>
                    <button class="action-btn" style="background:#475569; margin-top:5px;" onclick="logCalories(${meal.calories || 400}, event)">Ate This</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterMeals() {
    const text = document.getElementById('meal-search').value.toLowerCase();
    renderMealCards(text);
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
                <div class="card-front" style="border-left: 4px solid var(--accent-blue);">
                    <h3>Weekly Planner</h3>
                    <p>Manage your schedule.</p>
                </div>
                <div class="card-back">
                    <button class="action-btn" onclick="printPlan(event)">Print PDF</button>
                    <button class="action-btn" style="background:var(--accent-red); margin-top:10px;" onclick="clearPlanner(event)">Start New Week</button>
                </div>
            </div>
        </div>

        <h3 class="section-title">Schedule</h3>
        <div style="background:var(--card-bg); padding:15px; border-radius:10px; overflow-x:auto;">
            ${Object.keys(state.weeklyPlan).map(day => `
                <div style="margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <strong style="color:var(--accent-green); font-size:1.1rem;">${day}</strong>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-top:5px;">
                        <small>🍳 ${state.weeklyPlan[day].b || '-'}</small>
                        <small>🥗 ${state.weeklyPlan[day].l || '-'}</small>
                        <small>🥘 ${state.weeklyPlan[day].d || '-'}</small>
                        <small>🍎 ${state.weeklyPlan[day].s || '-'}</small>
                    </div>
                    <div style="margin-top:5px; color:var(--accent-pink); font-size:0.8rem;">
                        🏃 ${state.weeklyPlan[day].ex || '-'}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <button class="action-btn" style="background:var(--accent-red); margin-top:30px; width:100%;" onclick="resetData(event)">RESET APP DATA</button>
    `;
}

// --- NEW ACTIONS ---

function completeActivity(credits, type, calories, event) {
    event.stopPropagation();
    state.credits += credits;
    if (type === 'rehab') state.rehabStreak++;
    
    // Log Calories
    state.daily.caloriesOut += (calories || 0);
    
    updateHUD();
    alert(`+${credits} CR! Burned ${calories}kcal.`);
}

function manualLog(event) {
    const cals = prompt("Enter Calories Burned (from Garmin):");
    if(cals) {
        state.daily.caloriesOut += parseInt(cals);
        updateHUD();
        renderDashboard(); // Update deficit card
    }
}

function logWeight(event) {
    event.stopPropagation();
    const w = prompt("Current Weight (lbs):", state.daily.weight);
    if(w) {
        state.daily.weight = w;
        state.weightLog.push({date: new Date().toLocaleDateString(), weight: w});
        saveState();
        renderDashboard();
    }
}

function logCalories(cals, event) {
    event.stopPropagation();
    state.daily.caloriesIn += cals;
    saveState();
    renderDashboard(); // Update deficit
    alert("Calories Logged!");
}

function toggleFav(mealName, event) {
    event.stopPropagation();
    const idx = state.favorites.indexOf(mealName);
    if (idx > -1) state.favorites.splice(idx, 1);
    else state.favorites.push(mealName);
    saveState();
    filterMeals(); // Re-render
}

function addToPlan(itemName, event, isMeal = false) {
    event.stopPropagation();
    const day = prompt("Day? (Mon, Tue, Wed, Thu, Fri, Sat, Sun)", "Mon");
    if (!day || !state.weeklyPlan[day]) return alert("Invalid Day");

    let slot = 'ex';
    if(isMeal) {
        slot = prompt("Slot? (b=Breakfast, l=Lunch, d=Dinner, s=Snack)", "d").toLowerCase();
        if(!['b','l','d','s'].includes(slot)) return alert("Invalid Slot");
    }

    state.weeklyPlan[day][slot] = itemName;
    saveState();
    alert(`Added to ${day}`);
    if(document.getElementById('settings-section')) renderSettings();
}

function clearPlanner(event) {
    event.stopPropagation();
    if(confirm("Clear the whole week?")) {
        Object.keys(state.weeklyPlan).forEach(day => {
            state.weeklyPlan[day] = { b: null, l: null, d: null, s: null, ex: null };
        });
        saveState();
        renderSettings();
    }
}

function openFormGuide(url, event) {
    event.stopPropagation();
    window.open(url, '_blank');
}

// --- STANDARD ACTIONS ---

function showAddMealForm() {
    const name = prompt("Meal Name (e.g., Spicy Salmon Rice)");
    if (!name) return;
    
    const ingredientsString = prompt("Ingredients (comma separated)");
    if (!ingredientsString) return;
    
    const ingredients = ingredientsString.split(',').map(i => i.trim());
    let totalC = 0;
    
    ingredients.forEach(ing => {
        const key = ing.toLowerCase();
        const dbKey = Object.keys(ingredientDB).find(k => key.includes(k));
        totalC += dbKey ? ingredientDB[dbKey].c : 50; 
    });
    
    state.customMeals.push({
        name: name,
        ingredients: ingredients,
        nutrients: `Est: ${totalC} kcal`,
        calories: totalC,
        prep: "Custom"
    });
    saveState();
    filterMeals();
}

function flipCard(cardElement) {
    if (cardElement.classList.contains('locked')) return;
    cardElement.classList.toggle('flipped');
}

function buyTreat(cost, moneySaved, title, event) {
    event.stopPropagation();
    if (cost > 0 && state.credits < cost) return alert("INSUFFICIENT FUNDS");
    state.credits -= cost;
    if (moneySaved > 0) state.moneySaved += moneySaved;
    updateHUD();
    alert(cost < 0 ? "Banked!" : "Purchased!");
}

function completeMental(event) {
    event.stopPropagation();
    if (state.daily.mentalChecked) return;
    const card = event.target.closest('.card');
    const checks = card.querySelectorAll('input:checked').length;
    state.credits += (checks * 20);
    state.daily.mentalChecked = true;
    updateHUD();
    card.classList.remove('flipped');
}

function resetData(event) {
    event.stopPropagation();
    if(confirm("Delete all data?")) {
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
    if (tabId === 'dashboard') { renderDashboard(); document.getElementById('dashboard').style.display = 'block'; }
    else if (tabId === 'gym') { renderGym(); document.getElementById('gym').style.display = 'block'; }
    else if (tabId === 'kitchen') { renderKitchen(); document.getElementById('kitchen').style.display = 'block'; }
    else if (tabId === 'settings') { renderSettings(); document.getElementById('settings-section').style.display = 'block'; }
    document.querySelectorAll('.nav-btn').forEach(btn => btn.style.color = 'var(--text-mute)');
}

function triggerSOS() { document.getElementById('sos-modal').classList.remove('hidden'); }
function closeSOS() { document.getElementById('sos-modal').classList.add('hidden'); }
