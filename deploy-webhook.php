<?php
/**
 * GitHub Webhook Auto-Deploy Script for Hostinger
 * 
 * Setup Instructions:
 * 1. Upload this file to: public_html/finaccount/deploy-webhook.php
 * 2. Set a secret key below (replace 'YOUR_SECRET_KEY')
 * 3. In GitHub: Settings → Webhooks → Add webhook
 *    - Payload URL: https://finaccount.kashiskin.com/deploy-webhook.php
 *    - Content type: application/json
 *    - Secret: (use the same secret key you set below)
 *    - Events: Just the push event
 * 4. Save webhook
 * 
 * Now every push to main branch will auto-deploy!
 */

// SECURITY: Set your secret key here (must match GitHub webhook secret)
define('SECRET_KEY', 'SovFramework2026!Deploy');

// Configuration
define('REPO_URL', 'https://github.com/kfrem/FinAccord-Website.git');
define('BRANCH', 'main');
define('DEPLOY_PATH', __DIR__);

// Logging
define('LOG_FILE', __DIR__ . '/deploy.log');

function logMessage($message) {
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents(LOG_FILE, "[$timestamp] $message\n", FILE_APPEND);
}

// Verify GitHub signature
function verifySignature($payload, $signature) {
    if (empty($signature)) {
        return false;
    }
    
    $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, SECRET_KEY);
    return hash_equals($expectedSignature, $signature);
}

// Get payload
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

// Verify signature
if (!verifySignature($payload, $signature)) {
    logMessage('ERROR: Invalid signature');
    http_response_code(403);
    die('Invalid signature');
}

// Parse payload
$data = json_decode($payload, true);

// Check if push to main branch
if (!isset($data['ref']) || $data['ref'] !== 'refs/heads/' . BRANCH) {
    logMessage('INFO: Not a push to ' . BRANCH . ' branch, ignoring');
    die('Not a push to ' . BRANCH);
}

logMessage('INFO: Valid webhook received, starting deployment...');

// Change to deployment directory
chdir(DEPLOY_PATH);

// Execute deployment commands
$commands = [
    'git fetch origin ' . BRANCH . ' 2>&1',
    'git reset --hard origin/' . BRANCH . ' 2>&1',
    'git clean -fd 2>&1'
];

$output = [];
foreach ($commands as $cmd) {
    logMessage("EXEC: $cmd");
    exec($cmd, $output);
    logMessage("OUTPUT: " . implode("\n", $output));
    $output = [];
}

logMessage('SUCCESS: Deployment completed');

// Return success response
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Deployment completed',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
