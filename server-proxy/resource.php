<?php
$from = isset($_POST['from']) ? $_POST['from'] : 'Undefined';
echo "Response From: www.b.com <br/>";
echo "Request From: $from";
?>