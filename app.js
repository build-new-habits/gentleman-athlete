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
        startWeight: 178, 
        goalWeight: 154 
    },
    daily: {
        mentalChecked: false,
        shaved: false,
        caloriesIn: 0,
        caloriesOut: 0,
        weight: 174 
    },
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
        { date: '11/01', weight: 178 },
        { date: '11/15', weight: 176 },
        { date: '11/30', weight: 174 }
    ],
    milestones: [
        { name: "Christmas", date: "2023-12-25", target: 172 },
        { name: "Birthday", date: "2024-02-01", target: 165 },
        { name: "Easter", date: "2024-03-31", target: 158 },
        { name: "Goal", date: "2024-06-01", target: 154 }
    ]
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateHUD();
    initNavigation();
    renderDashboard(); // Default View
});

// --- NAVIGATION ---
function initNavigation() {
    const nav = document.querySelector('.bottom-nav');
    nav.innerHTML = `
        <button class="nav-btn active" id="btn-dashboard" onclick="switchTab('dashboard')"><i class="fa-solid fa-house"></i></button>
        <button class="nav-btn" id="btn-gym" onclick="switchTab('gym')"><i class="fa-solid fa-dumbbell"></i></button>
        <button class="nav-btn" id="btn-kitchen" onclick="switchTab('kitchen')"><i class="fa-solid fa-utensils"></i></button>
        <button class="nav-btn" id="btn-planner" onclick="switchTab('planner')"><i class="fa-solid fa-calendar-week"></i></button>
        <button class="nav-btn" id="btn-settings" onclick="switchTab('settings')"><i class="fa-solid fa-gear"></i></button>
    `;
}

