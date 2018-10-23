<?php
include 'funcs.php';
if(!isset($_GET['origin'])||empty($_GET['origin'])||!isset($_GET['req_url'])||empty($_GET['req_url'])) die('Host or Req Url or Query not set');
$origin=urldecode($_GET['origin']); $req_url=urldecode($_GET['req_url']); $query=isset($_GET['query'])&&!empty($_GET['query'])?$_GET['query']:'';
$url=preg_replace('/\s+/','+',$origin.$req_url.$query);
echo lookup($url,false,'https://ejaworld.com/Daisy/',true);