<?php error_reporting(E_ALL); ini_set('display_errors',1);
header('Cache-Control: no-cache');
header('Pragma: no-cache');
// header('Content-Type: text/plain');

include __DIR__.'/../funcs.php';

ob_start();

$txbu='https://www.jumia.com.ng';

function fetch_yt($url,$dbg=false) {
global $txbu,$dateReg,$monthArr,$splt,$sQuotReg,$dQuotReg;
require_once __DIR__.'/../php-simple-html-dom-parser-1.5.2/Src/Sunra/PhpSimple/simplehtmldom_1_5/simple_html_dom.php';
$html=new simplehtmldom_1_5\simple_html_dom();
$txc=trim(lookup($url));
$html->load($txc);
$prds=$err=[];
foreach($html->find('.products>div>.link') as $prd) {
  $prdOrders=is_object($prd->find('.total-ratings',0))?intval(rtrim(ltrim(trim($prd->find('.total-ratings',0)->plaintext),'('),')')):'';
  if(preg_match('/\d+/',$prdOrders,$ordMat)) $prdOrders=intval($ordMat[0]);
  // if($prdOrders<300) { echo "Order < 300<br />\n"; continue; }
  $prdStore=is_object($prd->find('.title .brand',0))?trim($prd->find('.title .brand',0)->plaintext):'';
  $prdDiscPrice=is_object($prd->find('.price-box [data-price]',0))?trim($prd->find('.price-box [data-price]',0)->plaintext):'';
  $prdPrice=is_object($prd->find('.price-box [data-price]',1))?trim($prd->find('.price-box [data-price]',1)->plaintext):'';
  $prdName=is_object($prd->find('.title .name',0))?trim($prd->find('.title .name',0)->plaintext):'';
  $prdUrl=$prd->href;
  if(is_object($prd->find('.image-wrapper img',0))) $prdPic=isset($prd->find('.image-wrapper img',0)->src)&&!empty($prd->find('.image-wrapper img',0)->src)?$prd->find('.image-wrapper img',0)->src:$prd->find('.image-wrapper img',0)->getAttribute('data-src');
  if(!$prdPic) { /*echo "Pic URL not found<br />\n";*/ continue; }
  $prds[]=['name'=>$prdName,'url'=>$prdUrl,'pic_url'=>$prdPic,'price'=>$prdPrice,'discount_price'=>$prdDiscPrice,'orders'=>$prdOrders,'store'=>$prdStore];
}
$html=null;

echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><style>';
include __DIR__.'/styles.css';
$urlQue=parse_url($url,PHP_URL_QUERY);
$que=$srt=$dir='';
if(preg_match('/\bq=([^&]+)/i',$urlQue,$qMat)) $que=$qMat[1];
if(preg_match('/\bsort=([^&]+)/i',$urlQue,$srtMat)) $srt=$srtMat[1];
if(preg_match('/\bdir=([^&]+)/i',$urlQue,$dirMat)) $dir=$dirMat[1];
switch(true) {
    case $srt==='newest'&&$dir==='desc': $srt='create_desc';  break;
    case $srt==='popularity'&&$dir==='desc': $srt==='total_tranpro_desc'; break;
    case $srt==='Price%3A%20High%20to%20Low'&&$dir==='desc': $srt='price_desc'; break;
    case $srt==='Price%3A%20Low%20to%20High'&&$dir==='asc': $srt='price_asc'; break;
    default: $srt='total_tranpro_desc';
}
echo '</style></head><body><h1><a class="hone colour" href="//',$_SERVER['HTTP_HOST'],'/Fetch/ali-express.php?u=',urlencode('wholesale?SearchText='.urlencode($que).'&SortType='.urlencode($srt)),'">Shop on AliExpress</a></h1>';

if(empty(array_filter($prds))) echo "<div>No results were returned! - $url</div>"; else {
echo '<div class="avail-prds">';
foreach($prds as $prd) {
$name=str_replace('&#39;','\'',html_entity_decode(htmlspecialchars_decode($prd['name']))); $prdUrl=$prd['url']; $picUrl=$prd['pic_url']; $price=$prd['price']; $discountPrice=$prd['discount_price']; $orders=$prd['orders']; $storeName=$prd['store'];
echo '<div class="prd" data-for="Jumia" href="#">
    <a href="',$prdUrl,'" title="View more about this product"><img class="prd__img" src="',$picUrl,'" alt="',$name,'" /></a>
    <div class="prd__desc colour"><a href="',$prdUrl,'" title="View more about this product">',$name,'...</a></div>
    <div class="prd__price colour"><span class="lnthr">N</span>',$discountPrice,($price?'<br /><span class="lnthr">N'.$price.'</span>':''),'</div>',($orders?'
    <div class="prd__orders colour">Ratings => '.$orders.($orders>75?' (Hot)':'').'</div>':''),'
</div>';
$name=$discountPrice=$orders=$storeName=$prdUrl=$picUrl=$pData=null;
ob_end_flush();
ob_start();
}
$page=1;
$pgReg='/(\?|&)page=(\d+)/i';
$curUrl='//'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
if(preg_match($pgReg,$curUrl,$pgMat)) $page=intval($pgMat[2]);
echo '</div><div class="pgnat">';
if($page>1) echo '<a class="previous" rel="previous" href="',preg_replace($pgReg,'${1}page='.($page-1),$curUrl),'">Previous</a>';
echo '<a class="next" rel="next" href="',(preg_match($pgReg,$curUrl,$pgMat)?preg_replace($pgReg,'${1}page='.($page+1),$curUrl):$curUrl.'&page='.($page+1)),'">Next</a>';
echo '</div>';
}
echo '</body></html>';
}

$url=$txbu;
if(isset($_GET['q'])&&!empty($_GET['q'])) $url.=(isset($_GET['pg'])&&!empty($_GET['pg'])?'/page/'.urldecode($_GET['pg']):'').'/?s='.$_GET['q'];
else if(isset($_GET['u'])&&!empty($_GET['u'])) $url.='/'.urldecode($_GET['u']);
else $url.='/';
fetch_yt($url,true);	