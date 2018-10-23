<?php
session_id('DaisyAssist');
session_start();
set_time_limit(0);
define('PROJ_NAME','DAISY ASSIST');
define('BOT_NAME','DBot');
define('BOT_USER_AGENT',$_SERVER['HTTP_USER_AGENT']);
define('BOT_SIGN',md5('Daisy your Voice Driven PA'));
define('BOT_COOKIE_JAR','DBot_cookies.txt');
define('BOT_COOKIE_FILE','DBot_cookies.txt');
define('APP_NAME','DAISY ASSIST');
define('APP_SHORT_NAME','DAISY');
define('APP_THEME_COLOR','#000000');
define('DAISY_DB_HOST','127.0.0.1');
define('DAISY_DB_USER','root');
define('DAISY_DB_PASS','Daisy_NaijaHacks2018');
define('DAISY_DB_NAME','main');
define('MOTHER_DOMAIN','daisy-oreo.tech');
define('USR_SESS_NAME','DAISY_user_id');
define('PW_SESS_NAME','DAISY_user_pass');
define('NAVDATA_SESS_NAME','DAISY_user_navigator_data');
define('GEODATA_SESS_NAME','DAISY_user_geolocation_data');

function convertFileSize($size) {
    $unit=array('B','kB','MB','GB','TB','PB');
    return @round($size/pow(1024,($i=floor(log($size,1024)))),2).' '.$unit[$i];
}

function get_client_ip() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    return $ipaddress;
}

function get_client_info($ip) {
    $dts=json_decode(file_get_contents("http://timezoneapi.io/api/ip/?ip={$ip}"),true);
    if($dts['meta']['code']=='200') {
        if(isset($dts['data']['city'])) $ret[]=['city'=>$dts['data']['city']];
        if(isset($dts['data']['postal'])) $ret[]=['postal_code'=>$dts['data']['postal']];
        if(isset($dts['data']['state'])) $ret[]=['state'=>$dts['data']['state']];
        if(isset($dts['data']['country'])) $ret[]=['country'=>$dts['data']['country']];
        // foreach($dts['data'] as $nm=>$inf) { if($nm!='state_code') $ret[]=[$nm=>$inf]; }
    }
    else $ret=null;
    return $ret;
}

function get_client_city($ip) {
    $dts=json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));
    return $dts->city ? $dts->city : '';
}

function get_client_region($ip) {
    $dts=json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));
    return $dts->region ? $dts->region : '';
}

function get_client_country($ip) {
    $dts=json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));
    return $dts->country ? $dts->country : '';
}

function get_client_org($ip) {
    $dts=json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));
    return $dts->org ? $dts->org : '';
}

function timeAgo($datetime, $full = false) {
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'year',
        'm' => 'month',
        'w' => 'week',
        'd' => 'day',
        'h' => 'hour',
        'i' => 'minute',
        's' => 'second',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' ago' : 'just now';
}

function getUrlContent($url) { return lookup($url); }

function lookup($url,$s_h=false,$ref='',$red=true,$head=false) {
    $dat='';
    $header[]='Accept: text/html, text/javascript, text/css, text/plain, application/xhtml+xml, application/xml, application/json, application/javascript';
    $header[].='Accept-Encoding: gzip,deflate';
    $header[].='Accept-Language: en-gb, en-us; q=0.8, en; q=0.7';
    $header[].='Accept-Charset: utf-8, *;q=0.6';
    $header[].='Connection: keep-alive';
    $header[].='Keep-Alive: 43200';
    $header[].='Cache-Control: no-cache';
    $header[].='Pragma: no-cache';
    $header[].='X-Visitor: '.BOT_NAME.'='.BOT_SIGN;
    $header[].='';
    $ch=curl_init($url);
    curl_setopt($ch,CURLOPT_VERBOSE,true);
    curl_setopt($ch,CURLOPT_AUTOREFERER,$red);
    curl_setopt($ch,CURLOPT_FOLLOWLOCATION,$red);
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,0);
    curl_setopt($ch,CURLOPT_IPRESOLVE,CURL_IPRESOLVE_V4);
    curl_setopt($ch,CURLOPT_NOBODY,$head);
    curl_setopt($ch,CURLOPT_MAXREDIRS,10);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch,CURLOPT_ENCODING,'');
    curl_setopt($ch,CURLOPT_USERAGENT,BOT_SIGN);
    curl_setopt($ch,CURLOPT_HEADER,$s_h);
    curl_setopt($ch,CURLOPT_HTTPHEADER,$header);
    curl_setopt($ch,CURLOPT_COOKIESESSION,true);
    curl_setopt($ch,CURLOPT_COOKIEJAR,BOT_COOKIE_JAR);
    curl_setopt($ch,CURLOPT_COOKIEFILE,BOT_COOKIE_FILE);
    curl_setopt($ch,CURLOPT_REFERER,$ref);
    curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,180);
    curl_setopt($ch,CURLOPT_TIMEOUT,7200);
    $dat=trim(curl_exec($ch));
    $status=curl_getinfo($ch);
    $httpcode=$status['http_code'];
    if(curl_errno($ch)) $dat=stripslashes(curl_errno($ch));
    if(curl_error($ch)) $dat=stripslashes(curl_error($ch));
    curl_close($ch);
    return $dat;
}
    
