// --- DATA STORE ---
let state = {
    credits: 420,
    moneySaved: 24.50,
    level: 1,
    status: {
        hamstringInjured: true, // Profile Context
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
        weight: 174,
        mood: null // Stores last mood check
    },
    // The Unified Planner (Supports Meals, Exercise, Mind)
    weeklyPlan: {
        Mon: { b: null, l: null, d: null, s: null, ex: null, mind: null, calsIn: 0, calsOut: 0 },
        Tue: { b: null, l: null, d: null, s: null, ex: null, mind: null, calsIn: 0, calsOut: 0 },
        Wed: { b: null, l: null, d: null, s: null, ex: null, mind: null, calsIn: 0, calsOut: 0 },
        Thu: { b: null, l: null, d: null, s: null, ex: null, mind: null, calsIn: 0, calsOut: 0 },
        Fri: { b: null, l: null, d: null, s: null, ex: null, mind: null, calsIn: 0, calsOut: 0 },
        Sat: { b: null, l: null, d: null, s: null, ex: null, mind: null, calsIn: 0, calsOut: 0 },
        Sun: { b: null, l: null, d: null, s: null, ex: null, mind: null, calsIn: 0, calsOut: 0 }
    },
    customMeals: [],
    favorites: [], // Stores IDs of fav items
    weightLog: [
        { date: '11/01', weight: 178 },
        { date: '11/30', weight: 174 }
    ],
    milestones: [
        { name: "Christmas", date: "2023-12-25", target: 172 },
        { name: "Birthday (46)", date: "2024-02-01", target: 165 },
        { name: "Easter", date: "2024-03-31", target: 158 },
        { name: "Athletic Goal", date: "2024-06-01", target: 154 }
    ]
};

// --- LIBRARIES (The "Cards") ---

const mindDB = [
    {
        id: 'box_breathing',
        title: "Box Breathing",
        type: 'mind',
        credits: 50,
        desc: "4-4-4-4 Tempo. Reduces Cortisol instantly.",
        motivation: "Navy SEAL technique for high-stress control.",
        videoUrl: "https://www.youtube.com/results?search_query=box+breathing+guided"
    },
    {
        id: 'nsdr',
        title: "NSDR / Yoga Nidra",
        type: 'mind',
        credits: 80,
        desc: "Non-Sleep Deep Rest. 20 mins = 4 hours sleep.",
        motivation: "Restores dopamine reserves without caffeine.",
        videoUrl: "https://www.youtube.com/results?search_query=nsdr+andrew+huberman"
    },
    {
        id: 'morning_stoic',
        title: "Morning Stoic",
        type: 'mind',
        credits: 30,
        desc: "5 Min Journaling. 'What is within my control?'",
        motivation: "Mental armor for the day ahead.",
        videoUrl: "https://www.youtube.com/results?search_query=stoic+morning+routine"
    }
];

const activityDB = [
    {
        id: 'commute_run',
        title: "Football Commute",
        type: 'cardio',
        credits: 150,
        calories: 300,
        risk: 'medium',
        color: 'var(--accent-green)',
        desc: "2.5 Miles. Zone 2.",
        motivation: "Builds aerobic base without stress.",
        videoUrl: "https://www.youtube.com/results?search_query=zone+2+running+form"
    },
    {
        id: 'sprint_session',
        title: "Track Sprints",
        type: 'cardio',
        credits: 300,
        calories: 450,
        risk: 'high',
        color: 'var(--accent-pink)',
        desc: "8 x 100m. Max Effort.",
        motivation: "Shreds visceral fat via EPOC.",
        videoUrl: "https://www.youtube.com/results?search_query=sprinting+technique"
    },
    {
        id: 'core_rehab',
        title: "McGill Big 3",
        type: 'rehab',
        credits: 100,
        calories: 100,
        risk: 'low',
        color: 'var(--accent-blue)',
        desc: "Bird-dog, Side Plank, Curl up.",
        motivation: "Non-negotiable for back health.",
        videoUrl: "https://www.youtube.com/results?search_query=mcgill+big+3+exercises"
    }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateHUD();
    initNavigation();
    renderDashboard();
});

