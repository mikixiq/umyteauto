<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$jmeno = isset($_POST['jmeno']) ? trim($_POST['jmeno']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telefon = isset($_POST['telefon']) ? trim($_POST['telefon']) : '';
$zprava = isset($_POST['zprava']) ? trim($_POST['zprava']) : '';

if ($jmeno === '' || $email === '' || $zprava === '') {
    header('Location: index.html');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.html');
    exit;
}

$jmeno = htmlspecialchars($jmeno, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$telefon = htmlspecialchars($telefon, ENT_QUOTES, 'UTF-8');
$zprava = htmlspecialchars($zprava, ENT_QUOTES, 'UTF-8');

$to = 'objednavky@umyteauto.cz';
$subject = 'Nová poptávka z webu Umyté auto';
$message = "Nová poptávka z webu:\n\n";
$message .= "Jméno: $jmeno\n";
$message .= "E-mail: $email\n";
$message .= "Telefon: $telefon\n\n";
$message .= "Zpráva:\n$zprava\n";

// Zjednodušené hlavičky
$headers = "From: web@umyteauto.cz\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Zkusíme odeslat bez parametru -f
if (mail($to, $subject, $message, $headers)) {
    header('Location: index.html?status=success');
} else {
    // Pokud tohle vypíše chybu přímo na webu, budeme vědět, že to server blokuje
    die("Chyba: Funkce mail() selhala.");
}

header('Location: index.html');
exit;
