const BRAND_COLOR = '#4f46e5'; // indigo-600
const BRAND_COLOR_DARK = '#4338ca'; // indigo-700
const TEXT_COLOR = '#1f2937'; // gray-800
const TEXT_MUTED = '#6b7280'; // gray-500
const BG_COLOR = '#f9fafb'; // gray-50
const CARD_BG = '#ffffff';
const BORDER_COLOR = '#e5e7eb'; // gray-200

function emailLayout(title: string, content: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};padding:40px 20px;">
    <tr>
      <td align="center">
        <!-- Logo -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:24px;font-weight:700;color:${BRAND_COLOR};letter-spacing:-0.5px;">Tameri</span>
            </td>
          </tr>
        </table>
        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:${CARD_BG};border-radius:12px;border:1px solid ${BORDER_COLOR};overflow:hidden;">
          <tr>
            <td style="padding:40px 32px;">
              ${content}
            </td>
          </tr>
        </table>
        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:${TEXT_MUTED};">&copy; ${year} Tameri. Tous droits réservés.</p>
              <p style="margin:8px 0 0;font-size:12px;color:${TEXT_MUTED};">Vous recevez cet email car un compte est associé à cette adresse.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getPasswordResetEmailHtml(resetLink: string): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:${TEXT_COLOR};">Réinitialisation du mot de passe</h1>
    <p style="margin:0 0 24px;font-size:14px;color:${TEXT_MUTED};line-height:1.5;">
      Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:8px 0 24px;">
          <a href="${resetLink}" target="_blank" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:8px;mso-padding-alt:0;">
            <!--[if mso]><i style="mso-font-width:150%;mso-text-raise:18pt">&nbsp;</i><![endif]-->
            Modifier le mot de passe
            <!--[if mso]><i style="mso-font-width:150%">&nbsp;</i><![endif]-->
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;font-size:12px;color:${TEXT_MUTED};line-height:1.5;">
      Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
    </p>
    <p style="margin:0 0 24px;font-size:12px;color:${BRAND_COLOR};word-break:break-all;line-height:1.5;">
      ${resetLink}
    </p>
    <hr style="border:none;border-top:1px solid ${BORDER_COLOR};margin:24px 0;" />
    <p style="margin:0;font-size:12px;color:${TEXT_MUTED};line-height:1.5;">
      Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe ne sera pas modifié.
    </p>`;

  return emailLayout('Réinitialisation du mot de passe — Tameri', content);
}
