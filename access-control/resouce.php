<?php
/*
 * Copyright (c) 2010 the original author or authors
 * @author colorhook@gmail.com
 *
 * Permission is hereby granted to use, modify, and distribute this file
 * in accordance with the terms of the license agreement accompanying it.
 */
header("Access-Control-Allow-Headers: x-requested-with");
header("Access-Control-Allow-Origin: http://www.a.com");
//header("Access-Control-Allow-Method: POST");
//header("Access-Control-Allow-Headers: X-PINGOTHER");
echo "That's right! You can make crossdomain asynchronous HTTP request by specify the HTTP response header: Access-Control-Allow-Origin";
?>