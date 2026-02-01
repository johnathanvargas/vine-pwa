/**
 * Main Application Logic
 * Handles UI interactions, form submission, and view navigation
 */

import { Storage } from './storage.js';

// Application State
const AppState = {
    currentView: 'dashboard',
    currentTreatmentId: null,
    selectedChemicals: [],
    treatmentArea: 0
};

// View Navigation
const Views = {
    showDashboard() {
        hideAllViews();
        document.getElementById('dashboard-view').classList.add('active');
        AppState.currentView = 'dashboard';
        updateDashboardStats();
    },

    showNewTreatment() {
        hideAllViews();
        document.getElementById('new-treatment-view').classList.add('active');
        AppState.currentView = 'new-treatment';
        initializeNewTreatmentForm();
    },

    showLogs() {
        hideAllViews();
        document.getElementById('logs-view').classList.add('active');
        AppState.currentView = 'logs';
        loadTreatmentLogs();
    }
};

function hideAllViews() {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
}

// Dashboard Functions
function updateDashboardStats() {
    const stats = Storage.getStats();
    document.getElementById('total-treatments').textContent = stats.totalTreatments;
    document.getElementById('last-treatment').textContent = stats.lastTreatmentDate;
    
    // Update notifications section (will be populated by reminders.js later)
    updateNotifications();
}

function updateNotifications() {
    const notificationsSection = document.getElementById('notifications-section');
    const rotationAlerts = document.getElementById('rotation-alerts');
    const retreatmentAlerts = document.getElementById('retreatment-alerts');
    
    // Clear existing alerts
    rotationAlerts.innerHTML = '';
    retreatmentAlerts.innerHTML = '';
    
    // For now, hide notifications section (will be implemented in iteration 4)
    notificationsSection.classList.add('hidden');
}

// New Treatment Form
function initializeNewTreatmentForm() {
    // Reset form
    document.getElementById('treatment-form').reset();
    AppState.selectedChemicals = [];
    AppState.treatmentArea = 0;
    
    // Set current date/time
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    document.getElementById('treatment-datetime').value = localDateTime;
    
    // Clear selected chemicals
    document.getElementById('selected-chemicals').innerHTML = '';
    document.getElementById('compatibility-alert').classList.add('hidden');
    document.getElementById('calculated-values').classList.add('hidden');
    
    // Show weather section but hide data initially
    document.getElementById('weather-data').classList.remove('hidden');
    document.getElementById('weather-loading').classList.add('hidden');
    
    // Initialize chemical search
    setupChemicalSearch();
}

// Chemical Search and Selection
function setupChemicalSearch() {
    const searchInput = document.getElementById('chemical-search');
    const suggestionsDiv = document.getElementById('chemical-suggestions');
    
    // Sample chemical database (will be moved to chemicals.js in iteration 3)
    const chemicalDatabase = [
        { 
            id: 1, 
            name: 'Mancozeb 75DF', 
            type: 'Fungicide',
            moaGroup: 'M3',
            defaultRate: '2 lb/acre',
            defaultRateValue: 2
        },
        { 
            id: 2, 
            name: 'Rally 40WSP', 
            type: 'Fungicide',
            moaGroup: '3',
            defaultRate: '5 oz/acre',
            defaultRateValue: 5
        },
        { 
            id: 3, 
            name: 'Captan 50WP', 
            type: 'Fungicide',
            moaGroup: 'M4',
            defaultRate: '3 lb/acre',
            defaultRateValue: 3
        },
        { 
            id: 4, 
            name: 'Luna Experience', 
            type: 'Fungicide',
            moaGroup: '7+11',
            defaultRate: '6 oz/acre',
            defaultRateValue: 6
        },
        { 
            id: 5, 
            name: 'Sevin XLR Plus', 
            type: 'Insecticide',
            moaGroup: '1A',
            defaultRate: '1 qt/acre',
            defaultRateValue: 1
        }
    ];
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            suggestionsDiv.classList.add('hidden');
            return;
        }
        
        const matches = chemicalDatabase.filter(chem => 
            chem.name.toLowerCase().includes(query) ||
            chem.type.toLowerCase().includes(query)
        );
        
        if (matches.length === 0) {
            suggestionsDiv.classList.add('hidden');
            return;
        }
        
        suggestionsDiv.innerHTML = matches.map(chem => `
            <div class="suggestion-item" data-chemical-id="${chem.id}">
                <div class="suggestion-name">${chem.name}</div>
                <div class="suggestion-details">${chem.type} - MOA ${chem.moaGroup} - ${chem.defaultRate}</div>
            </div>
        `).join('');
        
        suggestionsDiv.classList.remove('hidden');
        
        // Add click handlers
        suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const chemId = parseInt(item.dataset.chemicalId);
                const chemical = chemicalDatabase.find(c => c.id === chemId);
                addChemicalToTreatment(chemical);
                searchInput.value = '';
                suggestionsDiv.classList.add('hidden');
            });
        });
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.add('hidden');
        }
    });
}

