<?php
    require_once('../includes/dbClass.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/wp-config.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/wp-includes/class-wp-user.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/wp-includes/user.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/wp-includes/plugin.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/wp-includes/pluggable.php');
    class Cuestionario{
        function __construct($details){
            $action=$details['action'];
            $id=$details['id'];
            $db=new dbExamen();
            $date=date('Y-m-d');
            $user=$user=wp_get_current_user();
            $uid=$user->ID;
            $link=$db->mydb_connect(DB_HOST,DB_NAME,DB_USER,DB_PASSWORD);
            unset($details['action'],$details['id']);
            $db->add_column($link,'respuestas','preguntaID','int');
            $db->add_column($link,'respuestas','respuesta','text');
            $db->add_column($link,'respuestas','resultado','text');
            $db->add_column($link,'respuestas','user','int');
            $db->add_column($link,'respuestas','fecha','date');
            $db->add_column($link,'respuestas','area','text');
            switch($action){
                case 'preguntas':{
                    $limit=$details['limite'];
                    $area=$details['area'];
                    $query=($area!='')?"where area='$area'":'';
                    $table=$db->query($link,"select * from quiz $query order by RAND() limit 0,$limit");
                    echo json_encode($table);
                }break;
                case 'save':{
                    $table=$db->query($link,"select * from quiz");
                    $selec=[];
                    $query= "insert into respuestas(preguntaID,respuesta,resultado,user,fecha,area)values";
                    $val=[];
                    $area=$details['area'];
                    foreach($table as  $pregunta){
                        $id='d'.$pregunta['id'];
                        if($details[$id]==''){
                            continue;
                        }
                        $selected=explode(',',$details[$id]);
                        $keys=explode(',',$pregunta['respuesta']);
                        $values=explode(',',$pregunta['correcto']);
                        $respuestas=array_combine($keys,$values);
                        $resultado=$this->correcto($selected,$respuestas);
                        $correcto=array_values($resultado['respuestas']);
                        $respuesta=array_keys($resultado['respuestas']);
                        $respuesta=implode(',',$respuesta);
                        $correcto=implode(',',$correcto);
                        $contador=$resultado['contador'];
                        $val[]= "('$pregunta[id]','$respuesta','$contador','$uid','$date','$area')";
                    }
                    $query.=implode(',',$val);
                    $db->query($link,$query,$false);
                }break;
                case 'respondio':{
                   echo $this->isFill($link,$db,$details,$uid,$date);
                }break;
                case 'respuestas':{
                    $date=date('Y-m-d');
                    $area=$details['area'];
                    $query=($area!='')?"and quiz.area='$area'":'';
                    $table=$db->query($link,"SELECT distinct quiz.id,
                    quiz.pregunta,
                    respuestas.resultado,quiz.area,quiz.especialidad,
                    quiz.bibliografia,quiz.exploracion,respuestas.respuesta,
                    quiz.casoClinico,quiz.revisionDelCaso,quiz.img,
                    quiz.respuesta as opciones,quiz.correcto,respuestas.user,
                    respuestas.fecha FROM respuestas
                    left join quiz on respuestas.preguntaID=quiz.id
                    where respuestas.user=$uid and  respuestas.fecha='$date' $query; 
                    ");
                    echo json_encode($table);
                }break;
                case 'createResults':{
                    $area=$details['carea'];
                    $query=($area!='')?"and area='$area'":'';
                    $db->add_column($link,'resultados','user','int');
                    $db->add_column($link,'resultados','date','date');
                    $db->add_column($link,'resultArea','user','int');
                    $db->add_column($link,'resultEspecialidad','user','int');
                    $db->add_column($link,'resultExploracion','user','int');
                    $table=$db->query($link,"select count(id) as items from resultados where user=$uid and date='$date' $query");
                    if($table[0]['items']>0){
                        echo $table[0]['items'];
                        return false;
                    }
                   $_POST['user']=$uid;
                   $_POST['date']=$date;
                   $area=json_decode(stripslashes ($_POST['area']));
                   $especialidad=json_decode(stripslashes ($_POST['especialidad']));
                   $exploracion=json_decode(stripslashes ($_POST['exploracion']));
                   unset($_POST['area'],$_POST['exploracion'],$_POST['especialidad']);
                   $this->multiSave($link,$db,(array)$area,'resultArea',$uid,$date);
                   $this->multiSave($link,$db,(array)$exploracion,'resultExploracion',$uid,$date);
                   $this->multiSave($link,$db,(array)$especialidad,'resultEspecialidad',$uid,$date);
                   $db->save($link,$_POST,'resultados');
                }break;
                case 'reset':{
                    $area=$details['area'];
                    $query=($area!='')?"and area='$area'":'';
                    $db->query($link,"delete from respuestas where user=$uid and fecha='$date' $query",false);
                    echo "delete from respuestas where user=$uid and fecha='$date' $query";
                }break;
                case 'areas':{
                   echo json_encode($this->areas($db,$link));
                }break;
                case 'isLogged':{
                    $data=[
                        'logged'=>is_user_logged_in(),
                        'areas'=>$this->areas($db,$link),
                        'fill'=>$this->isFill($link,$db,$details,$uid,$date)
                        ];
                    echo json_encode($data);
                }break;
                case 'register':{
                    $data=[
                        'register'=> $this->registerByMail($details['mail']),
                        'areas'=>$this->areas($db,$link),
                        'fill'=>$this->isFill($link,$db,$details,$uid,$date)
                        ];
                        echo json_encode($data);
                }break;
            }
        }
        function correcto($respuesta,$resultado){
            $selecciones=[];
            $contador=0;
            foreach($respuesta as $value){
                $contador+=($resultado[$value]=='true')?1:0;
                $selecciones['respuestas'][$value]=$resultado[$value];
                $selecciones['contador']=$contador;
            }
           return $selecciones;
        }
        function multiSave($link,$db,$args,$table,$uid,$date){
            foreach ($args as $values) {
                $values->user=$uid;
                $values->date=$date;
                $db->save($link,(array)$values,$table);
            }
        }
        function registerByMail($mail,$level=''){
            $password=uniqid();
            $username=preg_split('/@/',$mail);
            $id=wp_create_user( $username[0], $password, $mail );
            if(!is_object($id)){
                wp_set_auth_cookie($id);
                $r['success']=true;
                 return $r;
            }else{
                return $id;
            }
        }
        function isFill($link,$db,$details,$uid,$date){
            $table=$db->query($link,"select area from respuestas where user=$uid and fecha='$date' group by area");
            return $table;
        }
        function areas($db,$link){
             return $db->query($link,'select area,count(area) as ppa from quiz group by area');
        }
    }
    $cuestionario=new Cuestionario($_POST);
?>