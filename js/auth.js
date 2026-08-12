const safeStorage = {
    getItem(key) {
        try {
            if (window.localStorage) {
                return window.localStorage.getItem(key);
            }
        } catch (error) {
            // En algunos navegadores o cuando se abre como archivo local, localStorage puede bloquearse.
        }

        try {
            return window.sessionStorage.getItem(key);
        } catch (error) {
            return null;
        }
    },
    setItem(key, value) {
        try {
            if (window.localStorage) {
                window.localStorage.setItem(key, value);
                return;
            }
        } catch (error) {
            // Fallback para file:// o navegadores con almacenamiento restringido.
        }

        try {
            window.sessionStorage.setItem(key, value);
        } catch (error) {
            // Nada que hacer si el navegador bloquea almacenamiento persistente y temporal.
        }
    },
    removeItem(key) {
        try {
            if (window.localStorage) {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            // Ignorar el error y probar el fallback.
        }

        try {
            window.sessionStorage.removeItem(key);
        } catch (error) {
            // Ignorar.
        }
    }
};

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
    const fullName = `${firstName} ${lastName}`.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const rawUsers = safeStorage.getItem('finx_users');
    const users = JSON.parse(rawUsers || '[]');

    if (users.some((user) => user.email === normalizedEmail)) {
        throw new Error('Este correo ya está registrado.');
    }

    const newUser = {
        id: crypto.randomUUID(),
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        email: normalizedEmail,
        password,
        language: 'es',
        created_at: new Date().toISOString()
    };

    users.push(newUser);
    safeStorage.setItem('finx_users', JSON.stringify(users));
    safeStorage.setItem('finx_session', JSON.stringify({ user: newUser }));

    return { user: newUser, session: { user: newUser } };
}

async function loginUser({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const rawUsers = safeStorage.getItem('finx_users');
    const users = JSON.parse(rawUsers || '[]');
    const user = users.find((item) => item.email === normalizedEmail && item.password === password);

    if (!user) {
        throw new Error('Correo o contraseña incorrectos.');
    }

    safeStorage.setItem('finx_session', JSON.stringify({ user }));
    return { user, session: { user } };
}

async function logoutUser() {
    safeStorage.removeItem('finx_session');
}

async function getSession() {
    const rawSession = safeStorage.getItem('finx_session');
    if (!rawSession) {
        return null;
    }

    try {
        return JSON.parse(rawSession);
    } catch (error) {
        safeStorage.removeItem('finx_session');
        return null;
    }
}

async function requireAuth(redirectTo = 'login.html') {
    const session = await getSession();

    if (session) {
        return session;
    }

    const isLocalBrowser = window.location.protocol === 'file:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

    if (isLocalBrowser) {
        const guestSession = {
            user: {
                id: 'guest-user',
                email: 'guest@local',
                first_name: 'Guest',
                last_name: 'User',
                full_name: 'Guest User',
                language: 'es'
            }
        };

        safeStorage.setItem('finx_session', JSON.stringify(guestSession));
        return guestSession;
    }

    window.location.href = redirectTo;
    return null;
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
