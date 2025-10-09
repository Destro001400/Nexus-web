import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("Função web-search-agent iniciada."); // Espião 1

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
}

serve(async (req) => {
  console.log(`Recebida uma requisição: ${req.method}`); // Espião 2

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log(`Query recebida: "${query}"`); // Espião 3

    if (!query) {
      throw new Error("A consulta (query) é obrigatória.");
    }

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    const SEARCH_ENGINE_ID = Deno.env.get('SEARCH_ENGINE_ID');

    // Espião 4: Vamos verificar se as chaves existem
    if (!GOOGLE_API_KEY) console.error("ERRO: A variável GOOGLE_API_KEY não foi encontrada!");
    if (!SEARCH_ENGINE_ID) console.error("ERRO: A variável SEARCH_ENGINE_ID não foi encontrada!");

    if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
      throw new Error("As chaves de API do Google não estão configuradas nos segredos do Supabase.");
    }
    
    console.log("Chaves encontradas. Montando URL da busca..."); // Espião 5
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
    
    console.log("Fazendo a chamada para a API do Google..."); // Espião 6
    const searchResponse = await fetch(searchUrl);
    
    console.log(`Resposta do Google: Status ${searchResponse.status}`); // Espião 7

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error("ERRO DETALHADO DA API DO GOOGLE:", errorData);
      throw new Error(`Erro na busca do Google: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const results: GoogleSearchResult[] = searchData.items?.slice(0, 4) || [];
    console.log(`Encontrados ${results.length} resultados.`); // Espião 8

    const context = results.map((result) => `
      Fonte: ${result.title}
      URL: ${result.link}
      Conteúdo: ${result.snippet}
    `).join('\n\n---\n\n');

    console.log("Contexto gerado com sucesso. Enviando resposta."); // Espião 9
    return new Response(JSON.stringify({ context }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("ERRO CRÍTICO NA FUNÇÃO:", error.message); // Espião de Erro Final
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});