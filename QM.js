/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * Qm.js 移动网站js框架
 * 项目托管地址:http://github.com/githubyang/Qm
 * 版本: 1.0
 * 开发者:单骑闯天下
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
'use strict';
;({
    /*---------------------- 一些常用的数据变量 -----------------------*/
    W:null,// window对象
    D:null,// document对象
    UA:null,
    cacheDom:{},
    eventDomList:{},// dom事件列表
    touchs:null,// 记录当前点击开始的监控对象列表,touch监控事件初始化时才会初始化为数组
    lives:{},// 已经live绑定的事件列表（一个事件类型只绑定一个代理函数）
    config:{
        swipeStep:2,// swipe出发的精度，默认为2
        swipeCheckOut:false,//是否监控swipe时间的mouseout
    },

    EVENT:null,// 用来给事件绑定传入代理函数trigger this.EVENT调用 因为普通的引用方法将导致removeEventListener无法移除事件
    /*---------------------- 框架初始化方法 -----------------------*/
    init:function(win){
        var that=this;
        that.W=win;
        that.D=win.document;
        that.UA=win.navigator.userAgent.toLowerCase(),
        that.EVENT=that.events(),
        win.M=(function(obj){
            return obj.method();
        }(that));
    },
    /*---------------------- 框架底层用到的基础方法 -----------------------*/
    type:function(o) {
        return o != undefined ? (Object.prototype.toString.call(o)).slice(8, -1) : 'undefined';
    },
    isM:function(o){
        return (o.M);
    },
    isFunction:function(o){
        return this.type(o)==="Function";
    },
    isObject:function(o){
        return this.type(o)==="Object";
    },
    isArray:function(o){
        return this.type(o)==='Array';
    },
    isString:function(o){
        return this.type(o)==='String';
    },
    objectCount:function(o){
        var n = 0,
            k;
        for (k in o) {
            n++;
        }
        return n;
    },
    trim:function(str){
        return str.replace(/(^\s*)/,"").replace(/(\s*$)/,"");
    },
    /** 生成唯一标识 **/
    uid:function(){
        return 'M'+(Math.random()+'').slice(-8);
    },
    // 设置和获取dom的UID bool为真则强制获取
    setDomUid:function(elem,bool){
        return (bool || !elem.uid) ? (elem.uid = this.uid()) : elem.uid;
    },
    // 设置dom缓存
    setData:function(elem,key,value){
        var uid=this.setDomUid(elem);
        if(!this.cacheDom[uid]){
            this.cacheDom[uid]={};
        }
        this.cacheDom[uid][key]=value;
    },
    // 读取dom缓存
    getData:function(elem,key){
        var uid=this.setDomUid(elem),
            result=this.cacheDom[uid]||undefined;
        return (result===undefined)?result:(result[key] != undefined) ? result[key] : undefined;
    },
    // 删除数据缓存
    deleteData:function(elem,key){
        var uid=this.setDomUid(elem),
            result=this.cacheDom[uid]||undefined;
        if(result){
            if(key){
                result[key] && delete this.cacheDom[uid][key];
            }else{
                delete this.cacheDom[uid];
            }
        }
    },
    // 从数组或者对象中移除
    remove:function(o,k,isv){
        var ik = k;
        if (isv === true) {
            ik = null;
            for (var i in o) {
                if (o[i] == k) {
                    ik = i;
                    break;
                }
            }
        }
        if (ik !== undefined && ik !== null) {
            if (this.isArray(o)) {
                o.splice(ik, 1);
            }
            if (this.isObject(o)) {
                delete o[ik];
            }
        }
        return o;
    },
    /*---------------------- dom选择器方法 -----------------------*/
    selector:function(s){
        var dom,
            len,
            arr=[],
            i=0;
        if(s.indexOf('#')===0){
            dom=this.D.querySelectorAll(s);
            return this.classArray([dom][0]);
        }else{
            dom=this.D.querySelectorAll(s);
            len=dom.length;
            if(len>1){
                for(;i<len;i++){
                    arr.push(dom[i]);
                }
            }
            return this.classArray(arr);
        }
    },
    /* 遍历方法*/
    each:function(object,callback,args){
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
                    if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                        break;
                    }
                }
            }
        }
        return object;
    },
    extend:function(object,obj,prop) {
        if (!prop) {
            prop = obj;
            obj = object;
        }
        for (var i in prop) {
            obj[i] = prop[i];
        }
        return obj;
    },
    /* 给匹配的元素对象加套子 */
    classArray:function(dom){
        var toArray = function(s){
            try{
                return Array.prototype.slice.call(s);
            } catch(e){
                var arr = [];
                for(var i = 0,len = s.length; i < len; i++){
                    arr[i] = s[i]; 
                }
                return arr;
            }
        };
        var arr = toArray(dom);
        for(var i in M){
            arr[i] = M[i];
        }
        return arr;
    },
    /* 浏览器检测 */
    browser:function(type){
        var ua=this.UA,
            win=this.W,
            gwe=function(p) {
                try{
                    if(win.external && win.external[p]){
                        var f = win.external[p];
                        return UT.isFunction(f) ? f() : f;
                    }
                }catch (e) {}
                return '';
            },
            bs = {
                isAndroid: (/Android/i).test(ua),
                isIPad: (/ipad/i).test(ua),
                isIPhone: (/iphone os/i).test(ua),
                isWMobile: (/Windows mobile/i).test(ua),
                isMobile: (/mobile|wap/).test(ua),

                isIECore: (/Trident/i).test(ua),
                isWebkitCore: (/webkit/i).test(ua),
                isGeckosCore: (/Gecko/i).test(ua) && !(/khtml/i).test(ua),
                se360: (function() {
                    var ret = /360se/i.test(ua) || /360ee/i.test(ua);
                    return ret ? ret : (/360se/i).test(gwe('twGetRunPath'));
                })(),
                sougou: (/MetaSr/i).test(ua),
                qq: (/QQBrowser/i).test(ua),
                maxthon: (function() {
                    return gwe('max_version').substr(0, 1) > 0;
                })(),
                opera: win.opera ? true : false,
                firefox: (/Firefox/i).test(ua),
                uc: (/ucweb/i).test(ua),
                liebao: (/LBBROWSER/i).test(ua),
                baidu: (/BIDUBrowser/i).test(ua) || gwe('GetVersion') == 'baidubrowser'
            },
            nogc = !bs.sougou && !bs.maxthon && !bs.qq && !bs.uc && !bs.liebao && !bs.baidu && !bs.se360;
            bs.ie = (bs.isIECore && nogc);
            bs.chrome = (/Chrome/i).test(ua) && win.chrome && nogc;
            bs.safari = (/Safari/.test(ua)) && !bs.chrome && nogc;
            bs.prefix = bs.isWebkitCore ? 'webkit' : bs.isGeckosCore ? 'Moz' : bs.opera ? 'O' : bs.isIECore ? 'ms' : '';
            bs.hasTouch = 'ontouchstart' in win;
        switch(type){
            case 'nogc':return bs.nogc;break;
            case 'ie':return bs.ie;break;
            case 'chrome':return bs.chrome;break;
            case 'safari':return bs.safari;break;
            case 'prefix':return bs.prefix;break;
            case 'hasTouch':return bs.hasTouch;break;
            default:break;
        }
    },
    eventType:function(){
        var that=this,
            hasTouch=that.browser('hasTouch');
        return {
            'vmousecancel': (hasTouch ? 'touchcancel' : 'mouseout'),
            'vmousedown': (hasTouch ? 'touchstart' : 'mousedown'),
            'vmousemove': (hasTouch ? 'touchmove' : 'mousemove'),
            'vmouseup': (hasTouch ? 'touchend' : 'mouseup'),
            'vmouseout': (hasTouch ? 'touchleave' : 'mouseout')
        };
    },
    events:function(){
        var that=this,
            eventDomList=that.eventDomList,
            tap,
            sx,
            sy,
            px,
            py,
            target,// 手势相关
            lto=800,
            lt=null,
            st;// 长点击监控相关
        return {
            trigger:function(e, et, k){
                var type=et?et:e.type,
                    i=0,
                    uid=that.setDomUid(this),
                    result=eventDomList[type]?eventDomList[type][uid]:null,
                    n,
                    len;
                if(result){
                    len=result.length;
                    for (;i<len;i++) {
                        n=result[i];
                        e.firecnt=++n.cnt;
                        e.data=n.data;
                        if(n.fn.call(this,e)===false){
                            M.$(this).unbind(type);
                            i--;
                        }
                    }
                }
            },
            touchDown:function(e){
                tap = true;
                var touch = e.touches ? e.touches[0] : e,
                    eventType=that.eventType();
                sx = px = touch.pageX;
                sy = py = touch.pageY;
                // 长按监控
                st = new Date - 0;
                lt = setInterval(function() {
                    if (lt && (new Date - st) > lto) {
                        clearInterval(lt);
                        lt = null;
                        e.stopPropagation = function() {
                            this._sbunble = true;
                        };
                        that.touchs.forEach(function(d, i) {
                            !e._sbunble && that.EVENT.trigger.call(d, e, 'longTap');
                        });
                    };
                }, 200);
                M.$(document).bind('vmousemove',that.EVENT.touchMove);//vmousemove事件包含: touchmove  mousemove
            },
            touchUp:function(e){
                var touchs=that.touchs,
                    eventType=that.eventType(),
                    trigger=that.events().trigger;
                e.stopPropagation = function() {
                    this._sbunble = true;
                };
                if (lt) {
                    clearInterval(lt);
                    lt = null;
                    touchs.forEach(function(d, i) {
                        !e._sbunble && trigger.call(d, e, 'tap');
                    });
                } else if (target) {
                    e.movement = {
                        startx: sx,
                        starty: sy,
                        x: px,
                        y: py,
                        target: target
                    };
                    touchs.forEach(function(d, i) {
                        !e._sbunble && trigger.call(d, e, 'swipeEnd');
                    });
                }
                touchs = [];
                tap = false;
                M.$(document).unbind('vmousemove',that.EVENT.touchMove);
            },
            touchMove:function(e){
                if (lt) {
                    clearInterval(lt);
                    lt = null
                };
                //屏蔽多点触控
                if (tap) {
                    var touch = e.touches ? e.touches[0] : e,
                        x = touch.pageX,
                        y = touch.pageY,
                        dx = Math.abs(x - px),
                        dy = Math.abs(y - py);
                    // 优化执行  如果位移小于限制值则不进行任何操作
                    if (dx < that.config.swipeStep && dy < that.config.swipeStep) {
                        return;
                    };
                    // 判断方向
                    target = dx > dy ? (x > sx ? 'right' : 'left') : (y > sy ? 'down' : 'up');
                    px = x;
                    py = y;
                    // trigger当前处于监控列表的元素
                    that.touchs.forEach(function(d, i) {
                        e.movement = {
                            startx: sx,
                            starty: sy,
                            x: x,
                            y: y,
                            mx: dx,
                            my: dy,
                            target: target
                        };
                        that.EVENT.trigger.call(d, e, 'swipe');
                    });
                }
            },
            domTouchDown:function(e){
                that.touchs.push(this);
            },
            domTouchOut:function(e){
                if (tap && M.$(e.relatedTarget).parents(this).length == 0) {
                    e.movement = {
                        startx: sx,
                        starty: sy,
                        x: px,
                        y: py,
                        target: target
                    };
                    that.EVENT.trigger.call(this, e, 'swipeEnd');
                    that.remove(that.touchs, this);
                }
            }
        };
    },
    bind:function(elem,type,data,fn){
        if(!type){return;}
        data && !fn && (fn=data) && (data=undefined);
        var that=this,
            eventType=that.eventType(),
            eventDomList=that.eventDomList,
            events=that.events(),
            types,
            uid,
            bool;
        uid=that.setDomUid(elem);
        if(typeof elem != 'string'){
            bool=/swipe|tap/i.test(type);
            types=eventType[type];
            type=types?types:type;
            if(bool){
                if(that.touchs===null){
                    that.touchs=[];
                    M.$(document).bind('vmousedown', that.EVENT.touchDown).bind('vmouseup', that.EVENT.touchUp);// vmousedown包含: touchstart mousedown,vmouseup包含:touchend mouseup
                }
                var o = M.$(elem);
                if (!o.data('tapinit')) {
                    o.bind('vmousedown', that.EVENT.domTouchDown).data('tapinit', true);// 绑定 vmousedown事件包含 touchstart mousedown事件
                    that.config.swipeCheckOut && o.bind('vmouseout', domTouchOut);
                }
            }else{
                elem.addEventListener(type,that.EVENT.trigger,false);
            }
        }
        // 这里开始执行事件缓存 通过事件名
        !eventDomList[type] && (eventDomList[type] = {});
        !eventDomList[type][uid] && (eventDomList[type][uid] = []);
        eventDomList[type][uid].push({
            cnt: 0,
            data: data,
            fn: fn
        });
    },
    unbind:function(elem,type,fn){
        var that=this,
            uid=that.setDomUid(elem),
            eventType=that.eventType(),
            types,
            i=0,
            len;
        if(type&&uid){
            types=eventType[type];
            type=types?types:type;
            if(that.eventDomList[type]){
                delete this.eventDomList[type][uid];
                elem.removeEventListener(type,that.EVENT.trigger,false);
            }
        }
    },
    stringify:function(data){
        // if(this.W.JSON){
        //     return this.W.JSON.stringify(data);
        // }
        var s=[],
            i=0,
            len,
            j;
        switch(this.type(data)){
            case 'Object':
                for(i in data){
                    if(!data.hasOwnProperty(data[i])){
                        data[i]=this.isString(data[i])?'"'+data[i]+'"':(this.isObject(data[i])?this.stringify(data[i]):'"'+data[i]+'"');// 递归执行
                        s.push('"'+i+'"'+':'+data[i]);
                    }
                }
                j='{'+s.join(',')+'}';
                return j;
            break;
            case 'Array':
                for(i,len=data.length;i<len;i++){
                    data[i]=this.isString(data[i])?'"'+data[i]+'"':(this.isArray(data[i])?this.stringify(data[i]):data[i]);
                    s.push('"'+i+'"'+':'+data[i]);
                }
                j='{'+s.join(',')+'}';
                return j;
            break;
            default:break;
        }
    },
    // 给外部调用的方法
    method:function(){
        var that=this;
        return {
            $:function(selector){
                if(typeof selector === "object" || selector.nodeType === 1 || selector.nodeType === 9){
                    if(selector == document){
                        selector = document.body;
                    }
                    return that.classArray([selector]);
                }
                return that.selector(selector);
            },
            M:'1.0',
            get:function(i){
                return i == undefined ? this : this[i];
            },
            /* each外部调用方法 */
            each:function(obj,callback,args){
                return that.each(obj,callback,args);
            },
            extend:function(obj,prop) {
                return that.extend(this,obj,prop);
            },
            browser:function(type){
                return that.browser(type);
            },
            data:function(key,value) {
                var obj=that,
                    elem=this[0],
                    result;
                if(key&&value){
                    obj.setDomUid(elem);
                    obj.setData(elem,key,value);
                    return;
                }else if(key){
                    result=obj.getData(elem,key);
                    return result;
                }
            },
            // 数据缓存删除
            deleteData:function(key){
                var elem=this[0];
                if(!key){
                    that.deleteData(elem);
                }else{
                    that.deleteData(elem,key);
                }
                return this;
            },
            // 触摸事件外部配置方法
            config:function(key,value){
                if((that.isObject(key))){
                    M.extend(that.config,key);
                }else{
                    that.config[key]=value;
                }
                return this;
            },
            bind:function(type,data,fn){
                if(!type){return;}
                var elem=this[0];
                that.bind(elem,type,data,fn);
                return this;
            },
            unbind:function(type,fn){
                that.unbind(this[0],type,fn);
                return this;
            },
            // json解析方法
            parse:function(data){
                if(!that.isString(data)||!data){
                    return this;
                }
                var d=that.trim(data),
                    r=that.W.JSON?that.W.JSON.parse(d):(new Function('d','return'+d)());
                return r;
            },
            // 对象字面量转换成json 支持对象和数组 但是对象里面不能包含数组 数组里面不能包含对象
            stringify:function(data){
                if(data || that.isObject(data) || that.isArray(data)){
                    var d=that.stringify(data);
                    return d;
                }
                return this;
            }
        }
    }
}).init(window);