# Dubai to Abu Dhabi Lift

A small static website for ride inquiries between Dubai and Abu Dhabi. It has no build step or booking backend.

## Pages and assets

- index.html — English homepage, vehicle list, starting fares, FAQs, and quote form.
- ar.html — Arabic service page.
- legal.html — booking terms.
- privacy.html — describes the current form and contact behavior.
- image-credits.html — photo creators and licenses.
- css/style.css — responsive layout, colors, and components.
- js/main.js — mobile navigation, WhatsApp booking links and form, theme toggle, and FAQ accordion.
- js/config.js — business WhatsApp number, optional call number, and reference email.
- images/fleet/ — responsive WebP photo variants for the eight listed models.

## Add the business WhatsApp number

Open `js/config.js` and set `whatsappIntl` to the real business WhatsApp number using international digits only, without `+`, spaces, or punctuation. No placeholder number is included. While it is blank, WhatsApp opens with the visitor's message and asks them to choose a chat; once set, booking messages open directly to the business. The booking form asks the customer for their contact phone number and includes it in the WhatsApp draft.

## Add the call number

Set `phoneIntl` in `js/config.js` to the real call number in international digits only. No dummy number is included. The homepage shows a disabled Call now button until a valid number is configured; after that, it opens the visitor's phone dialer with that number.

## Keep the site accurate

- Check the starting fares, availability, included charges, routes, and booking terms before publishing changes.
- The fleet pictures are representative Wikimedia Commons photos, not photographs of the actual cars. Creator and license details are on image-credits.html.
- Replace a photo only with an image you own or are allowed to use. Update the image credit page when its source or license changes.
- The inquiry form opens a WhatsApp draft. It does not submit to a website server; visitors review the message and tap Send in WhatsApp.
- Email is shown as a reference contact. Ride booking links use WhatsApp.

## Publish

Upload the site files to static hosting with the custom domain and HTTPS enabled. The public sitemap is https://dubaitoabudhabilift.com/sitemap.xml; robots.txt points to it. After publishing, check the live pages and sitemap in Google Search Console.
