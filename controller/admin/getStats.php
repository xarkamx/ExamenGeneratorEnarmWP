<?php 
    require_once('../includes/dbClass.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/wp-config.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/wp-includes/pluggable.php');
    $sv=new saveQuiz($_POST);
    class saveQuiz{
        function __construct($details){
            $action=$details['action'];
            $id=$details['id'];
            $db=new dbExamen();
            $link=$db->mydb_connect(DB_HOST,DB_NAME,DB_USER,DB_PASSWORD);
            unset($details['action'],$details['imgQuiz'],$details['id']);
            $db->add_column($link,"resultados","user","int");
            $db->add_column($link,"resultados","date","date");
            $db->add_column($link,"resultados","tp","text");
            $db->add_column($link,"resultados","pc","text");
            $db->add_column($link,"resultados","pi","text");
            $db->add_column($link,"resultados","cal","text");
            $db->add_column($link,"resultados","area","text");
            $db->add_column($link,"resultados","especialidad","text");
            $db->add_column($link,"resultados","exploracion","text");
            $date=date("Y-m-d");
            switch ($action) {
                case 'calificacionGlobal':{
                    $table=$db->query($link,'select (sum(cal)/count(cal)) as promedio ,date from resultados group by date order by date limit 0,60');
                    foreach($table as $item){
                        $key[]=$item['date'];
                        $values[]=$item['promedio'];
                    }
                    $data=array(
                        "keys"=>$key,
                        "data"=>$values,
                        );
                    echo json_encode($data);
                }break;
                case 'calificacionDelDia':{
                    $table=$db->query($link,"select cal as promedio ,date from resultados where date='$date' limit 0,60");
                    foreach($table as $item){
                        $key[]=$item['date'];
                        $values[]=$item['promedio'];
                    }
                    $data=array(
                        "keys"=>$key,
                        "data"=>$values,
                        );
                    echo json_encode($data);
                }break;
                case 'pRespondidas':{
                     $table=$db->query($link,'select sum(pc) as promedio ,date from resultados group by date order by date limit 0,60');
                    foreach($table as $item){
                        $key[]=$item['date'];
                        $values[]=$item['promedio'];
                    }
                    $data=array(
                        "keys"=>$key,
                        "data"=>$values,
                        );
                    echo json_encode($data);
                }break;
                case 'areas':{
                     $table=$db->query($link,'select sum(cal)/count(cal) as promedio ,area from resultArea group by area limit 0,60');
                    foreach($table as $item){
                        $key[]=$item['area'];
                        $values[]=$item['promedio'];
                    }
                    $data=array(
                        "keys"=>$key,
                        "data"=>$values,
                        );
                    echo json_encode($data);
                }break;
                case 'especialidad':{
                     $table=$db->query($link,'select sum(cal)/count(cal) as promedio ,especialidad from resultEspecialidad group by especialidad limit 0,60');
                    foreach($table as $item){
                        $key[]=$item['especialidad'];
                        $values[]=$item['promedio'];
                    }
                    $data=array(
                        "keys"=>$key,
                        "data"=>$values,
                        );
                    echo json_encode($data);
                }break;
                case 'exploracion':{
                     $table=$db->query($link,'select sum(cal)/count(cal) as promedio ,exploracion from resultExploracion group by exploracion limit 0,60');
                    foreach($table as $item){
                        $key[]=$item['exploracion'];
                        $values[]=$item['promedio'];
                    }
                    $data=array(
                        "keys"=>$key,
                        "data"=>$values,
                        );
                    echo json_encode($data);
                }break;
            }
        }
    }
?>