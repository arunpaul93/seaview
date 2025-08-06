# Seaview Aged Care Website

A professional website for Seaview Aged Care Home featuring a responsive design, photo gallery, and contact form.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Photo Gallery**: Showcases facility images with modal view
- **Contact Form**: Sends emails directly to admin@seaviewhome.co.nz
- **Professional Styling**: Modern, accessible design
- **Service Information**: Details about care services provided
- **Contact Information**: Phone: 035736027, Email: admin@seaviewhome.co.nz

## Files

- `index.html` - Main website file
- `styles.css` - All CSS styling
- `script.js` - JavaScript functionality
- `contact.php` - Server-side contact form handler
- `seaview (1-4).jpeg` - Facility photos

## Setup Instructions

### Option 1: Simple HTML (Basic Setup)
1. Open `index.html` in any web browser
2. Contact form will use mailto links (opens default email client)

### Option 2: With PHP Server (Full Functionality)
1. Install a local web server with PHP support:
   - **XAMPP**: https://www.apachefriends.org/
   - **WAMP**: http://www.wampserver.com/
   - **MAMP**: https://www.mamp.info/

2. Copy all files to your web server's document root:
   - XAMPP: `C:\xampp\htdocs\seaview\`
   - WAMP: `C:\wamp64\www\seaview\`

3. Access the website at: `http://localhost/seaview/`

### Option 3: Deploy to Web Hosting
1. Upload all files to your web hosting provider
2. Ensure PHP is enabled on your hosting account
3. Update email settings in `contact.php` if needed

## Email Configuration

The contact form is configured to send emails to:
- **Primary Email**: admin@seaviewhome.co.nz
- **Phone**: 035736027

### Customizing Email Settings

To modify email settings, edit `contact.php`:

```php
// Change the recipient email
$to = 'your-email@example.com';

// Modify email headers or content as needed
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Internet Explorer 11+

## Mobile Responsive

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Photo Credits

Photos should be placed in the same directory as the HTML file:
- `seaview (1).jpeg` - Hero section and gallery
- `seaview (2).jpeg` - About section and gallery
- `seaview (3).jpeg` - Gallery
- `seaview (4).jpeg` - Gallery

## Contact Form Features

- **Form Validation**: Client-side validation for all required fields
- **Email Format**: Validates proper email format
- **Phone Formatting**: Automatically formats New Zealand phone numbers
- **Spam Protection**: Basic server-side validation
- **Confirmation Email**: Sends confirmation to form submitter
- **Error Handling**: Graceful fallback to mailto if server fails

## Customization

### Colors
Primary colors can be changed in `styles.css`:
```css
/* Main brand color */
#2c5aa0

/* Hover states */
#1e3d72
```

### Content
Update content directly in `index.html`:
- Company information
- Services offered
- Contact details
- About section

### Photos
Replace the existing images with your own photos. Keep the same filenames or update the references in `index.html` and `script.js`.

## Security Notes

- Form validation on both client and server side
- Input sanitization in PHP
- Protection against basic injection attacks
- Rate limiting should be implemented for production use

## Support

For technical support or customization requests, please contact your web developer.

## License

This website template is created specifically for Seaview Aged Care Home.
