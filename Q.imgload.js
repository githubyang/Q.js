Q.fn.imgload=function(tag,disp){
  var list=[],h=window.innerHeight;
  Q('img['+tag+']').each(function(i,e){
    list[i]={};
    list[i]={
      y:Q(e).offset().top,
      elem:e
    };
  });
  Q('body').bind('swipemove',function(){
    Q.requestAnimationFrame(function(){
      var l=list.length,t=Q(window).scrollTop();
      if(l){
        Q.each(list,function(i,e){
          var is=Math.abs(((h+t)-e.y))<disp
          if(is){
            var s=Q(e.elem).attr(tag);
            Q(e.elem).attr('src',s);
            list.splice(i,1);
          }
        });
      }
    });
  });
};