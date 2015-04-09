;(function(win){
	var doc=win.document,
			Q=function(select){return selector(select);},
      extend=function(object,obj,prop){
        (!prop)&&(prop=obj,obj=object);
        for(var i in prop){
          obj[i]=prop[i];
        }
        return obj;
    	},
			classArray=function(dom){
				var l=dom.length,i=0;
				if(l>1){
					for(;i<l;i++){
            result[i]=dom[i]; 
          }
				}else{
					result[0]=dom[0];
				}
        return result;
    	},
			selector=function(s){
				if(!s){return result;}
				if(s.nodeType){return classArray(s);}
				if(s==='body' && document.body){return classArray(document.body);}
        var dom,len,arr=[],i=0;
        if(s.indexOf('#')===0){
          dom=doc.querySelectorAll(s);
          return classArray([dom][0]);
        }else{
          dom=doc.querySelectorAll(s);
          return classArray(dom);
        }
    	};
  Q.type=function(o){return o!=undefined?(Object.prototype.toString.call(o)).slice(8,-1):'undefined';};
  Q.isQ=function(o){return (o.v);};
  Q.isFunction=function(o){return this.type(o)==="Function";};
  Q.isObject=function(o){return this.type(o)==="Object";};
  Q.isArray=function(o){return this.type(o)==='Array';};
  Q.isString=function(o){return this.type(o)==='String';};
  Q.trim=function(str){return str.replace(/(^\s*)/,"").replace(/(\s*$)/,"");};
  var getAttr=function(elem,name){
        if(elem){
          return elem.getAttribute(name);
        }
    	},
    	setAttr=function(elem,name,value){
        if(value){
          if(Q.isFunction(value)){
            var v=elem.getAttribute(name),
                r=value.call(elem,v);
            if(r){
              elem.setAttribute(name,r);
            }
          }else{
            elem.setAttribute(name,value);
          }
        }
    	},
    	removeAttr=function(elem,name){
        if(name){
          elem.removeAttribute(name);
        }
    	},
    	// 检测class的值是不是已经存在
    	checkClass=function(value){
        var r=new RegExp('(\\s|^)'+value+'(\\s|$)'),
            d=this;
        return r.test(d.className);
    	},
    	// 添加class
    	addClass=function(elem,value){
        var is=checkClass.call(elem,value),
            obj=elem,
            name;
        if(is){return;}
        name=obj.className;
        name+=' '+value;
        obj.className=name;
    	},
    	// 移除class 如果class的值为空的话就移除class
    	removeClass=function(elem,value){
        var is=checkClass.call(elem,value),
            obj=elem,
            attribute=Q.trim(obj.className),
            len=attribute.split(' ').length,
            name;
        if(is){
          if(len===1){
            obj.removeAttribute('class');
            return;
          }
          var r=new RegExp('(\\s|^)' + value);
          obj.className=Q.trim(obj.className.replace(r,''));
        }
    	};
	var result={
		v:1.0,
		each:function(obj,callback,args){
			return Q.each(obj,callback,args);
		},
    // 当参数为空的时候获取节点的文本 参数存在则设置
    html:function(value){
      if(value){
      	this[0].innerHTML=value;
        return this;
      }else{
      	var r=this[0].innerHTML;
        return r;
      }
    },
    // 当两个参数都存在则设置属性值 第一个参数存在则获取 第二个参数也可以是函数 当函数执行完毕再设置函数返回的值为属性值
    attr:function(name,value){
      if(value){
        setAttr(this[0],name,value);
        return this;
    	}else{
    		var r=getAttr(this[0],name);
        return r;
     	}
    },
    // 移除属性
    removeAttr:function(name){
      removeAttr(this[0],name);
      return this;
    },
    // 添加class
    addClass:function(value){
      addClass(this[0],value);
      return this;
    },
    // 移除class
    removeClass:function(value){
      removeClass(this[0],value);
      return this;
    }
	};
	Q.extend=function(obj,prop){
		var res;
		(!prop)?(
			res=extend(result,obj)
		):(
			res=extend(obj,prop)
		);
		return res;
	};
	Q.each=function(object,callback,args){
    var name,i=0,length=object.length,isObj=length===undefined || this.isFunction(object);
    if(args){
      if(isObj){
        for(name in object){
          if(callback.apply(object[name],args)===false){
            break;
          }
        }
      }else{
        for(;i<length;){
          if(callback.apply(object[i++],args)===false){
            break;
          }
        }
      }
    }else{
      if(isObj){
        for(name in object){
          if(callback.call(object[name],name,object[name])===false){
            break;
          }
        }
      }else{
      	for(;i<length;){
          if(callback.call(object[i],i,object[i++])===false){
            break;
          }
       	}
      }
    }
    return object;
  };
  Q.parse=function(data){
    if(!Q.isString(data)||!data){
      return this;
    }
    var d=Q.trim(data),
        r=doc.JSON?doc.JSON.parse(d):(new Function('d','return'+d)());
    return r;
  };
	Q.fn=result;
	Q.ajax=function(){};
	win.$=win.Q=Q;
}(window));