// =====================================================
// Monitor Dólar Chile - JavaScript Application
// Complete functionality with error handling, validation, and UX improvements
// =====================================================

// ========================
// 1. UTILITY FUNCTIONS
// ========================

/**
 * Show loading spinner
 */
function showLoading() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'block';
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

/**
 * Display toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification: 'success', 'error', 'info'
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add toast styles if not already present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.innerHTML = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                font-weight: 500;
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .toast-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }
            .toast-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .toast-close:hover {
                opacity: 1;
            }
            .toast-success {
                background-color: #22c55e;
                color: white;
            }
            .toast-error {
                background-color: #ef4444;
                color: white;
            }
            .toast-info {
                background-color: #3b82f6;
                color: white;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Format number to currency format
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (e.g., 'CLP', 'USD')
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, currency = 'CLP') {
    if (typeof value !== 'number' || isNaN(value)) {
        return `0 ${currency}`;
    }
    return `${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${currency}`;
}

/**
 * Validate date input
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is valid and not in the future
    return date instanceof Date && !isNaN(date) && date <= today;
}

/**
 * Validate numeric input
 * @param {string|number} value - Value to validate
 * @returns {boolean} True if valid number, false otherwise
 */
function isValidNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
}

// ========================
// 2. DATA FETCHING FUNCTIONS
// ========================

/**
 * Fetch data from Mindicador API
 * @returns {Promise} Promise with fetched data
 */
async function cargarDesdeMindicador() {
    try {
        showLoading();
        const response = await fetch('https://mindicador.cl/api');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.dolar) {
            const dolarData = {
                source: 'Mindicador',
                buyPrice: data.dolar.valor,
                sellPrice: data.dolar.valor,
                date: data.dolar.fecha,
                timestamp: new Date()
            };
            
            updatePriceDisplay(dolarData);
            showToast('Datos cargados desde Mindicador ✓', 'success');
            return dolarData;
        } else {
            throw new Error('Estructura de datos inválida');
        }
    } catch (error) {
        console.error('Error loading from Mindicador:', error);
        showToast(`Error al cargar desde Mindicador: ${error.message}`, 'error');
        return null;
    } finally {
        hideLoading();
    }
}

/**
 * Fetch data from SBIF (Central Bank) - Mock implementation
 * @returns {Promise} Promise with fetched data
 */
