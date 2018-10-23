<?php $img=imagecreatefrompng('assets/images/mic_20x29.png');
if(imagepng($img,'assets/images/mic_20x29_cmp.png',9)) echo 'Compressed!'; else echo 'Not compressed!';
imagedestroy($img);