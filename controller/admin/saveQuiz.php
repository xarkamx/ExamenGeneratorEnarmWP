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
            $db->add_column($link,"quiz","pregunta",'text');
            $db->add_column($link,"quiz","area",'text');
            $db->add_column($link,"quiz","especialidad",'text');
            $db->add_column($link,"quiz","exploracion",'text');
            $db->add_column($link,"quiz","bibliografia",'text');
            $db->add_column($link,"quiz","img",'text');
            switch ($action) {
                case 'save':{
                    $db->save($link,$details,'quiz');
                }break;
                case 'update':{
                    $db->save($link,$details,'quiz',$id);
                }break;
                case 'load':{
                    $where=($id!='')?"where id=$id":'';
                    $table=$db->query($link,"select * from quiz $where");
                    echo json_encode($table);
                }break;
                case 'delete':{
                    echo 'delete';
                    $db->query($link,"delete from quiz where id=$id",false);
                    $db->query($link,"delete from resultados where preguntaID=$id",false);
                }break;
            }
        }
    }
?>