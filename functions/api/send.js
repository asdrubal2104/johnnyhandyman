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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>New Lead Notification</title>
  <style type="text/css">
    body {
      width: 100% !important;
      height: 100% !important;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding-top: 40px;
      padding-bottom: 40px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: #111827;
      padding: 30px 40px;
      text-align: center;
      border-bottom: 3px solid #f97316;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header span {
      color: #f97316;
    }
    .content {
      padding: 40px;
    }
    .lead-badge {
      background-color: #fff7ed;
      border: 1px solid #ffedd5;
      color: #9a3412;
      display: inline-block;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .info-grid {
      display: table;
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .info-row {
      display: table-row;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-label {
      display: table-cell;
      padding: 12px 0;
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
      width: 140px;
      vertical-align: top;
    }
    .info-value {
      display: table-cell;
      padding: 12px 0;
      color: #111827;
      font-size: 15px;
      font-weight: 600;
    }
    .message-box {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 20px;
      margin-top: 10px;
    }
    .message-label {
      color: #374151;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      display: block;
    }
    .message-content {
      color: #4b5563;
      font-size: 15px;
      line-height: 1.6;
      white-space: pre-wrap;
      font-style: italic;
    }
    .cta-button {
      display: inline-block;
      background-color: #f97316;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: bold;
      text-align: center;
      margin-top: 30px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #9ca3af;
      font-size: 12px;
      margin: 0;
      line-height: 1.5;
    }
    
    @media only screen and (max-width: 600px) {
      .wrapper { padding: 0 !important; }
      .container { border-radius: 0 !important; width: 100% !important; max-width: none !important; }
      .content { padding: 24px !important; }
      .header { padding: 24px !important; }
      .info-label { display: block !important; width: 100% !important; padding-bottom: 4px !important; }
      .info-value { display: block !important; width: 100% !important; padding-top: 0 !important; border-bottom: 1px solid #e5e7eb !important; }
      .info-row { border: none !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Johnny<span>Pro</span> Handyman</h1>
      </div>
      
      <div class="content">
        <div class="lead-badge">New Website Lead</div>
        <h2 style="margin: 0 0 24px 0; color: #111827; font-size: 20px;">Someone is interested in your services!</h2>
        
        <div class="info-grid">
          <div class="info-row">
            <div class="info-label">Customer Name</div>
            <div class="info-value">${name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email Address</div>
            <div class="info-value"><a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a></div>
          </div>
          <div class="info-row">
            <div class="info-label">Phone Number</div>
            <div class="info-value"><a href="tel:${phone}" style="color: #111827; text-decoration: none;">${phone || 'Not Provided'}</a></div>
          </div>
          <div class="info-row">
            <div class="info-label">Service Needed</div>
            <div class="info-value" style="text-transform: capitalize;">${(service || 'General Inquiry').replace(/-/g, ' ')}</div>
          </div>
        </div>

        <div class="message-label">Project Details / Message:</div>
        <div class="message-box">
          <div class="message-content">"${message}"</div>
        </div>

        <div style="text-align: center;">
          <a href="mailto:${email}?subject=Re: Your quote request - Johnny Pro Handyman" class="cta-button">Reply to Customer</a>
        </div>
      </div>

      <div class="footer">
        <p>This email was automatically generated from the contact form on <strong>johnnyprohandyman.com</strong>.</p>
        <p>&copy; ${new Date().getFullYear()} Johnny Pro Handyman. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
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