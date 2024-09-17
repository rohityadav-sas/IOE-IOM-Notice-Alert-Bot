fetch('/logs/logs-content')
    .then(response => response.text())
    .then(data => {
        document.getElementById('logsContent').innerText = data;
    })
    .catch(error => console.error('Error fetching logs:', error));