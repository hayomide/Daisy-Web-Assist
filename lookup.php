<?php
include 'funcs.php';
if(!isset($_GET['url'])||empty($_GET['url'])) die('Url not set');
$url=urldecode($_GET['url']);
$url=preg_replace('/\s+/','+',$url);
echo lookup($url,false,'https://ejaworld.com/Daisy/',true);
