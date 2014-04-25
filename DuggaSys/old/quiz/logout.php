<?php
session_start();
unset($_SESSION['loginName']);
unset($_SESSION['password']);
header("Location: index.html");