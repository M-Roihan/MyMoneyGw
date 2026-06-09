export function formatRupiah(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return "Rp 0";
    }
    return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
}

export function formatNumberInput(value) {
    if (!value) return "";
    const stringValue = value.toString();
    const numberString = stringValue.replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatDate(dateStr, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
    if (!dateStr) return "-";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "-";
        return date.toLocaleDateString('id-ID', options);
    } catch (e) {
        return "-";
    }
}

export function formatDateShort(dateStr) {
    return formatDate(dateStr, { day: '2-digit', month: 'short' });
}

export function getGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 11) {
        return "Selamat Pagi";
    } else if (hour >= 11 && hour < 15) {
        return "Selamat Siang";
    } else if (hour >= 15 && hour < 18) {
        return "Selamat Sore";
    } else {
        return "Selamat Malam";
    }
}
