const logsContent = document.getElementById('logsContent');
const searchInput = document.getElementById('searchInput');
const autoRefreshToggle = document.getElementById('autoRefresh');
let autoRefreshInterval;

let query = window.location.search.substring(1);

function clearLogs() {
    let endpoint = '/logs/clear';
    if (query) {
        endpoint += '?' + query;
    }
    document.getElementById('logsContent').innerText = '';
    fetch(endpoint, { method: 'POST' })
}

function searchLogs() {
    let endpoint = '/logs/getlogs';
    if (query) {
        endpoint += '?' + query;
    }
    fetch(endpoint).then(response => response.text()).then(logs => {
        const searchTerm = searchInput.value.toLowerCase();
        const logLines = logs.split('\n');
        const filteredLogs = logLines.filter(line => line.toLowerCase().includes(searchTerm));
        logsContent.innerHTML = filteredLogs.join('\n').replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
    }).catch(error => console.error('Error fetching logs:', error));
}

async function loadLogs() {
    try {
        let endpoint = '/logs/getlogs';
        if (query) {
            endpoint += '?' + query;
        }
        const response = await fetch(endpoint);
        if (response.ok) {
            const logs = await response.text();
            logsContent.textContent = logs;
        } else {
            console.error('Failed to fetch logs');
        }
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

loadLogs();

function toggleAutoRefresh() {
    if (autoRefreshToggle.checked && searchInput.value === '') {
        autoRefreshInterval = setInterval(loadLogs, 1000);
    } else {
        clearInterval(autoRefreshInterval);
    }
}

searchInput.addEventListener('input', () => {
    if (searchInput.value === '' && autoRefreshToggle.checked) {
        toggleAutoRefresh();
    }
    else {
        clearInterval(autoRefreshInterval);
    }
    searchLogs();
});

download.addEventListener('click', () => {
    let endpoint = '/logs/download';
    if (query) {
        endpoint += '?' + query;
    }
    if (logsContent.innerText === '') {
        alert("No logs to download");
    }
    else {
        window.location.href = endpoint;
    }
});


autoRefreshToggle.addEventListener('change', toggleAutoRefresh);