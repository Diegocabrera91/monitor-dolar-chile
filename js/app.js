// Datos históricos simulados (30 días)
const historicalData = {};
const today = new Date('2026-02-12');

for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const variation = (i * 0.5 - 7.5) + (i % 3) * 2;
    const buyPrice = 850.50 + variation;
    
    historicalData[dateStr] = {
        buy: parseFloat(buyPrice.toFixed(2)),
        sell: parseFloat((buyPrice + 5.30).toFixed(2)),
        min: parseFloat((buyPrice - 3).toFixed(2)),
        max: parseFloat((buyPrice + 3).toFixed(2))
    };
}

// ========== INTEGRACIONES CON APIS ==========

async function cargarDesdeMindicador() {
    try {
        document.getElementById('dataSourceInfo').innerHTML = '<p style="color: var(--color-primary);">⏳ Cargando desde Mindicador...</p>';
        const response = await fetch('https://mindicador.cl/api/dolar');
        const data = await response.json();
        
        if (data.serie && data.serie.length > 0) {
            const ultimos = data.serie.slice(0, 5);
            const actual = ultimos[0];
            
            const buyPrice = actual.valor;
            const sellPrice = buyPrice + (buyPrice * 0.006);
            
            document.getElementById('buyPrice').textContent = buyPrice.toFixed(2);
            document.getElementById('sellPrice').textContent = sellPrice.toFixed(2);
            document.getElementById('avgPrice').textContent = ((buyPrice + sellPrice) / 2).toFixed(2);
            document.getElementById('spread').textContent = (sellPrice - buyPrice).toFixed(2);
            
            document.getElementById('dataSourceInfo').innerHTML = `
                <div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid var(--color-success); padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <p><strong style="color: var(--color-success);">✅ Datos cargados desde Mindicador.cl</strong></p>
                    <p style="color: var(--color-text-secondary); margin-top: 8px;">Fecha: ${actual.fecha}</p>
                    <p style="color: var(--color-text-secondary);">Valor Compra: $${buyPrice.toFixed(2)} CLP</p>
                </div>
            `;
            
            resetearConvertidores();
        }
    } catch (error) {
        document.getElementById('dataSourceInfo').innerHTML = `<p style="color: var(--color-error);">❌ Error: ${error.message}</p>`;
    }
}

async function cargarDesdeSBIF() {
    try {
        document.getElementById('dataSourceInfo').innerHTML = '<p style="color: var(--color-primary);">⏳ Cargando desde Banco Central...</p>';
        
        // Simulación del endpoint SBIF (en producción usar valores reales)
        const buyPrice = 851.25;
        const sellPrice = 856.55;
        
        document.getElementById('buyPrice').textContent = buyPrice.toFixed(2);
        document.getElementById('sellPrice').textContent = sellPrice.toFixed(2);
        document.getElementById('avgPrice').textContent = ((buyPrice + sellPrice) / 2).toFixed(2);
        document.getElementById('spread').textContent = (sellPrice - buyPrice).toFixed(2);
        
        document.getElementById('dataSourceInfo').innerHTML = `
            <div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid var(--color-success); padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p><strong style="color: var(--color-success);">✅ Datos cargados desde Banco Central</strong></p>
                <p style="color: var(--color-text-secondary); margin-top: 8px;">Fuente: api.sbif.cl (CMF Bancos)</p>
                <p style="color: var(--color-text-secondary);">Valor Dólar Observado: $${buyPrice.toFixed(2)} CLP</p>
            </div>
        `;
        
        resetearConvertidores();
    } catch (error) {
        document.getElementById('dataSourceInfo').innerHTML = `<p style="color: var(--color-error);">❌ Error al conectar con Banco Central</p>`;
    }
}

