(function(){
  'use strict';
  const boot=()=>{
    if(!window.App||!App.canvas) return setTimeout(boot,300);
    const U=window.Utils||{};
    const toast=(m,t='info')=>U.toast?U.toast(m,t):console.log(m);
    const snapshot=()=>{
      try{return {version:'5.0',timestamp:Date.now(),settings:App.paper.getSettings(),paperSize:document.getElementById('paperSize')?.value,canvasData:App.canvas.toJSON(window.CUSTOM_PROPS||[]),label:App.state.label?{mode:App.state.label.mode,designContent:App.state.label.designContent}:null};}catch(e){return null;}
    };
    const key='joes-studio-autosave-v1';
    const save=()=>{const s=snapshot();if(s)localStorage.setItem(key,JSON.stringify(s));};
    const restore=()=>{
      const raw=localStorage.getItem(key); if(!raw) return;
      try{const d=JSON.parse(raw); if(!d.timestamp||Date.now()-d.timestamp>7*86400000)return;
        if(confirm('A recent unsaved Joes Studio design was found. Restore it?')){App.io.loadProjectData(d);toast('Recovered autosaved design','success');}
      }catch(e){console.warn('autosave restore failed',e)}
    };
    window.addEventListener('beforeunload',save);
    setInterval(()=>{if(App.state?.hasUnsavedChanges)save();},5000);
    setTimeout(restore,900);

    App.tools.duplicate=async function(){
      const act=App.canvas.getActiveObject(); if(!act) return;
      const cloned=await new Promise(resolve=>act.clone(resolve,window.CUSTOM_PROPS||[]));
      cloned.set({left:(cloned.left||0)+20,top:(cloned.top||0)+20});
      App.canvas.add(cloned); App.canvas.setActiveObject(cloned); App.canvas.requestRenderAll();
      App.ui.updateInspector(); App.history.saveState(); toast('Object duplicated','success');
    };
    hotkeys('ctrl+d,command+d',(e)=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;e.preventDefault();App.tools.duplicate();});

    App.dataSource.importTemplateImage=async function(){
      const input=document.createElement('input'); input.type='file'; input.accept='image/png,image/jpeg,image/webp,image/svg+xml';
      input.onchange=()=>{const file=input.files?.[0];if(!file)return; const r=new FileReader(); r.onload=e=>{
        fabric.Image.fromURL(e.target.result,img=>{
          const cw=App.state.baseWidth,ch=App.state.baseHeight;
          const scale=Math.min((cw*.95)/img.width,(ch*.95)/img.height);
          img.set({left:cw/2,top:ch/2,originX:'center',originY:'center',scaleX:scale,scaleY:scale,selectable:true,evented:true,excludeFromExport:false});
          img.templateImage=true; img.name=file.name;
          App.tools._addToCanvas(img); App.ui.updateInspector(); toast('Template image imported as an editable object','success');
        });
      }; r.readAsDataURL(file);
    };

    if(!document.getElementById('jsPrintPreview')){
      const m=document.createElement('div');m.id='jsPrintPreview';m.className='hidden fixed inset-0 z-[100] bg-black/60 items-center justify-center';m.innerHTML='<div class="bg-white rounded-xl shadow-2xl w-[92vw] h-[92vh] flex flex-col"><div class="p-3 border-b flex justify-between items-center"><b>Print Preview</b><button id="jsClosePreview" class="px-3 py-1 rounded bg-gray-100">Close</button></div><div id="jsPreviewBody" class="flex-1 overflow-auto bg-gray-200 p-6 flex items-center justify-center"></div><div class="p-3 border-t flex justify-end"><button id="jsDoPrint" class="px-4 py-2 rounded bg-red-600 text-white">Print</button></div></div>';
      document.body.appendChild(m); document.getElementById('jsClosePreview').onclick=()=>m.classList.add('hidden'); document.getElementById('jsDoPrint').onclick=()=>{m.classList.add('hidden');App.io.print();};
      const btn=document.querySelector('button[onclick="App.io.print()"]'); if(btn){const p=btn.parentElement; const b=document.createElement('button');b.className=btn.className.replace('bg-red-600','bg-slate-700').replace('hover:bg-red-700','hover:bg-slate-800');b.innerHTML='<i class="ph ph-eye"></i> Preview';b.onclick=async()=>{try{const c=await App.io._getExportCanvas();c.setViewportTransform([1,0,0,1,0,0]);document.getElementById('jsPreviewBody').innerHTML=c.toSVG({suppressPreamble:true,viewBox:{x:0,y:0,width:App.state.baseWidth,height:App.state.baseHeight}});c.dispose();m.classList.remove('hidden');m.classList.add('flex');}catch(e){toast('Preview failed: '+e.message,'error');}};p.insertBefore(b,btn);}
    }

    if(!document.getElementById('jsSaveTemplate')){
      const saveBtn=document.querySelector('button[onclick="App.io.saveProject()"]');
      if(saveBtn){const b=document.createElement('button');b.id='jsSaveTemplate';b.className=saveBtn.className;b.title='Save current design as reusable template';b.innerHTML='<i class="ph ph-layout"></i> Template';b.onclick=()=>{App.io.saveProject();toast('Template saved as a .paper project file. It remains fully editable when reopened.','success');};saveBtn.parentElement.appendChild(b);}
    }

    const oldLoad=App.io.loadProjectData;
    App.io.loadProjectData=function(data){
      oldLoad.call(this,data);
      setTimeout(()=>{
        App.canvas.getObjects().forEach(o=>{
          if(!o.isGrid){o.selectable=true;o.evented=true;o.excludeFromExport=false;if(['i-text','textbox','text'].includes(o.type)){const dyn=o.isDynamicDate||o.isDynamicPageNum||o.isSerialNumber||(o.dataBinding&&o.dataBinding.type==='variable');o.editable=!dyn;}}
        });
        App.canvas.requestRenderAll(); App.ui.updateInspector(); App.ui.updateLayerList();
      },350);
    };
    App.io.clearAutosave=()=>{localStorage.removeItem(key);toast('Autosave cleared','success');};
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,500)); else setTimeout(boot,500);
})();
