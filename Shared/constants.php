<?php
/* Start of password related constants */
define("MIN_PASSWORD_LENGTH", 8);
/* End of password related constants */

/* Eventlog constants */
define("EVENT_NOTICE", 0);
define("EVENT_WARNING", 1);
define("EVENT_LOGINERR", 2); // DO NOT CHANGE THIS WITHOUT UPDATING THE FUNCTION IN sessions.php.
define("EVENT_FATAL", 4);
/* End of eventlog constants */
?>