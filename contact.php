<?php
// Contact form handler for Seaview Aged Care
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get form data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'subject', 'message'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Field '$field' is required"]);
        exit;
    }
}

// Sanitize input data
$name = filter_var(trim($input['name']), FILTER_SANITIZE_STRING);
$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);
$phone = isset($input['phone']) ? filter_var(trim($input['phone']), FILTER_SANITIZE_STRING) : '';
$subject = filter_var(trim($input['subject']), FILTER_SANITIZE_STRING);
$message = filter_var(trim($input['message']), FILTER_SANITIZE_STRING);

// Validate email
if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Email configuration
$to = 'admin@seaviewhome.co.nz';
$email_subject = "Seaview Aged Care Contact Form: " . ucfirst($subject);

// Create email content
$email_body = "
New contact form submission from Seaview Aged Care website:

Name: $name
Email: $email
Phone: " . ($phone ?: 'Not provided') . "
Subject: " . ucfirst($subject) . "

Message:
$message

---
This message was sent from the Seaview Aged Care website contact form.
Sent on: " . date('Y-m-d H:i:s') . "
IP Address: " . $_SERVER['REMOTE_ADDR'] . "
";

// Email headers
$headers = [
    'From: "Seaview Website" <noreply@seaviewhome.co.nz>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email
$mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Send confirmation email to sender
    $confirmation_subject = "Thank you for contacting Seaview Aged Care";
    $confirmation_body = "
Dear $name,

Thank you for contacting Seaview Aged Care. We have received your message and will get back to you as soon as possible.

Your message:
Subject: " . ucfirst($subject) . "
Message: $message

For urgent matters, please call us directly at 035736027.

Best regards,
The Seaview Aged Care Team

---
Seaview Aged Care Home
Phone: 035736027
Email: admin@seaviewhome.co.nz
";

    $confirmation_headers = [
        'From: "Seaview Aged Care" <admin@seaviewhome.co.nz>',
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];

    mail($email, $confirmation_subject, $confirmation_body, implode("\r\n", $confirmation_headers));

    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully. We will get back to you soon!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email. Please try again or call us directly at 035736027.'
    ]);
}
?>
