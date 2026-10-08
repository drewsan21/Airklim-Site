/**
 * AIRKLIM Email Service
 * Invio email di benvenuto e reset password tramite nodemailer.
 * Se SMTP non è configurato, logga l'email su console (sviluppo) senza bloccare il flusso.
 */

const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: { user, pass }
    });
  } else {
    // Modalità sviluppo: nessun crash se SMTP mancante
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('[EMAIL] SMTP non configurato - email simulata:', {
          to: mailOptions.to,
          subject: mailOptions.subject
        });
        return { messageId: 'simulated', simulated: true };
      }
    };
  }
  return transporter;
}

function getFromAddress() {
  return process.env.EMAIL_FROM || 'AIRKLIM <noreply@airklim.it>';
}

/**
 * Email di benvenuto dopo la registrazione
 */
async function sendWelcomeEmail(user) {
  const mail = {
    from: getFromAddress(),
    to: user.email,
    subject: 'Benvenuto su AIRKLIM',
    html: `
      <h2>Ciao ${user.name || ''} ${user.surname || ''},</h2>
      <p>Benvenuto/a su <strong>AIRKLIM</strong>, la piattaforma per il clima e la termoidraulica.</p>
      <p>Il tuo account è stato creato con successo${user.role === 'professionista' ? ' ed è in attesa di verifica' : ''}.</p>
      <p>Accedi alla tua area riservata per scoprire il catalogo completo.</p>
      <p>— Il team AIRKLIM</p>
    `
  };
  return getTransporter().sendMail(mail);
}

/**
 * Email di reset password con token
 */
async function sendPasswordResetEmail(user, resetToken) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const mail = {
    from: getFromAddress(),
    to: user.email,
    subject: 'Reset password AIRKLIM',
    html: `
      <h2>Ciao ${user.name || ''},</h2>
      <p>Hai richiesto il reset della password per il tuo account AIRKLIM.</p>
      <p><a href="${resetLink}">Clicca qui per reimpostare la password</a> (link valido per 1 ora).</p>
      <p>Se non hai richiesto tu il reset, ignora questa email.</p>
      <p>— Il team AIRKLIM</p>
    `
  };
  return getTransporter().sendMail(mail);
}

module.exports = { sendWelcomeEmail, sendPasswordResetEmail, getTransporter };
