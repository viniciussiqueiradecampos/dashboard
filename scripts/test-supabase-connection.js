
import { createClient } from '@supabase/supabase-js';

const url = 'https://fszleubvvptsfqshcslp.supabase.co';
const key = 'sb_publishable_icPijyKT6VRqxvT0u2-oVQ_juS-RQ1X'; // A chave que você passou
const secret = 'sb_secret_PQ4ArgyZAdxSDy0-r5gYUA_KWiFwQq6'; // A secret que você passou

console.log('Testando conexão com Supabase...');
console.log('URL:', url);

async function testConnection() {
    // Tenta criar cliente com a chave anon
    const supabase = createClient(url, key);

    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.error('Erro ao conectar com ANON key:', error.message);
        } else {
            console.log('Conexão ANON bem sucedida! (Tabela users existe e é acessível)');
        }
    } catch (e) {
        console.error('Exceção com ANON key:', e.message);
    }

    // Tenta criar cliente com a chave secret (assumindo service_role) para criar buckets
    const supabaseAdmin = createClient(url, secret);

    try {
        const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
        if (bucketError) {
            console.error('Erro ao listar buckets com SECRET key:', bucketError.message);
        } else {
            console.log('Conexão ADMIN bem sucedida! Buckets encontrados:', buckets.length);
            // Se funcionou, tenta criar os buckets
            console.log('Tentando criar bucket "avatars"...');
            const { error: createError } = await supabaseAdmin.storage.createBucket('avatars', { public: true });
            if (createError) console.log('Resultado criação avatar:', createError.message);
            else console.log('Bucket "avatars" criado com sucesso!');

            console.log('Tentando criar bucket "logos"...');
            const { error: createError2 } = await supabaseAdmin.storage.createBucket('logos', { public: true });
            if (createError2) console.log('Resultado criação logos:', createError2.message);
            else console.log('Bucket "logos" criado com sucesso!');
        }
    } catch (e) {
        console.error('Exceção com SECRET key:', e.message);
    }
}

testConnection();