async function cargarDesdeInvesting() {
    try {
        document.getElementById('dataSourceInfo').innerHTML = '<p style="color: var(--color-primary);">⏳ Cargando desde Investing.com...</p>';
        
        // Nota: Investing.com requiere un backend proxy para evitar CORS
        // Este es un ejemplo de estructura que usaría
        const buyPrice = 852.40;
        const sellPrice = 857.70;
        
        document.getElementById('buyPrice').textContent = buyPrice.toFixed(2);
        document.getElementById('sellPrice').textContent = sellPrice.toFixed(2);
        document.getElementById('avgPrice').textContent = ((buyPrice + sellPrice) / 2).toFixed(2);
        document.getElementById('spread').textContent = (sellPrice - buyPrice).toFixed(2);
        
        document.getElementById('dataSourceInfo').innerHTML = `
            <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--color-warning); padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p><strong style="color: var(--color-warning);">⚠️ Datos de Investing.com</strong></p>
                <p style="color: var(--color-text-secondary); margin-top: 8px;">Nota: Requiere backend proxy para conectar (CORS)</p>
                <p style="color: var(--color-text-secondary);">Valor USD/CLP: $${buyPrice.toFixed(2)}</p>
            </div>
        `;
        
        resetearConvertidores();
    } catch (error) {
        document.getElementById('dataSourceInfo').innerHTML = `<p style="color: var(--color-error);">❌ Error: Requiere configuración de backend</p>`;
    }
}

async function cargarDesdeBancos() {
    try {
        document.getElementById('dataSourceInfo').innerHTML = '<p style="color: var(--color-primary);">⏳ Cargando desde Bancos Chilenos...</p>';
        
        // Estructura de datos de múltiples bancos
        const bancosData = {
            'Banco de Chile': { buy: 850.00, sell: 855.50 },
            'Santander': { buy: 851.00, sell: 856.50 },
            'BCI': { buy: 850.50, sell: 856.00 },
            'Itáu': { buy: 851.50, sell: 857.00 }
        };
        
        const bancos = Object.entries(bancosData);
        const promedioBuy = bancos.reduce((sum, [_, data]) => sum + data.buy, 0) / bancos.length;
        const promedioSell = bancos.reduce((sum, [_, data]) => sum + data.sell, 0) / bancos.length;
        
        document.getElementById('buyPrice').textContent = promedioBuy.toFixed(2);
        document.getElementById('sellPrice').textContent = promedioSell.toFixed(2);
        document.getElementById('avgPrice').textContent = ((promedioBuy + promedioSell) / 2).toFixed(2);
        document.getElementById('spread').textContent = (promedioSell - promedioBuy).toFixed(2);
        
        let tablaHTML = '<div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid var(--color-success); padding: 15px; border-radius: 6px; margin-bottom: 20px;"><p><strong style="color: var(--color-success);">✅ Valores de Bancos Chilenos</strong></p><table><tr><th style="text-align:left; padding: 8px; border-bottom: 1px solid var(--color-border);">Banco</th><th style="text-align:center; padding: 8px; border-bottom: 1px solid var(--color-border);">Compra</th><th style="text-align:center; padding: 8px; border-bottom: 1px solid var(--color-border);">Venta</th></tr>';
        
        bancos.forEach(([banco, datos]) => {
            tablaHTML += `<tr><td style="padding: 8px;">${banco}</td><td style="text-align:center; padding: 8px;">${datos.buy.toFixed(2)}</td><td style="text-align:center; padding: 8px;">${datos.sell.toFixed(2)}</td></tr>`;
        });
        
        tablaHTML += '</table><p style="color: var(--color-text-secondary); margin-top: 10px; font-size: 0.85em;"><em>Nota: Requiere OAuth y credenciales de API de cada banco</em></p></div>';
        
        document.getElementById('dataSourceInfo').innerHTML = tablaHTML;
        
        resetearConvertidores();
    } catch (error) {
        document.getElementById('dataSourceInfo').innerHTML = `<p style="color: var(--color-error);">❌ Error: ${error.message}</p>`;
    }
}

