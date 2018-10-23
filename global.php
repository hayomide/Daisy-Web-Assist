<?php
if(!isset($title)||empty($title)) $title='Daisy Assist';
if(!isset($desc)||empty($desc)) $desc='Daisy is your personal friend you can count on to get you outta boredom';
$protocol='http'.(isSSL()?'s':'').'://';
$canonicalUrl=$protocol.$_SERVER['HTTP_HOST'].strtok($_SERVER['REQUEST_URI'],'?');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title><?php echo $title; ?></title>
<meta name="description" content="<?php echo $desc; ?>" />
<meta property="og:name" content="<?php echo $title; ?>" />
<meta property="og:url" content="<?php echo $canonicalUrl; ?>" />
<meta property="og:description" content="<?php echo $desc; ?>" />
<meta name="twitter:name" content="<?php echo $title; ?>" />
<meta name="twitter:url" content="<?php echo $canonicalUrl; ?>" />
<meta name="twitter:description" content="<?php echo $desc; ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="assets/styles/main.css" />
<link rel="manifest" href="manifest.json" lange="en" />