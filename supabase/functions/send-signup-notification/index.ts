import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_EMAIL = "telliolegal@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { nome, cognome, numero_albo, foro, email, pec, telefono, area_competenza, interesse, time } = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Tellio <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject: `Nuova iscrizione: ${nome} ${cognome}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #faf8f8; border-radius: 16px;">
            <h2 style="margin: 0 0 24px; color: #1a1a1a; font-size: 20px;">Nuova iscrizione a Tellio</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 13px; width: 140px;">Nome</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px; font-weight: 500;">${nome} ${cognome}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${email}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 13px;">PEC</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${pec}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 13px;">Telefono</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${telefono}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 13px;">Foro</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${foro}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 13px;">N. Albo</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${numero_albo}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 13px;">Area</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${area_competenza}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 13px;">Interesse</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${interesse}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 13px;">Data</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${time}</td>
              </tr>
            </table>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
