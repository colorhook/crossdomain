<?php
/*
 * Copyright (c) 2010 the original author or authors
 * @author colorhook@gmail.com
 *
 * Permission is hereby granted to use, modify, and distribute this file
 * in accordance with the terms of the license agreement accompanying it.
 */
$from = isset($_POST['from']) ? $_POST['from'] : 'Undefined';
echo "Response From: www.b.com <br/>";
echo "Request From: $from";
?>