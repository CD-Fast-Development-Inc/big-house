var SUPABASE_URL = 'https://oygbfdyzjutvdbqcysms.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_WMVRmaRM_mVbOVgSCUJDJg_bvX7Ya3i';

// Создание клиента Supabase
// Библиотека подключается через <script> в index.html
var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
