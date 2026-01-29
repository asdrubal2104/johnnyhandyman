export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 2. Validar que la API Key esté presente
    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Falta la configuración API Key en Cloudflare." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { name, email, phone, service, message } = data;

    // 3. MEJOR PRÁCTICA: Validación básica de campos requeridos antes de llamar a Resend
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Nombre, Email y Mensaje son obligatorios." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`, // Ahora 'env' sí existe
      },
      body: JSON.stringify({
        // Como tu dominio ya está verificado, esto es lo correcto:
        from: "Johnny Pro Handyman <info@johnnyprohandyman.com>",
        to: ["asdrubalgaitan2104@gmail.com"],
        reply_to: email,
        subject: `New Contact Request: ${service || "General Inquiry"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #f97316; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0;">New Service Request</h2>
            </div>
            
            <div style="padding: 20px; color: #374151;">
              <p>Has recibido un nuevo mensaje desde el sitio web:</p>
              
              <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Service:</strong> ${service || 'General'}</p>
              </div>

              <h3 style="color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Message Details:</h3>
              <div style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">
                ${message}
              </div>
            </div>
            
            <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
              Este correo fue enviado desde el formulario de johnnyprohandyman.com
            </div>
          </div>
        `,
      }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: responseData.message || "Error en Resend" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Error interno: " + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}