<?php


function isValidHostname($hostname) {
    // Simple validation for IP addresses and domain names
    return filter_var($hostname, FILTER_VALIDATE_IP) || filter_var($hostname, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME);
}

function ping($host) {
    $output = [];
    $status = null;
    $time = 'N/A'; // Default to 'N/A'
    $timeout = 2000; // Timeout in milliseconds

    if (!isValidHostname($host)) {
        return ['error' => 'Invalid hostname or IP address'];
    }

    // Add timeout option based on OS
    $command = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ?
        sprintf('ping -n 1 -w %d %s', $timeout, escapeshellarg($host)) : // Windows command
        sprintf('ping -c 1 -W %d %s', $timeout / 1000, escapeshellarg($host));  // Other systems

    // Execute the ping command and capture the output
    exec($command, $output, $status);

    // Look for the time in the output
    foreach ($output as $line) {
        if (preg_match('/time[=<](\d+(\.\d+)?)(ms|ms)/i', $line, $matches)) {
            $time = $matches[1];
            break;
        }
    }

    return [
        'status' => $status === 0, // True if online, false if offline
        'time' => $time, // Extracted ping time or 'N/A'
        'output' => implode("\n", $output) // The entire output for debugging purposes
    ];
}

if (function_exists('exec') && !in_array('exec', array_map('trim', explode(',', ini_get('disable_functions'))))) {
    // Only process POST requests with 'hostnameIp' parameter
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && !empty($_POST['hostnameIp'])) {
        $pingResult = ping($_POST['hostnameIp']);
        echo json_encode($pingResult);
    } else {
        echo json_encode(['error' => 'Invalid request']);
    }
} else {
    echo json_encode(['error' => 'Ping is not available on this server.']);
}
?>
