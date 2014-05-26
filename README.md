Qm.js
==

Qm.js适用于移动端网站开发，她提供了触摸事件支持，快速的DOM操作，模块化加载，执行队列，高性能动画效果等支持。
## 当前框架版本 1.0 (目前已完善基本的触摸事件支持)

* 框架的数据缓存使用
```javascript
M.$('#id').data('参数1','参数2');// 如果只有一个参数代表取缓存里面的数据 两个参数代表设置数据第一个参数为键
```
数据缓存一般的应用到需要对操作结果进行记忆。

* 框架的事件绑定

目前支持的事件类型 swipe longTap swipeEnd tap 多点触控后面的版本会支持

```javascript
// swipe 滑动事件
M.$('#id').bind('swipe',function(e){
	// e.movement对象里面包含包含swipe事件里面的所有信息 '向上滑' '向下滑' '向左滑' '向右滑'
});

// longTap 长按事件
M.$('#id').bind('longTap',function(){
	// 事件回调函数
});

// swipeEnd 滑动结束事件
M.$('#id').bind('swipeEnd',function(){
	// 事件回调函数
});

// tap 点击事件
M.$('#id').bind('tap',function(){
	// 事件回调函数
});

// 除了能绑定这些触摸事件之外，还可以绑定click事件。
```
事件绑定函数里面可以这样传参数 .bind('事件类型','数据','事件回调函数');带入数据可以让事件函数具有记忆功能。

* DOM选择
DOM 选择目前只支持这两种 后面的版本会继续增加选择器类型
```javascript
M.$('#id')// 选取id
M.$('.class')// class选择
```