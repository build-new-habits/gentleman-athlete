// --- DATA STORE ---
let state = {
    credits: 420,
    moneySaved: 24.50,
    level: 1,
    status: {
        hamstringInjured: true, // Default to injured
        energy: 'Fresh' // Fresh, Tired
    },
    rehabStreak: 0, // Need 3 to unlock sprints
    xp: 0,
    daily: {
        mentalChecked: false,
        shaved: false
    }
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

// --- MEAL DATABASE ---
const mealDatabase = [
    {
        keywords: ["pizza", "burger", "takeaway", "chips"],
        type: "heavy",
        advice: "Carb Heavy. Eat 50% now. Save rest for post-workout.",
        snack: "Greek Yogurt (Casein) before bed.",
        color: "orange"
    },
    {
        keywords: ["salmon", "tuna", "fish", "sushi", "prawn"],
        type: "lean",
        advice: "Perfect Pescatarian Fuel. High Protein/Omega-3.",
        snack: "Dark Chocolate square (Reward).",
        color: "var(--accent-green)"
    },
    {
        keywords: ["pasta", "spaghetti", "lasagna", "mash", "potato"],
        type: "carb_load",
        advice: "Good for tomorrow's run. Watch portion size tonight.",
        snack: "Glass of water.",
        color: "var(--accent-blue)"
    },
    {
        keywords: ["salad", "soup", "stew", "veg"],
        type: "light",
        advice: "Light fuel. You might get hungry later.",
        snack: "Handful of nuts or Toast.",
        color: "var(--accent-green)"
    }
];

// --- TREAT DATABASE (The Dopamine Shop) ---
const treatDatabase = [
    {
        id: 'espresso_home',
        title: "Home Brew",
        cost: -20, // Negative cost means you EARN credits
        moneyValue: 3.40, // Money saved
        icon: 'fa-mug-hot',
        desc: "Barista skills. Save £3.40."
    },
    {
        id: 'wine_glass',
        title: "Fine Wine (Glass)",
        cost: 150,
        moneyValue: 0,
        icon: 'fa-wine-glass',
        desc: "Friday/Saturday Only. Enjoy it."
    },
    {
        id: 'mince_pie',
        title: "Mince Pie",
        cost: 200,
        moneyValue: 0,
        icon: 'fa-cookie-bite',
        desc: "Seasonal Fuel. Earn it first."
    },
    {
        id: 'negroni',
        title: "Negroni",
        cost: 300,
        moneyValue: 0,
        icon: 'fa-cocktail',
        desc: "The Gentleman's Drink. High cost."
    }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadState(); // Load data from local storage
    updateHUD();
    renderActivities();
    renderShop();
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
    
    saveState(); // Auto-save on every update
}

function toggleInjury() {
    state.status.hamstringInjured = !state.status.hamstringInjured;
    updateHUD();
    renderActivities(); // Re-render to lock/unlock sprints
}

function toggleTired() {
    state.status.energy = state.status.energy === 'Fresh' ? 'Tired' : 'Fresh';
    document.getElementById('energy-status').innerText = state.status.energy;
}

// --- PERSISTENCE (Save/Load) ---
function saveState() {
    localStorage.setItem('gentlemanAthleteState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('gentlemanAthleteState');
    if (saved) {
        state = JSON.parse(saved);
    }
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

function renderShop() {
    const shopContainer = document.getElementById('treat-shop');
    if (!shopContainer) return;
    
    shopContainer.innerHTML = '<h3 class="section-title" style="margin-top:20px;">The Store</h3>';
    
    treatDatabase.forEach(item => {
        const canAfford = state.credits >= item.cost;
        const isEarner = item.cost < 0; // Negative cost means you earn credits (Home Brew)
        
        const card = document.createElement('div');
        card.className = 'card';
        card.style.height = '120px'; // Slightly smaller for shop items
        card.setAttribute('onclick', 'flipCard(this)');
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="border-left: 4px solid ${isEarner ? 'var(--accent-green)' : 'var(--accent-pink)'}">
                    <i class="fa-solid ${item.icon}" style="font-size: 1.5rem; margin-bottom: 5px;"></i>
                    <h4>${item.title}</h4>
                    <p style="font-size:0.8rem">${item.desc}</p>
                </div>
                <div class="card-back">
                    <p>${isEarner ? 'EARN' : 'COST'}: ${Math.abs(item.cost)} CR</p>
                    ${item.moneyValue > 0 ? `<p style="color:var(--accent-green)">SAVES: £${item.moneyValue.toFixed(2)}</p>` : ''}
                    <button class="action-btn" onclick="buyTreat(${item.cost}, ${item.moneyValue}, '${item.title}', event)">
                        ${isEarner ? 'Brew & Bank' : 'Purchase'}
                    </button>
                </div>
            </div>
        `;
        shopContainer.appendChild(card);
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

function buyTreat(cost, moneySaved, title, event) {
    event.stopPropagation();
    
    // Check affordability
    if (cost > 0 && state.credits < cost) {
        alert("INSUFFICIENT FUNDS: Go for a run first.");
        return;
    }
    
    // Transaction
    state.credits -= cost; // If cost is negative (earning), this adds credits
    if (moneySaved > 0) {
        state.moneySaved += moneySaved;
    }
    
    updateHUD();
    
    // Feedback
    if (cost < 0) {
        alert(`Good choice. £${moneySaved.toFixed(2)} banked and credits earned.`);
    } else {
        alert(`${title} Purchased. Enjoy it, you earned it.`);
    }
    
    // Flip card back
    const card = event.target.closest('.card');
    card.classList.remove('flipped');
}

// --- MENTAL HEALTH LOGIC ---
function completeMental(event) {
    event.stopPropagation();
    
    if (state.daily.mentalChecked) {
        alert("You've already checked in today, Gentleman.");
        return;
    }

    // Get Checkbox values
    const checkboxes = document.querySelectorAll('.mental-back input[type="checkbox"]');
    let ticks = 0;
    checkboxes.forEach(box => {
        if (box.checked) ticks++;
    });

    // Calculate Reward
    const reward = ticks * 20; // 20 credits per tick
    state.credits += reward;
    state.daily.mentalChecked = true;

    // Flip card back and lock it visually
    const card = event.target.closest('.card');
    card.classList.remove('flipped');
    card.style.opacity = "0.5";
    card.style.pointerEvents = "none";

    updateHUD();
    alert(`Morning Audit Complete. +${reward} Credits added.`);
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
    
    // Default Fallback
    let match = {
        advice: "Standard Meal. Enjoy.",
        snack: "None needed.",
        color: "var(--text-mute)",
        title: "Meal Logged"
    };

    // Database Search
    for (let meal of mealDatabase) {
        if (meal.keywords.some(k => input.includes(k))) {
            match = {
                title: meal.type.toUpperCase() + " DETECTED",
                advice: meal.advice,
                snack: meal.snack,
                color: meal.color
            };
            break; 
        }
    }
    
    const html = `
        <div class="card">
            <div class="card-front" style="border-left: 4px solid ${match.color};">
                <h3>${match.title}</h3>
                <p>${match.advice}</p>
                <div style="margin-top:10px; padding-top:10px; border-top:1px solid #333;">
                    <p style="font-size:0.8rem; color:#888;">RECOMMENDED ADDITION:</p>
                    <p><strong>${match.snack}</strong></p>
                </div>
            </div>
        </div>
    `;
    
    output.innerHTML = html;
}
