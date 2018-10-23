<?php // error_reporting(E_ALL); ini_set('display_errors',1);
header('Cache-Control: no-cache');
header('Pragma: no-cache');
// header('Content-Type: text/plain');

include __DIR__.'/../funcs.php';

ob_start();

$txbu='https://www.aliexpress.com';

function fetch_yt($url,$dbg=false) {
global $txbu,$dateReg,$monthArr,$splt,$sQuotReg,$dQuotReg;
require_once __DIR__.'/../php-simple-html-dom-parser-1.5.2/Src/Sunra/PhpSimple/simplehtmldom_1_5/simple_html_dom.php';
$html=new simplehtmldom_1_5\simple_html_dom();
$txc=trim(lookup($url));
$html->load($txc);
$prds=$err=[];
foreach($html->find('.list-items .list-item') as $prd) {
  $prdOrders=trim($prd->find('.order-num-a',0)->plaintext);
  if(preg_match('/\d+/',$prdOrders,$ordMat)) $prdOrders=intval($ordMat[0]);
  // if($prdOrders<300) { echo "Order < 300<br />\n"; continue; }
  $prdStore=trim($prd->find('.store-name .store',0)->plaintext);
  $prdPrice='';
  $prdDiscPrice=trim($prd->find('.price .value',0)->plaintext);
  $prdName=trim($prd->find('.product',0)->plaintext);
  $prdUrl=$prd->find('.product',0)->href;
  $prdPic=isset($prd->find('img',0)->src)&&!empty($prd->find('img',0)->src)?$prd->find('img',0)->src:$prd->find('img',0)->getAttribute('image-src');
  // if(!$prdPic) { echo "Pic URL not found<br />\n"; continue; }
  $det=getItemDet($prdUrl);
  $itemSpecs=$det['specs'];
  if(!empty($det['price'])) $prdPrice=$det['price'];
  if(!empty($det['discount_price'])) $prdDiscPrice=$det['discount_price'];
  $prdPrice=preg_replace('/USD?\s*\$?/i','',$prdPrice);
  $prdDiscPrice=preg_replace('/USD?\s*\$?/i','',$prdDiscPrice);
  $prds[]=['name'=>$prdName,'url'=>$prdUrl,'pic_url'=>$prdPic,'price'=>$prdPrice,'discount_price'=>$prdDiscPrice,'orders'=>$prdOrders,'store'=>$prdStore,'item_specs'=>$itemSpecs];
}
$html=null;

echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><style>';
include __DIR__.'/styles.css';
$urlQue=parse_url($url,PHP_URL_QUERY);
$que=$srt='';
if(preg_match('/\bSearchText=([^&]+)/i',$urlQue,$qMat)) $que=$qMat[1];
if(preg_match('/\bSortType=([^&]+)/',$urlQue,$srtMat)) $srt=$srtMat[1];
switch($srt) {
    case 'create_desc': $srt='newest'; $dir='desc'; break;
    case 'total_tranpro_desc': $srt='popularity'; $dir='desc'; break;
    case 'price_desc': $srt='Price%3A%20High%20to%20Low'; $dir='desc'; break;
    case 'price_asc': $srt='Price%3A%20Low%20to%20High'; $dir='asc'; break;
    default: $srt='popularity'; $dir='desc';
}
echo '</style></head><body><h1><a class="hone colour" href="//',$_SERVER['HTTP_HOST'],'/Fetch/jumia.php?u=',urlencode('catalog/?q='.urlencode($que).'&sort='.urlencode($srt).'&dir='.urlencode($dir)),'">Shop on Jumia</a></h1>';

if(empty(array_filter($prds))) echo "<div>No results were returned!</div>"; else {
echo '<div class="avail-prds">';
foreach($prds as $prd) {
$name=str_replace('&#39;','\'',html_entity_decode(htmlspecialchars_decode($prd['name']))); $prdUrl=$prd['url']; $picUrl=$prd['pic_url']; $priceStart=$prd['price']; $discountPriceStart=$prd['discount_price']; $orders=$prd['orders']; $storeName=$prd['store']; $itemSpecs=$prd['item_specs'];
$priceEnd=$discountPriceEnd='';
if(preg_match('/([\d\.]+)\s*-+\s*([\d\.]+)/',$priceStart,$dpMat)) { $priceStart=$dpMat[1]; $priceEnd=$dpMat[2]; }
if(preg_match('/([\d\.]+)\s*-+\s*([\d\.]+)/',$discountPriceStart,$dpMat)) { $discountPriceStart=$dpMat[1]; $discountPriceEnd=$dpMat[2]; }
$strpName=substr($name,0,50);
echo '<div class="prd" data-for="AliExpress" href="#">
    <a href="',$prdUrl,'" title="View more about this product"><img class="prd__img" src="',$picUrl,'" alt="',$strpName,'" /></a>
    <div class="prd__desc colour"><a href="',$prdUrl,'" title="View more about this product">',$strpName,'...</a></div>
    <div class="prd__price colour">$',$discountPriceStart,($discountPriceEnd?' - '.$discountPriceEnd:''),($priceStart?'<br />'.$priceStart:''),($priceEnd?' - '.$priceEnd:''),'</div>
    <div class="prd__orders colour">Orders => ',$orders,($orders>400?' (Hot)':''),'</div>
</div>';
// <div class="prd__specs colour">Orders => ',$itemSpecs,'</div>
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

function getItemDet($url) {
    require_once __DIR__.'/../php-simple-html-dom-parser-1.5.2/Src/Sunra/PhpSimple/simplehtmldom_1_5/simple_html_dom.php';
    $html=new simplehtmldom_1_5\simple_html_dom();
    if(!preg_match('/^https?/',$url)) $url='https:'.$url;
    $txc=trim(lookup($url));
    $html->load($txc);
    $itemSpecs='{';
    foreach($html->find('.product-property-list .property-item') as $itemSpec) {
        $propTitle=str_replace(' ','_',preg_replace('/:+\s*$/','',$itemSpec->find('.propery-title',0)->plaintext));
        $propDesc=trim($itemSpec->find('.propery-des',0)->plaintext);
        $itemSpecs.='"'.$propTitle.'":"'.$propDesc.'",';
    }
    $itemSpecs=trim($itemSpecs,',').'}';
    if($itemSpecs==='{}') return $txc;
    $price=$discPrice='';
    if(is_object($html->find('#j-sku-price',0))&&is_object($html->find('#j-sku-discount-price',0))) { if(!empty($html->find('#j-sku-price',0)->plaintext)) $price=$html->find('#j-sku-price',0)->plaintext; if(!empty($html->find('#j-sku-discount-price',0)->plaintext)) $discPrice=$html->find('#j-sku-discount-price',0)->plaintext; }
    return ['specs'=>$itemSpecs,'price'=>$price,'discount_price'=>$discPrice];
}

$url=$txbu;
if(isset($_GET['q'])&&!empty($_GET['q'])) $url.=(isset($_GET['pg'])&&!empty($_GET['pg'])?'/page/'.urldecode($_GET['pg']):'').'/?s='.$_GET['q'];
else if(isset($_GET['u'])&&!empty($_GET['u'])) $url.='/'.(urldecode($_GET['u'])?urldecode($_GET['u']):'Snuff');
else $url.='/';
fetch_yt($url,true);