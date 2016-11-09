"use strict";
(function (){
    self.ajax= function (){
    function ajax_connect() {
        var xmlhttp;
        if (window.XMLHttpRequest)
          {
            xmlhttp=new XMLHttpRequest();
          }
        else
          {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
          }
        return xmlhttp;
    }
    this.send_Pdata=function(callback,form) {
        var xmlhttp=ajax_connect();
        var miform=form;
        var form=new FormData(miform);
        xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                callback(xmlhttp.responseText);
            }
          }
        xmlhttp.open("POST",miform.action,false);
        xmlhttp.send(form);
    };
    this.send_Gdata=function(callback,url,asinc){
        var xmlhttp=ajax_connect();
        var response='';
        xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                callback(xmlhttp.responseText);
                
            }
          }
        xmlhttp.open("get",url,asinc);
        xmlhttp.send();
    };
    this.send_Pdata_Json=function(callback,url,json,asinc){
        var xmlhttp=ajax_connect();
        var response='';
        xmlhttp.onreadystatechange=function(){
           
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                callback(xmlhttp.responseText);
                $('.alerta2').remove();
            }else{
                var d = new Date();
                var n = d.getSeconds();
                var div=document.createElement('div');
                div.className='alerta2';
                div.innerHTML='<h1>Please wait, this may take a few minutes.</h1>';
                div.innerHTML+='<center><img src="imagenes/wait.gif"></center>';
                document.body.appendChild(div);
            }
          }
        xmlhttp.open("post",url,asinc);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        xmlhttp.send('json='+json);
    }
    this.simple_cURL=function(args){
        console.log('simpleCurl')
        var xmlhttp=ajax_connect();
        var response='';
        if(args.asinc==true&&args.callback==undefined){
            console.log("funciones asincronas requieren un callback");
            return false;
        }
        xmlhttp.onreadystatechange=function(ev){
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                (args.asinc==false)?this.data=xmlhttp.responseText:args.callback(xmlhttp);
            }
        }
        xmlhttp.open(args.method,args.url,args.asinc);
        (args.header!=null)?xmlhttp.setRequestHeader(args.header,args.hvalue):''; 
        xmlhttp.send(args.parameters);
        return xmlhttp.data;
 }//regresa la respuesta de la url marcada. por el momento requerira php para cross-server args=header,method,url,asinc,parameters
}
})();