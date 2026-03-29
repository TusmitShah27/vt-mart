// @ts-ignore
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// New Code --------------------------------------------


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, phone, email, city, product_interest, message } = await req.json()

    // 1. Validate fields
    if (!name || !phone || !city || !email) {
      return new Response(
        JSON.stringify({ error: 'Name, phone, email, and city are required.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // 2. Initialize Supabase Client with Service Role Key (bypasses RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Insert lead into Supabase database
    const { error: dbError } = await supabaseClient
      .from('leads')
      .insert([{ name, phone, email, city, product_interest, message }])

    if (dbError) throw dbError

    // 4. Send Emails using EmailJS REST API
    const serviceId = Deno.env.get('EMAILJS_SERVICE_ID')
    const userId = Deno.env.get('EMAILJS_PUBLIC_KEY')
    const accessToken = Deno.env.get('EMAILJS_PRIVATE_KEY')

    const templateParams = {
      name: name,
      phone: phone,
      email: email,
      city: city,
      product_interest: product_interest || 'N/A',
      message: message || 'N/A'
    }

    // Email 1: To Admin (shahTusmit@gmail.com)
    const adminEmailPromise = fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: Deno.env.get('EMAILJS_TEMPLATE_ID_SELF'),
        user_id: userId,
        accessToken: accessToken,
        template_params: templateParams
      })
    })

    // Email 2: To Customer (Auto-reply)
    const clientEmailPromise = fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: Deno.env.get('EMAILJS_TEMPLATE_ID_CLIENT'),
        user_id: userId,
        accessToken: accessToken,
        template_params: templateParams
      })
    })

    // Wait for both emails to be sent
    const [adminRes, clientRes] = await Promise.all([adminEmailPromise, clientEmailPromise])

    if (!adminRes.ok || !clientRes.ok) {
      const errorText = await (!adminRes.ok ? adminRes : clientRes).text()
      throw new Error(`EmailJS Error: ${errorText}`)
    }

    // 5. Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Lead submitted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})


// Old Code --------------------------------------------
// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders })
//   }

//   try {
//     const { name, phone, city, product_interest, message, email } = await req.json()

//     // 1. Validate fields
//     if (!name || !phone || !city) {
//       return new Response(
//         JSON.stringify({ error: 'Name, phone, and city are required.' }),
//         { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
//       )
//     }

//     // 2. Initialize Supabase Client with Service Role Key (bypasses RLS)
//     const supabaseClient = createClient(
//       Deno.env.get('SUPABASE_URL') ?? '',
//       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
//     )

//     // 3. Insert lead into Supabase database
//     const { error: dbError } = await supabaseClient
//       .from('leads')
//       .insert([{ name, phone, city, product_interest, message }])

//     if (dbError) throw dbError

//     // 4. Send Emails using Resend API
//     const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
//     const CLIENT_EMAIL = Deno.env.get('CLIENT_EMAIL') || 'info@vishaltraders.com'
    
//     // Email 1: To Client (Vishal Traders)
//     await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${RESEND_API_KEY}`
//       },
//       body: JSON.stringify({
//         from: 'VT Mart Leads <onboarding@resend.dev>', // Update with your verified domain later
//         to: CLIENT_EMAIL,
//         subject: 'New Inquiry Received - VT Mart',
//         html: `
//           <h2>New Inquiry Received</h2>
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Phone:</strong> ${phone}</p>
//           <p><strong>City:</strong> ${city}</p>
//           <p><strong>Product Interest:</strong> ${product_interest || 'N/A'}</p>
//           <p><strong>Message:</strong> ${message || 'N/A'}</p>
//         `
//       })
//     })

//     //Email 2: To Customer (Auto Reply)
//     // Note: Uncomment this block if you add an 'email' field to your frontend form
    
//     if (email) {
//       await fetch('https://api.resend.com/emails', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${RESEND_API_KEY}`
//         },
//         body: JSON.stringify({
//           from: 'VT Mart <noreply@yourdomain.com>',
//           to: email,
//           subject: 'Thank you for contacting Vishal Traders',
//           html: `
//             <p>Hello ${name},</p>
//             <p>Thank you for contacting Vishal Traders regarding ${product_interest || 'our products'}.</p>
//             <p>Our team will contact you shortly.</p>
//             <p>Regards<br>Vishal Traders<br>VT Mart</p>
//           `
//         })
//       })
//     }
    

//     // 5. Return success response
//     return new Response(
//       JSON.stringify({ success: true, message: 'Lead submitted successfully' }),
//       { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
//     )

//   } catch (error) {
//     return new Response(
//       JSON.stringify({ error: error.message }),
//       { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
//     )
//   }
// })


