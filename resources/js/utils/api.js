export async function apiFetch(url, options = {}) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        ...(options.headers || {})
    };

    const config = {
        ...options,
        headers
    };

    const response = await fetch(url, config);
    
    // 3. Handle 401 Unauthorized
    if (response.status === 401) {
        window.location.href = '/login';
        return;
    }

    // Parse JSON
    const data = await response.json().catch(() => ({}));

    // 4. Handle 422 Validation Error
    if (response.status === 422) {
        const errorMessage = data.message || 'Terjadi kesalahan validasi';
        const errors = data.errors ? Object.values(data.errors).flat().join(', ') : '';
        throw new Error(errors ? `${errorMessage}: ${errors}` : errorMessage);
    }

    // 5. Handle other non-ok responses
    if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
    }

    // 6. Return parsed JSON
    return data;
}
