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
        calorieTarget: 2500,
        startWeight: 174, // lbs
        goalWeight: 154 // 11 stone
    },
    daily: {
        mentalChecked: false,
        shaved: false,
        caloriesIn: 0,
        caloriesOut: 0,
        weight: 174 
    },
    // Enhanced Weekly Plan with Macros
    weeklyPlan: {
        Mon: { b: null, l: null, d: null, s: null, ex: null, calsIn: 0, calsOut: 0 },
        Tue: { b: null, l: null, d: null, s: null, ex: null, calsIn: 0, calsOut: 0 },
        Wed: { b: null, l: null, d: null, s: null, ex: null, calsIn: 0, calsOut: 0 },
        Thu: { b: null, l: null, d: null, s: null, ex: null, calsIn: 0, calsOut: 0 },
        Fri: { b: null, l: null, d: null, s: null, ex: null, calsIn: 0, calsOut: 0 },
        Sat: { b: null, l: null, d: null, s: null, ex: null, calsIn: 0, calsOut: 0 },
        Sun: { b: null, l: null, d: null, s: null, ex: null, calsIn: 0, calsOut: 0 }
    },
    customMeals: [],
    favorites: [],
    weightLog: [
        { date: '2023-11-01', weight: 178 },
        { date: '2023-11-15', weight: 176 },
        { date: '2023-11-30', weight: 174 }
    ],
    milestones: [
        { name: "Christmas Survival", date: "2023-12-25", target: 172, desc: "Maintain through the holidays" },
        { name: "Birthday (46)", date: "2024-02-01", target: 165, desc: "Fit at 46" },
        { name: "Easter Cut", date: "2024-03-31", target: 158, desc: "Lean for Spring" },
        { name: "Athletic Goal", date: "2024-06-01", target: 154, desc: "11 Stone. Done." }
    ]
};

// --- SMART INGREDIENT DATABASE ---
const ingredientDB = {
    "salmon": { c: 200 }, "tuna": { c: 130 }, "chicken": { c: 165 },
    "steak": { c: 270 }, "tofu": { c: 90 }, "egg": { c: 70 },
    "rice": { c: 200 }, "pasta": { c: 220 }, "oats": { c: 150 },
    "potato": { c: 160 }, "avocado": { c: 240 }, "nuts": { c: 180 },
    "yogurt": { c: 100 }, "pizza": {c: 600}, "burger": {c: 500}
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
        desc: "2.5 Miles. Zone 2.",
        strategy: "Aerobic Base",
        motivation: "Builds the engine without cortisol spike.",
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
        desc: "8 x 100m. Max Effort.",
        strategy: "Fat Shredder",
        motivation: "High Intensity burns fat for 24hrs after (EPOC).",
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
        desc: "McGill Big 3.",
        strategy: "Injury Prevention",
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
        desc: "Lateral Agility.",
        strategy: "Reactive Speed",
        motivation: "Fun cardio that doesn't feel like work.",
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
        desc: "Bicep/Tricep Pump.",
        strategy: "Aesthetics",
        motivation: "Look good, feel good. Dopamine hit.",
        formGuide: "https://www.youtube.com/results?search_query=bicep+curl+form"
    }
];

