<?php
  require_once($_SERVER['DOCUMENT_ROOT'].'/wp-config.php');
  require_once($_SERVER['DOCUMENT_ROOT'].'/wp-includes/functions.php');
  require_once($_SERVER['DOCUMENT_ROOT'].'/wp-includes/post.php');
  class customWPAPI{
      function __construct($crud){
          switch($crud){
              case 'create':{
                $this->create($_POST,$callback);
              }break;
              case 'read':{
                  $this->read($_GET);
              }break;
              case 'update':{
                $this->update($_PUT,$callback);
              }break;
              case 'delete':{
                $this->delete($_DELETE,$callback);
              }break;
          }
      }
      function read($parameters){
        switch($parameters['action']){
          case 'post':{
            $args = array(
            	'category_name'    => 'casoClinico',
            	'orderby'          => 'date',
          );
          $posts_array = get_posts( $args );
          echo json_encode($posts_array);
          }break;
          case 'byID':{
            $posts_array = get_post( $_POST['id'] );
            echo json_encode($posts_array);
          }break;
        }
      }
  }
  $cAPI=new customWPAPI($_REQUEST['crud']);
?>