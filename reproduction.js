(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));

function selectTab(button,attribute,panel){
  $$('['+attribute+']').forEach(b=>{const active=b===button;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
  $(panel)?.setAttribute('aria-labelledby',button.id);
}
const outcomes={
  assurance:{title:'Protect the work<br>you depend on.',description:'Reduce the attack surface. Limit each workload’s access. Build essential operations on verifiable Linux systems.',aside:'Less exposure. Clear access boundaries. Integrity your team can check.',alt:'A dotted security boundary with a controlled path into and out of the operation.'},
  compute:{title:'Run the work<br>you need.',description:'Bring compute to the task, from local services and task-specific models to demanding inference and coordinated applications. Select resources for the response the workload requires.',aside:'Get useful computation where it is needed, within your time, power and deployment constraints.',alt:'Dotted compute modules above a shared operating foundation.'},
  control:{title:'Keep your data<br>under your control.',description:'Choose where information is processed and which workloads may use it. Retain control over the data and resources your operation depends on.',aside:'Make business information useful while keeping its operating boundaries in your hands.',alt:'Nested dotted surfaces inside an explicit operating boundary.'}
};
$$('[data-outcome]').forEach(b=>b.addEventListener('click',()=>{
  const key=b.dataset.outcome,d=outcomes[key];selectTab(b,'data-outcome','#outcome-panel');
  $('#outcome-title').innerHTML=d.title;$('#outcome-description').textContent=d.description;$('#outcome-aside').textContent=d.aside;
  $('#outcome-image').src='assets/pointwork/tile-'+key+'.svg';$('#outcome-image').alt=d.alt;
}));

const steps=[
  {label:'The required system',title:'Compose around the task.',description:'Bring together the packages, services and compute the workload needs. Keep its dependencies and access explicit.',link:'system.html#composition',linkText:'Explore system composition'},
  {label:'Verifiable evidence',title:'Establish the evidence.',description:'Review the specified behaviour, integrity evidence and assumptions covered by the deployment. Give your team a checkable basis for the decision.',link:'assurance.html',linkText:'Explore assurance'},
  {label:'The operating environment',title:'Deploy the right system.',description:'Start with integrated compute and Silicon OS, or assess suitable existing hardware. Match the system to its workload and interfaces.',link:'platform.html#starting-points',linkText:'Explore deployment options'},
  {label:'The next controlled change',title:'Control the next change.',description:'Keep updates, configuration and workload authority within one controlled lifecycle as the operation evolves.',link:'system.html#lifecycle',linkText:'Explore the operating lifecycle'}
];
let step=0;
function renderStep(){const d=steps[step];$('#step-label').textContent=d.label;$('#step-title').textContent=d.title;$('#step-description').textContent=d.description;$('#step-count').textContent=(step+1)+'/4';$('#step-link').href=d.link;$('#step-link').innerHTML=d.linkText+' <span aria-hidden="true">↗</span>';$('#lifecycle-image').src='assets/pointwork/lifecycle-'+step+'.svg';$('#lifecycle-image').alt='Four dotted system layers, with '+['compose','establish','deploy','maintain'][step]+' highlighted.';}
$('#step-next')?.addEventListener('click',()=>{step=(step+1)%4;renderStep();});
$('#step-prev')?.addEventListener('click',()=>{step=(step+3)%4;renderStep();});

const paths={greenfield:{description:'Start with compute and Silicon OS supplied as an integrated system, selected for your workload and operating environment.',subject:'Neurulus Platform — new deployment',image:'deployment',alt:'Compute modules integrated with layered operating software.'},brownfield:{description:'Retain useful hardware. We assess the workload, supported interfaces and compatibility to determine whether Silicon OS is a suitable fit.',subject:'Silicon OS — existing hardware assessment',image:'retained-hardware',alt:'A smaller operating foundation fitted within an existing system boundary.'}};
$$('[data-path]').forEach(b=>b.addEventListener('click',()=>{const d=paths[b.dataset.path];selectTab(b,'data-path','#deployment-panel');$('#deployment-description').textContent=d.description;$('#deployment-contact').href='mailto:sales@neurulus.com?subject='+encodeURIComponent(d.subject);$('#deployment-image').src='assets/pointwork/'+d.image+'.svg';$('#deployment-image').alt=d.alt;}));

$$('[role=tablist]').forEach(list=>list.addEventListener('keydown',e=>{const tabs=$$('[role=tab]',list);let i=tabs.indexOf(document.activeElement);if(i<0)return;const vertical=list.getAttribute('aria-orientation')==='vertical';if(e.key===(vertical?'ArrowDown':'ArrowRight'))i=(i+1)%tabs.length;else if(e.key===(vertical?'ArrowUp':'ArrowLeft'))i=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();tabs[i].focus();tabs[i].click();}));

const menu=$('.menu-toggle'),navigation=$('#navigation');
function closeDropdowns(){ $$('.nav-group>button').forEach(b=>{b.setAttribute('aria-expanded','false');$('#'+b.getAttribute('aria-controls')).hidden=true;}); }
function closeMenu(){menu?.setAttribute('aria-expanded','false');if(menu)menu.textContent='Menu';navigation?.classList.remove('open');document.body.classList.remove('menu-open');closeDropdowns();}
function positionPanel(button){const panel=$('#'+button.getAttribute('aria-controls'));if(innerWidth<900){panel.style.removeProperty('left');panel.style.removeProperty('top');panel.style.removeProperty('right');return;}const g=button.parentElement.getBoundingClientRect(),width=panel.offsetWidth;const left=Math.max(24,Math.min(g.left-24,innerWidth-width-24));panel.style.left=(left-g.left)+'px';panel.style.right='auto';panel.style.top=($('.site-header').getBoundingClientRect().bottom-7-g.top)+'px';}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';if(!open){closeMenu();return;}menu.setAttribute('aria-expanded','true');menu.textContent='Close';navigation.classList.add('open');document.body.classList.add('menu-open');closeDropdowns();const first=$('.nav-group>button');first.setAttribute('aria-expanded','true');$('#'+first.getAttribute('aria-controls')).hidden=false;positionPanel(first);});
$$('.nav-group>button').forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')!=='true';closeDropdowns();b.setAttribute('aria-expanded',String(open));$('#'+b.getAttribute('aria-controls')).hidden=!open;if(open)positionPanel(b);}));
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();return;}const current=$('.nav-group>button[aria-expanded=true]');if(current){closeDropdowns();current.focus();}}if(e.key==='Tab'&&menu?.getAttribute('aria-expanded')==='true'){const focusables=$$('a[href],button:not([disabled])',$('.site-header')).filter(x=>x.getClientRects().length);const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
window.addEventListener('resize',()=>{const active=$('.nav-group>button[aria-expanded=true]');if(active)positionPanel(active);},{passive:true});
window.addEventListener('scroll',()=>{if(innerWidth>=900)closeDropdowns();},{passive:true});
$$('.navigation a').forEach(a=>a.addEventListener('click',closeMenu));
matchMedia('(min-width:900px)').addEventListener('change',closeMenu);

const dialog=$('#brief-dialog');let brief='';
if(dialog){
  $('#open-brief')?.addEventListener('click',()=>dialog.showModal());$('.dialog-close',dialog).addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
  $('#brief-form').addEventListener('submit',event=>{event.preventDefault();const d=new FormData(event.currentTarget);brief=`NEURULUS / DEPLOYMENT BRIEF\n\nPerspective: ${d.get('audience')}\nStarting point: ${d.get('deployment')}\n\nThe work:\n${d.get('workload').trim()}\n\nThe required outcome:\n${d.get('priority')}\n\nConstraints:\n${d.get('constraints').trim()||'To discuss.'}\n\nContact: sales@neurulus.com\n`;
    $('#brief-output').textContent=brief;$('#brief-form').hidden=true;$('#brief-result').hidden=false;$('#brief-email').href='mailto:sales@neurulus.com?subject='+encodeURIComponent('Neurulus deployment — '+d.get('audience'))+'&body='+encodeURIComponent(brief);$('#brief-feedback').textContent='Your brief is ready to email, copy or download.';
  });
  $('#brief-edit').addEventListener('click',()=>{$('#brief-result').hidden=true;$('#brief-form').hidden=false;$('[name="workload"]').focus();});
  $('#brief-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(brief);$('#brief-feedback').textContent='Brief copied.';}catch{$('#brief-feedback').textContent='Select the brief above to copy it, or download a text copy.';}});
  $('#brief-download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='neurulus-deployment-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#brief-feedback').textContent='Brief downloaded.';});
}
})();
