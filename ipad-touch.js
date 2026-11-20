// Native iPad touch controls: one-finger pan, two-finger pinch/pan, and tap-to-colour.
// Deliberately no double-tap zoom: quick successive taps must always colour.
(() => {
  const vp=document.getElementById('canvas-viewport');
  if(!vp) return;
  ['pointerdown','pointermove','pointerup','pointercancel'].forEach(type=>vp.addEventListener(type,e=>{if(e.pointerType==='touch')e.stopImmediatePropagation();},true));
  let pts=new Map(),start=null,moved=false,prevDist=0,prevMid=null;
  const p=t=>({x:t.clientX,y:t.clientY}),dist=(a,b)=>Math.hypot(a.x-b.x),mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  vp.addEventListener('touchstart',e=>{
    if(e.target.closest&&e.target.closest('button'))return;
    pts=new Map([...e.touches].map(t=>[t.identifier,p(t)]));
    if(pts.size===1){start=[...pts.values()][0];moved=false;}
    if(pts.size===2){const a=[...pts.values()];prevDist=dist(a[0],a[1]);prevMid=mid(a[0],a[1]);moved=true;}
  },{passive:true});
  vp.addEventListener('touchmove',e=>{
    if(!pts.size)return;
    const old=pts,next=new Map([...e.touches].map(t=>[t.identifier,p(t)]));
    if(next.size===1&&old.size===1){
      const a=[...old.values()][0],b=[...next.values()][0],dx=b.x-a.x,dy=b.y-a.y;
      if(typeof zoom!=='undefined'&&zoom>1.01&&(Math.abs(dx)+Math.abs(dy)>.5)){
        const svg=document.getElementById('active-svg'),r=svg&&svg.getBoundingClientRect();
        if(r){vbX-=dx/r.width*vbW;vbY-=dy/r.height*vbH;applyTransform();moved=true;}
      }
      e.preventDefault();
    }else if(next.size===2){
      const a=[...next.values()],d=dist(a[0],a[1]),m=mid(a[0],a[1]);
      if(prevDist>8)setZoom(zoom*d/prevDist,m.x,m.y);
      if(prevMid&&zoom>1){
        const svg=document.getElementById('active-svg'),r=svg&&svg.getBoundingClientRect();
        if(r){vbX-=(m.x-prevMid.x)/r.width*vbW;vbY-=(m.y-prevMid.y)/r.height*vbH;applyTransform();}
      }
      prevDist=d;prevMid=m;moved=true;e.preventDefault();
    }
    pts=next;
  },{passive:false});
  vp.addEventListener('touchend',e=>{
    if(e.touches.length===0){
      const t=e.changedTouches[0];
      if(start&&!moved&&t&&!(e.target.closest&&e.target.closest('button'))){
        const here={x:t.clientX,y:t.clientY};
        for(const [x,y] of [[0,0],[4,0],[-4,0],[0,4],[0,-4],[7,7],[-7,-7],[7,-7],[-7,7]]){
          const hit=document.elementFromPoint(here.x+x,here.y+y);
          if(hit&&hit.classList&&hit.classList.contains('vec-region')){handleRegionTap(hit);break;}
        }
      }
      pts.clear();start=null;prevDist=0;prevMid=null;moved=false;
    }else{pts=new Map([...e.touches].map(t=>[t.identifier,p(t)]));start=null;prevDist=0;prevMid=null;moved=true;}
  },{passive:true});
  vp.addEventListener('touchcancel',()=>{pts.clear();start=null;prevDist=0;prevMid=null;moved=false;},{passive:true});
})();