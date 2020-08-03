<?php

session_start();

function respond($msg) {
    echo json_encode(['msg' => $msg]);
}

if(empty($_POST["email"]) &&
    empty($_POST["name"]) &&
    empty($_POST["message"]))
{
    http_response_code(403);
    respond('All the fields are required');
}
else
{
    $email = "mohamed@boudra.me";

    $from = trim($_POST["email"]);
    $message = trim($_POST["message"]);
    $name = trim($_POST["name"]);

    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=utf-8';
    $headers[] = "From: " . $from;

    $stamp = time();

    if(isset($_SESSION['last_message'])) {

	if($_SESSION['last_message'] + (5 * 60) > $stamp) {
	    http_response_code(403);
	    respond("You're sending messages too fast, please try again later");
	    exit;
	}

    }

    $_SESSION['last_message'] = $stamp;

    $message  = "<!DOCTYPE html>";
    $message .= "<html>";
    $message .= "<head>";
    $message .= "<title>Contact form</title>";
    $message .= "</head>";
    $message .= "<body>";
    $message .= '<h2>' . $_POST['name'] . '</h2>';
    $message .= '<p>' . htmlentities($_POST['message']) . '</p>';
    $message .= "</body>";

    if(mail($email, "Contact form boudra.me <{$from}>",
	    $message, implode("\r\n", $headers)))
    {
	respond("The message was sent, I will get to you as soon as possible");
    }
    else
    {
	http_response_code(403);
	respond("The message couldn't be sent, please try again or contact me directly via email");
    }
    
}

?>
