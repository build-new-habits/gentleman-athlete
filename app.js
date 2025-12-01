// --- DATA STORE ---
const state = {
    credits: 420,
    moneySaved: 24.50,
    level: 1,
    status: {
        hamstringInjured: true, // Default to injured
        energy: 'Fresh' // Fresh, Tired
    },
    rehabStreak: 0, // Need 3 to unlock sprints
    xp: 0
};

// --- EXERCISE DATABASE ---
const activities = [
    {
        id: 'commute_run',
        title: "Football Commute",
        type: 'cardio',
        credits: 150,
        risk: 'medium', // Requires hamstring check
        icon: 'fa-person-running',
        color: 'var(--accent-green)',
        desc: "2.5 Miles. Zone 2 Only."
    },
    {
        id: 'sprint_session',
        title: "Track Sprints",
        type: 'cardio',
        credits: 300,
        risk: 'high', // BLOCKED if injured
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

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateHUD();
    renderActivities();
    // Check local storage for saved data (Advanced step for later)
});

// --- CORE FUNCTIONS ---

function updateHUD() {
    document.getElementById('credit-count').innerText = state.credits;
    document.getElementById('money-saved').innerText = state.moneySaved.toFixed(2);
    
    // Status Toggles Styling
    const hamBtn = document.getElementById('injury-toggle');
    const hamStatus = document.getElementById('hamstring-status');
    if (state.status.hamstringInjured) {
        hamBtn.classList.add('active-warn');
        hamStatus.innerText = "Injured (Rehab Mode)";
    } else {
        hamBtn.classList.remove('active-warn');
        hamStatus.innerText = "Healed (Sprint Ready)";
    }
}

function toggleInjury() {
    state.status.hamstringInjured = !state.status.hamstringInjured;
    updateHUD();
    renderActivities(); // Re-render to lock/unlock sprints
}

function toggleTired() {
    state.status.energy = state.status.energy === 'Fresh' ? 'Tired' : 'Fresh';
    document.getElementById('energy-status').innerText = state.status.energy;
    // In Phase 5 we will change workout recommendations based on this
}

// --- RENDER ENGINE ---

function renderActivities() {
    const feed = document.getElementById('activity-feed');
    feed.innerHTML = ''; // Clear feed

    activities.forEach(act => {
        // LOGIC GATE: Is this safe?
        let isLocked = false;
        let lockReason = "";

        if (act.risk === 'high' && state.status.hamstringInjured) {
            isLocked = true;
            lockReason = "Hamstring Risk";
        }

        // CREATE CARD
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
                </div>
            </div>
        `;
        feed.appendChild(card);
    });
}

// --- INTERACTION ---

function flipCard(cardElement) {
    if (cardElement.classList.contains('locked')) return;
    cardElement.classList.toggle('flipped');
}

function completeActivity(credits, type, event) {
    event.stopPropagation(); // Stop card from flipping back immediately
    
    // Add Credits
    state.credits += credits;
    
    // Logic: If Rehab, build streak
    if (type === 'rehab') {
        state.rehabStreak++;
        if (state.rehabStreak >= 3 && state.status.hamstringInjured) {
            alert("REHAB MILESTONE: You are getting closer to Sprints.");
        }
    }

    updateHUD();
    alert(`+${credits} CR Earned!`);
}

function switchTab(tabId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(el => el.classList.replace('active-section', 'hidden-section'));
    // Show target
    document.getElementById(tabId).classList.replace('hidden-section', 'active-section');
    
    // Update Nav Icons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    // (In a real app, assign IDs to nav buttons to highlight correctly)
}

function triggerSOS() {
    document.getElementById('sos-modal').classList.remove('hidden');
}

function closeSOS() {
    document.getElementById('sos-modal').classList.add('hidden');
}

// --- KITCHEN LOGIC ---
function analyzeFamilyMeal() {
    const input = document.getElementById('family-meal-input').value.toLowerCase();
    const output = document.getElementById('kitchen-advice');
    
    let advice = "";
    
    if (input.includes("pizza") || input.includes("pasta") || input.includes("mash")) {
        advice = `
            <div class="card">
                <div class="card-front" style="border-left: 4px solid orange;">
                    <h3>Carb Heavy Alert</h3>
                    <p>Family is eating heavy. Eat 50% portion.</p>
                    <p><strong>Snack Rec:</strong> Greek Yogurt before bed.</p>
                </div>
            </div>
        `;
    } else {
        advice = `
            <div class="card">
                <div class="card-front" style="border-left: 4px solid var(--accent-green);">
                    <h3>Green Light</h3>
                    <p>This meal fits the macros.</p>
                    <p><strong>Add:</strong> A glass of water.</p>
                </div>
            </div>
        `;
    }
    
    output.innerHTML = advice;
}
