function translateAuthError(message) {
    const errors = {
        'Invalid login credentials': 'Correo o contraseña incorrectos.',
        'User already registered': 'Este correo ya está registrado.',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
        'Unable to validate email address: invalid format': 'El formato del correo no es válido.',
        'Email not confirmed': 'Debes confirmar tu correo antes de iniciar sesión.',
        'Signup requires a valid password': 'Ingresa una contraseña válida.',
        'Failed to fetch': 'No se pudo conectar con Supabase. Revisa la URL del proyecto y tu conexión.',
        'Network request failed': 'No se pudo conectar con Supabase. Revisa la URL del proyecto y tu conexión.'
    };

    if (!message) {
        return 'Ocurrió un error. Intenta de nuevo.';
    }

    return errors[message] || message;
}

function mapNetworkError(error) {
    const message = error && error.message ? error.message : String(error || '');
    if (
        message === 'Failed to fetch' ||
        message === 'Network request failed' ||
        message.includes('ERR_NAME_NOT_RESOLVED') ||
        message.includes('Failed to resolve')
    ) {
        return new Error(
            'No se pudo conectar con el proyecto de Supabase. Verifica en el dashboard que el proyecto exista y actualiza la URL en js/supabase-config.js.'
        );
    }

    return error instanceof Error ? error : new Error(translateAuthError(message));
}

function mapUser(user) {
    if (!user) {
        return null;
    }

    const metadata = user.user_metadata || {};

    return {
        ...user,
        first_name: metadata.first_name || user.first_name || '',
        last_name: metadata.last_name || user.last_name || '',
        full_name: metadata.full_name || user.full_name || '',
        user_metadata: metadata
    };
}

function mapSession(session) {
    if (!session) {
        return null;
    }

    return {
        ...session,
        user: mapUser(session.user)
    };
}

async function registerUser({ firstName, lastName, email, password }) {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
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

        return {
            user: mapUser(data.user),
            session: mapSession(data.session)
        };
    } catch (error) {
        throw mapNetworkError(error);
    }
}

async function loginUser({ email, password }) {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
        });

        if (error) {
            throw new Error(translateAuthError(error.message));
        }

        return {
            user: mapUser(data.user),
            session: mapSession(data.session)
        };
    } catch (error) {
        throw mapNetworkError(error);
    }
}

async function logoutUser() {
    try {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(translateAuthError(error.message));
        }
    } catch (error) {
        throw mapNetworkError(error);
    }
}

async function getSession() {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            throw new Error(translateAuthError(error.message));
        }

        return mapSession(data.session);
    } catch (error) {
        throw mapNetworkError(error);
    }
}

async function requireAuth(redirectTo = 'login.html') {
    const session = await getSession();

    if (session) {
        return session;
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
