// Native iPad touch fallback for pan and pinch. Tap-to-colour remains handled by the app.
(() => {
  const vp = document.getElementById('canvas-viewport');
  if (!vp) return;
  let points = new Map();
  let previousDistance = 0;
  let previousMid = null;
  let moved = false;
  const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
  const midpoint = (a,b) => ({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const point = t => ({x:t.clientX,y:t.clientY});
  const zoomAt = (factor,x,y) => {
    if (typeof setZoom === 'function' && typeof zoom !== 'undefined') setZoom(zoom*factor,x,y);
  };
  vp.addEventListener('touchstart', e => {
    if ([...e.targetTouches].some(t => t.target && t.target.closest && t.target.closest('button'))) return;
    window.__momNativeTouchActive = true;
    points = new Map([...e.touches].map(t => [t.identifier,point(t)]));
    if (points.size === 2) {
      const p=[...points.values()];
      previousDistance=distance(p[0],p[1]); previousMid=midpoint(p[0],p[1]); moved=false;
    }
  }, {passive:true});
  vp.addEventListener('touchmove', e => {
    if (!window.__momNativeTouchActive) return;
    const old=points;
    points=new Map([...e.touches].map(t => [t.identifier,point(t)]));
    if (points.size===1 && old.size===1 && typeof zoom!=='undefined' && zoom>1) {
      const a=[...old.values()][0], b=[...points.values()][0];
      const dx=b.x-a.x, dy=b.y-a.y;
      if (Math.abs(dx)+Math.abs(dy)>1) {
        const svg=document.getElementById('active-svg');
        if(svg){const r=svg.getBoundingClientRect(); vbX-=(dx/r.width)*vbW; vbY-=(dy/r.height)*vbH; applyTransform(); moved=true;}
      }
      e.preventDefault();
    } else if(points.size===2) {
      const p=[...points.values()], d=distance(p[0],p[1]), m=midpoint(p[0],p[1]);
      if(previousDistance>8) zoomAt(d/previousDistance,m.x,m.y);
      if(previousMid && typeof zoom!=='undefined' && zoom>1) {
        const svg=document.getElementById('active-svg');
        if(svg){const r=svg.getBoundingClientRect(); vbX-=((m.x-previousMid.x)/r.width)*vbW; vbY-=((m.y-previousMid.y)/r.height)*vbH; applyTransform();}
      }
      previousDistance=d; previousMid=m; moved=true; e.preventDefault();
    }
  }, {passive:false});
  const finish=()=>{points.clear();previousDistance=0;previousMid=null;window.__momNativeTouchActive=false;};
  vp.addEventListener('touchend', e=>{if(e.touches.length===0)finish();else{points=new Map([...e.touches].map(t=>[t.identifier,point(t)]));previousDistance=0;previousMid=null;}}, {passive:true});
  vp.addEventListener('touchcancel',finish,{passive:true});
})();