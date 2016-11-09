(function(){
    self.adminSpecialEvents=function(){
        this.id=function(dom,value){
            var actions=dom.querySelectorAll('.actions i');
            let pos=0
            for(pos;pos<actions.length;++pos){
                actions[pos].dataset.id=value;
                actions[pos].addEventListener('click',function(ev){
                    var tools=new Tools();
                    tools.postData('/wp-content/plugins/examen/controller/admin/saveQuiz.php',this.dataset,function(result){
                           loadInfo(result);
                    });
                });
            }
        }
        function loadInfo(result){
            var cMain=new mainAdmin();
            var tools=new Tools();
            if(result.responseText=='delete'){
                document.querySelector('.quizGen .main').dataset.action='save';
                cMain.printQuiz();
                return false;
            }
            tools.removeBySelector('.form-group .clone');
            var r=JSON.parse(result.responseText);
            var dIMG=document.querySelector('#imgQuiz');
            var pIMG=dIMG.parentElement;
            var im=document.querySelector('.img')||document.createElement('img');
            im.src=r[0].img;
            im.className='img';
            im.style.width='200px';
            pIMG.appendChild(im);
                //document.querySelector('.img').src='';
            document.querySelector('.quizGen .main').dataset.action='update';
            document.querySelector('.quizGen .main').dataset.id=r[0].id;
                //cMain.printForm();
            var tn=document.querySelectorAll('.quizGen .main input,.quizGen .main select, .quizGen .main textarea');
            for(let pos=0;pos<tn.length;++pos){
                let input=tn[pos];
                if(input.type=='file'){
                    continue;
                }
                input.value=r[0][input.id];
                if(tinyMCE.get(tn[pos].id)){
                    tinyMCE.get('casoClinico').setContent(tn[pos].value)
            }
            }
            var respuesta=document.querySelector('#respuesta');
            var respuestas=respuesta.value.split(',');
            var rv=respuestas[respuestas.length-1];
            var correcto=r[0].correcto.split(',');
            var rvc0=correcto[0];
            for(let index=0;index<respuestas.length;++index){
                respuesta.value=respuestas[index];
                respuesta.closest('.respuestas').querySelector('.correcto').checked=(correcto[index]=='true');
                (respuestas.length-1!=index)?cMain.duplicateDom(respuesta.closest('.respuestas')):'';
            }
            
        }
    }
})();