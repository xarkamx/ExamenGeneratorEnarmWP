<?php
require_once('tools.php');
class dbExamen extends ExamenTools{
    function mydb_connect($host,$dbName,$username,$password){
        $link='';
        try {
            $link = new PDO("mysql:host=".$host.";"."dbname=".$dbName, $username, $password);
            $link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $link->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
            $link->exec('set names utf8');
        } catch (PDOException $e) {
            echo 'No se puede conectar con el servidor o seleccionar la base de datos.';
        }
        return $link;
    }//conecta a la DB
    function is_logged($link){
        debug(__FILE__,__FUNCTION__,"esta funcion revisa si hay un usuario loggeado");
        // Inicio la sesión.

        $user_check = $_COOKIE['login_user9'];
        // Filtro la fila del usuario correspondiente.
        $resultado = $link->prepare('SELECT usuarios.*, permisos.permisos, permisos.nivelDeUsuario FROM usuarios join permisos on permisos.id=usuarios.rango WHERE usuarios.username = ?');
        $resultado->execute(array($user_check));
        $rowu = $resultado->fetch(PDO::FETCH_ASSOC);
        $login_session = $rowu['username'];

        // Si el usuario no está logueado lo redirijo a la página correspondiente.
        if (!isset($login_session) && !isset($_COOKIE['login_user9'])) {

            header('Location: ' . "index.php");
        }

        return $rowu;
            }//esto no deberia ir aqui XD mover a config en futuras versiones
    function query($link,$query='show tables',$print=true,$args=array()){
        $tabla = $link->prepare($query);
        $tabla->execute($args);
        $tabla =($print==true)? $tabla -> fetchAll(PDO::FETCH_ASSOC):true;
        return $tabla;
    }//rellena un arreglo con tu query
    function createTable($link,$t_name){
        $sentencia=$link->prepare("
            CREATE TABLE IF NOT EXISTS `$t_name` (
          `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          PRIMARY KEY (`id`)
        ) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;"
                   );
        $sentencia->execute();
        return $sentencia;
    }//crea una tabla si no existe
    function column_exist($link,$t_name,$c_name){
        if($this->table_exist($link,$t_name)==false){
            return false;
        }
        $tabla=$this->query($link,"show columns from $t_name where Field='$c_name'");
        return (count($tabla)==0)?false:true;
    }//revisa se la columna mencionada existe.
    function table_exist($link,$t_name){
         $tabla=$this->query($link,"SHOW TABLES WHERE Tables_in_".DB_NAME." ='$t_name'");
          return (count($tabla)==0)?false:true;
    }//revisa si la tabla mencionada existe.
    function element_exist($link,$t_name,$c_name,$c_value){
        $table=$this->query($link,"select $c_name from $t_name where $c_name=:value",true,array('value'=>$c_name));
        return (count($table)==0)?false:true;
    }
    function add_column($link,$t_name,$c_name,$c_type){
        if(!$this->table_exist($link,$t_name)){
            $this->createTable($link,$t_name);
        }
        if($this->column_exist($link,$t_name,$c_name)){
            return false;
        }

        $this->query($link,"alter table $t_name add column $c_name $c_type",false);
        return true;
    }//añade columna sin repetir (tambien crea tablas en caso de que no exista)
    function cloneTableStructure($link,$tabla_origen,$tabla_destino){
        $tabla=$this->query($link,"show columns from $tabla_origen");
        foreach ($tabla as $column) {
            $this->add_column($link,$tabla_destino,$column['Field'],$column['Type']);
        }
    }//clona las columnas de una tabla a otra
    function assosiative_array_to_db($link,$t_name,$array){
        unset($array['id']);
        $keys=array_keys($array);
        foreach ($keys as $key) {
            (!$this->column_exist($link,$t_name,$key))?$this->add_column($link,$t_name,$key,'text'):true;
        }
      $prep=array();
      foreach($array as $k => $v ) {
        $prep[':'.$k] = $v;
        }
    $sentencia=$link->prepare("INSERT INTO $t_name ( " . implode(', ',$keys) . ") VALUES (" . implode(', ',array_keys($prep)) . ")");
    $sentencia->execute($prep);
    }//inserta un array asosiativo (bi-dimencional) a una tabla;
    function deleteRowByID($link,$t_name,$id){
        return $this->query($link,"delete from $t_name where id='$id'",false);
    }
    function historicalUpdate($link,$t_name,$select,$parameters,$args){
        $query="
            create temporary table tmd ($select limit 0,1);
	            update tmd set $parameters ,id=(select id from historical order by id desc limit 0,1)+1;
                insert into $t_name (select*from tmd limit 0,1);
        ";
       return $this->query($link,$query,false,$args);
    }
    function duplicate_row($link,$t_name,$select,$parameters,$args){
        $query="
            create temporary table tmd ($select limit 0,1);
	            update tmd set $parameters ,id=(select id from $t_name order by id desc limit 0,1)+1;
                insert into $t_name (select*from tmd limit 0,1);
        ";
       return $this->query($link,$query,false,$args);
}
    function save($link,$arr,$tabla,$id=''){
        foreach((array)$arr as $k => $v ) {
            if ($v == 'null') $v=null;
            $prep[':'.$k] = $v;
            $prep2 .= $k."=:".$k.",";
        }

        if($id != ""){
            $colname = $link->prepare("SHOW COLUMNS FROM $tabla");
            $colname->execute(array($company));
            $colname = $colname -> fetchAll(PDO::FETCH_ASSOC);
            foreach ($colname as $k => $v){
                if ($v[Key] != "PRI"){
                    $prepdelete[':'.$v[Field]]= NULL;
                    $prep2delete .= $v[Field]."=:".$v[Field].",";
                }
            }
          $sentencia = $link->prepare("UPDATE $tabla set " . trim($prep2delete, ",") ." WHERE id =". $id); //Vaciamos fila en DB
          $sentencia->execute($prepdelete);
          $sentencia = $link->prepare("UPDATE $tabla set " . trim($prep2, ",") ." WHERE id =". $id); //Llenamos fila en DB
          $sentencia->execute($prep);
        }
        else{
            $this->assosiative_array_to_db($link,$tabla,$arr);
        }
    }//Funcion para guardar un array en la DB
    function search($link,$t_name,$keyword,$query){
        $tabla=$this->query($link,"show columns from $t_name");
        foreach ($tabla as $field) {

            $c_name[]=$field['Field'];
        }
        $results=$this->query($link,"select * from $t_name where ".implode("='$keyword' or ",$c_name)." $query");
        return $results;
    }
    function csvToDB($link,$t_name,$csv,$callback=''){
        $lines=preg_split('/\n/',$csv);
        $titles=$this->camelCase($lines[0]);
        unset($lines[0]);
        $assoc=preg_split('/,/',$titles);
        foreach($lines as $index=>$items){
            if($items==''){
                continue;
            }
            $row=array_combine($assoc,preg_split('/,/',$items));
            $rows=($callback=='')?$row:$callback($link,$this,$row);
            if($rows['where']==''){
                $where="id is null";
            }else{
                $where=$rows['where'];
            }
            $rows=array_map(function($n){
                $n=preg_replace('/"/','',$n);
                $n="'$n'";
                return $n;
            },$rows);
            unset($rows['where']);
            $keys=implode(',',array_keys($rows));
            $rowsAndKeys=[];
            foreach($rows as $ind=>$cell){
                $name=uniqid();
                $rowsAndKeys[]="$cell as '$name'";
            }
            $query.="insert into $t_name($keys)
            SELECT * FROM (SELECT ".implode(',',$rowsAndKeys).") AS tmp
                WHERE NOT EXISTS (
                    SELECT $keys FROM $t_name WHERE $where
                ) LIMIT 1
                ;";
        }
        //echo $query;
        $this->query($link,$query,false);
    }
}
?>
