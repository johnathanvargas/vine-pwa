/**
 * Local Storage Manager
 * Handles all data persistence for the PWA
 */

const STORAGE_KEYS = {
    TREATMENTS: 'vine_treatments',
    CHEMICALS: 'vine_chemicals',
    SETTINGS: 'vine_settings'
};

export const Storage = {
    /**
     * Get all treatments
     * @returns {Array} Array of treatment objects
     */
    getTreatments() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.TREATMENTS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading treatments:', error);
            return [];
        }
    },

    /**
     * Save a new treatment
     * @param {Object} treatment - Treatment object
     * @returns {Object} Saved treatment with ID
     */
    saveTreatment(treatment) {
        try {
            const treatments = this.getTreatments();
            const newTreatment = {
                ...treatment,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            treatments.push(newTreatment);
            localStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(treatments));
            return newTreatment;
        } catch (error) {
            console.error('Error saving treatment:', error);
            throw error;
        }
    },

    /**
     * Get a single treatment by ID
     * @param {string} id - Treatment ID
     * @returns {Object|null} Treatment object or null
     */
    getTreatment(id) {
        const treatments = this.getTreatments();
        return treatments.find(t => t.id === id) || null;
    },

    /**
     * Update an existing treatment
     * @param {string} id - Treatment ID
     * @param {Object} updates - Updated fields
     * @returns {Object|null} Updated treatment or null
     */
    updateTreatment(id, updates) {
        try {
            const treatments = this.getTreatments();
            const index = treatments.findIndex(t => t.id === id);
            if (index === -1) return null;
            
            treatments[index] = {
                ...treatments[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(treatments));
            return treatments[index];
        } catch (error) {
            console.error('Error updating treatment:', error);
            throw error;
        }
    },

    /**
     * Delete a treatment
     * @param {string} id - Treatment ID
     * @returns {boolean} Success status
     */
    deleteTreatment(id) {
        try {
            const treatments = this.getTreatments();
            const filtered = treatments.filter(t => t.id !== id);
            localStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting treatment:', error);
            return false;
        }
    },

    /**
     * Search treatments
     * @param {string} query - Search query
     * @returns {Array} Filtered treatments
     */
    searchTreatments(query) {
        const treatments = this.getTreatments();
        if (!query) return treatments;
        
        const lowerQuery = query.toLowerCase();
        return treatments.filter(treatment => {
            const chemicalNames = treatment.chemicals.map(c => c.name.toLowerCase()).join(' ');
            const dateStr = new Date(treatment.datetime).toLocaleDateString();
            const notes = (treatment.notes || '').toLowerCase();
            
            return chemicalNames.includes(lowerQuery) || 
                   dateStr.includes(lowerQuery) || 
                   notes.includes(lowerQuery);
        });
    },

    /**
     * Get treatments sorted by date (newest first)
     * @returns {Array} Sorted treatments
     */
    getTreatmentsSorted() {
        const treatments = this.getTreatments();
        return treatments.sort((a, b) => 
            new Date(b.datetime) - new Date(a.datetime)
        );
    },

    /**
     * Get treatment statistics
     * @returns {Object} Stats object
     */
    getStats() {
        const treatments = this.getTreatments();
        const lastTreatment = this.getTreatmentsSorted()[0];
        
        return {
            totalTreatments: treatments.length,
            lastTreatmentDate: lastTreatment ? 
                new Date(lastTreatment.datetime).toLocaleDateString() : 
                'Never'
        };
    },

    /**
     * Get settings
     * @returns {Object} Settings object
     */
    getSettings() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : {
                weatherApiKey: '',
                defaultApplicationRate: 20, // gallons per 1000 sq ft
                rotationAlertThreshold: 3 // consecutive uses before alert
            };
        } catch (error) {
            console.error('Error reading settings:', error);
            return {};
        }
    },

    /**
     * Save settings
     * @param {Object} settings - Settings object
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    },

    /**
     * Clear all data (for testing/reset)
     */
    clearAll() {
        if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEYS.TREATMENTS);
            localStorage.removeItem(STORAGE_KEYS.CHEMICALS);
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            return true;
        }
        return false;
    }
};
