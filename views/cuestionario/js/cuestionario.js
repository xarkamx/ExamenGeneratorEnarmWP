(function (){
    const   tools=new Tools(),
            ft=new templateFill(),
            path="/wp-content/plugins/examen/";
    self.MainCuestionario=function(){
        this.answer=''
        this.loadQuiz=function(parameters={}){
            console.log('load quiz');
            const tools=new Tools();
            const cuestionario=document.querySelector('.cuestionario');
            let selector=cuestionario.dataset.selector;
            parameters.limite=cuestionario.dataset.preguntas;
            parameters.area=cuestionario.dataset.area;
            parameters.action='preguntas';
            check={}
            check.action='respondio';
            if(selector=="true"){
                this.loadSelector();
                return false;
            }
            check.area=document.querySelector('.cuestionario').dataset.area;
            var isFill=tools.requestPage("/wp-content/plugins/examen/controller/cuestionario/",check);
            console.log(isFill)
            if(isFill==0){
                const template=tools.import(path+"/views/templates/quiz.html");
                const fq=cuestionario.querySelector('.frameQuiz');
                fq.innerHTML=''
                fq.appendChild(template);
                tools.postData('/wp-content/plugins/examen/controller/cuestionario/',parameters,function(result){
                var json=JSON.parse(result.response);
                self.respuestas={};
                document.querySelector('.titles').appendChild(paginado(json,0));
                document.querySelector('.titles').addEventListener('click',function(ev){
                    if(ev.target.tagName!='LI'){
                        return false;
                    }
                    saveResponse();
                    document.querySelector('.titles .active').classList.remove('active');
                    ev.target.classList.add('active');
                    pregunta(json[ev.target.dataset.page]);
                    document.querySelector('.nxt').dataset.position=ev.target.dataset.page;
                    setEvents(json);
                 });
                document.querySelector('.terminar').addEventListener('click',function(ev){
                    terminar(tools);
                });
                document.querySelector('.cuestionario').dataset.preguntas=json.length;
                pregunta(json[0]);
                setEvents(json);
            });
            }else{
                this.loadResult();
            }
        };
        this.loadResult=function(parameters={}){
            var cuestionario=document.querySelector('.frameQuiz');
            cuestionario.innerHTML='';
            var tools=new Tools();
            var html=tools.requestPage("/wp-content/plugins/examen/views/templates/resultados.html");
            var div=document.createElement('div');
            div.innerHTML=html;
            cuestionario.appendChild(div);
            parameters.action='respuestas'
            parameters.area=document.querySelector('.cuestionario').dataset.area;
            tools.postData('/wp-content/plugins/examen/controller/cuestionario/',parameters,function(result){
                printResults(JSON.parse(result.response));
            });
        }
        this.loadSelector=function(){
            const cuestionario=document.querySelector('.cuestionario');
            const frameQuiz=cuestionario.querySelector('.frameQuiz');
            const template=tools.import(path+"/views/templates/selector.html");
            const params={
                action:'areas',
            }
            tools.postData("/wp-content/plugins/examen/controller/cuestionario/",params,(result)=>{
                areas(template,result.response);
            })
            frameQuiz.innerHTML='';
            frameQuiz.appendChild(template);
        }
        this.isLogged=function(){
            tools.postData(path+'/controller/cuestionario/index.php',{action:'isLogged'},ev=>{
                if(ev.response!=true){
                    console.log(ev.response);
                    modalLogin();
                    return false;
                }else{
                    this.loadQuiz();
                }
            })
        }
    };
    function paginado(json,seleccionado){
        var ul=document.createDocumentFragment('ul'),
        total=json.length;
        ul.className='pagination';
        for (let pos=0;pos<total;++pos){
            let li=document.createElement('li');
            li.innerHTML='p'+(pos+1);
            li.dataset.page=pos;
            li.dataset.pid=json[pos].id;
            li.className=(seleccionado==pos)?'active':'';
            li.classList.add('col-sm-2');
            li.classList.add('list-group-item');
            if(json[pos]['correcto']==true){
                li.classList.add('list-group-item-success')
                
            }else if(json[pos]['correcto']==false){
                li.classList.add('list-group-item-danger')
            }
            ul.appendChild(li);
        }
        return ul;
    }
    function pregunta(json){
        sp=new cuestionarioSpecialEvent(),
        pn=document.querySelector('.preguntas'),
        tn=document.querySelector('.preguntas','.quiz'),
        args=[];
        args.push(json);
        ft.tableFill(pn,tn,args,sp);
    }
    function setEvents(json){
        document.querySelector('.nxt').addEventListener('click',function(ev){
            saveResponse();
            var pos=parseFloat(document.querySelector('.nxt').dataset.position||0);
            pos=(pos>=json.length-1)?0:pos+1;
            pregunta(json[pos]);
            setEvents(json);
            document.querySelector('.nxt').dataset.position=pos;
            document.querySelector('.titles .active').classList.remove('active');
            document.querySelectorAll('.titles li')[pos].classList.add('active');
            
        })
        document.querySelector('.prev').addEventListener('click',function(ev){
            saveResponse();
            var pos=parseFloat(document.querySelector('.nxt').dataset.position||json.length);
            pos=(pos<=0)?json.length-1:pos-1;
            pregunta(json[pos]);
            setEvents(json);
            document.querySelector('.nxt').dataset.position=pos;
            document.querySelector('.titles .active').classList.remove('active');
            document.querySelectorAll('.titles li')[pos].classList.add('active');
        })
    }
    function saveResponse(){
        var resp='d'+document.querySelector('.quiz .respuesta').dataset.id,
        currentID='d'+document.querySelector('.active').dataset.pid;
        checks=document.querySelectorAll('.respuesta .form-control:checked');
        self.respuestas[resp]=[];
        for(let pos=0;pos<checks.length;++pos){
            check=checks[pos];
            self.respuestas[resp].push(check.value);
        }
        console.log(self.respuestas);
        if(self.respuestas[currentID].length>0){
            document.querySelector('.active').classList.add('list-group-item-info')
        }
    }
    function terminar(tools){
        saveResponse();
        var parameters={};
        parameters=self.respuestas;
        var cuestionario=document.querySelector('.cuestionario');
        if(Object.keys(self.respuestas).length<cuestionario.dataset.preguntas){
                alert('hey aun no terminas!');
                return false;
            }
        parameters.action='save';
        parameters.area=cuestionario.dataset.area;
        tools.postData('/wp-content/plugins/examen/controller/cuestionario/',parameters,function(result){
            console.log(result.response);
            MainCuestionario();
            self.loadResult();
        });
        
    }
    function printResults(json){
        var cleanTable=[],
        items={
            area:{},
            especialidad:{},
            exploracion:{},
        },
        ft=new templateFill(),
        pn=document.querySelector('.tablaResultados'),
        tn=document.querySelector('.tablaResultados .resultados'),
        puntaje=0,
        puntajeMaximo=0,
        pc=0;
        for(let pos=0;pos<json.length;++pos){
            let pregunta=json[pos];
            let preObj=setResults(pregunta);
            pc+=(preObj['valorMaximo']==preObj['resultado'])?1:0;
            cleanTable.push(preObj);
            items.area[pregunta.area]=calcSegments(items.area[pregunta.area],pregunta,preObj);
            items.especialidad[pregunta.especialidad]=calcSegments(items.especialidad[pregunta.especialidad],pregunta,preObj);
            items.exploracion[pregunta.exploracion]=calcSegments(items.exploracion[pregunta.exploracion],pregunta,preObj);
        }
        let cal=(pc/json.length)*100;
        document.querySelector('.frameQuiz .tp').innerHTML=json.length;
        document.querySelector('.frameQuiz .pc').innerHTML=pc;
        document.querySelector('.frameQuiz .pi').innerHTML=json.length-pc;
        document.querySelector('.frameQuiz .cal').innerHTML=cal.toFixed(2)+'%';
        document.querySelector('.rpp').addEventListener('click',function(ev){
            var fq=document.querySelector('.frameQuiz');
            fq.innerHTML=''
            fq.appendChild(rrpTemplate());
            document.querySelector('.titles').appendChild(paginado(cleanTable,0));
            pregunta(cleanTable[0]);
            document.querySelector('.titles').addEventListener('click',function(ev){
                if(ev.target.tagName!='LI'){
                    return false;
                }
                document.querySelector('.titles .active').classList.remove('active');
                ev.target.classList.add('active');
                pregunta(cleanTable[ev.target.dataset.page]);
                
             });
        })
        document.querySelector('.rg').addEventListener('click',(ev)=>{
            var fq=document.querySelector('.frameQuiz');
            fq.innerHTML=''
            fq.appendChild(rgTemplate());
            console.log(items.area);
            pn=document.querySelector('.frameQuiz .areas'),
            tn=document.querySelector('.areas .repeatArea');
            ft.tableFill(pn,tn,items.area);
            pn=document.querySelector('.frameQuiz .especialidades'),
            tn=document.querySelector('.especialidades .repeatEspecialidad');
            ft.tableFill(pn,tn,items.especialidad);
            pn=document.querySelector('.frameQuiz .exploraciones'),
            tn=document.querySelector('.exploraciones .repeatExploracion');
            ft.tableFill(pn,tn,items.exploracion);
        });
        document.querySelector('.reset').addEventListener('click',(ev)=>{
            const parameters={
                action:'reset',
                area:document.querySelector('.cuestionario').dataset.area,
            }
            tools.postData('/wp-content/plugins/examen/controller/cuestionario/',parameters,(result)=>{
               
                location.reload();
            });
        });
        var parameters={};
        parameters.tp=json.length;
        parameters.pc=pc;
        parameters.pi=json.length-pc;
        parameters.cal=cal.toFixed(2);
        parameters.area=items.area;
        parameters.carea=document.querySelector('.cuestionario').dataset.area;
        parameters.especialidad=items.especialidad;
        parameters.exploracion=items.exploracion;
        parameters.action='createResults';
        tools.postData('/wp-content/plugins/examen/controller/cuestionario/',parameters,function(result){
        
        });
    }
    function rrpTemplate(){
        var html=tools.requestPage("/wp-content/plugins/examen/views/templates/resultadosPorPregunta.html");
        var div=document.createElement('div');
        div.innerHTML=html;
        return div;
    }
    function rgTemplate(){
        var html=tools.requestPage("/wp-content/plugins/examen/views/templates/resultadosGenerales.html");
        var div=document.createElement('div');
        div.innerHTML=html;
        return div;
    }
    function setResults(pregunta){
        let preObj={};
        if(pregunta.id==null){
            return false;
        }
        let correcto=pregunta['correcto'].split(',');
            let opciones=pregunta['opciones'].split(',');
            let maxVal=0;
            let rc=[];
            for(let index=0;index<correcto.length;++index){
                (correcto[index]=='true')?rc.push(opciones[index]):'';
                maxVal+=(correcto[index]=='true')?1:0;
            }
            preObj['id']=pregunta['id'];
            preObj['pregunta']=pregunta['pregunta'];
            preObj['turespuesta']=pregunta['respuesta'];
            preObj['respuesta']=pregunta['respuesta'];
            preObj['respuestaCorrecta']=rc.join();
            preObj['resultado']=pregunta['resultado'];
            preObj['valorMaximo']=maxVal;
            preObj['area']=pregunta['area'];
            preObj['exploracion']=pregunta['exploracion'];
            preObj['bibliografia']=pregunta['bibliografia'];
            preObj['especialidad']=pregunta['especialidad'];
            preObj['casoClinico']=pregunta['casoClinico'];
            preObj['revisionDelCaso']=pregunta['revisionDelCaso'];
            preObj['img']=pregunta['img'];
            preObj['correcto']=(preObj['valorMaximo']==preObj['resultado']);
            return preObj;
    }
    function calcSegments(segmento,pregunta,preObj){
        let cal=0;
        if(segmento==undefined){
            segmento={};
            segmento.pc=0;
            segmento.pi=0;
            segmento.tp=0;
            segmento.area=pregunta.area;
            segmento.especialidad=pregunta.especialidad;
            segmento.exploracion=pregunta.exploracion;
        }
        segmento.pc+=(preObj['valorMaximo']==preObj['resultado'])?1:0;
        segmento.pi+=(preObj['valorMaximo']!=preObj['resultado'])?1:0;
        segmento.tp+=1;
        cal=(segmento.pc/segmento.tp)*100;
        segmento.cal=cal.toFixed(2);
        return segmento;
    }
    function areas(dom,args){
        let sp=new cuestionarioSpecialEvent(),
        pn=dom.querySelector('.areas'),
        tn=dom.querySelector('.areaSelector');
        sp.area=function(dom,value){
            const mc=new MainCuestionario();
            dom.innerHTML=value;
            dom.parentElement.addEventListener('click',(ev)=>{
                const cuestionario=document.querySelector('.cuestionario');
                const fq=cuestionario.querySelector('.frameQuiz');
                cuestionario.dataset.selector='false';
                cuestionario.dataset.area=value;
                const template=tools.import(path+"/views/templates/quiz.html");
                fq.innerHTML=''
                fq.appendChild(template);
                mc.loadQuiz();
            });
        }
       
        ft.tableFill(pn,tn,args,sp);
    }
    function modalLogin(){
        jQuery('#myModal').modal('show');
        const modal=document.querySelector('#myModal');
        const regButton=modal.querySelector('.btn-registro');
        const mail=modal.querySelector('input[type=email]');
        regButton.addEventListener('click',ev=>{
            if(mail.checkValidity()){
                registerAndLogin(mail.value);
                jQuery('#myModal').modal('hide');
            }else{
                alert('correo no valido, recuerda que tiene que tener el siguiente formato: nombredeusuario@dominio.com');
            }
        });
    }
    function registerAndLogin(mail){
         tools.postData(path+'/controller/cuestionario/index.php',{action:'register',mail},ev=>{
             debugger;
            const resp=JSON.parse(ev.response);
            if(resp.success==1){
                 mc.loadQuiz();
            }else{
                alert('Ya te has registrado! para acceder al examen solo tienes que loggearte');
            }
         });
    }
    const mc=new MainCuestionario();
    window.onload=function(ev){
        mc.isLogged();
        tools.wait(false,'Cargando Sistema...');
    }
})();