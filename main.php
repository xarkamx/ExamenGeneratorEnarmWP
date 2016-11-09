<?php
/*
Plugin Name: QuizMaker
Description: QuizMaker es un plugin dedicado a la generacion dinamica de examenes 
Version: 1.0
Author: ARKAM
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

*/
function register_plugin_page(){
    wp_create_category('casoClinico');
    add_menu_page( 'Admin Quiz', 'Admin Quiz', 'edit_others_posts', __DIR__.'/views/admin/quizAdmin.php', '','dashicons-welcome-write-blog' );;
}
function quizGenerator($args){
    $content=file_get_contents(__DIR__.'/views/cuestionario/cuestionario.html');
    $html="<div class='cuestionario' data-preguntas=$args[preguntas] data-area='$args[area]' data-selector=$args[selector]>$content</div>";
    return $html;
}
add_shortcode('quizGenerator','quizGenerator');
add_action( 'admin_menu', 'register_plugin_page' );
?>