function switchTab(tabId) {
    // 1. Hide all sections
    document.querySelectorAll('section').forEach(el => el.style.display = 'none');
    
    // 2. Render target section
    if(tabId === 'dashboard') { renderDashboard(); document.getElementById('dashboard').style.display = 'block'; }
    if(tabId === 'gym') { renderGym(); document.getElementById('gym').style.display = 'block'; }
    if(tabId === 'kitchen') { renderKitchen(); document.getElementById('kitchen').style.display = 'block'; }
    if(tabId === 'planner') { renderPlanner(); document.getElementById('planner-section').style.display = 'block'; }
    if(tabId === 'settings') { renderSettings(); document.getElementById('settings-section').style.display = 'block'; }

    // 3. Update Nav Active State
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${tabId}`);
    if(activeBtn) activeBtn.classList.add('active');
}

// --- RENDERERS ---

function renderDashboard() {
    const feed = document.getElementById('activity-feed');
    feed.innerHTML = '';
    
    // Mental Health Card (Fixed Height)
    const mentalCard = document.createElement('div');
    mentalCard.className = 'card';
    mentalCard.setAttribute('onclick', 'flipCard(this)');
    mentalCard.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="border-left: 4px solid var(--accent-blue);">
                <i class="fa-solid fa-brain" style="font-size:2rem; margin-bottom:10px;"></i>
                <h3>Morning Protocol</h3>
                <p>Start the day right.</p>
                ${state.daily.mentalChecked ? '<span style="color:var(--accent-green); font-weight:bold; margin-top:5px;">COMPLETED</span>' : ''}
            </div>
            <div class="card-back">
                <h3 style="margin-bottom:10px;">The Audit</h3>
                <div class="checklist-container" onclick="event.stopPropagation()">
                    <label class="checklist-item"><input type="checkbox"> <span>Shaved / Groomed</span></label>
                    <label class="checklist-item"><input type="checkbox"> <span>Drank Water</span></label>
                    <label class="checklist-item"><input type="checkbox"> <span>Plan Defined</span></label>
                </div>
                <button class="action-btn" onclick="completeMental(event)">Complete (+50 CR)</button>
            </div>
        </div>
    `;
    feed.appendChild(mentalCard);

    // Weight/Calorie Card
    const deficit = state.settings.calorieTarget - (state.daily.caloriesIn - state.daily.caloriesOut);
    const deficitCard = document.createElement('div');
    deficitCard.className = 'card';
    deficitCard.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="border-left: 4px solid var(--accent-green);">
                <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:10px;">
                    <span><i class="fa-solid fa-bullseye"></i> Goal: ${state.settings.goalWeight}</span>
                    <span><i class="fa-solid fa-weight-scale"></i> ${state.daily.weight} lbs</span>
                </div>
                <h3>${deficit} kcal left</h3>
                <div class="graph-wrapper">
                     ${generateGraphBars()}
                </div>
            </div>
        </div>
    `;
    feed.appendChild(deficitCard);
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
    
    // THIS IS THE NEW FORM (No Flipping)
    setSection.innerHTML = `
        <h2 class="section-title">Settings & Data</h2>
        
        <div class="settings-group">
            <div class="setting-row">
                <label>Current Weight (lbs)</label>
                <input type="number" id="input-weight" value="${state.daily.weight}" onchange="updateSetting('weight', this.value)">
            </div>
            <div class="setting-group">
                <label>Goal Weight (lbs)</label>
                <input type="number" id="input-goal" value="${state.settings.goalWeight}" onchange="updateSetting('goal', this.value)">
            </div>
        </div>

        <div class="settings-group">
            <div class="setting-row">
                <label>Calorie Target</label>
                <input type="number" id="input-cals" value="${state.settings.calorieTarget}" onchange="updateSetting('cals', this.value)">
            </div>
            <div class="setting-row">
                <label>Start Weight (for graph scale)</label>
                <input type="number" id="input-start" value="${state.settings.startWeight}" onchange="updateSetting('start', this.value)">
            </div>
        </div>

        <button class="action-btn" style="background:var(--accent-red); margin-top:20px;" onclick="resetData(event)">Factory Reset App</button>
        <p style="text-align:center; color:#444; margin-top:20px; font-size:0.7rem;">Gentleman Athlete v2.1</p>
    `;
}

// --- LOGIC HELPERS ---

function updateSetting(key, value) {
    if(key === 'weight') {
        state.daily.weight = parseFloat(value);
        state.weightLog.push({date: new Date().toLocaleDateString(), weight: parseFloat(value)});
    }
    if(key === 'goal') state.settings.goalWeight = parseFloat(value);
    if(key === 'cals') state.settings.calorieTarget = parseFloat(value);
    if(key === 'start') state.settings.startWeight = parseFloat(value);
    
    saveState();
    alert("Saved.");
}

function generateGraphBars() {
    // Generate simple HTML bars
    let html = '';
    const logs = state.weightLog.slice(-7); // Last 7 entries
    logs.forEach(log => {
        // Calculate height percentage based on start/goal range
        const range = state.settings.startWeight - state.settings.goalWeight;
        const current = log.weight - state.settings.goalWeight;
        let percent = (current / range) * 100;
        if(percent < 10) percent = 10; // Min height
        if(percent > 100) percent = 100;

        html += `
            <div class="graph-bar" style="height:${percent}%;">
                <span class="graph-label">${log.weight}</span>
            </div>
        `;
    });
    return html;
}

// --- CORE UTILS ---
function updateHUD() {
    document.getElementById('credit-count').innerText = state.credits;
    document.getElementById('money-saved').innerText = state.moneySaved.toFixed(2);
    
    const hamBtn = document.getElementById('injury-toggle');
    const hamStatus = document.getElementById('hamstring-status');
    if (state.status.hamstringInjured) {
        hamBtn.classList.add('active-warn');
        hamStatus.innerText = "Injured";
    } else {
        hamBtn.classList.remove('active-warn');
        hamStatus.innerText = "Healed";
    }
    saveState();
}

function toggleInjury() {
    state.status.hamstringInjured = !state.status.hamstringInjured;
    updateHUD();
    const activeSection = document.querySelector('section[style*="block"]'); // Find visible
    if(activeSection && activeSection.id === 'gym') renderGym(); 
}

function toggleTired() {
    state.status.energy = state.status.energy === 'Fresh' ? 'Tired' : 'Fresh';
    document.getElementById('energy-status').innerText = state.status.energy;
}

function saveState() { localStorage.setItem('gentlemanAthleteState', JSON.stringify(state)); }
function loadState() {
    const saved = localStorage.getItem('gentlemanAthleteState');
    if (saved) state = JSON.parse(saved);
}

function flipCard(cardElement) {
    if (cardElement.classList.contains('locked')) return;
    cardElement.classList.toggle('flipped');
}

function completeMental(event) {
    event.stopPropagation();
    if (state.daily.mentalChecked) return;
    state.credits += 50;
    state.daily.mentalChecked = true;
    updateHUD();
    const card = event.target.closest('.card');
    card.classList.remove('flipped');
    renderDashboard(); // Re-render to show COMPLETED badge
}

function resetData(event) {
    if(confirm("Delete all data and start over?")) {
        localStorage.removeItem('gentlemanAthleteState');
        location.reload();
    }
}

// Placeholders for other renderers (Gym, Kitchen, Planner) 
// Ensure you keep your existing renderGym, renderKitchen, renderPlanner functions in the file! 
// Just ensure they use the new HTML structure if creating cards.
// If you need the full file again with ALL functions included, let me know.
// For brevity, I've focused on the broken parts (Dashboard, Settings, Nav).