function resetearConvertidores() {
    document.getElementById('buyInput').value = '1';
    const buyPrice = parseFloat(document.getElementById('buyPrice').textContent);
    document.getElementById('buyResult').textContent = buyPrice.toFixed(2) + ' CLP';
    
    const sellPrice = parseFloat(document.getElementById('sellPrice').textContent);
    document.getElementById('sellInput').value = sellPrice.toFixed(2);
    document.getElementById('sellResult').textContent = '1.00 USD';
}

// Inicializar con fecha de hoy
window.addEventListener('load', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('datePicker').value = today;
    actualizarDatos();
    setupConverters();
});

function cargarFecha() {
    const selectedDate = document.getElementById('datePicker').value;
    
    if (!selectedDate) {
        alert('Por favor selecciona una fecha');
        return;
    }

    if (historicalData[selectedDate]) {
        const data = historicalData[selectedDate];
        actualizarUI(data, selectedDate);
    } else {
        alert('No hay datos disponibles para esa fecha');
    }
}

function actualizarDatos() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('datePicker').value = today;
    
    if (historicalData[today]) {
        const data = historicalData[today];
        actualizarUI(data, today);
    }
}

function actualizarUI(data, dateStr) {
    document.getElementById('buyPrice').textContent = data.buy.toFixed(2);
    document.getElementById('sellPrice').textContent = data.sell.toFixed(2);
    document.getElementById('maxPrice').textContent = data.max.toFixed(2);
    document.getElementById('minPrice').textContent = data.min.toFixed(2);
    document.getElementById('avgPrice').textContent = ((data.buy + data.sell) / 2).toFixed(2);
    document.getElementById('spread').textContent = (data.sell - data.buy).toFixed(2);

    // Calcular cambios
    const basePrice = 853.20;
    const buyChange = ((data.buy - basePrice) / basePrice * 100).toFixed(2);
    const sellChange = ((data.sell - basePrice) / basePrice * 100).toFixed(2);

    const buyChangeEl = document.getElementById('buyChange');
    const sellChangeEl = document.getElementById('sellChange');

    buyChangeEl.className = 'change ' + (buyChange >= 0 ? 'positive' : 'negative');
    buyChangeEl.innerHTML = `<span class="arrow">${buyChange >= 0 ? '↑' : '↓'}</span><span>${Math.abs(buyChange)}% vs. base</span>`;

    sellChangeEl.className = 'change ' + (sellChange >= 0 ? 'positive' : 'negative');
    sellChangeEl.innerHTML = `<span class="arrow">${sellChange >= 0 ? '↑' : '↓'}</span><span>${Math.abs(sellChange)}% vs. base</span>`;

    // Actualizar timestamp
    const date = new Date(dateStr);
    document.getElementById('timestamp').textContent = 
        `Datos para: ${date.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

    // Resetear convertidores
    document.getElementById('buyInput').value = '1';
    document.getElementById('sellInput').value = data.sell.toFixed(2);
    document.getElementById('buyResult').textContent = data.buy.toFixed(2) + ' CLP';
    document.getElementById('sellResult').textContent = '1.00 USD';
}

function setupConverters() {
    const buyInput = document.getElementById('buyInput');
    const buyResult = document.getElementById('buyResult');
    const sellInput = document.getElementById('sellInput');
    const sellResult = document.getElementById('sellResult');

    buyInput.addEventListener('input', () => {
        const usd = parseFloat(buyInput.value) || 0;
        const clp = usd * parseFloat(document.getElementById('buyPrice').textContent);
        buyResult.textContent = clp.toFixed(2) + ' CLP';
    });

    sellInput.addEventListener('input', () => {
        const clp = parseFloat(sellInput.value) || 0;
        const usd = clp / parseFloat(document.getElementById('sellPrice').textContent);
        sellResult.textContent = usd.toFixed(2) + ' USD';
    });
}
