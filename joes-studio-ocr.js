/* OCR-assisted raster template extraction for Joes Studio. */
(function(){'use strict';
function boot(){
 if(!window.App||!App.canvas||!window.fabric||!window.JoesStudioPro)return setTimeout(boot,400);
 if(window.JoesStudioOCR)return;
 const O=window.JoesStudioOCR={
  async load(){if(window.Tesseract)return;await new Promise((ok,bad)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=ok;s.onerror=()=>bad(Error('OCR engine could not be loaded'));document.head.appendChild(s);});},
  async extract(){const obj=App.canvas.getActiveObject();if(!obj||obj.type!=='image')return JoesStudioPro.toast('Select the raster template image first.','error');try{JoesStudioPro.toast('Loading OCR engine and reading template...','info');await this.load();const src=obj.toDataURL({format:'png',multiplier:2});const r=await Tesseract.recognize(src,'eng',{logger:m=>{if(m.status&&m.progress>.05)console.log('OCR',m.status,Math.round(m.progress*100)+'%')}});const words=(r.data&&r.data.words)||[];let count=0;const iw=obj.width||1,ih=obj.height||1,sw=obj.getScaledWidth()/iw,sh=obj.getScaledHeight()/ih;words.forEach(w=>{const text=(w.text||'').trim();if(!text)return;const b=w.bbox||{};const x=(b.x0+b.x1)/2,y=(b.y0+b.y1)/2;const t=new fabric.IText(text,{left:(obj.left||0)+(x-iw/2)*sw,top:(obj.top||0)+(y-ih/2)*sh,fontSize:Math.max(8,(b.y1-b.y0)*sh),fill:'#111827',backgroundColor:'rgba(255,255,255,.8)',editable:true,selectable:true,evented:true,ocrExtracted:true});App.canvas.add(t);count++;});App.canvas.requestRenderAll();try{App.history.saveState();App.state.hasUnsavedChanges=true;}catch(e){}JoesStudioPro.toast(count?'Created '+count+' editable text objects from the template.':'No text detected.','success');}catch(e){JoesStudioPro.toast('OCR failed: '+e.message,'error');}},
  addButton(){if(document.getElementById('jspOCR'))return;const p=document.getElementById('jspPanel');if(!p)return;const batch=p.querySelector('#jspBatch');if(!batch)return;const b=document.createElement('button');b.id='jspOCR';b.className='jsp-btn';b.textContent='OCR Template';b.onclick=()=>this.extract();batch.parentElement.appendChild(b);}
 };const watch=setInterval(()=>{O.addButton();if(document.getElementById('jspOCR'))clearInterval(watch)},700);
}
boot();
})();
