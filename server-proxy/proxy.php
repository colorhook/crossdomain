<?php
/*
 * Copyright (c) 2010 the original author or authors
 * @author colorhook@gmail.com
 *
 * Permission is hereby granted to use, modify, and distribute this file
 * in accordance with the terms of the license agreement accompanying it.
 */
class Proxy{
	static function request_by_curl($url, $method, $data){
		$ch = curl_init($url);
		if ( strtolower($method) == 'post' ) {
			curl_setopt( $ch, CURLOPT_POST, true );
			curl_setopt( $ch, CURLOPT_POSTFIELDS, $_POST );
		 }
		// curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true ); comment this line to ignore http redirect
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

		$response = curl_exec($ch);
		curl_close($ch);
		return $response;
	}

	static function request_by_file($url, $method, $data){
		  if(is_array($data)){
			  $data = http_build_query($data, '', '&');
		  }
		 $ctx = array (
			'http' => array (
				'method' => strtoupper($method),
				'header'=> "Content-type: application/x-www-form-urlencoded\r\n"
					. "Content-Length: " . strlen($data) . "\r\n",
				'content' => $data
			)
		);
       $context = stream_context_create($ctx);
       return file_get_contents($url,false,$context);
	}
}

//entry point
$resource = isset($_REQUEST['resource']) ? $_REQUEST['resource'] : '';
if($resource == ''){
	exit(0);
}
$method = $_SERVER['REQUEST_METHOD'];
$data =  strtolower($method) == 'post' ? $_POST: $_GET;

if(function_exists('file_get_contents')){
	echo Proxy::request_by_file($resource, $method, $data);
}else if(function_exists('curl_init')){
	echo Proxy::request_by_curl($resource, $method, $data);
}
?>