<?php

declare(strict_types=1);



header('Content-Type: application/json; charset=UTF-8');




function sendResponse(
    bool $success,
    string $message,
    int $statusCode = 200
): void {
    http_response_code($statusCode);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message
        ],
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );

    exit;
}


function textLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value);
    }

    return strlen($value);
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(
        false,
        'Method not allowed.',
        405
    );
}




$recipientEmail = 'hello@advantshield.com';

$siteName = 'LLC Advantshield';




$name = isset($_POST['name'])
    ? trim((string) $_POST['name'])
    : '';

$email = isset($_POST['email'])
    ? trim((string) $_POST['email'])
    : '';

$service = isset($_POST['service'])
    ? trim((string) $_POST['service'])
    : '';

$zip = isset($_POST['zip'])
    ? trim((string) $_POST['zip'])
    : '';

$message = isset($_POST['message'])
    ? trim((string) $_POST['message'])
    : '';




$name = strip_tags($name);
$service = strip_tags($service);
$zip = strip_tags($zip);
$message = strip_tags($message);

$name = preg_replace(
    '/[\r\n]+/',
    ' ',
    $name
) ?? '';

$service = preg_replace(
    '/[\r\n]+/',
    ' ',
    $service
) ?? '';

$zip = preg_replace(
    '/[\r\n]+/',
    ' ',
    $zip
) ?? '';

$email = str_replace(
    ["\r", "\n"],
    '',
    $email
);

$message = preg_replace(
    '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u',
    '',
    $message
) ?? '';




if (
    $name === '' ||
    $email === '' ||
    $service === '' ||
    $zip === '' ||
    $message === ''
) {
    sendResponse(
        false,
        'Please complete all required fields.',
        422
    );
}


if (
    textLength($name) < 2 ||
    textLength($name) > 100
) {
    sendResponse(
        false,
        'Please enter a valid name.',
        422
    );
}


if (
    !filter_var(
        $email,
        FILTER_VALIDATE_EMAIL
    )
) {
    sendResponse(
        false,
        'Please enter a valid email address.',
        422
    );
}


if (textLength($email) > 190) {
    sendResponse(
        false,
        'Please enter a valid email address.',
        422
    );
}


if (textLength($service) > 120) {
    sendResponse(
        false,
        'Please select a valid service.',
        422
    );
}

if (
    textLength($zip) > 20 ||
    !preg_match(
        '/^[0-9A-Za-z][0-9A-Za-z\s-]{1,18}[0-9A-Za-z]$/',
        $zip
    )
) {
    sendResponse(
        false,
        'Please enter a valid ZIP code.',
        422
    );
}


if (
    textLength($message) < 10 ||
    textLength($message) > 5000
) {
    sendResponse(
        false,
        'Please enter a message between 10 and 5000 characters.',
        422
    );
}


if (
    preg_match_all(
        '/https?:\/\//i',
        $message,
        $links
    ) > 4
) {
    sendResponse(
        false,
        'Your message looks like spam. Please remove extra links and try again.',
        422
    );
}




$allowedServices = [
    'Digital Strategy',
    'SEO',
    'Social Media Marketing',
    'Paid Advertising',
    'Content Marketing',
    'Web Design',
    'Integrated Marketing'
];

if (
    !in_array(
        $service,
        $allowedServices,
        true
    )
) {
    sendResponse(
        false,
        'Please select a valid service.',
        422
    );
}




$safeName = htmlspecialchars(
    $name,
    ENT_QUOTES |
    ENT_SUBSTITUTE,
    'UTF-8'
);

$safeEmail = htmlspecialchars(
    $email,
    ENT_QUOTES |
    ENT_SUBSTITUTE,
    'UTF-8'
);

$safeService = htmlspecialchars(
    $service,
    ENT_QUOTES |
    ENT_SUBSTITUTE,
    'UTF-8'
);

$safeZip = htmlspecialchars(
    $zip,
    ENT_QUOTES |
    ENT_SUBSTITUTE,
    'UTF-8'
);

$safeMessage = htmlspecialchars(
    $message,
    ENT_QUOTES |
    ENT_SUBSTITUTE,
    'UTF-8'
);

$safeSiteName = htmlspecialchars(
    $siteName,
    ENT_QUOTES |
    ENT_SUBSTITUTE,
    'UTF-8'
);

$headerName = trim(
    preg_replace(
        '/["<>]+/',
        '',
        $name
    ) ?? ''
);

$headerSiteName = trim(
    preg_replace(
        '/["<>]+/',
        '',
        $siteName
    ) ?? ''
);


$subject = sprintf(
    'New %s enquiry — %s',
    $siteName,
    $service
);


$emailBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New {$safeSiteName} Enquiry</title>
</head>

<body style="
    margin:0;
    padding:32px;
    background:#f5f2f7;
    font-family:Arial,sans-serif;
    color:#17151f;
">

    <div style="
        max-width:680px;
        margin:0 auto;
        padding:32px;
        background:#ffffff;
        border-radius:20px;
    ">

        <h1 style="
            margin:0 0 24px;
            font-size:26px;
        ">
            New project enquiry
        </h1>

        <p>
            <strong>Name:</strong><br>
            {$safeName}
        </p>

        <p>
            <strong>Email:</strong><br>
            {$safeEmail}
        </p>

        <p>
            <strong>Service:</strong><br>
            {$safeService}
        </p>

        <p>
            <strong>ZIP code:</strong><br>
            {$safeZip}
        </p>

        <p>
            <strong>Project details:</strong>
        </p>

        <div style="
            padding:18px;
            background:#f5f2f7;
            border-radius:14px;
            line-height:1.7;
        ">
            {$safeMessage}
        </div>

    </div>

</body>
</html>
HTML;




$domain = isset($_SERVER['SERVER_NAME'])
    ? preg_replace(
        '/[^a-zA-Z0-9.-]/',
        '',
        (string) $_SERVER['SERVER_NAME']
    )
    : 'localhost';

if (
    !$domain ||
    $domain === 'localhost'
) {
    $fromEmail = 'no-reply@localhost';
} else {
    $fromEmail = 'no-reply@' . $domain;
}


$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . $headerSiteName . ' Website <' . $fromEmail . '>',
    'Reply-To: ' . $headerName . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];




$mailSent = @mail(
    $recipientEmail,
    $subject,
    $emailBody,
    implode("\r\n", $headers)
);




if (!$mailSent) {
    sendResponse(
        false,
        'Something went wrong. Please try again.',
        500
    );
}


sendResponse(
    true,
    'Message sent successfully'
);
