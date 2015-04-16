;(function(win){
  var doc=win.document,
      Q=function(select){return selector(select);},
      cacheDom={},
      eventList={},
      elemObj=null,
      body=doc.body,
      lastTapTime=NaN,
      extend=function(object,obj,prop){
        (!prop)&&(prop=obj,obj=object);
        for(var i in prop){
          obj[i]=prop[i];
        }
        return obj;
      },
      classArray=function(dom){
        var toArray=function(s){
          try{
            return Array.prototype.slice.call(s);
          }catch(e){
            var arr=[];
            for(var i=0,len=s.length;i<len;i++){
              arr[i]=s[i]; 
            }
            return arr;
          }
        };
        var arr=toArray(dom);
        for(var i in result){
          arr[i]=result[i];
        }
        return arr;
      },
      selector=function(s){
        if(!s){return result;}
        if(s.nodeType){return classArray([s]);}
        if(s==='body' && document.body){return classArray([document.body]);}
        if(Q.isWindow(s)){return classArray([window]);}
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
  Q.isNumber=function(o){return Q.type(o)==='number';};
  Q.isWindow=function(o){return o!=null && o==o.window};
  Q.isDocument=function(o){return o!=null && o.nodeType==o.DOCUMENT_NODE};
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
        console.log(this)
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
  var buildFragment=function(args,nodes){
      var fragment,
          doc=nodes && nodes[0]?nodes[0].ownerDocument || nodes[0]:document,
          div,
          value,
          ret=[];
      div=document.createElement('div');
      fragment=document.createDocumentFragment();
      !Q.isObject(args[0])?div['innerHTML']=(value=args[0]):div['appendChild'](value=args[0]);
      if(div.firstChild){
        ret=extend(ret,div.childNodes);
      }
      Q.each(ret,function(i,e){
        (e.nodeType)&&(fragment.appendChild(e));
      });
      //阻止内存泄漏
      div=null;
      return fragment;
    },
    clone=function(elem){
      var clone;
      clone=elem.cloneNode(true);
      //如果当前对象中已注册事件，则不拷贝
      if(elem.events){
        clone=elem;
      }
      return clone;
    },
    nodeName=function (elem,name){
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    domManip=function(obj,args,callback){
      var results,
          elem=obj[0];
      results=buildFragment(args,elem);
      callback.call(elem,clone(results.firstChild));
      return obj;
    };
  var touch=(function(){
    var propertyList=['pagex','pageY','clientX','clientY','screenX','screenY','targets'],
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
                // var duration=+Date.now()-gesture.time;
                // (distance>25&&duration>1)&&(e.preventDefault());
                
                (gesture.status=="taping" && distance>10)&&(
                  gesture.status="swipeing",
                  events=doc.createEvent('HTMLEvents'),
                  events.initEvent('swipestart',true,true),
                  propertyList.forEach(function(v){
                    (v=='targets')?(events[v]=e.target):(events[v]=touch[v]);
                  }),
                  elemObj.dispatchEvent(events)
                );
                (gesture.status=='swipeing')&&(
                  events=doc.createEvent('HTMLEvents'),
                  events.initEvent('swipemove',true,true),
                  propertyList.forEach(function(v){
                    (v=='targets')?(events[v]=e.target):(events[v]=touch[v]);
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
            body.addEventListener('touchmove',touchMove,false),
            body.addEventListener('touchend',touchEnd,false)
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
                  },1000)
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
  var style=function(name,value){
    var rdashAlpha=/-([a-z])/gi,
        fcamelCase=function(all,letter){
          return letter.toUpperCase();
        },
        cssNumber={
          zIndex:true,
          opacity:true,
          lineHeight:true,
          fontWeight:true,
          zoom:true
        };
    name=name.replace(rdashAlpha,fcamelCase) || name;
    if(value !== undefined){
      if(Q.isNumber(value) && !cssNumber[name]){
        value+='px';
      }
      try{
        this.style[name]=value;
      }catch(e){}
    }else{
      return win.getComputedStyle(this)[name];
    }
  },
  funcArg=function(context,arg,idx,payload){
    return Q.isFunction(arg)?arg.call(context,idx,payload):arg;
  },
  offsetParent=function(){
    return this.map(function(){
      var parent=this.offsetParent || document.body;
      while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
        parent = parent.offsetParent
        return parent
    })
  };
  var result={
    v:1.0,
    map:function(fn){
      return Q(Q.map(this,function(el,i){return fn.call(el,i,el)}));
    },
    each:function(callback,args){
      return Q.each(this,callback,args);
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
    },
    append:function(){
      return domManip(this,arguments,function(e){
        if(this.nodeType===1){
          this.appendChild(e);
        }
      });
    },
    prepend:function(){
      return domManip(this,arguments,function(e){
        if(this.nodeType===1){
          this.insertBefore(e,this.firstChild);
        }
      });
    },
    after:function(){
      if(this[0] && this[0].parentNode){
        return domManip(this,arguments,function(e){
          this.parentNode.insertBefore(e,this.nextSibling);
        });
      }
    },
    before:function(){
      if(this[0] && this[0].parentNode){
        return domManip(this,arguments,function(e){
          this.parentNode.insertBefore(e,this);
        });
      }
    },
    val:function(){
      var rradiocheckbox=/^(?:radio|checkbox)$/i;
      if(!arguments.length){
        var elem=this[0];
        if(elem){
          if(nodeName(elem,'option')){
            var val=elem.attributes.value;
            return !val || val.specified?elem.value:elem.text;
          }
          if(nodeName(elem,'select')){
            var index=elem.selectedIndex,
                options=elem.options,
                one=elem.type==='select-one',
                option,
                value;
            if(index<0){return null;}
            if(one){
              for(var i=one?index:0,max=one?index+1:options.length;i<max;i++){
                option=options[i];
                if(option.selected && !option.parentNode.disabled && !option.disabled){
                  value=Q(option).val();
                }
              }
            }
            return value;
          }
          if(rradiocheckbox.test(elem.type)){
            return elem.getAttribute('value') === null ? 'on' : elem.value;
          }
          return (elem.value || '').replace(/\r/g,'');
        }
        return undefined;
      }
    },
    css:function(){
      if(arguments.length===0){return this;}
      var name=arguments[0],
          value=arguments[1],
          l=arguments.length;
      if(l==2){
        style.call(this[0],name,value);
      }
      if(l===1 && l<2){
        if(Q.isObject(name)){
          for(var i in name){
            this.css(i,name[i]);
          }
          return this;
        }
        for(var i=0,nodeL=this.length;i<nodeL;i++){
          style.call(this[i],name);
        }
      }
      return this;
    },
    scrollTop:function(value){
      var hasScrollTop='scrollTop' in this[0];
      if(value===undefined){
        return hasScrollTop?this[0].scrollTop:this[0].pageYOffset;
      }
      return this.each(hasScrollTop?function(){this.scrollTop=value;}:function(){this.scrollTo(this.scrollX,value)});
    },
    offset:function(coordinates){
      if(coordinates)
        return this.each(function(i,index){
          var $this=Q(this),
              coords=funcArg(this,coordinates,index,$this.offset()),
              parentOffset=$this.offsetParent().offset(),
              props={
                top:coords.top-parentOffset.top,
                left:coords.left-parentOffset.left
              };
          if($this.css('position')=='static') props['position']='relative';
          $this.css(props);
        });
      var obj=this[0].getBoundingClientRect();
      return{
        left:obj.left+window.pageXOffset,
        top:obj.top+window.pageYOffset,
        width:Math.round(obj.width),
        height:Math.round(obj.height)
      }
    },
    remove:function(){
      (this[0].parentNode!=null)&&(this[0].parentNode.removeChild(this[0]));
    }
  };
  // 最优动画方法
  Q.requestAnimationFrame=function(fn){
    win.Animation=null;
    var anim=win.requestAnimationFrame||win.webkitRequestAnimationFrame||win.mozRequestAnimationFrame||win.oRequestAnimationFrame||win.msRequestAnimationFrame||function(e,t){Animation=setTimeout(e,1000/60);}
    anim(fn);
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
          if(callback.apply(object[name],[name,object[name],args])===false){
            break;
          }
        }
      }else{
        for(;i<length;){
          if(callback.apply(object[i],[i,object[i++],args])===false){
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
  Q.each(['width','height'],function(i,e){
    var dimensionProperty=e.replace(/./,function(m){return m[0].toUpperCase();});
    Q.fn[e]=function(value){
      var offset,el=this[0];
      if(value===undefined){
        return Q.isWindow(el)?el['inner'+dimensionProperty]:Q.isDocument(el)?el.documentElement['scroll'+dimensionProperty]:(offset=this.offset())&&offset[e];
      }else{
        return this[0].each(function(idx){
          el=$(this)
          el.css(e,funcArg(this,value,idx,el[e]()))
        })
      }
    }
  });
  Q.map=function(elements,callback){
    var value,values=[],i,key;
    if(isArray(elements))
      for(i=0;i<elements.length;i++){
        value=callback(elements[i],i);
        if(value!=null) values.push(value);
      }
    else
      for(key in elements){
        value=callback(elements[key],key);
        if(value!=null)values.push(value);
      }
    return values;
  };
  Q.ajax=function(options){
    var o={
      init:function(){return this.CreateHTTPObject();},
      accepts:function(a){
        var opts={
          html:"text/html,text/css",
          text:"text/plain",
          json:"application/x-www-form-urlencoded, text/javascript"
        };
        return opts[a];
      },
      toData:function(data){
        var arr=[];
        for(var i in data){
          arr.push(i + "=" + data[i]);
        }
        arr=arr.join("&");
        return arr;
      },
      /* 创建一个XMLHttpRequest对象 */
      CreateHTTPObject:function() {
        var xmlhttp=false;
        /* 使用IE的的ActiveX项来加载该文件 */
        if(typeof ActiveXObject!="undefined"){
          try{
            xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
          }catch(e){
            try{
              xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }catch(E){
              xmlhttp=false;
            }
          }
        }else if(window.XMLHttpRequest){
          try{
            xmlhttp=new XMLHttpRequest();
          }catch (e){
            xmlhttp=false;
          }
        }
        return xmlhttp;
      },
      communicate:function(o){
        var xmlhttp=this.init(), /* 每次调用重新创建XMLHttpRequest对象解决IE缓存问题 */
            param=this.toData(o.data);
        if(!xmlhttp || !o.url){
          return;
        }
        /* 如果来自服务器的响应没有 XML mime-type 头部，则一些版本的 Mozilla 浏览器不能正常运行 */
        /* 对于这种情况，httpRequest.overrideMimeType('text/xml'); 语句将覆盖发送给服务器的头部，强制 text/xml 作为 mime-type */
        if(xmlhttp.overrideMimeType){
          xmlhttp.overrideMimeType("text/xml");
        }
        if(!o.dataType){
          o.dataType="text";
        }
        o.dataType=o.dataType.toLowerCase();
        /* 转换为小写 */
        var cache=function(){
          var now="time=" + new Date().getTime();
          o.url += o.url.indexOf("?") + 1 ? "&" :"?";
          o.url += now;
        };
        if(o.cache){
          cache();
        }
        /* IE缓存问题 */
        xmlhttp.open(o.type, o.url, o.async);
        xmlhttp.setRequestHeader("Content-Type", this.accepts(o.dataType));
        xmlhttp.onreadystatechange = function() {
          /* 调用一个状态变化时的功能 */
          if(xmlhttp.readyState==4){
            /* 就绪状态为4时该文件被加载 */
            if(xmlhttp.status==200){
              var result="";
              if(xmlhttp.responseText){
                result=xmlhttp.responseText;
              }
              /* 如果返回的是JSON格式，返回之前eval的结果 */
              if(o.dataType=="json"){
                /* JSON字符串如果包含\n换行符计算时会出错，所有需要全部替换 */
                result=result.replace(/[\n\r]/g, "");
              }
              /* 给数据给回调函数 */
              if(o.success){
                o.success(result);
              }
            }else{
              /* 发生错误 */
              if(o.error){
                o.error(xmlhttp.status);
              }
            }
          }
        };
        xmlhttp.send(param);
      },
      run:function(options){
        var opts={
            async:true,
            type:"POST",
            dataType:"json",
            cache:true,
            error:function(error){},
            success:function(){}
          },
          o=Q.extend(opts,options);
        this.communicate(o);
      }
    };
    o.run(options||{});
  };
  win.Q=win.$=Q;
}(window));