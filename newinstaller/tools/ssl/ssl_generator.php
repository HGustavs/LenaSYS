<?php
# create SSL for only local use( localhost )
$hostname = "localhost";
# a number is needed, so we pick:
$validDays = 420;

# generate a 2048 bit RSA private key
$privateKey = openssl_pkey_new([
	"private_key_bits" => 2048,
	"private_key_type" => OPENSSL_KEYTYPE_RSA,
]);

# SSL keys requires some metadata, even though it is local
$csr = openssl_csr_new([
	"CN" => $hostname,
	"O" => "dev",
	"OU" => "dev",
	"L" => "Locality",
	"ST" => "State",
	"C" => "SE",
],$privateKey);

# Sign the certificate!

$certificate = openssl_csr_sign(
	$csr,
	null,
	$privateKey,
	$validDays,
	["digest_alg" => "sha256"],
);

# export the key and certificate
openssl_pkey_export($privateKey, $privateKeyOut);
openssl_x509_export($certificate, $certificateOut);

# write the output to files
file_put_contents("localhost.key", $privateKeyOut);
file_put_contents("localhost.crt", $certificateOut);





