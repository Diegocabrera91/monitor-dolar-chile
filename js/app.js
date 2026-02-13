// js/app.js

// Load currency data from Mindicador
async function cargarDesdeMindicador() {
    try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading from Mindicador:', error);
    }
}

// Load currency data from SBIF
async function cargarDesdeSBIF() {
    try {
        const response = await fetch('https://www.sbif.cl/'); // Replace with actual API endpoint
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading from SBIF:', error);
    }
}

// Load currency data from Investing.com
async function cargarDesdeInvesting() {
    try {
        const response = await fetch('https://investing.com/'); // Replace with actual API endpoint
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading from Investing:', error);
    }
}

// Load currency data from Bancos
async function cargarDesdeBancos() {
    try {
        const response = await fetch('https://www.bancos.cl/'); // Replace with actual API endpoint
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading from Bancos:', error);
    }
}

// Get the current date
function cargarFecha() {
    const date = new Date();
    return date.toISOString().slice(0, 10);
}

// Update currency data
async function actualizarDatos() {
    try {
        const [mindicadorData, sbifData, investingData, bancosData] = await Promise.all([
            cargarDesdeMindicador(),
            cargarDesdeSBIF(),
            cargarDesdeInvesting(),
            cargarDesdeBancos()
        ]);
        // Process and use the loaded data
        console.log(mindicadorData, sbifData, investingData, bancosData);
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

// Helper function for currency conversions
function convertirMoneda(monto, tasaDeCambio) {
    return monto * tasaDeCambio;
}

// Helper function for calculations
function calcularPromedio(datos) {
    const suma = datos.reduce((acc, curr) => acc + curr, 0);
    return suma / datos.length;
}

// Call to update data
actualizarDatos();
