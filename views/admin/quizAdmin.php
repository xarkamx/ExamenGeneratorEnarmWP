<link rel="stylesheet" href="/wp-content/plugins/examen/assets/bootstrap/css/bootstrap.min.css" type="text/css" />
<link rel="stylesheet" href="/wp-content/plugins/examen/assets/fontAwesome/css/font-awesome.min.css">
<link rel="stylesheet" href="/wp-content/plugins/examen/views/admin/css/admin.css">
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.bundle.js"></script>
<script type="text/javascript" src="/wp-content/plugins/examen/views/js/ajax.js"></script>
<script type="text/javascript" src="/wp-content/plugins/examen/views/js/tools.js"></script>
<script>
    const tools=new Tools();
    tools.wait(true,'Cargando Sistema...');
</script>
<div class='panel panel-info'>
    <div class='panel-heading text-right'>
        <h4>Graficos 
            <i data-toggle="collapse" data-target=".graficadora" class="btn fa fa-sort-desc" aria-hidden="true"></i>
        </h4>
    </div>
    <div class='panel-body graficadora collapse'>
        <div class='col-sm-4 calificacion'>
           Calificaciones globales
        </div>
        <div class='col-sm-4 calpD'>
            Calificaciones del dia
        </div>
        <div class='col-sm-4 area'>
            Calificaciones por area
        </div>
        <div class='col-sm-4 especialidad'>
            Por especialidad
        </div>
        <div class='col-sm-4 exploracion'>
            Por exploracion
        </div>
        <div class='col-sm-4 respondidas'>
            Por Preguntas respondidas correctamente
        </div>
    </div>
</div>
<div class='panel panel-primary'>
    <div class='panel-heading text-right'>
        <h4>Generador de examenes <i data-toggle="collapse" data-target=".examanager" class="btn fa fa-sort-desc" aria-hidden="true"></i></h4>
    </div>
    <div class='panel-body examanager'>
        <div  class="postbox quizGen col-sm-8">
            <div class="inside">
            	<div class="main">
            	    
            	</div>
            	<button class='btn btn-success btn-save pull-left'>Guardar</button>
            	<button class='btn btn-warning btn-void pull-right'>vaciar form</button>
    	
            </div>
    </div>
        <div class='postbox quizList col-sm-4'>
            <ul class='list-group q-group '>
                <li class="list-group-item quiz col-sm-12">
                    <div class='pregunta col-sm-7'>Pregunta</div>
                    <div class='actions col-sm-5 id'>
                        <i class="fa fa-pencil-square-o btn-success" data-action='load' aria-hidden="true"></i>
                        <i class="fa fa-trash-o btn-danger" data-action='delete' aria-hidden="true"></i>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    
</div>
<div class='panel panel-success'>
    <div class='panel-heading text-right'>
        <h4>Generador de shortcodes <i data-toggle="collapse" data-target=".scr" class="btn fa fa-sort-desc" aria-hidden="true"></i></h4>
    </div>
    <div class='panel-body scr collapse'>
        <div  class="postbox  col-sm-12">
            <div class="inside">
            	<div class="main">
            	    <div class='form-group'>
            	        <label for="area">Area</label>
            	        <input type='text' name='area' id='scAreas' class='form-control' placeholder='a que area pertenecera tu examen?'>
            	    </div>
            	    <div class='form-group'>
            	        <label for="preguntas">Preguntas</label>
            	        <input type='number' name='preguntas' id='scPreguntas' class='form-control' placeholder='cuantas preguntas tendra este examen?'>
            	    </div>
            	</div>
            	<div class='list-group-item '>
            	        shortcode:<span class='badge shortcode'></span>
            	    </div>
            	<button class='btn btn-success btn-shortcode pull-left'>Generar ShortCode</button>
            </div>
        </div>
    </div>
    
</div>
<script type="text/javascript" src="/wp-content/plugins/examen/views/admin/js/specialEvents.js"></script>
<script type="text/javascript" src="/wp-content/plugins/examen/assets/tinymce/js/tinymce.min.js"></script>
<script type="text/javascript" src="/wp-content/plugins/examen/assets/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/wp-content/plugins/examen/views/js/fillTemplates.js"></script>
<script type="text/javascript" src="/wp-content/plugins/examen/views/admin/js/quizAdmin.js"></script>

