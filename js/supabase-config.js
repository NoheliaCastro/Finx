const SUPABASE_URL = 'https://jljfzsoflipjcrmlxwka.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lGOTzYU71_qe_fJjp6HO2A_PH55QtXa';

let supabaseClient = null;

function getSupabase() {
    if (!window.supabase) {
        throw new Error('Supabase no está cargado. Verifica el script del CDN.');
    }

    if (!supabaseClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    return supabaseClient;
}
