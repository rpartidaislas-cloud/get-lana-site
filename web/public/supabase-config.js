// Config única de conexión a Supabase para todas las páginas de LANA.
// Antes cada .html traía su propia copia pegada de esta URL/key — con
// ~14 copias, cambiar de proyecto de Supabase (ej. para armar un
// ambiente de staging) significaba editar 14 archivos a mano y confiar
// en no dejar ninguno desactualizado. Ahora solo se edita aquí.
//
// La anon key NO es secreta (por diseño de Supabase — la protección real
// vive en las políticas RLS de cada tabla), así que exponerla en un
// archivo .js público no es un problema de seguridad distinto al que ya
// existía con las copias pegadas directo en cada HTML.
window.LANA_SUPABASE_URL = "https://lgjdzaqjrmmzyrenevfm.supabase.co";
window.LANA_SUPABASE_ANON_KEY = "sb_publishable_43k3WtL8Lacehc4zDkpvGg_YHUyYLnk";
