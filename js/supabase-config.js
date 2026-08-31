// Paste Project URL and publishable key from:
// https://supabase.com/dashboard/project/_/settings/api
const SUPABASE_URL = 'https://wvghnboljpshsvovfhsj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ELTH2IPIO6bBjYq3ymk_Gg_1RYmBSnn';

let supabaseClient = null;

function getSupabase() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        throw new Error('Supabase no está cargado. Verifica el script del CDN.');
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Faltan las credenciales de Supabase en js/supabase-config.js.');
    }

    if (!supabaseClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    return supabaseClient;
}

window.getSupabase = getSupabase;
