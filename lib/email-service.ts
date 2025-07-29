// Mock email service for demo
import nodemailer from 'nodemailer'
import QRCode from 'qrcode'

// Email throttling to avoid being flagged as spam
let lastEmailSent = 0
const EMAIL_THROTTLE_MS = 2000 // 2 seconds between emails

export class EmailService {
  static async sendInvitation(email: string, guestName: string, qrToken: string): Promise<boolean> {
    try {
      // Throttling to avoid spam detection
      const now = Date.now()
      const timeSinceLastEmail = now - lastEmailSent
      if (timeSinceLastEmail < EMAIL_THROTTLE_MS) {
        await new Promise(resolve => setTimeout(resolve, EMAIL_THROTTLE_MS - timeSinceLastEmail))
      }
      lastEmailSent = Date.now()

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://privateparty.space'
      const invitationUrl = `${baseUrl}/q/${qrToken}`
      const qrBuffer = await QRCode.toBuffer(invitationUrl)

      // Debug SMTP credentials (remove in production)
      console.log('📧 SMTP config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? '***hidden***' : 'NOT_SET',
        from: process.env.EMAIL_FROM,
      })

      const transporterOptions: any = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        pool: true,
        maxConnections: 1,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 1,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: true,
          minVersion: 'TLSv1.2',
        },
      }
      // Configura DKIM se presente
      if (process.env.DKIM_PRIVATE_KEY) {
        transporterOptions.dkim = {
          domainName: process.env.DKIM_DOMAIN || '',
          keySelector: process.env.DKIM_KEY_SELECTOR || '',
          privateKey: process.env.DKIM_PRIVATE_KEY.replace(/\\n/g, '\n'),
          cacheDir: false,
          hashAlgo: 'sha256',
        }
      }
      const transporter = nodemailer.createTransport(transporterOptions)

      // Verify connection before sending
      try {
        await transporter.verify()
        console.log('✅ SMTP connection verified')
      } catch (verifyError) {
        console.error('❌ SMTP verification failed:', verifyError)
        throw new Error('SMTP connection failed')
      }

      // Prepara versione plain-text
      const plainText = `Ciao ${guestName},

La tua richiesta per l'after party è stata approvata!

DETTAGLI EVENTO:
Via Marco Polo 49, Marinella di Selinunte
Nel cuore del Calannino
Terrazze sul mare con vista mozzafiato

Il tuo link personale: ${invitationUrl}

IMPORTANTE:
- Questo QR code è univoco e nominativo
- Deve essere scansionato solo una volta all'ingresso
- Non condividere con altre persone

Ci vediamo alle terrazze!
Team After Party

Se non hai richiesto questo invito, ignora questa email.`

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
        subject: 'Sei stato accettato per l\'after party!',
        // Critical anti-spam headers
        messageId: `<${Date.now()}.${Math.random().toString(36)}@privateparty.space>`,
        text: plainText,
        html: `
 <!DOCTYPE html>
-<html>
+<html lang="it">
 <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>After Party Invitation</title>
     <style>
         @media only screen and (max-width: 600px) {
             .container { width: 100% !important; padding: 10px !important; }
             .content { padding: 20px !important; }
         }
     </style>
 </head>
 <body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background:#fafafa;color:#1a1f2c;">
     <div class="container" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;">
         <!-- Header -->
         <div style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);color:#ffffff;padding:40px 30px;text-align:center;border-radius:0;">
             <h1 style="margin:0;font-size:28px;font-weight:300;letter-spacing:2px;">AFTER PARTY</h1>
             <p style="margin:10px 0 0;font-size:14px;opacity:0.9;letter-spacing:1px;">EXCLUSIVE INVITATION</p>
         </div>
         
         <!-- Content -->
         <div class="content" style="padding:40px 30px;">
             <h2 style="color:#0f172a;font-size:24px;font-weight:300;margin:0 0 20px;text-align:center;">Sei stato accettato!</h2>
             
             <p style="font-size:16px;line-height:1.6;margin:0 0 30px;text-align:center;">
                 Ciao <strong>${guestName}</strong>,<br>
                 La tua richiesta è stata approvata per la partecipazione all'after party!
             </p>
             
             <!-- Location Details -->
             <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:25px;margin:30px 0;">
                 <h3 style="color:#1e293b;font-size:18px;font-weight:400;margin:0 0 15px;text-align:center;">Location</h3>
                 <p style="margin:0 0 10px;font-size:15px;text-align:center;line-height:1.5;">
                     <strong>Via Marco Polo 49</strong><br>
                     Marinella di Selinunte<br>
                     Nel cuore del Calannino
                 </p>
                 <p style="margin:15px 0 0;font-size:14px;color:#334155;text-align:center;font-style:italic;">
                     Terrazze sul mare con vista mozzafiato<br>
                     L'arte sarà l'anima della festa
                 </p>
             </div>
             
             <!-- QR Code -->
             <div style="text-align:center;margin:40px 0;">
                 <p style="font-size:16px;margin:0 0 20px;color:#1e293b;">Il tuo QR code personale:</p>
                 <div style="display:inline-block;padding:20px;background:#ffffff;border:2px solid #1e293b;border-radius:8px;margin:0 auto;">
                     <img src="cid:qr@invite" alt="QR Code Personale" style="width:200px;height:200px;display:block;" />
                 </div>
                 <p style="margin:20px 0 0;font-size:14px;color:#64748b;">
                     <a href="${invitationUrl}" style="color:#1e293b;text-decoration:none;font-weight:500;">Visualizza invito online</a>
                 </p>
             </div>
             
             <!-- Disclaimer -->
             <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:6px;padding:20px;margin:30px 0;">
                 <h4 style="color:#92400e;font-size:16px;font-weight:500;margin:0 0 10px;">⚠️ Importante - Leggi attentamente</h4>
                 <ul style="color:#92400e;font-size:14px;line-height:1.5;margin:0;padding-left:20px;">
                     <li>Questo QR code è <strong>univoco e nominativo</strong></li>
                     <li>Deve essere <strong>scansionato solo una volta</strong> all'ingresso del party</li>
                     <li>Dopo la scansione risulterà <strong>automaticamente non valido</strong></li>
                     <li>Non condividere questo QR code con altre persone</li>
                 </ul>
             </div>
             
             <p style="text-align:center;font-size:14px;color:#64748b;margin:30px 0 0;">
                 Ci vediamo alle terrazze!<br>
                 <em>Team After Party</em>
             </p>
         </div>
         
         <!-- Footer -->
         <div style="background:#f1f5f9;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
             <p style="margin:0 0 10px;">
                 Questo messaggio è stato inviato a ${email} perché hai richiesto l'accesso all'after party.
             </p>
             <p style="margin:0;font-size:12px;color:#64748b;">
                 Se non hai richiesto questo invito, puoi tranquillamente ignorare questa email.<br>
                 Private Party Team - Via Marco Polo 49, Marinella di Selinunte
             </p>
             <p style="margin:10px 0 0;font-size:11px;color:#94a3b8;">
                 ID Messaggio: ${Date.now()}-${Math.random().toString(36).substr(2, 5)}
             </p>
         </div>
     </div>
     <!-- Tracking pixel for deliverability -->
     <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="1" alt="" style="display:block;">
 </body>
 </html>
         `,
         attachments: [
           {
             filename: 'qrcode.png',
             content: qrBuffer,
             cid: 'qr@invite',
           },
         ],
       })

      return true
    } catch (error) {
      console.error('Error sending invitation email:', error)
      return false
    }
  }
}
