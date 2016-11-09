(function(){
    self.Tools=function(){
        this.fileUpload=function (selector,callback) {
          var files    = selector.files,
          pos=0,
          reader  = new FileReader();
          for(pos;pos<files.length;++pos){
              let file=files[pos];
              console.log(file);
              if(file.type.split("/")[0]!='image'){
                  alert('El archivo tiene que ser imagen');
                  return false;
              }
              if(file.size/Math.pow(1024,2)>1){
                  alert('el archivo es demaciado grande, el tope es de 1MB.');
                  return false;
              }
              reader.addEventListener("load", function () {
                callback(reader);
              }, false);
              if (file) {
                reader.readAsDataURL(file);
              }
              
          }
         /* var reader  = new FileReader();
         */
        }
        this.inputsToObject=function(dom){
            var inputs=dom.querySelectorAll('input,select,textarea'),
            pos=0;
            var content={};
            for (pos;pos<inputs.length;++pos){
                if(!inputs[pos].checkValidity()){
                    alert('el campo '+inputs[pos].name+' no es valido');
                    return false;
                }
                var input=inputs[pos];
                var value;
                if(input.type=='file'){
                    value=input.files;
                }else if(input.type=='checkbox'){
                    value=input.checked;   
                }else{
                    if(input.value==''){
                        continue;
                    }
                    value=input.value.replace(/,/,'.');
                    value=encodeURIComponent(value);
                }
                if(input==undefined||typeof(input)!='object'){
                    continue;
                }
                if(!inputs[pos].checkValidity()){
                    alert('el campo '+inputs[pos].name+' no es valido');
                    return false;
                }
                if(content[input.name]==undefined){
                    content[input.name]=value;
                }else if(typeof(content[input.name])=='object'){
                    content[input.name].push(value);
                }else{
                    let val=content[input.name];
                    content[input.name]=[];
                    content[input.name].push(val);
                    content[input.name].push(value);
                }
            }
            console.log(content);
            return content;
        }
        this.postData=function(path,parameters,response){
            parameters=this.objectToSerialize(parameters);
            var custom_ajax=new ajax(),
            args={
                method:'post',
                url:path,
                header:"Content-type",
                hvalue:"application/x-www-form-urlencoded",
                asinc:true,
                parameters:parameters,
                callback:response,
            };
            var result=custom_ajax.simple_cURL(args);
        }
        this.objectToSerialize=function(param){
            var keys=Object.keys(param);
            var values=[];
            for (let k in keys){
                value=(typeof(param[keys[k]])=='object' && Array.isArray(param[keys[k]])==false)?JSON.stringify(param[keys[k]]):param[keys[k]];
                values.push(keys[k]+'='+value);
            }
            return values.join('&');
        }
        this.removeBySelector=function(selector){
            var killList=document.querySelectorAll(selector);
            var pos=0;
            for(pos;pos<killList.length;++pos){
                let killItem=killList[pos];
                killItem.parentElement.removeChild(killItem);
            }
        }
        this.replaceBySelector=function(origin,replace){
            var parent=origin.parentElement;
            parent.removeChild(origin);
            parent.appendChild(replace);
        }
        this.searchInObject=function(search,obj){
            var r={};
            for(let pos in obj){
                var items=obj[pos];
                if(Array.isArray(items)){
                    let index=items.indexOf(search)
                    r[pos]=items;
                }else if(typeof(items)=='string'&&items==search){
                    r[pos]=items;
                }else if(typeof(items)=='object'){
                    r=this.searchInObject(search,items)            
                }
            }
            return r;
        }
        this.requestPage=function(path,parameters={}){
            parameters=this.objectToSerialize(parameters);
            var custom_ajax=new ajax(),
            args={
                method:'post',
                url:path,
                header:"Content-type",
                hvalue:"application/x-www-form-urlencoded",
                asinc:false,
                parameters:parameters,
            };
            var result=custom_ajax.simple_cURL(args);
           return result;
        }
        this.wait=function(status,msn){
            if(status!=true){
                document.querySelector('.waitWall').parentElement.removeChild(
                    document.querySelector('.waitWall')
                );
                    return false;
            }
            let wait=document.createElement('div');
            wait.className='waitWall';
            wait.innerHTML='<h1>'+msn+'</h1>';
            document.body.appendChild(wait);
            return true;
        }
        this.import=function(path){
            const md=document.createElement('div');
            md.innerHTML=this.requestPage(path);
            return md;
        }
    }
}

)();

window.onerror = function(msg, url, line, col, error) {
    var tools=new Tools();
    var param={
        msg:msg,
        url:url,
        line:line,
        col:col,
        error:error,
    }
    tools.postData('/wp-content/plugins/examen/controller/includes/errorHandler.php',param,function(ev){
        alert('parece que ha ocurrido un error, no te preocupes se ha avisado al programador para que lo solucione');
    });
};