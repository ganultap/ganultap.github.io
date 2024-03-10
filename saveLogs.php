<?php

// Set the directory where log files will be saved
$logDirectory = __DIR__ . '/logs';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if the logs directory exists, if not try to create it
    if (!file_exists($logDirectory)) {
        if (!mkdir($logDirectory, 0755, true)) {
            // If the directory can't be created, send an error response
            echo json_encode(['error' => 'Failed to create log directory.']);
            exit;
        }
    }

    // Get the JSON as a string from the request body
    $jsonStr = file_get_contents('php://input');

    // Generate a unique filename with a timestamp in the format YYYY-MM-DD-HH-MM
    $filename = $logDirectory . '/log_' . date('Y-m-d-H-i') . '.txt';

    // Write the data to the newly generated file
    if (file_put_contents($filename, $jsonStr) !== false) {
        echo json_encode(['message' => 'Log saved successfully.']);
    } else {
        echo json_encode(['error' => 'Failed to save log.']);
    }
} else {
    // Handle non-POST requests
    echo json_encode(['message' => 'Invalid request method']);
}
