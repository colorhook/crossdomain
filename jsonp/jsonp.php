<?php
/**
 *
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