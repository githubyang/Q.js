$.fn.countTime=function(prop){
  $(this[0]).data('time',(+prop.timeEnd-prop.timeStart));
  var reg={
    days:/{[Dd]}/g,
    hours:/{[Hh]{2}}|{[Hh]}/g,
    minutes:/{[Mm]{2}}|{[Mm]}/g,
    seconds:/{[Ss]{2}}|{[Ss]}/g
  },
  _this=this,
  formatt=function(t,f,s){
    var time={
      days:Math.floor(t/86400000),
      hours:Math.floor((t%86400000)/3600000),
      minutes:Math.floor((t%3600000)/60000),
      seconds:Math.floor((t%60000)/1000)
    },
    result=[],
    is=s||false;
    for(var i in f){
      var value=time[i];
      if(value===0 && i!=='seconds' && is){
        continue;
      }
      result.push(prop.formatt[i].replace(reg[i],function(){
        if(value<10 && arguments[0].length>3){
          value='0' + value;
        }
        return value;
      }));
    }
    if(result){
      prop.callback.call(_this,result);
    }
  },
  run=function(){
    setInterval(function(){
      var a=+$(this[0]).data('time')-1000;
      $(this[0]).data('time',a);
      formatt($(this[0]).data('time'),reg);
    },1000);
  };
  run();
};