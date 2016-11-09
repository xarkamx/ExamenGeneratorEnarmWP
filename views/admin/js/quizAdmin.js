(function (){
    var path='/wp-content/plugins/examen/';
    self.mainAdmin=function(){
        this.printForm=function(){
            var formFill=new templateFill(),
            formParameters={
                pregunta:{
                    type:'text',
                    class:'form-control',
                    id:'pregunta',
                    placeholder:'Ingresa una pregunta',
                    label:'Pregunta',
                    require:true,
                },
                revisionDelCaso:{
                    type:'select',
                    class:'form-control',
                    id:'revisionDelCaso',
                    options:getRevisionCases(),
                    placeholder:'selecciona el post con la categoria de caso clinico',
                    label:'Revision caso clinico',
                    require:true,
                },
                casoClinico:{
                    type:'textarea',
                    class:'form-control',
                    id:'casoClinico',
                    placeholder:'Caso Clinico',
                    label:'Caso clinico',
                    require:true,
                },
                area:{
                    type:'text',
                    class:'form-control',
                    id:'area',
                    placeholder:'Define el area de especialidad',
                    label:'Area',
                    require:true,
                },
                especialidad:{
                    type:'text',
                    class:'form-control',
                    id:'especialidad',
                    placeholder:'Define especialidad',
                    label:'Especialidad',
                    require:true,
                },
                exploracion:{
                    type:'text',
                    class:'form-control',
                    id:'exploracion',
                    placeholder:'Area de exploracion',
                    label:'Exploración',
                    require:true,
                },
                bibliografia:{
                    type:'textarea',
                    class:'form-control',
                    id:'bibliografia',
                    placeholder:'ingresa una bibliografia separado por comas.',
                    label:'Bibliografia',
                    require:true,
                },
                quizIMG:{
                    placeholder:'Imagen de referencia',
                    class:'form-control',
                    containerClass:'form-group',
                    label:'Imagen de referencia',
                    type:'file',
                    id:'imgQuiz',
                },
                respuesta:{
                    placeholder:'ingresa respuesta',
                    class:'form-control',
                    containerClass:'form-group',
                    label:'Respuestas',
                    checkValue:'true',
                    button:'add',
                    type:'text',
                    id:'',
                    callback:function(dom,par){
                        var custom_ajax=new ajax(),
                        mainDiv=document.createElement('div'),
                        args={
                            method:'get',
                            url:path+'views/templates/respuestas.html',
                            asinc:false,
                        };
                        mainDiv.innerHTML=custom_ajax.simple_cURL(args);
                        return mainDiv;
                    }
                },
            },
            target=document.querySelector('.quizGen .main');
            target.innerHTML='';
            formFill.formGenerator(formParameters,target);
            tinymce.init({
                selector:'#casoClinico',
                setup: function (editor) {
                    editor.on('keyup',function(ed){
                      console.log(this.getContent());
                      document.querySelector("#casoClinico").value=this.getContent();
                    })
                },
            });
            jQuery('select').tooltip();
            setEvents();
        },
        this.printQuiz=function(){
           
            sp=new adminSpecialEvents(),
            parameters={};
            parameters.action='load';
            tools.postData(path+'controller/admin/saveQuiz.php',parameters,function(result){
                var ft=new templateFill(),
                pn=document.querySelector('.q-group');
                tn=document.querySelector('.q-group .quiz');
                ft.tableFill(pn,tn,result.response,sp);
            });
        }
        this.duplicateDom=function(dom){
            var clone=dom.cloneNode(true);
            clone.classList.add('clone');
            dom.parentElement.insertAdjacentElement('afterend',clone);
            clone.querySelector('.respuesta').addEventListener('keyup',function(ev){
                if(this.value==''){
                    clone.parentElement.removeChild(clone);
                };
            });
        }
        this.loadChart=function(selector,data){
            var ctx = document.createElement("canvas"),
            selector=document.querySelector(selector);
            let label=selector.innerHTML;
            selector.innerHTML='';
            selector.appendChild(ctx);
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.keys,
                    datasets: [{
                        label: label,
                        data: data.data,
                        backgroundColor:'#'+Math.random().toString(16).slice(2, 8).toUpperCase(),
                        borderWidth: 1
                    }]
                },
            });
                    }
    }
    function saveRespuesta(){
        var rep=document.querySelector('.respuestas'),
        val=rep.querySelector('.respuesta').value;
        mainAdmin();
        (val!='')?self.duplicateDom(rep):alert('Se necesita una respuesta');
        rep.querySelector('.respuesta').value='';
        rep.querySelector('.correcto').checked=false;
    }
    function setEvents(){
        document.querySelector('.addOption').addEventListener('click',function(ev){
                saveRespuesta();
        });
        document.querySelector('.respuesta').addEventListener('keyup',function(ev){
                switch (ev.keyCode) {
                    case 13:
                         saveRespuesta();
                    break;
                    default:
                        console.log(ev.keyCode);
                }
        });
        document.querySelector('.btn-save').addEventListener('click',function(ev){
            var main=document.querySelector('.quizGen .main'),
            img=document.querySelector(".img");
            
            var param=tools.inputsToObject(main);
            if(param==false){return false}
            if(img!=null){
                param.img=img.src;
                img.parentElement.removeChild(img);
            }
            param.action=main.dataset.action||'save';
            param.id=main.dataset.id||undefined;
            tools.postData(path+'controller/admin/saveQuiz.php',param,function(result){
                document.querySelector('#pregunta').value='';
                document.querySelector('#respuesta').value='';
                document.querySelector('#imgQuiz').value='';
                document.querySelector('#respuesta').checked='false';
                document.querySelector('#pregunta').focus();
                tinyMCE.get('casoClinico').setContent('');
                cMain.printQuiz();
                main.dataset.action='save';
                tools.removeBySelector('.clone');
            });
        });
        document.querySelector('.btn-void').addEventListener('click',function(ev){
            var main=document.querySelector('.quizGen .main'),
            img=document.querySelector(".img");
           
            var param=tools.inputsToObject(main);
            if(param==false){return false}
            if(img!=null){
                param.img=img.src;
                img.parentElement.removeChild(img);
            }
            document.querySelector('#pregunta').value='';
            document.querySelector('#area').value='';
            document.querySelector('#especialidad').value='';
            document.querySelector('#exploracion').value='';
            document.querySelector('#bibliografia').value='';
            document.querySelector('#respuesta').value='';
            document.querySelector('#imgQuiz').value='';
            document.querySelector('#respuesta').checked='false';
            document.querySelector('#pregunta').focus();
            tinyMCE.get('casoClinico').setContent('');
            cMain.printQuiz();
            main.dataset.action='save';
            tools.removeBySelector('.clone');
        });
        document.querySelector('#imgQuiz').addEventListener('change',function(ev){
            tools.fileUpload(ev.target,function(ev){
                const parameters={
                    file:ev.result,
                    pregunta:document.querySelector('#pregunta').value,
                    area:document.querySelector('#area').value,
                };
                tools.postData(path+'controller/admin/uploadFiles.php',parameters,function(result){
                    var dIMG=document.querySelector('#imgQuiz');
                    var pIMG=dIMG.parentElement;
                    var im=document.querySelector('.img')||document.createElement('img');
                    im.src=result.responseText;
                    im.className='img';
                    im.style.width='200px';
                    pIMG.appendChild(im);
                });
            });
        });
        document.querySelector('#imgQuiz').addEventListener('click',function(ev){
           var im=document.querySelector('.img');
           (document.querySelector('.img')!=null)?im.parentElement.removeChild(im):'';
        });
        document.querySelector('#revisionDelCaso').addEventListener('change',(ev)=>{
            if(ev.target.value=='cn'){
                window.location='/wp-admin/post-new.php';
            }
        });
        document.querySelector('.btn-shortcode').addEventListener('click',ev=>{
            const preguntas=document.querySelector('#scPreguntas').value;
            const area=document.querySelector('#scAreas').value.toLowerCase();
            document.querySelector('.shortcode').innerHTML="[quizGenerator preguntas='"+preguntas+"' area='"+area+"']";
        })
    }
    function getRevisionCases(){
        
        var r=JSON.parse(tools.requestPage(path+'controller/admin/revCasoClinico.php?crud=read&action=post&cat=caso-clinico',{}));
        var result={};
        for(let pos=0;pos<r.length;++pos){
            let option={}
            option.value=r[pos].ID;
            option.label=r[pos].post_title;
            result[r[pos].post_name]=option;
        }
        result['default']={
            value:'cn',
            label:'crear nuevo caso clinico',
        }
        return result;
    }
    function getStats(selector,action){
        let params={};
        params.action=action;
        tools.postData(path+'controller/admin/getStats.php',params,(result)=>{
            let jr=JSON.parse(result.response);
            if(jr.keys!=null){
                cMain.loadChart(selector,jr);
            }else{
                document.querySelector(selector).innerHTML='No hay informacion para este grafico';
                console.log('no examenes hoy')
            }
        });
    }
    const cMain=new mainAdmin();
    getStats('.calificacion','calificacionGlobal');
    getStats('.calpD','calificacionDelDia');
    getStats('.area','areas');
    getStats('.especialidad','especialidad');
    getStats('.exploracion','exploracion');
    getStats('.respondidas','pRespondidas');
    cMain.printForm();
    cMain.printQuiz();
    window.onload=function(ev){
        tools.wait(false,'Cargando Sistema...');
    }
})();