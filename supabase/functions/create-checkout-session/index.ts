import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@10.12.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient()
})

// IMPORTANTE: Coloque o ID do Preço do seu "Nexus Pro" aqui de novo!
const NEXUS_PRO_PRICE_ID = "price_1SEZO0FNLv57q4yk8TeHxCOK"; // Substitua pelo seu Price ID do Stripe

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Pega o e-mail que o app enviou no corpo da requisição
    const { email } = await req.json()
    if (!email) {
      throw new Error('Email do usuário não fornecido na requisição.')
    }

    // Cria a sessão de checkout no Stripe usando o e-mail recebido
    const session = await stripe.checkout.sessions.create({
      line_items: [ { price: NEXUS_PRO_PRICE_ID, quantity: 1 } ],
      customer_email: email,
      mode: 'subscription',
      success_url: `${Deno.env.get('SITE_URL')}/app?payment_success=true`,
      cancel_url: `${Deno.env.get('SITE_URL')}/app`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})