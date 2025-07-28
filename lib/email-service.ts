// Mock email service for demo
import nodemailer from 'nodemailer'
import QRCode from 'qrcode'
export class EmailService {
  static async sendInvitation(email: string, guestName: string, qrToken: string): Promise<boolean> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const invitationUrl = `${baseUrl}/q/${qrToken}`
      const qrBuffer = await QRCode.toBuffer(invitationUrl)

      // Debug SMTP credentials
      console.log('📧 SMTP config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM,
      })

      const transporterOptions: any = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }
      // Configura DKIM se presente
      if (process.env.DKIM_PRIVATE_KEY) {
        transporterOptions.dkim = {
          domainName: process.env.DKIM_DOMAIN || '',
          keySelector: process.env.DKIM_KEY_SELECTOR || '',
          privateKey: process.env.DKIM_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
      }
      const transporter = nodemailer.createTransport(transporterOptions)

      // Prepara versione plain-text
      const plainText = `Ciao ${guestName},\nLa tua richiesta è stata approvata!\nAccedi con questo link: ${invitationUrl}\nSe non hai richiesto questo invito, ignora questa email.`
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
        subject: 'Invito alla Terrace Party',
        text: plainText,
        html: `
   <html>
     <body style="font-family:Arial,sans-serif;text-align:center;color:#333;">
       <h1 style="color:#2a9d8f;">Invito alla Terrace Party!</h1>
       <p>Ciao ${guestName},</p>
       <p>La tua richiesta è stata approvata! Inquadra il QR code qui sotto per accedere:</p>
       <div style="margin:20px auto;">
         <img src="cid:qr@invite" alt="QR Code" style="width:200px;height:200px;" />
         <p><a href="${invitationUrl}" style="display:inline-block;margin-top:10px;color:#1d3557;text-decoration:none;">Apri il tuo invito</a></p>
       </div>
       <p>Oppure usa questo link: <a href="${invitationUrl}" style="color:#e76f51;">${invitationUrl}</a></p>
       <p style="font-size:12px;color:#888;">Se non hai richiesto questo invito, ignora questa email.</p>
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
        headers: {
          'List-Unsubscribe': `<mailto:${process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM}?subject=unsubscribe>`,
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High',
        },
      })

      return true
    } catch (error) {
      console.error('Error sending invitation email:', error)
      return false
    }
  }
}
