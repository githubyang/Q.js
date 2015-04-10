;(function(win){
	var doc=win.document,
			Q=function(select){return selector(select);},
			cacheDom={},
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
				if(s.nodeType){return (result[0]=s,result);}
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
        var r=new RegExp('(\\s|^)'+value+'(\\s|$)');
        return r.test(this[0].className);
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
    	},
    	/** 生成唯一标识 **/
    	uid=function(){
        return 'Q'+(Math.random()+'').slice(-8);
    	},
    	// 设置和获取dom的UID bool为真则强制获取
    	setDomUid=function(elem,bool){
        return (bool || !elem.uid)?(elem.uid=uid()):elem.uid;
    	},
    	// 设置dom缓存
    	setData=function(elem,key,value){
        var uid=setDomUid(elem);
        if(!cacheDom[uid]){
          cacheDom[uid]={};
        }
        cacheDom[uid][key]=value;
    	},
      // 读取dom缓存
      getData=function(elem,key){
        var uid=setDomUid(elem),
            result=cacheDom[uid]||undefined;
        return (result===undefined)?result:(result[key]!=undefined)?result[key]:undefined;
    	},
      // 删除数据缓存
      deleteData=function(elem,key){
        var uid=setDomUid(elem),
            result=cacheDom[uid]||undefined;
        if(result){
          if(key){
            result[key] && delete cacheDom[uid][key];
          }else{
            delete this.cacheDom[uid];
          }
        }
    	};
  var touch=(function(){
    var elemObj=null,
        eventList={},
        body=doc.body,
        lastTapTime=NaN,
        propertyList=['pagex','pageY','clientX','clientY','screenX','screenY','targets'],
        getOwnPropertyNames=function(obj){
          return Object.getOwnPropertyNames(obj);
        },
        touchStart=function(elem,callback){
          elemObj.addEventListener('touchstart',callback,false);
        },
        touchEnd=function(e){
          var events=null;
          (function(touches){
            var i=0,o,gesture,touch;
            for(;o=touches[i++];){
              gesture=eventList[o.identifier];
              if(!gesture)continue;
              (gesture.handle)&&(
                clearTimeout(gesture.handle),
                gesture.handle=null
              );
              (gesture.status=='taping')&&(
                events=doc.createEvent('HTMLEvents'),
                events.initEvent('tap',true,true),
                propertyList.forEach(function(v){
                  (v=='targets')?(events[v]=e.target):(events[v]=o[v]);
                }),
                elemObj.dispatchEvent(events)
              );
              (gesture.status=='swipeing')&&(
                events=doc.createEvent('HTMLEvents'),
                events.initEvent('swipeend',true,true),
                propertyList.forEach(function(v){
                  (v=='targets')?(events[v]=e.target):(events[v]=o[v]);
                }),
                elemObj.dispatchEvent(events)
              );
              (gesture.status=='holding')&&(
                events=doc.createEvent('HTMLEvents'),
                events.initEvent('holdend',true,true),
                propertyList.forEach(function(v){
                  (v=='targets')?(events[v]=e.target):(events[v]=o[v]);
                }),
                elemObj.dispatchEvent(events)
              );
              delete eventList[o.identifier];
            }
          }(e.changedTouches));
          (getOwnPropertyNames(eventList).length==0)&&(
            body.removeEventListener('touchend',touchEnd,false),
            body.removeEventListener('touchmove',touchMove,false)
          );
        },
        touchMove=function(e){
          e.preventDefault();
          var events=null;
          ;(function(touchs){
            var i=0,o;
            for(;o=touchs[i++];){
              (function(touch){
                var gesture=eventList[touch.identifier];
                if(!gesture)return;
                var displacementX=touch.clientX-gesture.record.clientX,
                    displacementY=touch.clientY-gesture.record.clientY,
                    direction={
                      y:(displacementY<0?true:false),
                      x:(displacementX<0?false:true)
                    },
                    distance=Math.sqrt(Math.pow(displacementX,2)+Math.pow(displacementY,2));
                (gesture.status=="taping" && distance>10)&&(
                  gesture.status="swipeing",
                  events=doc.createEvent('HTMLEvents'),
                  events.initEvent('swipestart',true,true),
                  propertyList.forEach(function(e){
                    (v=='targets')?(events[v]=e.target):(events[e]=touch[e]);
                  }),
                  elemObj.dispatchEvent(events)
                );
                (gesture.status=='swipeing')&&(
                  events=doc.createEvent('HTMLEvents'),
                  events.initEvent('swipemove',true,true),
                  propertyList.forEach(function(e){
                    (v=='targets')?(events[v]=e.target):(events[e]=touch[e]);
                  }),
                  events.displacementX=displacementX,
                  events.displacementY=displacementY,
                  events.direction=direction,
                  elemObj.dispatchEvent(events)
                );
              }(o));
            }
          }(e.changedTouches));
        },
        initStart=function(e){
          var events=null;
          (getOwnPropertyNames(eventList).length==0)&&(
            body.addEventListener('touchend',touchEnd,false),
            body.addEventListener('touchmove',touchMove,false)
          );
          (function(touches){
            for(var i=0,o;o=touches[i++];){
              (function(obj){
                var touchRecord={},gesture=null;
                for(var i in obj){
                  touchRecord[i]=obj[i];
                }
                gesture={
                  record:touchRecord,
                  time:Date.now(),
                  status:'taping',
                  handle:setTimeout(function(){
                    (gesture.status=='taping')&&(
                      gesture.status='holding',
                      events=doc.createEvent('HTMLEvents'),
                      events.initEvent('hold',true,true),
                      propertyList.forEach(function(v){
                        (v=='targets')?(events[v]=e.target):(events[v]=touchRecord[v]);
                      }),
                      elemObj.dispatchEvent(events)
                    );
                    gesture.handle=null;
                  },200)
                };
                eventList[obj.identifier]=gesture;
              }(o));
            }
          }(e.changedTouches));
        };  
    return {
      tap:function(elem,callback){
        elemObj=(typeof elem!=='string')?elem:(doc.querySelector(elem));
        touchStart(elemObj,initStart);
        var handleCallback=function(e){
          e.preventDefault();
          callback.call(this,e);
        };
        setData(elemObj,'tap',handleCallback);
        var fn=getData(elemObj,'tap');
        elemObj.addEventListener('tap',fn,false);
      },
      doubletap:function(elem,callback){
        var doubletapCallback=function(e){
          if(+Date.now()-lastTapTime<500){
            var events=doc.createEvent('HTMLEvents');
            events.initEvent('doubletap',true,true);
            propertyList.forEach(function(v){
              events[v]=e[v];
            });
            elemObj.dispatchEvent(events);
          }
          lastTapTime=Date.now();
        },
        handleCallback=function(e){
          e.preventDefault();
          callback.call(this,e);
        };
        this.tap(elem,doubletapCallback);
        setData(elemObj,'doubletap',handleCallback);
        var fn=getData(elemObj,'doubletap');
        elemObj.addEventListener('doubletap',fn,false);
      },
      hold:function(elem,callback){
        elemObj=(typeof elem!=='string')?elem:(doc.querySelector(elem));
        touchStart(elemObj,initStart);
        var handleCallback=function(e){
          e.preventDefault();
          callback.call(this,e);
        };
        setData(elemObj,'hold',handleCallback);
        var fn=getData(elemObj,'hold');
        elemObj.addEventListener('hold',fn,false);
      },
      holdend:function(elem,callback){
        elemObj=(typeof elem!=='string')?elem:(doc.querySelector(elem));
        touchStart(elemObj,initStart);
        var handleCallback=function(e){
          e.preventDefault();
          callback.call(this,e);
        };
        setData(elemObj,'holdend',handleCallback);
        var fn=getData(elemObj,'holdend');
        elemObj.addEventListener('holdend',fn,false);
      },
      swipestart:function(elem,callback){
        elemObj=(typeof elem!=='string')?elem:(doc.querySelector(elem));
        touchStart(elemObj,initStart);
        var handleCallback=function(e){
          e.preventDefault();
          callback.call(this,e);
        };
        setData(elemObj,'swipestart',handleCallback);
        var fn=getData(elemObj,'swipestart');
        elemObj.addEventListener('swipestart',fn,false);
      },
      swipemove:function(elem,callback){
        elemObj=(typeof elem!=='string')?elem:(doc.querySelector(elem));
        touchStart(elemObj,initStart);
        var handleCallback=function(e){
          e.preventDefault();
          callback.call(this,e);
        };
        setData(elemObj,'swipemove',handleCallback);
        var fn=getData(elemObj,'swipemove');
        elemObj.addEventListener('swipemove',fn,false);
      },
      swipeend:function(elem,callback){
        elemObj=(typeof elem!=='string')?elem:(doc.querySelector(elem));
        touchStart(elemObj,initStart);
        var handleCallback=function(e){
          e.preventDefault();
          callback.call(this,e);
        };
        setData(elemObj,'swipeend',handleCallback);
        var fn=getData(elemObj,'swipeend');
        elemObj.addEventListener('swipeend',fn,false);
      }
    };
  }());
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
    // 检测class的值是不是已经存在
    hasClass:function(value){
      return checkClass.call(this,value);
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
    },
    // 数据缓存读和写
    data:function(key,value){
      var elem=this[0],
      		result;
      if(key&&value){
      	setDomUid(elem);
      	setData(elem,key,value);
      	return;
      }else if(key){
      	result=getData(elem,key);
      	return result;
      }
    },
    // 数据缓存删除
    deleteData:function(key){
    	var elem=this[0];
    	if(!key){
    		deleteData(elem);
    	}else{
    		deleteData(elem,key);
    	}
    	return this;
    },
    bind:function(type,callback){
      var fn=null;
      switch(type){
        case 'tap':(//点触事件
          touch.tap(this[0],callback)
        );break;
        case 'doubletap':(//双击事件
          touch.doubletap(this[0],callback)
        );break;
        case 'hold':(//长按事件
          touch.hold(this[0],callback)
        );break;
        case 'holdend':(//长按结束时事件
          touch.holdend(this[0],callback)
        );break;
        case 'swipestart':(//开始滑动事件
          touch.swipestart(this[0],callback)
        );break;
        case 'swipemove':(//滑动中的事件
          touch.swipemove(this[0],callback)
        );break;
        case 'swipeend':(//滑动结束事件
          touch.swipeend(this[0],callback)
        );break;
        default:(//其它事件
          setData(this[0],type,callback),
          fn=getData(this[0],type),
          this[0].addEventListener(type,fn,false)
        );break;
      }
    },
    unbind:function(type){
      (type=='doubletap')&&(arguments.callee.call(this,'tap'));
      var fn=getData(this[0],type);
      this[0].removeEventListener(type,fn,false);
      deleteData(this[0],type);
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