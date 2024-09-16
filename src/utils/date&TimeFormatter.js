function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date).getTime() + (5 * 60 + 45) * 60 * 1000);
}

function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(new Date(date).getTime() + (5 * 60 + 45) * 60 * 1000);
}

module.exports = { formatDate, formatTime };