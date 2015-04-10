Q.js
==

Q.js适用于移动端web开发，和目前主流的js框架比，主要的优势是轻量级，为移动开发而生，完美的touch事件支持。
Q.js的插件扩展是以对象字面量的形式扩展插件，框架的开发思路是基于框架的核心方法以外部模块的形式形形成框架，这样易于扩展和高度复用。
框架的API设计和jquery一样，主要是降低框架的使用成本，在这里也向伟大的jquery框架致敬！

QM.js已废弃。

## 当前框架版本 1.1 (开发中)

### API
#### 框架的核心功能

* 数据缓存
```javascript
$('#id').data('参数1','参数2');// 如果只有一个参数代表取缓存里面的数据 两个参数代表设置数据第一个参数为键
$('#id').deleteData('键');
```
数据缓存一般的应用到需要对操作结果进行记忆。

* 解析json字符串
```javascript
$.parse('传入需要解析的json字符串');
```

* 扩展
```javascript
$.fn.'扩展的函数名'=function(){};
```
* ajax
```javascript
//开发中
```

* $.each();
```javascript
$.each('需要遍历的对象或者数组','函数','带入的参数');
```

* DOM选择
DOM 选择目前只支持这两种 后面的版本会继续增加选择器类型
```javascript
$('#id')// 选取id
$('.class')// class选择
```

* 属性操作

```javascript
$('#id').html();// 传入参数将设置文本 不传参数将获取文本

$('#id').attr('属性名称','属性值/函数');// 如果只传入属性名称将获取值 如果是函数 函数执行完毕返回值设置属性值

$('#id').removeAttr('属性名称');// 移除属性

$('#id').addClass('class名称');// 添加class

$('#id').removeClass('class名称');// 移除class
```

* 文档操作
```javascript
// 开发中
```

* 事件模块
```javascript
# touch事件

## 回调函数的参数
回调函数里面的参数event包含10个属性:pagex,pageY,clientX,clientY,screenX,screenY,direction,displacementX,displacementY,targets.

screenX

事件发生时手指触摸位置距离屏幕左上角的X方向(水平)距离.

screenY

事件发生时手指触摸位置距离屏幕左上角的Y方向(竖直)距离.

clientX

事件发生时手指触摸位置距离浏览器网页显示区域左上角的X方向(水平)距离.

clientY

事件发生时手指触摸位置距离浏览器网页显示区域左上角的Y方向(竖直)距离.

pageX

事件发生时手指触摸位置距离页面左上角的X方向(水平)距离.

pageY

事件发生时手指触摸位置距离页面左上角的Y方向(竖直)距离.

direction

事件发生时手指触摸的方向,如果direction.x为false代表向左滑动,为true代表向右滑动.

如果direction.y为false代表向下滑动,为true代表向上滑动.

displacementX

手指相对于起始点的X方向(水平)移动距离.

displacementY

手指相对于起始点的Y方向(竖直)移动距离.

targets

触摸的目标元素.

## tap事件
tap事件是手指点触事件,tap事件的触发过程是手指轻点屏幕并迅速离开.

```javascript
$('#id或者.class').bind('tap',function(event){
	// 回调方法
});
```

## doubletap事件
doubletap事件是用一根手指在触屏上快速连续点击两次.

```javascript
$(#id或者.class).bind('doubletap',function(event){
	// 回调方法
});
```

## hold事件
hold事件又叫长按事件,用一根手指在触屏上按住0.3秒以上.

```javascript
$('#id或者.class').bind('hold',function(event){
	// 回调方法
});
```

## holdend事件
holdend事件用一根手指在触屏上按住0.3秒以上,手指离开触屏时触发.

```javascript
$('#id或者.class').bind('holdend',function(event){
	// 回调方法
});
```

## swipe事件
滑动事件用一根手指在触屏上滑动时触发.

```javascript
$('#id或者.class').bind('swipestart',function(e){
  //alert('开始滑动');
});
$('#id或者.class').bind('swipemove',function(e){
  //alert('滑动中');
});
$('#id或者.class').bind('swipeend',function(e){
  alert('结束滑动');
});

```
### unbind取消绑定事件

```javascript
$('#id或者.class').unbind('需要取消的事件名称');
```

### 表单验证模块
```javascript
// 开发中
```

### 图片上传模块
```javascript
// 开发中
```

### 上拉下拉刷新模块
```javascript
// 开发中
```

### 焦点图滑动模块
```javascript
// 开发中
```

### 动画模块
```javascript
// 开发中
```

### 本地存储模块
```javascript
// 开发中
```

### 浏览器检测模块
```javascript
// 开发中
```