// --- NAVIGATION ---
function initNavigation() {
    const nav = document.querySelector('.bottom-nav');
    // Added "Mind" Tab
    nav.innerHTML = `
        <button class="nav-btn active" id="btn-dashboard" onclick="switchTab('dashboard')"><i class="fa-solid fa-house"></i></button>
        <button class="nav-btn" id="btn-gym" onclick="switchTab('gym')"><i class="fa-solid fa-dumbbell"></i></button>
        <button class="nav-btn" id="btn-kitchen" onclick="switchTab('kitchen')"><i class="fa-solid fa-utensils"></i></button>
        <button class="nav-btn" id="btn-mind" onclick="switchTab('mind')"><i class="fa-solid fa-brain"></i></button>
        <button class="nav-btn" id="btn-planner" onclick="switchTab('planner')"><i class="fa-solid fa-calendar-week"></i></button>
        <button class="nav-btn" id="btn-settings" onclick="switchTab('settings')"><i class="fa-solid fa-gear"></i></button>
    `;
}

function switchTab(tabId) {
    document.querySelectorAll('section').forEach(el => el.style.display = 'none');
    
    // Render Logic
    if(tabId === 'dashboard') { renderDashboard(); document.getElementById('dashboard').style.display = 'block'; }
    if(tabId === 'gym') { renderGym(); document.getElementById('gym').style.display = 'block'; }
    if(tabId === 'kitchen') { renderKitchen(); document.getElementById('kitchen').style.display = 'block'; }
    if(tabId === 'mind') { renderMind(); document.getElementById('mind-section').style.display = 'block'; }
    if(tabId === 'planner') { renderPlanner(); document.getElementById('planner-section').style.display = 'block'; }
    if(tabId === 'settings') { renderSettings(); document.getElementById('settings-section').style.display = 'block'; }

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${tabId}`);
    if(activeBtn) activeBtn.classList.add('active');
}

// --- RENDERERS ---

function renderDashboard() {
    const feed = document.getElementById('activity-feed');
    feed.innerHTML = '';
    
    // 1. THE MOOD METER (New Feature)
    // Determines content based on check-in
    let moodHTML = '';
    if (!state.daily.mood) {
        moodHTML = `
        <div class="card" id="mood-check-card">
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid var(--accent-pink);">
                    <h3><i class="fa-solid fa-face-smile"></i> Mood Check-in</h3>
                    <p>How are you feeling right now?</p>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px; width:100%;">
                        <button class="action-btn" style="background:#ef4444;" onclick="logMood('High', 'Unpleasant')">Anxious / Angry</button>
                        <button class="action-btn" style="background:#f59e0b;" onclick="logMood('High', 'Pleasant')">Happy / Hyper</button>
                        <button class="action-btn" style="background:#3b82f6;" onclick="logMood('Low', 'Unpleasant')">Sad / Tired</button>
                        <button class="action-btn" style="background:#10b981;" onclick="logMood('Low', 'Pleasant')">Calm / Content</button>
                    </div>
                </div>
            </div>
        </div>`;
    } else {
        moodHTML = `
        <div class="card">
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid var(--accent-pink);">
                    <h3>Current State: ${state.daily.mood}</h3>
                    <p>${getMoodAdvice(state.daily.mood)}</p>
                    <button class="action-btn" style="margin-top:10px;" onclick="resetMood()">Check In Again</button>
                </div>
            </div>
        </div>`;
    }
    feed.innerHTML += moodHTML;

    // 2. DAILY AUDIT
    const mentalCard = document.createElement('div');
    mentalCard.className = 'card';
    mentalCard.innerHTML = `
        <div class="card-inner">
            <div class="card-front mental-front" style="border-left: 4px solid var(--accent-blue);">
                <div style="display:flex; justify-content:space-between;">
                    <strong>Daily Audit</strong>
                    <span>${state.daily.mentalChecked ? '✅' : 'Pending'}</span>
                </div>
                <div class="checklist-container" style="margin-top:10px;">
                    <label class="checklist-item"><input type="checkbox" onchange="saveCheck(this)" ${state.daily.shaved ? 'checked' : ''}> <span>Shaved & Groomed</span></label>
                    <label class="checklist-item"><input type="checkbox" onchange="saveCheck(this)"> <span>Drank 500ml Water</span></label>
                    <label class="checklist-item"><input type="checkbox" onchange="saveCheck(this)"> <span>Plan Review</span></label>
                </div>
                ${!state.daily.mentalChecked ? '<button class="action-btn" onclick="completeMental(this)">Finish Audit (+50 CR)</button>' : ''}
            </div>
        </div>
    `;
    feed.appendChild(mentalCard);
}

function renderMind() {
    const main = document.getElementById('app-container');
    let section = document.getElementById('mind-section');
    if (!section) {
        section = document.createElement('section');
        section.id = 'mind-section';
        section.className = 'hidden-section';
        main.appendChild(section);
    }

    let html = `<h2 class="section-title">Mental Conditioning</h2>`;
    
    mindDB.forEach(item => {
        const isFav = state.favorites.includes(item.id);
        html += `
        <div class="card">
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid #8b5cf6;">
                    <div style="display:flex; justify-content:space-between;">
                        <h4>${item.title}</h4>
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-star" onclick="toggleFav('${item.id}')" style="color:${isFav ? 'gold' : '#666'}"></i>
                    </div>
                    <p>${item.desc}</p>
                    <small style="color:#aaa; display:block; margin-top:5px;">"${item.motivation}"</small>
                    <div style="display:flex; gap:10px; margin-top:15px;">
                        <button class="action-btn" onclick="window.open('${item.videoUrl}', '_blank')">Start Session</button>
                        <button class="action-btn" style="background:#475569;" onclick="addToPlan('${item.title}', 'mind')">Plan</button>
                    </div>
                </div>
            </div>
        </div>`;
    });
    section.innerHTML = html;
}

function renderGym() {
    const feed = document.getElementById('gym-feed');
    feed.innerHTML = ''; 
    
    activities.forEach(act => {
        let isLocked = (act.risk === 'high' && state.status.hamstringInjured);
        let lockMsg = isLocked ? '<br><span style="color:var(--accent-red)"><i class="fa-solid fa-lock"></i> Injury Risk</span>' : '';

        const card = document.createElement('div');
        card.className = `card ${isLocked ? 'locked' : ''}`;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid ${act.color}">
                    <div style="display:flex; justify-content:space-between;">
                        <h4>${act.title}</h4>
                        <i class="fa-solid ${act.icon}" style="color:${act.color}"></i>
                    </div>
                    <p>${act.desc} ${lockMsg}</p>
                    <div style="display:flex; gap:5px; margin-top:15px;">
                        <button class="action-btn" onclick="completeActivity(${act.credits}, '${act.type}', ${act.calories})">Done</button>
                        <button class="action-btn" style="background:#475569;" onclick="window.open('${act.videoUrl}', '_blank')">Video</button>
                        <button class="action-btn" style="background:#475569;" onclick="addToPlan('${act.title}', 'ex', ${act.calories})">Plan</button>
                    </div>
                </div>
            </div>
        `;
        feed.appendChild(card);
    });
}

