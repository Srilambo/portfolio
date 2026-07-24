/**
 * WhatsApp Notification Service (Meta Cloud API & CallMeBot Fallback)
 *
 * Security: The credentials are loaded from environment variables ONLY.
 * They are never stored in the database or exposed to the client in any way.
 */

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends a WhatsApp notification to the admin's private number using Meta Cloud API
 * or falls back to CallMeBot if Meta is not configured.
 */
export async function sendWhatsAppNotification(data: ContactData): Promise<void> {
  const timestamp = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Colombo',
    day:    '2-digit',
    month:  'short',
    hour:   '2-digit',
    minute: '2-digit',
  });

  const preview = data.message.length > 150
    ? data.message.slice(0, 150).trim() + '…'
    : data.message;

  const text = [
    '📬 *New Portfolio Message*',
    '',
    `👤 *From:* ${data.name}`,
    `📧 *Email:* ${data.email}`,
    `📌 *Subject:* ${data.subject}`,
    `🕐 *Time:* ${timestamp} IST`,
    '',
    `💬 *Message:*`,
    preview
  ].join('\n');

  // 1. Try WASender API configuration first if available
  const wasenderApiKey = process.env.WASENDER_API_KEY;
  const wasenderRecipient = process.env.WASENDER_RECIPIENT_NUMBER || process.env.WHATSAPP_ADMIN_NUMBER || process.env.META_WA_RECIPIENT_NUMBER;
  const wasenderUrl = process.env.WASENDER_API_URL || 'https://wasenderapi.com/api/send-message';

  if (wasenderApiKey && wasenderRecipient) {
    console.info('[WhatsApp] Attempting send via WASender API...');
    try {
      const response = await fetch(wasenderUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${wasenderApiKey}`,
          'X-API-KEY': wasenderApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: wasenderApiKey,
          apiKey: wasenderApiKey,
          to: wasenderRecipient.replace(/^\+/, ''),
          phone: wasenderRecipient.replace(/^\+/, ''),
          receiver: wasenderRecipient.replace(/^\+/, ''),
          recipient: wasenderRecipient.replace(/^\+/, ''),
          message: text,
          msg: text,
          text: text
        })
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.warn(`[WhatsApp] WASender API returned status ${response.status}: ${errText}`);
      } else {
        console.info('[WhatsApp] Notification sent successfully via WASender API');
        return;
      }
    } catch (err: any) {
      console.error('[WhatsApp] WASender API request failed:', err?.message || err);
    }
  }

  // 2. Try Meta Cloud API configuration next
  const metaToken = process.env.META_WA_ACCESS_TOKEN;
  const metaPhoneId = process.env.META_WA_PHONE_NUMBER_ID;
  const metaRecipient = process.env.META_WA_RECIPIENT_NUMBER; // Format: country code + number, e.g., 94771234567 (no + sign)
  const metaTemplate = process.env.META_WA_TEMPLATE_NAME; // Optional: e.g., portfolio_alert

  if (metaToken && metaPhoneId && metaRecipient && !metaToken.includes('your_meta')) {
    console.info('[WhatsApp] Attempting send via Meta Business Cloud API...');
    
    const url = `https://graph.facebook.com/v20.0/${metaPhoneId}/messages`;
    let bodyData: any;

    if (metaTemplate) {
      // Template Message (Required by Meta to start/initiate conversations securely)
      bodyData = {
        messaging_product: 'whatsapp',
        to: metaRecipient,
        type: 'template',
        template: {
          name: metaTemplate,
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: data.name },
                { type: 'text', text: data.email },
                { type: 'text', text: data.subject },
                { type: 'text', text: preview }
              ]
            }
          ]
        }
      };
    } else {
      // Free-form text message (Works only if a 24-hour window is active)
      bodyData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: metaRecipient,
        type: 'text',
        text: { body: text }
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${metaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({}));
      throw new Error(`Meta API responded with ${response.status}: ${JSON.stringify(errorResponse)}`);
    }

    console.info('[WhatsApp] Notification sent successfully via Meta Cloud API');
    return;
  }

  // 3. Fallback to CallMeBot if neither WASender nor Meta is configured
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  const apiKey      = process.env.WHATSAPP_API_KEY;

  if (!adminNumber || !apiKey || apiKey.includes('YOUR_CALLMEBOT_KEY')) {
    console.info('[WhatsApp] Skipping: No valid WhatsApp service (WASender, Meta, or CallMeBot) is configured in .env');
    return;
  }

  console.info('[WhatsApp] Attempting send via CallMeBot fallback...');

  const cmbText = [
    '📬 *New Portfolio Message*',
    '',
    `👤 *From:* ${data.name}`,
    `📧 *Email:* ${data.email}`,
    `📌 *Subject:* ${data.subject}`,
    `🕐 *Time:* ${timestamp} IST`,
    '',
    `💬 *Message:*`,
    preview,
    '',
    '_(View full message in your admin panel)_',
  ].join('\n');

  const url = new URL('https://api.callmebot.com/whatsapp.php');
  url.searchParams.set('phone',  adminNumber);
  url.searchParams.set('text',   cmbText);
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`CallMeBot responded ${response.status}: ${body}`);
  }

  console.info('[WhatsApp] Notification sent successfully via CallMeBot');
}

