<?php 
    require_once('../includes/tools.php');
    $tools=new ExamenTools();
    $path=$_SERVER['DOCUMENT_ROOT'];
    echo $tools->b64toFile($path.'/wp-content/plugins/examen/uploads',$_POST['file'],$_POST['pregunta'].'-'.$_POST['area']);
?>