```js
var h=e.sig||jr(e.s);

jr=function(a){
  a=a.split("");
  ir.Cx(a,3);
  ir.pd(a,30);
  ir.w2(a,29);
  ir.Cx(a,1);
  ir.pd(a,3);
  ir.Cx(a,1);
  ir.w2(a,54);
  ir.pd(a,52);
  ir.w2(a,48);
  return a.join("")
}

var ir ={
  w2:function(a,b){
    var c=a[0];
    a[0]=a[b%a.length];
    a[b]=c
  },
  Cx:function(a,b){
    a.splice(0,b)
  },
  pd:function(a){
    a.reverse()
  }
}


e.url=cj(e.url,{signature:h})

cj=function(a,b){return bj(a,b||{},!0)}

bj=function(a,b,c){
  var d=a.split("#",2);

  a=d[0];

  var d=1<d.length?"#"+d[1]:"",
      e=a.split("?",2);

  a=e[0];

  var e=Zi(e[1]||""),
      h;
  for(h in b)
    if(c||!Yb(e,h))
      e[h]=b[h];

  return gf(a,e)+d
}

gf=function(a,b){
  return af(
    df([a],b)
  )
}

af=function(a){
  if(a[1]){
    var b=a[0],
        c=b.indexOf("#");
    0<=c&&(a.push(b.substr(c)),a[0]=b=b.substr(0,c));
    c=b.indexOf("?");
    0>c
    ?a[1]="?"
    :c==b.length-1&&(a[1]=void 0)
  }
  return a.join("")
}
```