function getHttpHeaders($url,$type=0,$ref='',$red=true) { $ret=lookup($url,true,$ref,$red,true); return $type===1?explode("\n",$ret):$ret; }
    
function post($url,$data,$s_h=false,$ref='') {
    $ret='';
    $ch=curl_init($url);
    $header[]='Accept: text/html, text/javascript, text/css, text/plain, application/xhtml+xml, application/xml, application/json, application/javascript';
    $header[].='Accept-Encoding: gzip,deflate';
    $header[].='Accept-Language: en-gb, en-us; q=0.8, en; q=0.7';
    $header[].='Accept-Charset: utf-8, *;q=0.6';
    $header[].='Connection: keep-alive';
    $header[].='Keep-Alive: 43200';
    $header[].='Cache-Control: no-cache';
    $header[].='Pragma: no-cache';
    $header[].='Content-Type: application/x-www-form-urlencoded, charset=utf-8';
    $header[].='X-Visitor: '.BOT_NAME.'='.BOT_SIGN;
    $header[].='X-Requested-With: XMLHttpRequest';
    $header[].='';
    curl_setopt($ch,CURLOPT_VERBOSE,true);
    curl_setopt($ch,CURLOPT_AUTOREFERER,true);
    curl_setopt($ch,CURLOPT_FOLLOWLOCATION,true);
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,0);
    curl_setopt($ch,CURLOPT_IPRESOLVE,CURL_IPRESOLVE_V4);
    curl_setopt($ch,CURLOPT_MAXREDIRS,10);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch,CURLOPT_POST,1);
    curl_setopt($ch,CURLOPT_POSTFIELDS,$data);
    curl_setopt($ch,CURLOPT_ENCODING,'');
    curl_setopt($ch,CURLOPT_USERAGENT,BOT_SIGN);
    curl_setopt($ch,CURLOPT_HEADER,$s_h);
    curl_setopt($ch,CURLOPT_HTTPHEADER,$header);
    curl_setopt($ch,CURLOPT_COOKIESESSION,true);
    curl_setopt($ch,CURLOPT_COOKIEJAR,BOT_COOKIE_JAR);
    curl_setopt($ch,CURLOPT_COOKIEFILE,BOT_COOKIE_FILE);
    if($ref) curl_setopt($ch,CURLOPT_REFERER,$ref);
    curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,180);
    curl_setopt($ch,CURLOPT_TIMEOUT,7200);
    $dat=trim(curl_exec($ch));
    $status=curl_getinfo($ch);
    $httpcode=$status['http_code'];
    if(curl_errno($ch)) $dat=stripslashes(curl_errno($ch));
    if(curl_error($ch)) $dat=stripslashes(curl_error($ch));
    curl_close($ch);
    return $dat;
}

function isSSL() {
    $ret=isset($_SERVER['HTTPS'])&&($_SERVER['HTTPS']!=='off'||$_SERVER['HTTPS']!=0) ? true : false;
    if(!$ret) $ret=isset($_SERVER['SERVER_PORT'])&&intval($_SERVER['SERVER_PORT'])===443 ? true : false;
    if(!$ret) $ret=isset($_SERVER['HTTP_X_FORWARED_PROTO'])&&$_SERVER['HTTP_X_FORWARED_PROTO']==='https' ? true : false;
    if(!$ret) $ret=isset($_SERVER['HTTP_X_FORWARED_SSL'])&&$_SERVER['HTTP_X_FORWARED_SSL']==='on' ? true : false;
    return $ret;
}

$motherdomain=$edomain=$worldDomain='daisy-oreo.tech';
$desktop=$smartphone=$featurephone=0;
$is_ajax=null;

$shh=isset($_SERVER['HTTP_HOST'])?$_SERVER['HTTP_HOST']:'';
$sru=isset($_SERVER['REQUEST_URI'])?$_SERVER['REQUEST_URI']:'';

$is_DBot=(isset($_SERVER['HTTP_X_VISITOR'])&&$_SERVER['HTTP_X_VISITOR']=='DBot='.BOT_SIGN) ? true : false;
$is_ajax=isset($_SERVER['HTTP_X_REQUESTED_WITH'])&&$_SERVER['HTTP_X_REQUESTED_WITH']==='XMLHttpRequest' ? true : false;
$json=isset($_SERVER['HTTP_X_XHR_DATA_RETURN_TYPE'])&&$_SERVER['HTTP_X_XHR_DATA_RETURN_TYPE']==='JSON' ? true : false;

$fullPageUrl=$shh&&$sru?'http' . (isSSL()?'s':'') . '://'.$shh.$sru:'';
$ipAddress=get_client_ip();
$userAgent=isset($_SERVER['HTTP_USER_AGENT'])?$_SERVER['HTTP_USER_AGENT']:'';
$httpReferer=isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:'';