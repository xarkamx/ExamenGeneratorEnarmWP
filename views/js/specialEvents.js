(function(){
    self.specialEvents=function(){
        this.progress_status=function(dom,value){
            var css='',
            val=''
            if(value==''||value==null||value==undefined){
                css='study_in_progress';
                val='study in progress'
            }
            else{
                css=value.replace(/ /gi,'_').toLowerCase();
                val=value;
            }
            dom.innerHTML=val;
            dom.className="progress_status "+css;
            
            return dom;
        };
        this.animalSexOnArrival=function(dom,value){
            if(value==''){
                value='male';
            }
            dom.classList.add(value);
        };
        this.animalStatus=function (dom,value){
            if(value==null){
                return 0;
            }
            dom.classList.add(value.replace(/ /gi,"_"));
            dom.innerHTML=value;
        }
        this.animalColor=function(dom,value){
            dom.style.background=value;
        }
        this.permisosMenu=function(dom,val){
          inputs=dom.querySelectorAll('input');
          for(key in inputs){
              inputs[key].name=val.replace(/ /gi,'_')+'[]';
          }
          dom.querySelector('label').innerHTML=val;
      }
        this.repeatOnDays=function(dom,val){
            let days=(val!=null)?val.split(','):'';
            dom.closest('.content').querySelector('.repeats').innerHTML='';
            if(days[0]==''){
                //return false;
            }
            let indexDays=days.length-1;
            for (indexDays;indexDays>=0;indexDays--){
                let repeats=dom.closest('.content').querySelector('.repeats');
				dom.value=days[indexDays];
				if(dom.value==''){
				    continue;
				}
				let node=dom.closest('.repDad').cloneNode(true);
				repeats.appendChild(node);
            }
            dom.value='';
        }
        this.isGhost=function(dom,val){
            dom.innerHTML='to delete please go to the parent event';
            dom.classList.remove('deleteEvent');
            dom.dataset.ghostOf=val;
        }
        this.color=function(dom,val){
            //dom.style.background=val;
        }
    }
})();