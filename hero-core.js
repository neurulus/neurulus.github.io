(()=>{'use strict';
const canvas=document.querySelector('#compute-core');if(!canvas)return;
const ctx=canvas.getContext('2d');if(!ctx)return;
const hero=canvas.parentElement,copy=hero.querySelector('.hero-copy');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,scale=1,originX=0,originY=0,mobile=false,frame=0,last=0,visible=true;
let cursorX=0,cursorY=0,targetX=0,targetY=0,routes=[];
const points=[];
const point=(x,y,z,kind='frame',opacity=1)=>points.push({x,y,z,kind,opacity});
function interpolate(a,b,c,d,t){const t2=t*t,t3=t2*t;return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);}
const anchors=[[-2.7,2.65],[-1.4,2.65],[-.2,2.6],[.65,2.2],[.68,1.1],[.8,.55],[1.6,0],[.8,-.55],[.68,-1.1],[.65,-2.2],[-.2,-2.6],[-1.4,-2.65],[-2.7,-2.65]];
const profile=[];let previous=null,carry=0;
for(let i=0;i<anchors.length-1;i++)for(let j=0;j<32;j++){
  const a=anchors[Math.max(0,i-1)],b=anchors[i],c=anchors[i+1],d=anchors[Math.min(anchors.length-1,i+2)],t=j/32;
  const q=[interpolate(a[0],b[0],c[0],d[0],t),interpolate(a[1],b[1],c[1],d[1],t)];
  if(previous)carry+=Math.hypot(q[0]-previous[0],q[1]-previous[1]);
  if(!previous||carry>.115){profile.push(q);carry=0;}previous=q;
}
// The brace is a spatial surface. It encloses three independent compute planes.
for(let j=0;j<=18;j++){
  const z=-1.55+j*3.1/18;
  profile.forEach(([x,y],i)=>{if(j>0&&j<18&&i%2) return;point(x,y,z,'frame',j===0||j===18?1:.78);});
}
for(const y of [-1.05,0,1.05]){
  for(let ix=0;ix<=18;ix++)for(let iz=0;iz<=16;iz++){
    const edge=ix===0||ix===18||iz===0||iz===16;
    if(!edge&&(ix+iz)%2)continue;
    point(-3.35+ix*2.65/18,y,-1.2+iz*2.4/16,edge?'edge':'core',edge?1:.68);
  }
}
// Small vertical seams make the planes read as a single computing structure.
for(const x of [-3.35,-.7])for(const z of [-1.2,1.2])for(let y=-1.05;y<=1.05;y+=.15)point(x,y,z,'seam',.48);

function project(p){
  const yaw=-.48+cursorX*.045,pitch=.34+cursorY*.025;
  const x=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),z=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw);
  return {x:originX+x*scale,y:originY+(z*Math.sin(pitch)-p.y*Math.cos(pitch))*scale,depth:z};
}
function makeRoute(coords){let length=0;const segments=[];for(let i=1;i<coords.length;i++){const a=coords[i-1],b=coords[i],d=Math.hypot(b.x-a.x,b.y-a.y);segments.push({a,b,length:d,start:length});length+=d;}return {segments,length};}
function sample(route,distance){const d=Math.max(0,Math.min(route.length,distance));const s=route.segments.find(s=>s.start+s.length>=d)||route.segments.at(-1);const t=s.length?(d-s.start)/s.length:0;return {x:s.a.x+(s.b.x-s.a.x)*t,y:s.a.y+(s.b.y-s.a.y)*t};}
function buildRoutes(){
  routes=[1.05,0,-1.05].map((y,i)=>{
    const input=project({x:-3.35,y,z:0}),middle=project({x:-1.25,y,z:0}),gate=project({x:i===1?1.6:.7,y,z:0});
    const turn=gate.x+(mobile?14:28)+i*(mobile?5:10),level=mobile?height-102+i*20:height-117+i*24;
    const startY=input.y+(i-1)*(mobile?15:24),inlet=Math.max(mobile?12:28,input.x-(mobile?26:60));
    const outputX=mobile?width+20:width+40;
    return {route:makeRoute([{x:-40,y:startY},{x:inlet,y:startY},{x:inlet,y:input.y},input,middle,gate,{x:turn,y:gate.y},{x:turn,y:level},{x:outputX,y:level}]),gate,index:i};
  });
}
const rootStyle=getComputedStyle(document.documentElement),signalColor=rootStyle.getPropertyValue('--signal').trim()||'#dcebb7',dotColor=rootStyle.getPropertyValue('--tone-fff').trim()||'#fff',surfaceColor=rootStyle.getPropertyValue('--tone-e8e8e8').trim()||'#e8e8e8';
function dot(x,y,r,color,opacity=1){if(x<-3||x>width+3||y<0||y>height+3)return;ctx.globalAlpha=opacity;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function draw(time){
  ctx.clearRect(0,0,width,height);
  if(!reduced.matches){cursorX+=(targetX-cursorX)*.035;cursorY+=(targetY-cursorY)*.035;}
  buildRoutes();
  const radius=mobile?1.08:Math.max(1.02,Math.min(1.28,scale*.014));
  // Quiet, continuous paths become visible work through a few moving groups of dots.
  for(const {route,index} of routes){
    for(let d=0;d<route.length;d+=mobile?6.5:8){const p=sample(route,d);dot(p.x,p.y,.82,dotColor,.27);}
    const progress=reduced.matches?route.length*(.3+index*.2):((time*.035+index*route.length/3)%route.length);
    for(let j=0;j<6;j++){const d=progress-j*7;if(d<0)continue;const p=sample(route,d);dot(p.x,p.y,mobile?1.35:1.5,signalColor,1-j*.13);}
  }
  for(const p of points){
    const q=project(p),near=(p.z+1.55)/3.1;
    const opacity=p.opacity*(p.kind==='frame'?.35+near*.58:p.kind==='core'?.7: .9);
    dot(q.x,q.y,radius,p.kind==='edge'?dotColor:surfaceColor,opacity);
  }
  for(const {gate} of routes)dot(gate.x,gate.y,mobile?2:2.7,signalColor,1);
  ctx.globalAlpha=1;hero.classList.add('core-ready');
}
function resize(){
  const r=canvas.getBoundingClientRect();width=r.width;height=r.height;mobile=width<700;
  const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  if(mobile){scale=Math.min(width/7.8,52);originX=width*.5+scale*.75;originY=height-190;}
  else{const room=copy.getBoundingClientRect().left-hero.getBoundingClientRect().left;scale=Math.min((room-72)/6.8,height/7.5);originX=room*.61;originY=height*.5+12;}
  draw(0);
}
function animate(t){if(visible&&t-last>42){draw(t);last=t;}frame=requestAnimationFrame(animate);}
function start(){cancelAnimationFrame(frame);if(!document.hidden&&!reduced.matches&&visible)frame=requestAnimationFrame(animate);else draw(0);}
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start();}).observe(canvas);
hero.addEventListener('pointermove',e=>{if(mobile||reduced.matches)return;const r=hero.getBoundingClientRect();targetX=(e.clientX-r.left)/r.width-.5;targetY=(e.clientY-r.top)/r.height-.5;},{passive:true});
hero.addEventListener('pointerleave',()=>{targetX=0;targetY=0;},{passive:true});
reduced.addEventListener('change',()=>{cursorX=cursorY=targetX=targetY=0;start();});
document.addEventListener('visibilitychange',start);
document.fonts.ready.then(resize);resize();start();
})();
