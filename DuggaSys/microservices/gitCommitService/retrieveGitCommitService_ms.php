<?php

function retrieveGitCommitService_ms() {
  // Error handling: Check if Git is installed and accessible
  if (!function_exists('shell_exec')) {
    echo "Error: shell_exec function is disabled. Retrieving Git commits requires server-side execution capabilities.";
    return;
  }

  $output = shell_exec('git log --pretty=format:"%H - %s"'); // Get commits with hash and message

  if ($output === false) {
    echo "Error: Failed to execute Git command.";
    return;
  }

  // Sanitize output before echoing (security precaution)
  $sanitizedOutput = htmlspecialchars($output, ENT_QUOTES); // Escape special characters

  echo $sanitizedOutput;
}

// Call the function (assuming you want to execute it)
retrieveGitCommitService_ms();
