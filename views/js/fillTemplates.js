(function (){
    self.templateFill=function(){
        this.tableFill=function(parentDOM,targetDOM,args,custom_obj={}){
            var defaultDOM=this.defaultDom(parentDOM);
            var inheritDOM=document.createElement('div');
            inheritDOM.innerHTML=defaultDOM;
            targetDOM.innerHTML=inheritDOM.innerHTML;
            if(parentDOM==undefined){
                return false;
            }
            if(targetDOM==undefined || args.length==0){
                console.log('llamada incompleta');
                parentDOM.innerHTML=defaultDOM;
                return false;
            }
            var json=(typeof(args)=='object')?args:JSON.parse(args),
            fragment=document.createDocumentFragment();
            for (var row in json){
                item=targetDOM.cloneNode(true);
                item=fillRow(item,json[row],custom_obj);
                fragment.appendChild(item);
            }
            parentDOM.innerHTML='';
            parentDOM.appendChild(fragment);
        }
        this.defaultDom=function(dom){
            if(dom==null){
                return '';
            }
            dom.id=(dom.id=='')?'id'+Date.now():dom.id;
            var content=window.localStorage.getItem(dom.id);
            if(content==null){
                window.localStorage.setItem(dom.id,dom.innerHTML);
                return dom.innerHTML;
            }else{
                return content;
            }
    }
        this.formGenerator=function(formParameters,targetDOM,custom_obj={}){
            console.log('formGenerator');
            var pos=0,
            formGroup;
            targetDOM.classList.add('form-horizontal');
            for (pos in formParameters){
                var dom=formParameters[pos];
                if(custom_obj[pos]!=undefined){
                   var input=custom_obj[pos](dom);
                   targetDOM.appendChild(input);
                   continue;
                }    
                var setInput=this.fillForm(dom),
                label=document.createElement('label');
                label.innerHTML=(dom.label||dom.id||pos);
                label.innerHTML+=(dom.require==true)?'*':'';
                label.className='col-md-3 control-label';
                formGroup=document.createElement('div');
                formGroup.className=dom.containerClass||'form-group';
                formGroup.appendChild(label);
                formGroup.appendChild(setInput);
                targetDOM.appendChild(formGroup);
            }
        }
        this.fillForm=function(formInput){
            var col=document.createElement('div');
            col.className='col-sm-6';
            var newDOM;
            var type=formInput.type;
            switch (type) {
                case 'date':{
                    newDOM=document.createElement('input');
                    newDOM.type='text';
                    newDOM.placeholder=formInput.placeholder;
                    newDOM.dataset.inputMask="99/99/9999",
                    newDOM.dataset.dateFormat='mm/dd/yyyy',
                    $(newDOM).datepicker();
                }break;
                case 'select':{
                    newDOM=document.createElement('select');
                    var options=formInput.options,
                    pos=0;
                    for(pos in options){
                        var option=document.createElement('option');
                        option.value=(Array.isArray(options))?options[pos]:options[pos].value;
                        option.innerHTML=(Array.isArray(options))?options[pos]:options[pos].label;
                        newDOM.appendChild(option);
                    }
                    newDOM.addEventListener('change',function(ev){
                        if(this.value=='OTHER'){
                            parent=ev.target.parentElement;
                            parent.removeChild(ev.target);
                            newDOM=document.createElement('input');
                            newDOM.type=type;
                            newDOM.placeholder=formInput.placeholder;
                            newDOM.id=formInput.id;
                            newDOM.className=formInput.class;
                            parent.appendChild(newDOM);
                        }
                    });
                    newDOM.dataset.toogle='tooltip';
                    newDOM.title=formInput.placeholder;
                }break;
                case 'textarea':{
                    newDOM=document.createElement('textarea');
                    newDOM.placeholder=formInput.placeholder;
                }break;
                default:{
                    newDOM=document.createElement('input');
                    newDOM.type=type;
                    newDOM.placeholder=formInput.placeholder;
                    (formInput.mask==undefined)?'':$(newDOM).mask(formInput.mask);
                }
                
            }
            newDOM.require=formInput.require;
            newDOM.className=formInput.class;
            newDOM.id=formInput.id;
            newDOM.required=formInput.require;
            newDOM.name=formInput.name||formInput.id;
            newDOM=(formInput.callback==undefined)?newDOM:formInput.callback(newDOM,formInput);
            (formInput.id!='')?newDOM.classList.add(formInput.id):'';
            col.appendChild(newDOM);
            return col;
        }
    }
    /*-
    custom_obj sirve para manejar situaciones especiales. 
    solo tienes que crear tu evento en un objeto, y si la clase de origen esta representada en 
    tu objeto entonces tomara tu evento antes que el default del tipo.
    
    los parametros validos para tus metodos deben ser maximo dos siendo doms siempre el primero, tus metodos tienen que regresar un dom valido, de lo contrario no va a funcionar.
    -*/
    function fillRow(targetDOM,row,custom_obj={}){
        for (var column in row){
            var item=targetDOM.querySelector("."+column);
            if(item==null){
                continue;
            }
            if(custom_obj[column]!=undefined){
                custom_obj[column](item,row[column]);
                continue;
            }
            switch (item.tagName) {
                case 'IMG':{
                    if(row[column]==''||row[column]==null){
                        item.parentElement.removeChild(item);
                    }else{
                        item.src=row[column];
                    }
                }break;
                case 'UL':{
                    item.innerHTML='';
                    for(var parameters in row[column]){
                        var li=document.createElement('li');
                        li.classList.add(row[column][parameters][0].replace(/ /gi,'_'));
                        li.innerHTML=row[column][parameters][0];
                        item.appendChild(li);
                    }
                }break;
                case 'SELECT':{
                    if(typeof(row[column])!='object'){
                        row[column]=row[column].split(',');
                    }
                    var subsis=item.cloneNode(true);
                     for(var parameters in row[column]){
                         if(row[column][parameters]==''){
                             continue;
                         }
                        var option=document.createElement('option');
                        option.classList.add(parameters.replace(/ /gi,'_').toLowerCase());
                        option.innerHTML=row[column][parameters];
                        subsis.value=row[column][parameters];
                        if(subsis.value==''){
                            item.appendChild(option);
                        }else{
                            item.options[subsis.selectedIndex].selected=true;
                        }
                    }
                }break;
                case 'A':{
                    item.href=row[column];
                }break;
                case 'INPUT':{
                    item.value=row[column];
                }break;
                case 'TEXTAREA':{
                    item.value=row[column];
                }break;
                default:
                   item.innerHTML=row[column];
                   item.classList.remove('hidden');
                break;
            }
          
        }
          return targetDOM;
    }
})();