Q.fn.touchload=function(callback){
  var scrollTop=0,
      _this=this,
      is=true;
  this.bind('swipestart',function(e){
    scrollTop=Q(window).scrollTop();
  });
  this.bind('swipeend',function(e){
    if(is&&((+_this.height()-(+scrollTop+window.innerHeight-45))<=0)){
      is=false;
      callback&&(is=callback());
    }
  });
};