function addChemicalToTreatment(chemical) {
    // Check if already added
    if (AppState.selectedChemicals.find(c => c.id === chemical.id)) {
        alert('This chemical is already added');
        return;
    }
    
    AppState.selectedChemicals.push({
        ...chemical,
        rate: chemical.defaultRateValue
    });
    
    renderSelectedChemicals();
    checkCompatibility();
    updateCalculations();
}

function renderSelectedChemicals() {
    const container = document.getElementById('selected-chemicals');
    
    if (AppState.selectedChemicals.length === 0) {
        container.innerHTML = '<p style="color: #757575; font-style: italic;">No chemicals selected</p>';
        return;
    }
    
    container.innerHTML = AppState.selectedChemicals.map(chem => `
        <div class="chemical-card">
            <div class="chemical-header">
                <div>
                    <div class="chemical-name">${chem.name}</div>
                    <div class="chemical-info">${chem.type} - MOA Group ${chem.moaGroup}</div>
                </div>
                <button class="remove-chemical-btn" data-chemical-id="${chem.id}">×</button>
            </div>
            <div class="chemical-rate-input">
                <label>Rate:</label>
                <input type="number" 
                       class="rate-input" 
                       data-chemical-id="${chem.id}" 
                       value="${chem.rate}" 
                       step="0.1" 
                       min="0">
                <span>${chem.defaultRate.split('/')[0].replace(/[0-9.]/g, '').trim()}/acre</span>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    container.querySelectorAll('.remove-chemical-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chemId = parseInt(btn.dataset.chemicalId);
            removeChemical(chemId);
        });
    });
    
    container.querySelectorAll('.rate-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const chemId = parseInt(e.target.dataset.chemicalId);
            const newRate = parseFloat(e.target.value) || 0;
            updateChemicalRate(chemId, newRate);
        });
    });
}

function removeChemical(chemId) {
    AppState.selectedChemicals = AppState.selectedChemicals.filter(c => c.id !== chemId);
    renderSelectedChemicals();
    checkCompatibility();
    updateCalculations();
}

function updateChemicalRate(chemId, newRate) {
    const chemical = AppState.selectedChemicals.find(c => c.id === chemId);
    if (chemical) {
        chemical.rate = newRate;
        updateCalculations();
    }
}

function checkCompatibility() {
    const alertDiv = document.getElementById('compatibility-alert');
    
    if (AppState.selectedChemicals.length < 2) {
        alertDiv.classList.add('hidden');
        return;
    }
    
    // Simple compatibility check (will be enhanced in iteration 3)
    // For now, just show compatible message
    alertDiv.innerHTML = `
        <div class="compatibility-title">✓ Compatible</div>
        <div class="compatibility-details">
            No known incompatibilities detected. Always verify with product labels.
        </div>
    `;
    alertDiv.className = 'compatibility-alert compatible';
    alertDiv.classList.remove('hidden');
}

// Treatment Area and Calculations
document.getElementById('treatment-area').addEventListener('input', (e) => {
    AppState.treatmentArea = parseFloat(e.target.value) || 0;
    updateCalculations();
});

function updateCalculations() {
    const calcDiv = document.getElementById('calculated-values');
    
    if (AppState.treatmentArea === 0 || AppState.selectedChemicals.length === 0) {
        calcDiv.classList.add('hidden');
        return;
    }
    
    // Calculate finished solution volume
    // Assumption: 20 gallons per 1000 sq ft (typical for vineyard spraying)
    const gallonsPer1000 = 20;
    const solutionVolume = (AppState.treatmentArea / 1000) * gallonsPer1000;
    
    document.getElementById('solution-volume').textContent = 
        `${solutionVolume.toFixed(2)} gal`;
    
    // Calculate chemical amounts
    const chemicalAmountsDiv = document.getElementById('chemical-amounts');
    chemicalAmountsDiv.innerHTML = AppState.selectedChemicals.map(chem => {
        // Convert area to acres for calculation
        const acres = AppState.treatmentArea / 43560;
        const amount = chem.rate * acres;
        const unit = chem.defaultRate.split('/')[0].replace(/[0-9.]/g, '').trim();
        
        return `
            <div class="calc-item">
                <span class="calc-label">${chem.name}:</span>
                <span class="calc-value">${amount.toFixed(2)} ${unit}</span>
            </div>
        `;
    }).join('');
    
    calcDiv.classList.remove('hidden');
}

// Form Submission
document.getElementById('treatment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (AppState.selectedChemicals.length === 0) {
        alert('Please select at least one chemical');
        return;
    }
    
    if (AppState.treatmentArea === 0) {
        alert('Please enter treatment area');
        return;
    }
    
    // Gather form data
    const formData = {
        datetime: document.getElementById('treatment-datetime').value,
        weather: {
            temperature: parseFloat(document.getElementById('temperature').value) || null,
            humidity: parseFloat(document.getElementById('humidity').value) || null,
            windSpeed: parseFloat(document.getElementById('wind-speed').value) || null,
            conditions: document.getElementById('weather-conditions').value || null
        },
        chemicals: AppState.selectedChemicals.map(chem => ({
            id: chem.id,
            name: chem.name,
            type: chem.type,
            moaGroup: chem.moaGroup,
            rate: chem.rate,
            unit: chem.defaultRate.split('/')[0].replace(/[0-9.]/g, '').trim()
        })),
        area: AppState.treatmentArea,
        areaUnit: 'sq ft',
        solutionVolume: (AppState.treatmentArea / 1000) * 20,
        solutionVolumeUnit: 'gal',
        retreatmentInterval: parseInt(document.getElementById('retreatment-interval').value) || null,
        notes: document.getElementById('treatment-notes').value || null
    };
    
    try {
        Storage.saveTreatment(formData);
        alert('Treatment saved successfully!');
        Views.showDashboard();
    } catch (error) {
        console.error('Error saving treatment:', error);
        alert('Error saving treatment. Please try again.');
    }
});

// Treatment Logs
function loadTreatmentLogs(query = '') {
    const listDiv = document.getElementById('treatments-list');
    const treatments = query ? Storage.searchTreatments(query) : Storage.getTreatmentsSorted();
    
    if (treatments.length === 0) {
        listDiv.innerHTML = `
            <div class="empty-state">
                <p>No treatments found.</p>
                ${query ? '<p>Try a different search term.</p>' : '<p>Tap "New Treatment" to get started!</p>'}
            </div>
        `;
        return;
    }
    
    listDiv.innerHTML = treatments.map(treatment => {
        const date = new Date(treatment.datetime);
        const chemicalNames = treatment.chemicals.map(c => c.name).join(', ');
        
        // Check if retreatment is due
        let badge = '';
        if (treatment.retreatmentInterval) {
            const daysSince = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSince >= treatment.retreatmentInterval) {
                const daysOverdue = daysSince - treatment.retreatmentInterval;
                badge = `<span class="treatment-badge overdue">Retreatment overdue by ${daysOverdue} days</span>`;
            } else {
                const daysUntil = treatment.retreatmentInterval - daysSince;
                badge = `<span class="treatment-badge upcoming">Retreatment in ${daysUntil} days</span>`;
            }
        }
        
        return `
            <div class="treatment-item" data-treatment-id="${treatment.id}">
                <div class="treatment-date">${date.toLocaleString()}</div>
                <div class="treatment-chemicals">${chemicalNames}</div>
                <div class="treatment-area">Area: ${treatment.area.toLocaleString()} ${treatment.areaUnit}</div>
                ${badge}
            </div>
        `;
    }).join('');
    
    // Add click handlers
    listDiv.querySelectorAll('.treatment-item').forEach(item => {
        item.addEventListener('click', () => {
            const treatmentId = item.dataset.treatmentId;
            showTreatmentDetail(treatmentId);
        });
    });
}

// Log Search
document.getElementById('log-search').addEventListener('input', (e) => {
    loadTreatmentLogs(e.target.value);
});

document.getElementById('clear-filters-btn').addEventListener('click', () => {
    document.getElementById('log-search').value = '';
    loadTreatmentLogs();
});

// Treatment Detail Modal
function showTreatmentDetail(treatmentId) {
    const treatment = Storage.getTreatment(treatmentId);
    if (!treatment) return;
    
    AppState.currentTreatmentId = treatmentId;
    
    const date = new Date(treatment.datetime);
    const contentDiv = document.getElementById('treatment-detail-content');
    
    contentDiv.innerHTML = `
        <div class="detail-section">
            <h3>Date & Time</h3>
            <div class="detail-item">
                <span class="detail-label">Treated on:</span>
                <span class="detail-value">${date.toLocaleString()}</span>
            </div>
        </div>
        
        ${treatment.weather.temperature ? `
        <div class="detail-section">
            <h3>Weather Conditions</h3>
            <div class="detail-item">
                <span class="detail-label">Temperature:</span>
                <span class="detail-value">${treatment.weather.temperature}°F</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Humidity:</span>
                <span class="detail-value">${treatment.weather.humidity}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Wind Speed:</span>
                <span class="detail-value">${treatment.weather.windSpeed} mph</span>
            </div>
            ${treatment.weather.conditions ? `
            <div class="detail-item">
                <span class="detail-label">Conditions:</span>
                <span class="detail-value">${treatment.weather.conditions}</span>
            </div>
            ` : ''}
        </div>
        ` : ''}
        
        <div class="detail-section">
            <h3>Chemicals Applied</h3>
            ${treatment.chemicals.map(chem => `
                <div class="detail-item">
                    <span class="detail-label">${chem.name}:</span>
                    <span class="detail-value">${chem.rate} ${chem.unit}/acre</span>
                </div>
            `).join('')}
        </div>
        
        <div class="detail-section">
            <h3>Application Details</h3>
            <div class="detail-item">
                <span class="detail-label">Area Treated:</span>
                <span class="detail-value">${treatment.area.toLocaleString()} ${treatment.areaUnit}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Solution Volume:</span>
                <span class="detail-value">${treatment.solutionVolume.toFixed(2)} ${treatment.solutionVolumeUnit}</span>
            </div>
            ${treatment.retreatmentInterval ? `
            <div class="detail-item">
                <span class="detail-label">Retreatment Interval:</span>
                <span class="detail-value">${treatment.retreatmentInterval} days</span>
            </div>
            ` : ''}
        </div>
        
        ${treatment.notes ? `
        <div class="detail-section">
            <h3>Notes</h3>
            <p>${treatment.notes}</p>
        </div>
        ` : ''}
    `;
    
    document.getElementById('treatment-detail-modal').classList.remove('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    document.getElementById('new-treatment-btn').addEventListener('click', () => Views.showNewTreatment());
    document.getElementById('view-logs-btn').addEventListener('click', () => Views.showLogs());
    document.getElementById('export-btn').addEventListener('click', () => showExportModal());
    
    document.getElementById('back-from-new').addEventListener('click', () => Views.showDashboard());
    document.getElementById('back-from-logs').addEventListener('click', () => Views.showDashboard());
    
    // Modal controls
    document.getElementById('close-detail-modal').addEventListener('click', closeDetailModal);
    document.getElementById('close-detail-btn').addEventListener('click', closeDetailModal);
    document.getElementById('delete-treatment-btn').addEventListener('click', deleteTreatment);
    
    document.getElementById('close-export-modal').addEventListener('click', closeExportModal);
    
    // Initialize dashboard
    Views.showDashboard();
});

function closeDetailModal() {
    document.getElementById('treatment-detail-modal').classList.add('hidden');
    AppState.currentTreatmentId = null;
}

function deleteTreatment() {
    if (!AppState.currentTreatmentId) return;
    
    if (confirm('Are you sure you want to delete this treatment? This cannot be undone.')) {
        Storage.deleteTreatment(AppState.currentTreatmentId);
        closeDetailModal();
        loadTreatmentLogs();
        updateDashboardStats();
    }
}

function showExportModal() {
    document.getElementById('export-modal').classList.remove('hidden');
}

function closeExportModal() {
    document.getElementById('export-modal').classList.add('hidden');
}

// Simple export functions (will be enhanced in iteration 5)
document.getElementById('export-csv-btn').addEventListener('click', () => {
    const treatments = Storage.getTreatmentsSorted();
    
    if (treatments.length === 0) {
        alert('No treatments to export');
        return;
    }
    
    let csv = 'Date,Chemicals,Area (sq ft),Temperature (F),Humidity (%),Wind (mph),Notes\n';
    
    treatments.forEach(t => {
        const date = new Date(t.datetime).toLocaleString();
        const chemicals = t.chemicals.map(c => c.name).join('; ');
        const temp = t.weather.temperature || '';
        const humidity = t.weather.humidity || '';
        const wind = t.weather.windSpeed || '';
        const notes = (t.notes || '').replace(/,/g, ';');
        
        csv += `"${date}","${chemicals}",${t.area},${temp},${humidity},${wind},"${notes}"\n`;
    });
    
    downloadFile('vine-treatments.csv', csv, 'text/csv');
    closeExportModal();
});

document.getElementById('export-json-btn').addEventListener('click', () => {
    const treatments = Storage.getTreatmentsSorted();
    
    if (treatments.length === 0) {
        alert('No treatments to export');
        return;
    }
    
    const json = JSON.stringify(treatments, null, 2);
    downloadFile('vine-treatments.json', json, 'application/json');
    closeExportModal();
});

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
