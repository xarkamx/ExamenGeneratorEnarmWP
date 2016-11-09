<?php 
    class ExamenTools{
        function b64toFile($folderName,$b64file,$filename='myfile'){
            if (!file_exists($folderName)) {
                mkdir($folderName, 0775, true);
            }
            $b64file=trim($b64file);
            $data=preg_split('/,/',$b64file);
            $type=preg_split('/\//',$data[0]);
            $ext=preg_replace("/;base64/",'',$type[1]);
            $file=str_replace(' ','+',$data[1]);
            $file=base64_decode($file);
            file_put_contents("$folderName/$filename.$ext",$file);
            return $this->systemPathToUrl("$folderName/$filename.$ext");
        }
        function systemPathToUrl($path){
            return "http://".str_replace($_SERVER['DOCUMENT_ROOT'],$_SERVER['HTTP_HOST'],$path);
        }
        function replaceWeirdChar($r){
        $r=preg_replace("/ /","_",$r);
        $r=preg_replace("/\+/","plus",$r);
        $r=preg_replace("/\:/","",$r);
        $r=preg_replace("/-/","_",$r);
        $r=strtolower($r);
        $r = iconv('ISO-8859-1','ASCII//TRANSLIT//IGNORE',$r);
        $r=preg_replace("/ú/i","u",$r);
        $r=preg_replace("/[\.\?\¿\(\)]/","",$r);
        return $r;
    }//elimina todos los caracteres que podrian dar problemas en una db
        function replaceHtmlchar($string){
    
            $avoid=preg_replace("/</","&lt;",$string);
    
            $avoid=preg_replace("/>/","&gt;",$avoid);
    
            return $avoid;
    
    }//elimina corchetes angulares.
        function downfile($archivo){
    
            if (file_exists($archivo)) {
    
    
    
                header("Content-Length: " . filesize ( $archivo ) );
    
                    header("Content-type: application/octet-stream");
    
                    header("Content-disposition: attachment; filename=".basename($archivo));
    
                    header('Expires: 0');
    
                    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    
                    ob_clean();
    
                    flush();
    
                    readfile($archivo);
    
            }else{
    
                echo $filename[0];
    
            }
    
    }//descarga archivos
        function crearCarpeta($direccion){
    
            if(!file_exists($direccion)){
    
                mkdir($direccion,0777);
    
            }
    
    }
        function sendMailbyPost($post,$sendTo=null,$title=null){
            add_post_to_db($post,$title);
            $mail=$post['mail'];
            unset($post['mail']);
            $mensaje="Haz recibido una cotizacion de $mail \r\n";
            $keys=array_keys($post);
            $price=0;
            foreach($keys as $key){
                $quiz_val=preg_split("/-/",$post[$key]);
                $deformatKey=str_replace("_"," ",$key);
                $mensaje.="¿$deformatKey? $quiz_val[1]\r\n";
                $price+=$quiz_val[0];
            }
            $price=number_format ( $price ,2);
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= "From: <$mail>" . "\r\n";
            //echo $mensaje.'Con un precio total de $'.$price;
            //($sendTo!=null)?mail($sendTo,'Cotización',$mensaje.'Con un precio total de $'.$price):'';
            header('Location: ' . $_SERVER['HTTP_REFERER']."?alert=1");
    }//manda directamente tu post a un correo. //requiere personalizacion.
        function exist_on_array($array,$element){
    
            for ($x=0;$x<count($array);$x++){
    
                if($array[$x]==$element){
    
                    return true;
    
                }
    
            }
    
            return false;
    
    }//busca un elemento en el array, y regresa true de existir y false de no hacerlo
        function listDirectory($dir){
    
        $result = array();
    
        $root = scandir($dir);
    
        foreach($root as $value) {
    
          if($value === '.' || $value === '..') {
    
            continue;
    
          }
    
          if(is_file("$dir$value")) {
    
            $result[] = "$dir$value";
    
            continue;
    
          }
    
          if(is_dir("$dir$value")) {
    
            $result[] = "$dir$value/";
    
          }
    
          foreach(self::listDirectory("$dir$value/") as $value)
    
          {
    
            $result[] = $value;
    
          }
    
        }
    
        return $result;
    
      }//enlista todos los directorios del camino asignado
        function arr_to_form($args){
            if($args==null){
                return 0;
            }
    
            $title='';
            if($args['titulo']){
                $title=$args['titulo'];
                unset($args['titulo']);
            }
            $html="<div class='g_form'>
            <h3>$title</h3>
            ";
    
    
            foreach($args as $element){
                $id=$element['id'];
                unset($element['id']);
                $keys=array_keys($element);
                 $html.="<div class='g_input' id='li-$id-$title'>
                       ";
                foreach($keys as $key){
                    $html.=" <div class='gr_input'>
                        <label>$key</label>
                        <input id='$id-$key-$title' class='gen_input' name='$id-$key-$title' value='$element[$key]'></div>";
                }
                $html.="
                        <div class='gr_input'>
                            <div class='deleteButton' id='d-$id-$title' onclick='killElement(this.id)'>X</div>
                        </div>
                    </div>";
            }
            $html.='</from></div>';
            return $html;
        }//convierte un arreglo en formulario
        function fileToPath($files,$name=''){
            $plugin_path=dirname(__DIR__);
            if(!is_dir($plugin_path."/upload")){
                mkdir($plugin_path."/upload");
            }
            foreach ( $files as $file) {
            if ($file["error"] == UPLOAD_ERR_OK) {
                $tmp_name = $file["tmp_name"];
                pathinfo($file["name"], PATHINFO_EXTENSION);
                $name = ($name=='')?$file["name"]:$name.".zip";
                return (move_uploaded_file($tmp_name, $plugin_path."/upload/$name"))?"$name":'El archivo no se copio correctamente.';
            }
                return "something when wrong";
        }
        }
        function find_repeat_on_matrix($args,$colum){
            $repeat=array();
            foreach($args as $row){
                $repeat[$row[$colum]]=($repeat[$row[$colum]]=='')?1:1+$repeat[$row[$colum]];
            }
            return $repeat;
        }
        function array_unshift_assoc($arr, $key, $val, $species='',$type=''){ 
            $arr = array_reverse($arr, true);
            if($arr[$key]!=''){
                unset($arr[$key]);
            }
            $arr[$key] =(is_array($val))? $val:array($val);
            if($type=='vendor'){
                $arr[$key]['class']=$species;
            }
            return  array_reverse($arr, true); 
        } //esta no me acuerdo que hace XD creo que agrega un item al principio del array
        function console( $data) {
    	    if ( is_array( $data ) )
    	        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    	    else
    	        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";
    	
    	    echo $output;
    	}//imprime en consola de js 
    	function camelCase($str, $separator = ' '){
             $words = explode($separator, strtolower($str));
    		 $return = '';
    		 foreach ($words as $word) {
    		 if ($words[0]==$word) {  $return .= trim($word); continue;}
    		  $return .= ucfirst(trim($word));
    		  }
    		  return $return;
    }//cameliza un STR
    	function date_us_to_iso($str){
                $str = new DateTime($str);
                $str = $str->format('Y-m-d');
                return $str;
        }// Fecha US 12/31/2016 a 2016-12-31
        function array_date_us_to_iso($arr){
            foreach($arr as $k => $v){
                if (!is_array($v)){
                    if (DateTime::createFromFormat('m/d/Y', $v) !== FALSE) {
                        $arr[$k] = date("Y-m-d", strtotime($v));
                    }
                }
            }
                return $arr;
        }// Fecha US 12/31/2016 a 2016-12-31
        function array_date_iso_to_us($arr){
            foreach($arr as $k => $v){
                if (!is_array($v)){
                    if (DateTime::createFromFormat('Y-m-d', $v) !== FALSE) {
                        $arr[$k] = date("m/d/Y", strtotime($v));
                    }
                }
                else{
                    $arr[$k]=$this->array_date_iso_to_us($v);
                }
            }
                return $arr;
        }// Fecha ISO 2016-12-31 a 12/31/2016
        function is_json($string) {
            $json=json_decode($string);
            return (is_object($json)||is_array($json));
        }
        function replace_key_function($array, $key1, $key2){
            $keys = array_keys($array);
            $index = array_search($key1, $keys);
        
            if ($index !== false) {
                $keys[$index] = $key2;
                $array = array_combine($keys, $array);
            }
        
            return $array;
        }
    }
?>