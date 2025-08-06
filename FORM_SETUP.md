# Contact Form Setup Guide

Your Seaview website now supports multiple ways to handle form submissions internally without opening the user's email client.

## Option 1: Web3Forms (Recommended - FREE & Easy)

**Why Web3Forms?**
- ✅ Completely FREE
- ✅ No server setup required
- ✅ Sends emails directly to admin@seaviewhome.co.nz
- ✅ Works immediately
- ✅ No technical setup needed

**Setup Steps:**
1. Go to https://web3forms.com/
2. Click "Get Started Free"
3. Enter your email: `admin@seaviewhome.co.nz`
4. You'll receive an Access Key via email
5. Copy the Access Key
6. In `script.js`, replace `YOUR_WEB3FORMS_KEY` with your actual key

**Example:**
```javascript
access_key: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Your actual key
```

## Option 2: Formspree (Also FREE)

**Setup Steps:**
1. Go to https://formspree.io/
2. Sign up with admin@seaviewhome.co.nz
3. Create a new form
4. Copy your form ID (looks like: xpzgkjyz)
5. In `script.js`, replace `YOUR_FORM_ID` with your actual ID

## Option 3: EmailJS (FREE tier available)

**Setup Steps:**
1. Go to https://www.emailjs.com/
2. Sign up and create a service
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Add EmailJS script to your HTML head:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

## Option 4: Your PHP Server (Current)

The PHP option (`contact.php`) will work if you have:
- Web hosting with PHP support
- Mail server configured
- Proper email headers setup

## How It Works Now:

1. **User fills out form** → clicks submit
2. **JavaScript tries services in order:**
   - EmailJS (if configured)
   - Your PHP handler
   - Formspree (if configured)
   - Web3Forms (if configured)
3. **If all fail** → falls back to mailto
4. **User sees success message** → form resets

## Recommended Quick Setup:

**For immediate functionality:**
1. Use Web3Forms (5 minutes setup)
2. Get your access key
3. Replace `YOUR_WEB3FORMS_KEY` in `script.js`
4. Done! Forms will submit internally

## Testing:

1. Fill out your contact form
2. Submit it
3. Check admin@seaviewhome.co.nz for the email
4. Should receive formatted email with all form details

## Benefits:

- ✅ **No mailto popups** - seamless user experience
- ✅ **Professional appearance** - forms submit smoothly
- ✅ **Email delivery** - direct to admin@seaviewhome.co.nz
- ✅ **Form validation** - prevents spam and errors
- ✅ **Confirmation messages** - users know their message was sent
- ✅ **Multiple fallbacks** - ensures reliability

Choose Web3Forms for the quickest and easiest setup!
