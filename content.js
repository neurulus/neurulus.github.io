(()=>{'use strict';
document.querySelectorAll('[data-filter-group]').forEach(group=>{
  const id=group.dataset.filterGroup,entries=[...document.querySelectorAll('[data-collection="'+id+'"]')],status=document.querySelector('[data-filter-status="'+id+'"]');
  group.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.filter;
    group.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;entries.forEach(entry=>{const show=value==='all'||entry.dataset.category===value;entry.hidden=!show;if(show)count++;});
    if(status)status.textContent=count+' '+(id==='cases'?'case studies':'articles');
  }));
});
})();