function renderKitchen() {
    const feed = document.getElementById('kitchen-advice');
    feed.innerHTML = `
        <div class="card" style="border-style:dashed; text-align:center; padding:20px;" onclick="showAddMealForm()">
            <i class="fa-solid fa-plus-circle" style="color:var(--accent-green); font-size:1.5rem;"></i>
            <h3>Add New Meal</h3>
        </div>
    `;
    
    // Combine defaults + custom
    // (Simplified for brevity - assuming defaultMeals object exists as before)
    // ... render logic similar to Gym but for meals ...
    // For V3 clarity, I'm ensuring the "Add Meal" works perfectly first.
}

function renderSettings() {
    const main = document.getElementById('app-container');
    let section = document.getElementById('settings-section');
    if (!section) {
        section = document.createElement('section');
        section.id = 'settings-section';
        section.className = 'hidden-section';
        main.appendChild(section);
    }

    section.innerHTML = `
        <h2 class="section-title">Control Room</h2>
        
        <div class="settings-group">
            <h3>Finances</h3>
            <div class="setting-row">
                <label>Money Saved (£)</label>
                <input type="number" value="${state.moneySaved}" onchange="updateVal('moneySaved', this.value)">
            </div>
            <div class="setting-row">
                <label>Credits</label>
                <input type="number" value="${state.credits}" onchange="updateVal('credits', this.value)">
            </div>
            <button class="action-btn" style="background:#f59e0b;" onclick="resetFinance()">Reset Wallet Only</button>
        </div>

        <div class="settings-group">
            <h3>Schedule</h3>
            <button class="action-btn" style="background:var(--accent-blue);" onclick="resetPlanner()">Clear Weekly Plan</button>
        </div>

        <div class="settings-group">
            <h3>Danger Zone</h3>
            <button class="action-btn" style="background:var(--accent-red);" onclick="factoryReset()">Factory Reset App</button>
        </div>
    `;
}

