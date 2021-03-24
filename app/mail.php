<?
require_once 'PHPMailer/PHPMailerAutoload.php';

$admin_email = array();
foreach ( $_POST["admin_email"] as $key => $value ) {
	array_push($admin_email, $value);
}

$form_subject = trim($_POST["form_subject"]);

$mail = new PHPMailer;
$mail->CharSet = 'UTF-8';

// Настройки SMTP
// $mail->isSMTP();
// $mail->SMTPAuth = true;
// $mail->SMTPDebug = 0;
 
// $mail->Host = 'ssl://smtp.gmail.com';
// $mail->Port = 465;
// $mail->Username = 'Логин';
// $mail->Password = 'Пароль';


$c = true;
$message = '';
foreach ( $_POST as $key => $value ) {
	if ( $value != ""  && $key != "admin_email" && $key != "form_subject" ) {
		if (is_array($value)) {
			$val_text = '';
			foreach ($value as $val) {
				if ($val && $val != '') {
					$val_text .= ($val_text==''?'':', ').$val;
				}
			}
			$value = $val_text;
		}
		$message .= "
		" . ( ($c = !$c) ? '<tr>':'<tr>' ) . "
		<td style='padding: 10px; width: auto;'><b>$key:</b></td>
		<td style='padding: 10px;width: 100%;'>$value</td>
		</tr>
		";
	}
}
$message = "<table style='width: 50%;'>$message</table>";


// От кого
$mail->setFrom('adm@' . $_SERVER['HTTP_HOST'], 'Your best site');
 
// Кому
foreach ( $admin_email as $key => $value ) {
	$mail->addAddress($value);
}
// Тема письма
$mail->Subject = $form_subject;
 
// Тело письма
$body = $message;
// $mail->isHTML(true);  это если прям верстка
$mail->msgHTML($body);

// Приложения
if ($_FILES){
	foreach ( $_FILES['file']['tmp_name'] as $key => $value ) {
		$mail->addAttachment($value, $_FILES['file']['name'][$key]);
	}
}
$mail->send();
?>