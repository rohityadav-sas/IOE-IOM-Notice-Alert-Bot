fetch('/logs/logs-content')
    .then(response => response.text())
    .then(data => {
        document.getElementById('logsContent').innerText = data;
    })
    .catch(error => console.error('Error fetching logs:', error));

function clearLogs() {
    document.getElementById('logsContent').innerText = '';
    fetch('/logs/clear', { method: 'POST' })
        .then(() => console.log('Logs cleared'))
        .catch(error => console.error('Error clearing logs:', error));
}