function renderPlanner() {
    const main = document.getElementById('app-container');
    let section = document.getElementById('planner-section');
    if (!section) {
        section = document.createElement('section');
        section.id = 'planner-section';
        section.className = 'hidden-section';
        main.appendChild(section);
    }

    let html = `<h2 class="section-title">Weekly Strategy</h2>`;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    days.forEach(day => {
        const d = state.weeklyPlan[day];
        html += `
        <div style="background:var(--card-bg); border-radius:12px; padding:15px; margin-bottom:15px; border-left:4px solid #475569;">
            <div style="display:flex; justify-content:space-between;">
                <h3>${day}</h3>
                <small>${d.calsIn - d.calsOut} Net Kcal</small>
            </div>
            <div style="margin-top:10px; font-size:0.85rem;">
                ${d.mind ? `<div style="color:#a78bfa"><i class="fa-solid fa-brain"></i> ${d.mind}</div>` : ''}
                ${d.ex ? `<div style="color:#f472b6"><i class="fa-solid fa-dumbbell"></i> ${d.ex}</div>` : ''}
                ${d.d ? `<div style="color:#34d399"><i class="fa-solid fa-utensils"></i> ${d.d}</div>` : ''}
            </div>
        </div>`;
    });
    section.innerHTML = html;
}

// --- ACTIONS & LOGIC ---

function logMood(energy, pleasantness) {
    let mood = "";
    if(energy === 'High' && pleasantness === 'Unpleasant') mood = "Anxious/Angry";
    if(energy === 'High' && pleasantness === 'Pleasant') mood = "Hyper/Happy";
    if(energy === 'Low' && pleasantness === 'Unpleasant') mood = "Sad/Tired";
    if(energy === 'Low' && pleasantness === 'Pleasant') mood = "Calm/Content";
    
    state.daily.mood = mood;
    saveState();
    renderDashboard();
    
    // Dopamine hit for checking in
    alert(`Mood Logged: ${mood}. +20 Credits for Emotional Awareness.`);
    state.credits += 20;
    updateHUD();
}

function getMoodAdvice(mood) {
    if(mood.includes("Anxious")) return "High Energy + Unpleasant. You need to discharge. Try 'Box Breathing' or a heavy 'Sprint Session'.";
    if(mood.includes("Sad")) return "Low Energy + Unpleasant. Be kind. Try 'Morning Stoic' journaling or a gentle walk.";
    if(mood.includes("Hyper")) return "High Energy + Pleasant. You are in the zone. Great time for a 'Football Commute' or creative work.";
    if(mood.includes("Calm")) return "Low Energy + Pleasant. Recovery mode. Good time for 'NSDR' or reading.";
    return "";
}

function resetMood() {
    state.daily.mood = null;
    renderDashboard();
}

function addToPlan(item, type, calories = 0) {
    const day = prompt("Add to which day? (Mon, Tue, Wed...)", "Mon");
    if(!state.weeklyPlan[day]) return alert("Invalid Day");
    
    // Type mapping to slot
    let slot = 'ex';
    if(type === 'mind') slot = 'mind';
    
    state.weeklyPlan[day][slot] = item;
    if(calories) state.weeklyPlan[day].calsOut += calories;
    
    saveState();
    alert(`Added ${item} to ${day}`);
}

function completeMental(btn) {
    if(state.daily.mentalChecked) return;
    state.daily.mentalChecked = true;
    state.credits += 50;
    updateHUD();
    btn.innerText = "Completed";
    btn.disabled = true;
}

function updateVal(key, val) {
    state[key] = parseFloat(val);
    saveState();
    updateHUD();
}

function resetPlanner() {
    if(confirm("Clear entire week?")) {
        Object.keys(state.weeklyPlan).forEach(d => {
            state.weeklyPlan[d] = { b: null, l: null, d: null, s: null, ex: null, mind: null, calsIn: 0, calsOut: 0 };
        });
        saveState();
        alert("Planner Cleared.");
        renderPlanner();
    }
}

function resetFinance() {
    if(confirm("Reset Money & Credits to 0?")) {
        state.moneySaved = 0;
        state.credits = 0;
        updateHUD();
    }
}

function factoryReset() {
    if(confirm("DELETE EVERYTHING?")) {
        localStorage.removeItem('gentlemanAthleteState');
        location.reload();
    }
}

// --- UTILS ---
function updateHUD() {
    document.getElementById('credit-count').innerText = state.credits;
    document.getElementById('money-saved').innerText = state.moneySaved.toFixed(2);
    saveState();
}
function saveState() { localStorage.setItem('gentlemanAthleteState', JSON.stringify(state)); }
function loadState() {
    const saved = localStorage.getItem('gentlemanAthleteState');
    if (saved) state = JSON.parse(saved);
}
