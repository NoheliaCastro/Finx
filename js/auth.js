function translateAuthError(message) {
    const errors = {
        'Invalid login credentials': 'Correo o contraseña incorrectos.',
        'User already registered': 'Este correo ya está registrado.',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
        'Unable to validate email address: invalid format': 'El formato del correo no es válido.',
        'Email not confirmed': 'Debes confirmar tu correo antes de iniciar sesión.',
        'Signup requires a valid password': 'Ingresa una contraseña válida.'
    };

    return errors[message] || message || 'Ocurrió un error. Intenta de nuevo.';
}

async function registerUser({ firstName, lastName, email, password }) {
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`.trim()
            }
        }
    });

    if (error) {
        throw new Error(translateAuthError(error.message));
    }

    return data;
}

async function loginUser({ email, password }) {
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw new Error(translateAuthError(error.message));
    }

    return data;
}

async function logoutUser() {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(translateAuthError(error.message));
    }
}

async function getSession() {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        throw new Error(translateAuthError(error.message));
    }

    return data.session;
}

async function requireAuth(redirectTo = 'login.html') {
    const session = await getSession();

    if (!session) {
        window.location.href = redirectTo;
        return null;
    }

    return session;
}

function showAuthAlert(containerId, message, type = 'danger') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.className = `alert alert-${type}`;
    container.textContent = message;
    container.classList.remove('d-none');
}

function hideAuthAlert(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.classList.add('d-none');
    container.textContent = '';
}

function setButtonLoading(button, isLoading, loadingText) {
    if (!button) return;

    if (isLoading) {
        button.dataset.originalHtml = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${loadingText}`;
        return;
    }

    button.disabled = false;
    button.innerHTML = button.dataset.originalHtml || button.innerHTML;
}

window.FinxAuth = {
    registerUser,
    loginUser,
    logoutUser,
    getSession,
    requireAuth,
    showAuthAlert,
    hideAuthAlert,
    setButtonLoading
};
