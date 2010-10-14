<?php
/*
 * Copyright (c) 2010 the original author or authors
 * @author colorhook@gmail.com
 *
 * Permission is hereby granted to use, modify, and distribute this file
 * in accordance with the terms of the license agreement accompanying it.
 */
$callback = isset($_GET['callback']) ? $_GET['callback'] : '';
$arraydata = array(
	'timestamp' => strftime ('%X'),
	'count' => 2,
	'data'=> array(
		array(
			'id' => 1,
			'name' => 'foo'
		),
		array(
			'id' => 2,
			'name' => 'bar'
		)
	)
);
$jsondata = json_encode ($arraydata);
echo "$callback($jsondata)";
?>