// --- DEFAULT MEAL DATABASE ---
const defaultMeals = {
    breakfast: [
        { name: "Oats & Whey", ingredients: ["Oats", "Whey", "Berries"], nutrients: "C:40 P:25 F:5", calories: 350, prep: "5m", tags: ["carb_load"] },
        { name: "Smoked Salmon Eggs", ingredients: ["Eggs", "Salmon", "Spinach"], nutrients: "C:2 P:30 F:15", calories: 400, prep: "10m", tags: ["protein", "fat"] }
    ],
    lunch: [
        { name: "Tuna Niçoise", ingredients: ["Tuna", "Egg", "Olives", "Green Beans"], nutrients: "C:10 P:35 F:12", calories: 450, prep: "15m", tags: ["protein"] },
        { name: "Prawn Wrap", ingredients: ["Prawn", "Wrap", "Avocado"], nutrients: "C:30 P:20 F:10", calories: 380, prep: "5m", tags: ["balanced"] }
    ],
    dinner: [
        { name: "Monkfish Curry", ingredients: ["Monkfish", "Coconut Milk", "Turmeric"], nutrients: "C:10 P:30 F:20", calories: 500, prep: "25m", tags: ["protein", "anti_inflammatory"] },
        { name: "Spicy Tofu Stir-fry", ingredients: ["Tofu", "Chilli", "Bok Choi", "Noodles"], nutrients: "C:45 P:20 F:8", calories: 420, prep: "15m", tags: ["vegan", "light"] }
    ],
    snacks: [
        { name: "Greek Yogurt", ingredients: ["Yogurt", "Honey"], nutrients: "High Casein", calories: 150, prep: "1m", tags: ["recovery"] },
        { name: "Apple & Walnuts", ingredients: ["Apple", "Nuts"], nutrients: "Healthy Fats", calories: 200, prep: "1m", tags: ["energy"] }
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
    
    // Inject Nav Buttons if missing
    const nav = document.querySelector('.bottom-nav');
    if(nav && !document.getElementById('nav-planner')) {
        const pBtn = document.createElement('button');
        pBtn.id = 'nav-planner';
        pBtn.className = 'nav-btn';
        pBtn.innerHTML = '<i class="fa-solid fa-calendar-week"></i>';
        pBtn.onclick = () => switchTab('planner');
        
        const sBtn = document.createElement('button');
        sBtn.id = 'nav-settings';
        sBtn.className = 'nav-btn';
        sBtn.innerHTML = '<i class="fa-solid fa-chart-line"></i>'; // Changed to chart for progress/settings
        sBtn.onclick = () => switchTab('settings');
        
        nav.appendChild(pBtn);
        nav.appendChild(sBtn);
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
    // Re-render current view
    const activeSection = document.querySelector('.active-section');
    if(activeSection.id === 'gym') renderGym(); 
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
    
    // Mental Health Card (FIXED FLIP BUG)
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
                <div onclick="event.stopPropagation()" style="text-align:left; width:100%; padding:0 20px;">
                    <label style="display:block; margin:5px 0; padding:5px; border-bottom:1px solid #444;">
                        <input type="checkbox"> Shaved / Groomed
                    </label>
                    <label style="display:block; margin:5px 0; padding:5px; border-bottom:1px solid #444;">
                        <input type="checkbox"> Drank Water
                    </label>
                    <label style="display:block; margin:5px 0; padding:5px;">
                        <input type="checkbox"> Plan Defined
                    </label>
                </div>
                <button class="action-btn" onclick="completeMental(event)">Complete (+50 CR)</button>
            </div>
        </div>
    `;
    feed.appendChild(mentalCard);

    // Progress Snapshot
    const deficit = state.settings.calorieTarget - (state.daily.caloriesIn - state.daily.caloriesOut);
    const deficitCard = document.createElement('div');
    deficitCard.className = 'card';
    deficitCard.style.height = '140px';
    deficitCard.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="border-left: 4px solid var(--accent-blue)">
                <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:5px;">
                    <span><i class="fa-solid fa-bullseye"></i> Goal: ${state.settings.goalWeight}</span>
                    <span><i class="fa-solid fa-weight-scale"></i> ${state.daily.weight} lbs</span>
                </div>
                <h3>Remaining: ${deficit} kcal</h3>
                <div style="font-size:0.8rem; color:#888;">
                    In: ${state.daily.caloriesIn} | Out: ${state.daily.caloriesOut}
                </div>
                <div style="margin-top:10px; height:6px; background:#333; border-radius:3px; overflow:hidden;">
                    <div style="width:${Math.min(((state.settings.startWeight - state.daily.weight) / (state.settings.startWeight - state.settings.goalWeight)) * 100, 100)}%; height:100%; background:var(--accent-green);"></div>
                </div>
                <button class="action-btn" style="margin-top:5px; font-size:0.7rem;" onclick="logWeight(event)">Log Weight</button>
            </div>
        </div>
    `;
    feed.appendChild(deficitCard);
}

function renderGym() {
    const feed = document.getElementById('gym-feed');
    feed.innerHTML = ''; 
    
    // Manual Log
    feed.innerHTML += `<div style="text-align:center; margin-bottom:20px;">
        <button class="action-btn" style="background:#334155" onclick="manualLog(event)"><i class="fa-solid fa-watch"></i> Sync Garmin/Manual</button>
    </div>`;

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
                    <small style="color:#888;">${act.strategy}</small>
                    ${isLocked ? `<div style="color:var(--accent-red); font-weight:bold; margin-top:5px;"><i class="fa-solid fa-lock"></i> ${lockReason}</div>` : ''}
                </div>
                <div class="card-back">
                    <h3 style="font-size:0.9rem">${act.motivation}</h3>
                    <p style="font-size:0.8rem; color:var(--accent-pink);">Burn: ~${act.calories} kcal</p>
                    <button class="action-btn" onclick="completeActivity(${act.credits}, '${act.type}', ${act.calories}, event)">Complete</button>
                    <div style="margin-top:10px;">
                        <button class="action-btn" style="background:#475569; font-size:0.7rem;" onclick="openFormGuide('${act.formGuide}', event)">Watch Video</button>
                        <button class="action-btn" style="background:#475569; font-size:0.7rem;" onclick="addToPlan('${act.title}', event, false, ${act.calories})">Plan This</button>
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
    
    // Search
    feed.innerHTML += `
        <div style="margin-bottom:20px;">
            <input type="text" id="meal-search" placeholder="Search (e.g. Salmon)..." 
               style="width:100%; padding:10px; border-radius:8px; border:1px solid #334155; background:#1e293b; color:white;"
               onkeyup="filterMeals()">
        </div>
    `;

    // Add New
    feed.innerHTML += `
        <div class="card" style="height:60px; border-style:dashed;" onclick="showAddMealForm()">
            <div style="display:flex; justify-content:center; align-items:center; height:100%; cursor:pointer;">
                <i class="fa-solid fa-plus-circle" style="color:var(--accent-green); margin-right:10px;"></i>
                <h3>CREATE CUSTOM MEAL</h3>
            </div>
        </div>
    `;

    // Results Container
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'meal-results';
    feed.appendChild(resultsContainer);
    renderMealCards(''); // Show all
    
    renderShop();
}

function renderMealCards(filterText) {
    const container = document.getElementById('meal-results');
    container.innerHTML = '';
    
    const allMeals = [...Object.values(defaultMeals).flat(), ...state.customMeals];

    allMeals.forEach(meal => {
        if (filterText && !meal.name.toLowerCase().includes(filterText) && !meal.ingredients.some(i => i.toLowerCase().includes(filterText))) {
            return;
        }

        const isFav = state.favorites.includes(meal.name);
        const card = document.createElement('div');
        card.className = 'card';
        card.style.height = '160px';
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
                    <div style="font-size:0.6rem; color:var(--accent-blue); margin-top:5px;">
                        ${(meal.tags || []).join(' • ')}
                    </div>
                </div>
                <div class="card-back">
                    <h4>Nutrients</h4>
                    <p>${meal.nutrients}</p>
                    <button class="action-btn" onclick="addToPlan('${meal.name}', event, true, ${meal.calories})">Add to Planner</button>
                    <button class="action-btn" style="background:#475569; margin-top:5px;" onclick="logCalories(${meal.calories || 400}, event)">Ate This Now</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderPlanner() {
    // THIS IS THE NEW "BEAUTIFUL TABLE"
    const main = document.getElementById('app-container');
    let planSection = document.getElementById('planner-section');
    if (!planSection) {
        planSection = document.createElement('section');
        planSection.id = 'planner-section';
        planSection.className = 'hidden-section';
        main.appendChild(planSection);
    }

    // Filter Buttons
    let html = `
        <h2 class="section-title">Weekly Strategy</h2>
        <div class="filter-bar" style="margin-bottom:15px; display:flex; gap:10px;">
            <button class="action-btn" style="flex:1; font-size:0.7rem;" onclick="filterPlanView('all')">All</button>
            <button class="action-btn" style="flex:1; font-size:0.7rem; background:var(--accent-green);" onclick="filterPlanView('meals')">Meals</button>
            <button class="action-btn" style="flex:1; font-size:0.7rem; background:var(--accent-pink);" onclick="filterPlanView('ex')">Training</button>
        </div>
        <div id="planner-table-container"></div>
    `;
    planSection.innerHTML = html;
    filterPlanView('all'); // Render default
}

function filterPlanView(viewMode) {
    const container = document.getElementById('planner-table-container');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    let html = `<div style="display:flex; flex-direction:column; gap:15px;">`;

    days.forEach(day => {
        const d = state.weeklyPlan[day];
        const balance = d.calsIn - d.calsOut;
        const balanceColor = balance > 0 ? 'var(--accent-red)' : 'var(--accent-green)';
        
        html += `
            <div style="background:var(--card-bg); border-radius:12px; padding:15px; border-left:4px solid #475569;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h3 style="margin:0; color:white;">${day}</h3>
                    <span style="font-size:0.8rem; color:${balanceColor};">Net: ${balance > 0 ? '+' : ''}${balance} kcal</span>
                </div>
                
                ${(viewMode === 'all' || viewMode === 'meals') ? `
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:0.8rem; margin-bottom:10px;">
                    <div style="background:#334155; padding:5px; border-radius:4px;"><span style="color:#aaa">B:</span> ${d.b || '-'}</div>
                    <div style="background:#334155; padding:5px; border-radius:4px;"><span style="color:#aaa">L:</span> ${d.l || '-'}</div>
                    <div style="background:#334155; padding:5px; border-radius:4px;"><span style="color:#aaa">D:</span> ${d.d || '-'}</div>
                    <div style="background:#334155; padding:5px; border-radius:4px;"><span style="color:#aaa">S:</span> ${d.s || '-'}</div>
                </div>` : ''}

                ${(viewMode === 'all' || viewMode === 'ex') ? `
                <div style="background:rgba(236, 72, 153, 0.1); padding:8px; border-radius:4px; border:1px solid var(--accent-pink);">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                        <span style="color:var(--accent-pink); font-weight:bold;"><i class="fa-solid fa-person-running"></i> ${d.ex || 'Rest Day'}</span>
                        <span style="color:#fff;">${d.calsOut > 0 ? '-' + d.calsOut : ''}</span>
                    </div>
                </div>` : ''}
            </div>
        `;
    });
    html += `</div>`;
    
    html += `<button class="action-btn" style="background:var(--accent-red); margin-top:20px; width:100%;" onclick="clearPlanner(event)">Clear Week</button>`;
    
    container.innerHTML = html;
}

function renderSettings() {
    // PROGRESS & MILESTONES VIEW
    const main = document.getElementById('app-container');
    let setSection = document.getElementById('settings-section');
    if (!setSection) {
        setSection = document.createElement('section');
        setSection.id = 'settings-section';
        setSection.className = 'hidden-section';
        main.appendChild(setSection);
    }
    
    // Graph Bars Generation
    let graphHTML = `<div style="display:flex; align-items:flex-end; gap:5px; height:150px; padding:10px; border-bottom:1px solid #444; margin-bottom:20px;">`;
    state.weightLog.slice(-10).forEach(log => {
        const height = Math.max(10, (log.weight - 150) * 5); // simple scaling
        graphHTML += `
            <div style="flex:1; background:var(--accent-green); height:${height}px; position:relative; border-radius:3px 3px 0 0;" title="${log.date}: ${log.weight}">
                <span style="position:absolute; top:-20px; left:0; font-size:0.6rem; width:100%; text-align:center;">${log.weight}</span>
            </div>
        `;
    });
    graphHTML += `</div>`;

    setSection.innerHTML = `
        <h2 class="section-title">Progress & Milestones</h2>
        
        <div class="card">
            <div class="card-inner">
                <div class="card-front">
                    <h3>Weight History</h3>
                    ${graphHTML}
                    <p style="font-size:0.8rem; color:#888;">Start: ${state.settings.startWeight} | Current: ${state.daily.weight} | Goal: ${state.settings.goalWeight}</p>
                </div>
            </div>
        </div>

        <h3 class="section-title">The Path</h3>
        <div style="display:flex; flex-direction:column; gap:10px;">
            ${state.milestones.map(m => {
                const isMet = state.daily.weight <= m.target;
                return `
                <div style="background:var(--card-bg); padding:15px; border-radius:10px; border-left:4px solid ${isMet ? 'var(--accent-green)' : '#444'}; opacity:${isMet ? 0.6 : 1}">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${m.name}</strong>
                        <span style="color:var(--accent-blue);">${m.date}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-top:5px; color:#aaa;">
                        <span>Target: ${m.target} lbs</span>
                        <span>${isMet ? 'ACHIEVED' : 'Pending'}</span>
                    </div>
                </div>
                `;
            }).join('')}
        </div>

        <div style="margin-top:30px;">
             <h3 class="section-title">Data Management</h3>
             <button class="action-btn" style="background:var(--accent-red); width:100%;" onclick="resetData(event)">Factory Reset App</button>
        </div>
    `;
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
                    <button class="action-btn" onclick="buyTreat(${item.cost}, ${item.moneyValue}, '${item.title}', event)">${isEarner ? 'Brew & Bank' : 'Purchase'}</button>
                </div>
            </div>`;
        shopContainer.appendChild(card);
    });
}

// --- RECOMMENDATION ENGINE ---
function recommendExercise(mealName, calories) {
    if(calories > 500) {
        alert(`Heavy Meal Detected (${calories}kcal). \n\nRECOMMENDATION: \nSchedule a Sprint Session tomorrow to utilize the glycogen.`);
    }
}

// --- ACTIONS ---

function addToPlan(itemName, event, isMeal = false, calories = 0) {
    event.stopPropagation();
    const day = prompt("Day? (Mon, Tue, Wed, Thu, Fri, Sat, Sun)", "Mon");
    if (!day || !state.weeklyPlan[day]) return alert("Invalid Day");

    let slot = 'ex';
    if(isMeal) {
        slot = prompt("Slot? (b=Breakfast, l=Lunch, d=Dinner, s=Snack)", "d").toLowerCase();
        if(!['b','l','d','s'].includes(slot)) return alert("Invalid Slot");
        
        state.weeklyPlan[day][slot] = itemName;
        state.weeklyPlan[day].calsIn += calories;
        recommendExercise(itemName, calories);
    } else {
        state.weeklyPlan[day].ex = itemName;
        state.weeklyPlan[day].calsOut += calories;
    }

    saveState();
    alert(`Added to ${day}`);
}

function filterMeals() {
    const text = document.getElementById('meal-search').value.toLowerCase();
    renderMealCards(text);
}

// --- STANDARD ---
function completeActivity(credits, type, calories, event) {
    event.stopPropagation();
    state.credits += credits;
    if (type === 'rehab') state.rehabStreak++;
    state.daily.caloriesOut += (calories || 0);
    updateHUD();
    alert(`+${credits} CR! Burned ${calories}kcal.`);
}
function manualLog(event) {
    const cals = prompt("Enter Calories Burned:");
    if(cals) { state.daily.caloriesOut += parseInt(cals); updateHUD(); renderDashboard(); }
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
    renderDashboard();
    recommendExercise('Quick Log', cals);
}
function toggleFav(mealName, event) {
    event.stopPropagation();
    const idx = state.favorites.indexOf(mealName);
    if (idx > -1) state.favorites.splice(idx, 1);
    else state.favorites.push(mealName);
    saveState();
    filterMeals(); 
}
function clearPlanner(event) {
    event.stopPropagation();
    if(confirm("Clear the whole week?")) {
        Object.keys(state.weeklyPlan).forEach(day => {
            state.weeklyPlan[day] = { b: null, l: null, d: null, s: null, ex: null, calsIn: 0, calsOut: 0 };
        });
        saveState();
        filterPlanView('all');
    }
}
function showAddMealForm() {
    const name = prompt("Meal Name:");
    if (!name) return;
    const ingredientsString = prompt("Ingredients (comma separated):");
    if (!ingredientsString) return;
    const ingredients = ingredientsString.split(',').map(i => i.trim());
    let totalC = 0;
    ingredients.forEach(ing => {
        const key = ing.toLowerCase();
        const dbKey = Object.keys(ingredientDB).find(k => key.includes(k));
        totalC += dbKey ? ingredientDB[dbKey].c : 50; 
    });
    state.customMeals.push({ name, ingredients, nutrients: `Est: ${totalC} kcal`, calories: totalC, prep: "Custom" });
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
    if(confirm("Factory Reset?")) { localStorage.removeItem('gentlemanAthleteState'); location.reload(); }
}
function openFormGuide(url, event) { event.stopPropagation(); window.open(url, '_blank'); }
function switchTab(tabId) {
    document.querySelectorAll('section').forEach(el => el.style.display = 'none');
    if (tabId === 'dashboard') { renderDashboard(); document.getElementById('dashboard').style.display = 'block'; }
    else if (tabId === 'gym') { renderGym(); document.getElementById('gym').style.display = 'block'; }
    else if (tabId === 'kitchen') { renderKitchen(); document.getElementById('kitchen').style.display = 'block'; }
    else if (tabId === 'planner') { renderPlanner(); document.getElementById('planner-section').style.display = 'block'; }
    else if (tabId === 'settings') { renderSettings(); document.getElementById('settings-section').style.display = 'block'; }
    document.querySelectorAll('.nav-btn').forEach(btn => btn.style.color = 'var(--text-mute)');
}
function triggerSOS() { document.getElementById('sos-modal').classList.remove('hidden'); }
function closeSOS() { document.getElementById('sos-modal').classList.add('hidden'); }
