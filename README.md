# 🌊 Sistema Inviti Terrazza - Super Semplice

Sistema di inviti per after-party con database JSON. Zero configurazione, massima semplicità!

## 🚀 Avvio Immediato

\`\`\`bash
# 1. Copia il file .env.example in un nuovo file .env.local e imposta le credenziali SMTP
cp .env.example .env.local
# 2. Installa dipendenze
npm install

# 3. Avvia il server
npm run dev
\`\`\`

**È tutto qui!** Il sistema è subito funzionante su http://localhost:3000

## 🌐 Configurazione Produzione

Per il deploy su **privateparty.space**, assicurati di configurare:

1. **Variabile ambiente principale**:
   ```
   NEXT_PUBLIC_BASE_URL=https://privateparty.space
   ```

2. **Configurazione SMTP** per email reali
3. **Records DNS** per deliverability (SPF, DKIM, DMARC)

## 📧 ANTI-SPAM: Setup Completo per Inbox Delivery

### 1. Provider SMTP Professionale
Usa SOLO provider affidabili:
- ✅ **SendGrid** (raccomandato)
- ✅ **Mailgun** 
- ✅ **Amazon SES**
- ✅ **Postmark**
- ❌ NON usare Gmail/provider gratuiti

### 2. DNS Records OBBLIGATORI

#### SPF Record (TXT)
```
v=spf1 include:sendgrid.net ~all
```

#### DKIM Record (TXT)
```
Nome: mail._domainkey.privateparty.space
Valore: [chiave pubblica dal provider SMTP]
```

#### DMARC Record (TXT)
```
Nome: _dmarc.privateparty.space
Valore: v=DMARC1; p=quarantine; rua=mailto:dmarc@privateparty.space
```

#### MX Record
```
privateparty.space. MX 10 mx.sendgrid.net.
```

### 3. Configurazione Dominio
- **Warm-up** del dominio: invia email gradualmente
- **Verifica dominio** presso il provider SMTP
- **IP dedicato** se possibile
- **Reverse DNS** configurato

### 4. Variabili Ambiente Anti-Spam
```env
EMAIL_FROM="Private Party <noreply@privateparty.space>"
EMAIL_REPLY_TO=noreply@privateparty.space
DKIM_DOMAIN=privateparty.space
DKIM_KEY_SELECTOR=mail
DKIM_PRIVATE_KEY="[chiave privata DKIM]"
```

### 5. Test Deliverability
Testa con:
- [Mail-tester.com](https://mail-tester.com) (punteggio 10/10)
- [MXToolbox](https://mxtoolbox.com)
- Test su Gmail, Outlook, Yahoo

### 6. Monitoraggio
- Controlla bounce rate < 5%
- Complaint rate < 0.1%
- Monitor blacklist status
- Analytics di apertura/click

⚠️ **CRITICO**: Senza questi setup, le email finiranno in spam!

## 📁 Database JSON

Tutto è salvato in \`data/database.json\`:

\`\`\`json
{
  "admin": {
    "username": "admin", 
    "password": "password"
  },
  "requests": [...],
  "tokens": [...],
  "sessions": [...]
}
\`\`\`

Il file si aggiorna automaticamente ad ogni operazione.

## 🎯 Come Funziona

### 1. **Richiesta Accesso** (/)
- Form semplice: nome, cognome, email, Instagram
- Dati salvati automaticamente nel JSON

### 2. **Admin Panel** (/admin)
- Login: \`admin\` / \`password\`
- Dashboard con tutte le richieste
- Bottone "Approva" per ogni richiesta

### 3. **Approvazione**
- Genera QR code univoco
- Salva nel database JSON
- Simula invio email (vedi console)

### 4. **Validazione QR** (/q/[token])
- Prima visita: "Benvenuto!" + marca come usato
- Seconda visita: "QR già utilizzato"

## 📊 Funzionalità

✅ **Database JSON** - Un solo file, zero setup  
✅ **Auto-aggiornamento** - Il JSON si modifica da solo  
✅ **Admin semplice** - Login e dashboard minimali  
✅ **QR univoci** - Token non riutilizzabili  
✅ **Responsive** - Funziona su mobile  
✅ **Deploy facile** - Vercel, Netlify, ovunque  

## 🌐 Deploy Gratuito

### Vercel (Consigliato)
1. Push su GitHub
2. Connetti a Vercel
3. Deploy automatico!

### Netlify
1. Drag & drop della cartella
2. Funziona subito

## 🔧 Personalizzazione

### Cambiare Credenziali Admin
Modifica \`data/database.json\`:
\`\`\`json
{
  "admin": {
    "username": "tuousername",
    "password": "tuapassword"
  }
}
\`\`\`

### Aggiungere Campi
Modifica i form e le API per nuovi campi.

### Styling
Tutto in Tailwind CSS, facile da personalizzare.

## 📱 Utilizzo

1. **Ospiti**: Vanno su / e compilano il form
2. **Admin**: Va su /admin, fa login, approva le richieste
3. **Entrata**: Gli ospiti mostrano il QR code ricevuto via email
4. **Controllo**: Scansiona o visita il link del QR

## 🔒 Sicurezza

- Session cookies per admin
- Token univoci per QR
- Validazione una sola volta
- Niente database esterno da proteggere
- Email deliverability: configura SPF, DKIM e DMARC nel DNS del tuo dominio per evitare che le email finiscano in spam. Aggiungi i record:
  - SPF: `v=spf1 include:_spf.yourmailprovider.com ~all`
  - DKIM: chiave pubblica con selector configurato in `DKIM_KEY_SELECTOR`
  - DMARC: `v=DMARC1; p=none; rua=mailto:postmaster@tuodominio.com`
  
### Variabili ambiente per anti-spam
Assicurati di aver configurato in `.env.local`:
- `EMAIL_REPLY_TO`: indirizzo su cui ricevere risposte e unsubscribe
- `DKIM_DOMAIN`, `DKIM_KEY_SELECTOR`, `DKIM_PRIVATE_KEY` per la firma DKIM

## 📝 Note

- **Email reali**: Invia email tramite SMTP configurato in .env.local
- **Dati persistenti**: Tutto salvato in JSON
- **Zero dipendenze**: Solo Next.js e Tailwind
- **Pronto per produzione**: Aggiungi solo SMTP reale

---

**Semplicità massima, funzionalità complete!** 🚀
