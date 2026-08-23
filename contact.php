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


function readConfigString(
    string $configSource,
    string $key
): ?string {
    $pattern = '/\b' . preg_quote($key, '/') . '\s*:\s*("(?:\\\\.|[^"\\\\])*")/';

    if (
        !preg_match(
            $pattern,
            $configSource,
            $matches
        )
    ) {
        return null;
    }

    $value = json_decode(
        $matches[1],
        true
    );

    return is_string($value)
        ? trim($value)
        : null;
}


function readSiteConfig(): array
{
    $configPath = __DIR__ . '/config/config.js';

    if (!is_readable($configPath)) {
        sendResponse(
            false,
            'Something went wrong. Please try again.',
            500
        );
    }

    $configSource = file_get_contents($configPath);

    if ($configSource === false) {
        sendResponse(
            false,
            'Something went wrong. Please try again.',
            500
        );
    }

    $brandName = readConfigString(
        $configSource,
        'brandName'
    );

    $email = readConfigString(
        $configSource,
        'email'
    );

    if (
        !$brandName ||
        !$email ||
        !filter_var(
            $email,
            FILTER_VALIDATE_EMAIL
        )
    ) {
        sendResponse(
            false,
            'Something went wrong. Please try again.',
            500
        );
    }

    return [
        'brandName' => preg_replace(
            '/[\r\n]+/',
            ' ',
            strip_tags($brandName)
        ) ?? '',
        'email' => $email
    ];
}




if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(
        false,
        'Method not allowed.',
        405
    );
}




$siteConfig = readSiteConfig();

$recipientEmail = $siteConfig['email'];

$siteName = $siteConfig['brandName'];




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
    mb_strlen($name) < 2 ||
    mb_strlen($name) > 100
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


if (mb_strlen($email) > 190) {
    sendResponse(
        false,
        'Please enter a valid email address.',
        422
    );
}


if (mb_strlen($service) > 120) {
    sendResponse(
        false,
        'Please select a valid service.',
        422
    );
}

if (
    mb_strlen($zip) > 20 ||
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
    mb_strlen($message) < 10 ||
    mb_strlen($message) > 5000
) {
    sendResponse(
        false,
        'Please enter a message between 10 and 5000 characters.',
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
    'From: ' . $siteName . ' Website <' . $fromEmail . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];




$mailSent = mail(
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
    'Thank you. Your message has been successfully sent.'
);