async function cargarDesdeSBIF() {
    try {
        showLoading();
        
        // Mock data - Replace with actual API endpoint
        const mockData = {
            source: 'SBIF',
            buyPrice: 845.50,
            sellPrice: 850.75,
            date: new Date().toISOString(),
            timestamp: new Date()
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updatePriceDisplay(mockData);
        showToast('Datos cargados desde Banco Central (SBIF) ✓', 'success');
        return mockData;
    } catch (error) {
        console.error('Error loading from SBIF:', error);
        showToast(`Error al cargar desde SBIF: ${error.message}`, 'error');
        return null;
    } finally {
        hideLoading();
    }
}

/**
 * Fetch data from Investing.com - Mock implementation
 * @returns {Promise} Promise with fetched data
 */
async function cargarDesdeInvesting() {
    try {
        showLoading();
        
        // Mock data - Replace with actual API endpoint
        const mockData = {
            source: 'Investing.com',
            buyPrice: 848.25,
            sellPrice: 852.90,
            date: new Date().toISOString(),
            timestamp: new Date()
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updatePriceDisplay(mockData);
        showToast('Datos cargados desde Investing.com ✓', 'success');
        return mockData;
    } catch (error) {
        console.error('Error loading from Investing:', error);
        showToast(`Error al cargar desde Investing: ${error.message}`, 'error');
        return null;
    } finally {
        hideLoading();
    }
}

/**
 * Fetch data from Chilean Banks - Mock implementation
 * @returns {Promise} Promise with fetched data
 */
async function cargarDesdeBancos() {
    try {
        showLoading();
        
        // Mock data - Replace with actual API endpoint and OAuth
        const mockData = {
            source: 'Bancos',
            buyPrice: 843.80,
            sellPrice: 854.20,
            banks: [
                { name: 'Banco de Chile', buy: 844.00, sell: 854.00 },
                { name: 'Santander', buy: 843.50, sell: 854.50 },
                { name: 'BCI', buy: 844.10, sell: 853.90 }
            ],
            date: new Date().toISOString(),
            timestamp: new Date()
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updatePriceDisplay(mockData);
        showToast('Datos cargados desde Bancos ✓', 'success');
        return mockData;
    } catch (error) {
        console.error('Error loading from Bancos:', error);
        showToast(`Error al cargar desde Bancos: ${error.message}`, 'error');
        return null;
    } finally {
        hideLoading();
    }
}

// ========================
// 3. DATA PROCESSING FUNCTIONS
// ========================

/**
 * Update price display in UI
 * @param {object} data - Data object with price information
 */
function updatePriceDisplay(data) {
    if (!data) return;
    
    const buyPriceEl = document.getElementById('buyPrice');
    const sellPriceEl = document.getElementById('sellPrice');
    const timestampEl = document.getElementById('timestamp');
    const dataSourceInfo = document.getElementById('dataSourceInfo');
    
    if (buyPriceEl) buyPriceEl.textContent = data.buyPrice ? data.buyPrice.toFixed(2) : '0.00';
    if (sellPriceEl) sellPriceEl.textContent = data.sellPrice ? data.sellPrice.toFixed(2) : '0.00';
    
    if (timestampEl) {
        const date = new Date(data.date || data.timestamp);
        timestampEl.textContent = `Actualizado: ${date.toLocaleString('es-CL')}`;
    }
    
    if (dataSourceInfo) {
        dataSourceInfo.innerHTML = `
            <p style="color: var(--color-text-secondary); text-align: center;">
                <strong>Fuente:</strong> ${data.source || 'Desconocida'}
            </p>
        `;
    }
    
    // Update converters
    if (data.buyPrice) {
        updateBuyConverter(data.buyPrice);
    }
    if (data.sellPrice) {
        updateSellConverter(data.sellPrice);
    }
}

/**
 * Calculate and update statistics
 * @param {number} buyPrice - Buy price
 * @param {number} sellPrice - Sell price
 */
function updateStatistics(buyPrice, sellPrice) {
    const maxPriceEl = document.getElementById('maxPrice');
    const minPriceEl = document.getElementById('minPrice');
    const avgPriceEl = document.getElementById('avgPrice');
    const spreadEl = document.getElementById('spread');
    
    if (maxPriceEl) maxPriceEl.textContent = Math.max(buyPrice, sellPrice).toFixed(2);
    if (minPriceEl) minPriceEl.textContent = Math.min(buyPrice, sellPrice).toFixed(2);
    if (avgPriceEl) avgPriceEl.textContent = ((buyPrice + sellPrice) / 2).toFixed(2);
    if (spreadEl) spreadEl.textContent = (sellPrice - buyPrice).toFixed(2);
}

/**
 * Convert USD to CLP
 * @param {number} usd - Amount in USD
 * @param {number} rate - Exchange rate
 * @returns {number} Amount in CLP
 */
function convertUSDtoCLP(usd, rate) {
    if (!isValidNumber(usd) || !isValidNumber(rate)) {
        showToast('Valores inválidos para la conversión', 'error');
        return 0;
    }
    return parseFloat(usd) * parseFloat(rate);
}

/**
 * Convert CLP to USD
 * @param {number} clp - Amount in CLP
 * @param {number} rate - Exchange rate
 * @returns {number} Amount in USD
 */
function convertCLPtoUSD(clp, rate) {
    if (!isValidNumber(clp) || !isValidNumber(rate)) {
        showToast('Valores inválidos para la conversión', 'error');
        return 0;
    }
    return parseFloat(clp) / parseFloat(rate);
}

/**
 * Update buy converter display
 * @param {number} rate - Exchange rate
 */
function updateBuyConverter(rate) {
    const buyInput = document.getElementById('buyInput');
    const buyResult = document.getElementById('buyResult');
    
    if (buyInput && buyResult) {
        const usd = parseFloat(buyInput.value) || 0;
        const clp = convertUSDtoCLP(usd, rate);
        buyResult.textContent = `${formatCurrency(clp, 'CLP')}`;
    }
}

/**
 * Update sell converter display
 * @param {number} rate - Exchange rate
 */
function updateSellConverter(rate) {
    const sellInput = document.getElementById('sellInput');
    const sellResult = document.getElementById('sellResult');
    
    if (sellInput && sellResult) {
        const clp = parseFloat(sellInput.value) || 0;
        const usd = convertCLPtoUSD(clp, rate);
        sellResult.textContent = `${formatCurrency(usd, 'USD')}`;
    }
}

// ========================
// 4. USER INTERACTION FUNCTIONS
// ========================

/**
 * Load data for a specific date
 */
function cargarFecha() {
    const datePicker = document.getElementById('datePicker');
    
    if (!datePicker || !datePicker.value) {
        showToast('Por favor, selecciona una fecha válida', 'error');
        return;
    }
    
    if (!isValidDate(datePicker.value)) {
        showToast('No puedes seleccionar una fecha futura', 'error');
        return;
    }
    
    showToast(`Cargando datos para ${new Date(datePicker.value).toLocaleDateString('es-CL')}...`, 'info');
    
    // Simulate API call with historical data
    setTimeout(() => {
        const mockData = {
            source: 'Histórico',
            buyPrice: 840.50 + Math.random() * 20,
            sellPrice: 850.75 + Math.random() * 20,
            date: datePicker.value,
            timestamp: new Date(datePicker.value)
        };
        updatePriceDisplay(mockData);
        showToast('Datos históricos cargados ✓', 'success');
    }, 1000);
}

/**
 * Update with today's data
 */
function actualizarDatos() {
    showToast('Actualizando datos de hoy...', 'info');
    
    // Load from Mindicador (most reliable for current data)
    cargarDesdeMindicador();
    
    // Update date picker to today
    const datePicker = document.getElementById('datePicker');
    if (datePicker) {
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
    }
}

// ========================
// 5. EVENT LISTENERS & INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // Set date picker to today
    const datePicker = document.getElementById('datePicker');
    if (datePicker) {
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
    }
    
    // Add event listeners to converters
    const buyInput = document.getElementById('buyInput');
    const sellInput = document.getElementById('sellInput');
    const buyPrice = document.getElementById('buyPrice');
    const sellPrice = document.getElementById('sellPrice');
    
    if (buyInput && buyPrice) {
        buyInput.addEventListener('input', function() {
            updateBuyConverter(parseFloat(buyPrice.textContent));
        });
    }
    
    if (sellInput && sellPrice) {
        sellInput.addEventListener('input', function() {
            updateSellConverter(parseFloat(sellPrice.textContent));
        });
    }
    
    // Load initial data
    actualizarDatos();
    
    showToast('Aplicación iniciada correctamente ✓', 'success');
});

// ========================
// 6. ERROR HANDLING
// ========================

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showToast('Error inesperado. Por favor, recarga la página.', 'error');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('Error en la operación. Por favor, intenta nuevamente.', 'error');
});