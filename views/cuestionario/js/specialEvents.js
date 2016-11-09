(function(){
    self.cuestionarioSpecialEvent=function(){
        this.respuesta=function(dom,value){
            var respuesta=value.split(',');
            var fg=dom.querySelector('.form-group');
            var node=document.createDocumentFragment('div');
            var tools=new Tools();
            var id='d'+dom.dataset.id;
            for(let pos=0;pos<respuesta.length;++pos){
                let clone=fg.cloneNode(true);
                clone.querySelector('label').innerHTML=respuesta[pos];
                clone.querySelector('.respuesta').value=respuesta[pos];
                if(window.self.respuestas[id]!=undefined){
                    clone.querySelector('.respuesta').checked=(window.self.respuestas[id].indexOf(respuesta[pos])>=0);
                }
                node.appendChild(clone);
            }
            dom.innerHTML='';
            dom.appendChild(node);
        }  
        this.id=function(dom,value){
            dom.dataset.id=value;
        }
        this.correcto=function(dom,value){
            dom.innerHTML=(value==true)?'correcto':'incorrecto';
            dom.style.color=(value==true)?'green':'red';
            
        }
        this.revisionDelCaso=function(dom,value){
            dom.dataset.id=value;
            dom.addEventListener('click',function(ev){
                var tools=new Tools();
                var parameters={}
                parameters.id=this.dataset.id;
                tools.postData("/wp-content/plugins/examen/controller/admin/revCasoClinico.php?crud=read&action=byID&cat=caso-clinico",parameters,function(ev){
                    var response=JSON.parse(ev.response),
                    rc=document.querySelector('#revisionDelCaso');
                    rc.querySelector('.modal-title').innerHTML=response.post_title;
                    rc.querySelector('.modal-body').innerHTML=response.post_content;
                })
                jQuery('#revisionDelCaso').modal('show');
            })
        }
    }
})();