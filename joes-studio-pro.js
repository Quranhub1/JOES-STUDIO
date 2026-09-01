/* Joes Studio Pro enhancements. The existing header Pro control is the only launcher. */
(function () {
  'use strict';
  const boot = () => {
    if (!window.App || !App.canvas || !window.fabric) return setTimeout(boot, 300);
    if (window.JoesStudioPro) return;

    const P = window.JoesStudioPro = {
      excel: { workbook:null, rows:[], headers:[], sheet:'', index:0, fileName:'' },
      pages: [],
      toast(message, type='info') {
        if (window.Utils?.toast) Utils.toast(message, type);
        else if (window.Toastify) Toastify({text:message,duration:2600,gravity:'top',position:'right'}).showToast();
      },
      unlocked() {
        return !!(window.JoesStudioPremium?.isActivated?.());
      },
      requireAccess() {
        if (this.unlocked()) return true;
        if (window.JoesStudioPremium?.open) window.JoesStudioPremium.open();
        else this.toast('Activate Pro to use Pro tools.', 'error');
        return false;
      },
      active(){ return App.canvas.getActiveObject(); },
      mark(){ try{ App.history.saveState(); App.state.hasUnsavedChanges=true; App.canvas.requestRenderAll(); }catch(_){} },

      applyRow(row){
        if (!row) return;
        App.canvas.getObjects().forEach(o=>{
          const b=o.dataBinding||o.binding;
          let field=b&&(b.field||b.key||b.column);
          if(!field&&typeof o.text==='string'){
            const m=o.text.match(/^\{\{\s*([^}]+?)\s*\}\}$/); if(m) field=m[1];
          }
          if(!field) return;
          const value=row[field]==null?'':String(row[field]);
          if(typeof o.text==='string'){
            o.rawContent=value;
            o.set('text',value);
          }
          if(o.type==='image'&&value) o.dataRecordValue=value;
        });
        App.canvas.requestRenderAll();
        try{App.ui.updateInspector();App.ui.updateLayerList();}catch(_){}
      },

      setBinding(object,field){
        if(!this.requireAccess()||!object||!field)return;
        object.dataBinding={type:'variable',field,sheet:this.excel.sheet||''};
        object.binding=object.dataBinding;
        if(typeof object.text==='string'){
          object.rawContent='{{'+field+'}}';
          object.set('text','{{'+field+'}}');
        }
        this.mark(); this.toast('Mapped to Excel field: '+field,'success');
        if(this.excel.rows.length)this.applyRow(this.excel.rows[this.excel.index]);
      },

      async loadPaper(file){
        if(!this.requireAccess())return;
        const text=await file.text();
        let data; try{data=JSON.parse(text);}catch(e){throw new Error('The .paper/.json file is not valid Joes Studio JSON.');}
        if(!data||typeof data!=='object')throw new Error('Invalid template file.');
        if(!App.io?.loadProjectData)throw new Error('Template loader is unavailable.');
        App.io.loadProjectData(data);
        this.toast('Editable template loaded: '+file.name,'success');
      },

      async loadImage(file){
        if(!this.requireAccess())return;
        const url=URL.createObjectURL(file);
        await new Promise((resolve,reject)=>fabric.Image.fromURL(url,img=>{
          if(!img){reject(new Error('Unable to read image.'));return;}
          const cw=App.state.baseWidth,ch=App.state.baseHeight;
          const scale=Math.min(cw*.95/img.width,ch*.95/img.height,1);
          img.set({left:cw/2,top:ch/2,originX:'center',originY:'center',scaleX:scale,scaleY:scale,selectable:true,evented:true,excludeFromExport:false});
          img.templateImage=true;img.name=file.name;
          App.canvas.add(img);App.canvas.setActiveObject(img);this.mark();
          URL.revokeObjectURL(url);resolve();
        },{crossOrigin:'anonymous'}));
        this.toast('Template image added as an editable canvas object.','success');
      },

      pickTemplate(){
        if(!this.requireAccess())return;
        const i=document.createElement('input');i.type='file';i.accept='.paper,.json,image/png,image/jpeg,image/webp,image/svg+xml';
        i.onchange=async()=>{const f=i.files?.[0];if(!f)return;try{/\.(paper|json)$/i.test(f.name)?await this.loadPaper(f):await this.loadImage(f);}catch(e){this.toast(e.message,'error');}};i.click();
      },

      async loadExcel(file){
        if(!this.requireAccess())return;
        if(!window.XLSX)throw new Error('Excel engine is not loaded.');
        const wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:true});
        this.excel.workbook=wb;this.excel.fileName=file.name;this.selectSheet(wb.SheetNames[0]);
        this.toast(`Excel loaded: ${this.excel.rows.length} records, ${this.excel.headers.length} fields`,'success');
      },
      selectSheet(name){
        if(!this.requireAccess())return;
        const ws=this.excel.workbook?.Sheets[name];if(!ws)return;
        this.excel.sheet=name;this.excel.rows=XLSX.utils.sheet_to_json(ws,{defval:''});
        this.excel.headers=this.excel.rows.length?Object.keys(this.excel.rows[0]):[];this.excel.index=0;
        if(this.excel.rows.length)this.applyRow(this.excel.rows[0]);this.renderPanel();
      },

      async batchPDF(){
        if(!this.requireAccess())return;
        const rows=this.excel.rows||[];if(!rows.length)return this.toast('Load an Excel sheet first.','error');
        const jsPDF=window.jspdf?.jsPDF;if(!jsPDF)return this.toast('PDF engine is unavailable.','error');
        const old=this.excel.index,w=App.state.baseWidth,h=App.state.baseHeight;
        const pdf=new jsPDF({orientation:w>h?'landscape':'portrait',unit:'pt',format:[w,h],compress:true});
        for(let n=0;n<rows.length;n++){
          this.excel.index=n;this.applyRow(rows[n]);
          await new Promise(r=>setTimeout(r,25));
          if(n>0)pdf.addPage([w,h],w>h?'landscape':'portrait');
          pdf.addImage(App.canvas.toDataURL({format:'png',multiplier:1.5,enableRetinaScaling:false}),'PNG',0,0,w,h,undefined,'FAST');
        }
        this.excel.index=old;if(rows[old])this.applyRow(rows[old]);
        pdf.save((this.excel.fileName||'joes-studio').replace(/\.[^.]+$/,'')+'-batch.pdf');
        this.toast(`Batch PDF created (${rows.length} pages).`,'success');
      },

      savePage(){
        if(!this.requireAccess())return;
        const snapshot={name:'Page '+(this.pages.length+1),settings:App.paper.getSettings(),data:App.canvas.toJSON(window.CUSTOM_PROPS||[])};
        this.pages.push(snapshot);localStorage.setItem('joes-studio-pages-v1',JSON.stringify(this.pages));
        this.toast('Current design saved as a local page.','success');this.renderPanel();
      },
      loadPage(i){
        if(!this.requireAccess())return;const p=this.pages[i];if(!p)return;
        if(App.io?.loadProjectData)App.io.loadProjectData({settings:p.settings,canvasData:p.data});this.toast('Page restored.','success');
      },
      deletePage(i){if(!this.requireAccess())return;this.pages.splice(i,1);localStorage.setItem('joes-studio-pages-v1',JSON.stringify(this.pages));this.renderPanel();},

      toggleGuides(){
        if(!this.requireAccess())return;let g=document.getElementById('jspGuides');
        if(g){g.remove();return;}g=document.createElement('div');g.id='jspGuides';
        Object.assign(g.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:'50',backgroundImage:'linear-gradient(to right,rgba(225,29,72,.18) 1px,transparent 1px),linear-gradient(to bottom,rgba(225,29,72,.18) 1px,transparent 1px)',backgroundSize:'20px 20px'});document.body.appendChild(g);
      },
      align(mode){
        if(!this.requireAccess())return;const a=this.active();if(!a)return this.toast('Select an object first.','error');
        const cw=App.state.baseWidth,ch=App.state.baseHeight;
        if(mode==='left')a.set({left:a.getScaledWidth()/2});if(mode==='center')a.set({left:cw/2});if(mode==='right')a.set({left:cw-a.getScaledWidth()/2});
        if(mode==='top')a.set({top:a.getScaledHeight()/2});if(mode==='middle')a.set({top:ch/2});if(mode==='bottom')a.set({top:ch-a.getScaledHeight()/2});this.mark();
      },
      flip(axis){if(!this.requireAccess())return;const a=this.active();if(!a)return;a.set(axis==='x'?{flipX:!a.flipX}:{flipY:!a.flipY});this.mark();},
      group(){if(!this.requireAccess())return;const a=App.canvas.getActiveObject();if(a?.type==='activeSelection'){a.toGroup();this.mark();}},
      ungroup(){if(!this.requireAccess())return;const a=this.active();if(a?.type==='group'&&!a.isTable&&!a.isBarcode){a.toActiveSelection();App.canvas.discardActiveObject();this.mark();}},
      duplicate(){if(!this.requireAccess())return;if(App.tools?.duplicate)return App.tools.duplicate();if(App.io?.copy&&App.io?.paste){App.io.copy();App.io.paste();}},

      printPreview(){
        if(!this.requireAccess())return;
        const b=document.querySelector('#jsPrintPreview');
        if(b){b.classList.remove('hidden');b.classList.add('flex');return;}
        if(App.io?.print)App.io.print();
      },

      renderPages(){
        const p=document.getElementById('jspPages');if(!p)return;
        p.innerHTML=this.pages.length?this.pages.map((x,i)=>`<div class="flex items-center gap-1 mt-1"><button data-load="${i}" class="jsp-page flex-1 text-left border rounded px-2 py-1 hover:bg-gray-50">${x.name||'Page '+(i+1)}</button><button data-del="${i}" class="border rounded px-2 py-1 text-red-500">×</button></div>`).join(''):'<span class="text-gray-400">No saved pages</span>';
      },
      renderPanel(){
        const p=document.getElementById('jspPanel');if(!p)return;const e=this.excel,rows=e.rows||[];
        const sheet=p.querySelector('#jspSheet');if(sheet)sheet.innerHTML=e.workbook?e.workbook.SheetNames.map(s=>`<option value="${String(s).replace(/"/g,'&quot;')}" ${s===e.sheet?'selected':''}>${s}</option>`).join(''):'';
        p.querySelector('#jspCount').textContent=rows.length+' records';
        p.querySelector('#jspFields').innerHTML=e.headers.map(h=>`<button data-field="${String(h).replace(/"/g,'&quot;')}" class="jsp-field">${h}</button>`).join('')||'<span class="text-gray-400">Load Excel to see fields</span>';
        p.querySelector('#jspRecord').textContent=rows.length?(e.index+1)+' / '+rows.length:'0 / 0';this.renderPages();
      },

      openPanel(){
        if(!this.unlocked())return window.JoesStudioPremium?.open?window.JoesStudioPremium.open():this.toast('Activate Pro to use Pro tools.','error');
        let p=document.getElementById('jspPanel');if(p){p.classList.toggle('hidden');this.renderPanel();return;}
        p=document.createElement('aside');p.id='jspPanel';p.className='fixed right-4 top-20 z-[90] w-[360px] max-w-[92vw] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden';
        p.innerHTML=`<div class="p-3 border-b flex items-center justify-between"><b>Joes Studio Pro</b><button id="jspClose">×</button></div><div class="p-3 space-y-3 text-xs max-h-[78vh] overflow-auto">
          <div class="grid grid-cols-2 gap-2"><button id="jspTemplate" class="jsp-btn">Upload Template</button><button id="jspExcel" class="jsp-btn">Import Excel</button></div>
          <div><label>Worksheet</label><select id="jspSheet" class="w-full border rounded p-1"></select><div id="jspCount" class="text-gray-500 mt-1">0 records</div></div>
          <div><b>Excel fields</b><div id="jspFields" class="grid grid-cols-2 gap-1 mt-1"></div><div class="text-gray-500 mt-1">Select an object, then tap a field to bind it.</div></div>
          <div class="flex items-center justify-between"><button id="jspPrev" class="jsp-btn">◀</button><b id="jspRecord">0 / 0</b><button id="jspNext" class="jsp-btn">▶</button></div>
          <div class="grid grid-cols-2 gap-2"><button id="jspBatch" class="jsp-btn">Batch PDF</button><button id="jspPreview" class="jsp-btn">Print Preview</button></div>
          <div class="grid grid-cols-3 gap-2"><button data-align="left" class="jsp-btn">Left</button><button data-align="center" class="jsp-btn">Center</button><button data-align="right" class="jsp-btn">Right</button><button data-align="top" class="jsp-btn">Top</button><button data-align="middle" class="jsp-btn">Middle</button><button data-align="bottom" class="jsp-btn">Bottom</button></div>
          <div class="grid grid-cols-4 gap-2"><button id="jspDup" class="jsp-btn">Duplicate</button><button id="jspGX" class="jsp-btn">Group</button><button id="jspUX" class="jsp-btn">Ungroup</button><button id="jspGuideBtn" class="jsp-btn">Guides</button></div>
          <div class="grid grid-cols-2 gap-2"><button id="jspFX" class="jsp-btn">Flip H</button><button id="jspFY" class="jsp-btn">Flip V</button></div>
          <div><b>Local pages</b><button id="jspSavePage" class="jsp-btn w-full mt-1">Save Current Page</button><div id="jspPages" class="mt-1"></div></div>
        </div>`;
        const style=document.createElement('style');style.id='jspStyles';style.textContent='.jsp-btn{border:1px solid #d1d5db;border-radius:7px;padding:6px;background:#f8fafc}.jsp-btn:hover{background:#f1f5f9}.jsp-field{border:1px solid #e5e7eb;border-radius:6px;padding:5px;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.jsp-page{background:#fff}';if(!document.getElementById('jspStyles'))document.head.appendChild(style);document.body.appendChild(p);
        p.querySelector('#jspClose').onclick=()=>p.classList.add('hidden');p.querySelector('#jspTemplate').onclick=()=>this.pickTemplate();
        p.querySelector('#jspExcel').onclick=()=>{const i=document.createElement('input');i.type='file';i.accept='.xlsx,.xls,.csv';i.onchange=()=>i.files[0]&&this.loadExcel(i.files[0]).catch(e=>this.toast(e.message,'error'));i.click();};
        p.querySelector('#jspSheet').onchange=e=>this.selectSheet(e.target.value);
        p.querySelector('#jspPrev').onclick=()=>{if(!this.excel.rows.length)return;this.excel.index=Math.max(0,this.excel.index-1);this.applyRow(this.excel.rows[this.excel.index]);this.renderPanel();};
        p.querySelector('#jspNext').onclick=()=>{if(!this.excel.rows.length)return;this.excel.index=Math.min(this.excel.rows.length-1,this.excel.index+1);this.applyRow(this.excel.rows[this.excel.index]);this.renderPanel();};
        p.querySelector('#jspBatch').onclick=()=>this.batchPDF();p.querySelector('#jspPreview').onclick=()=>this.printPreview();p.querySelectorAll('[data-align]').forEach(b=>b.onclick=()=>this.align(b.dataset.align));
        p.querySelector('#jspDup').onclick=()=>this.duplicate();p.querySelector('#jspGX').onclick=()=>this.group();p.querySelector('#jspUX').onclick=()=>this.ungroup();p.querySelector('#jspGuideBtn').onclick=()=>this.toggleGuides();p.querySelector('#jspFX').onclick=()=>this.flip('x');p.querySelector('#jspFY').onclick=()=>this.flip('y');p.querySelector('#jspSavePage').onclick=()=>this.savePage();
        p.querySelector('#jspFields').onclick=e=>{const b=e.target.closest('[data-field]');if(b)this.setBinding(this.active(),b.dataset.field);};
        p.querySelector('#jspPages').onclick=e=>{const load=e.target.closest('[data-load]');const del=e.target.closest('[data-del]');if(load)this.loadPage(+load.dataset.load);if(del)this.deletePage(+del.dataset.del);};
        try{this.pages=JSON.parse(localStorage.getItem('joes-studio-pages-v1')||'[]');}catch(_){this.pages=[];}this.renderPanel();
      }
    };

    window.addEventListener('keydown',e=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='d'&&!/INPUT|TEXTAREA/.test(document.activeElement?.tagName||'')){e.preventDefault();if(P.unlocked())P.duplicate();}
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='p'&&P.unlocked()){e.preventDefault();P.printPreview();}
      if(e.key==='Escape'){const p=document.getElementById('jspPanel');if(p)p.classList.add('hidden');}
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700));else setTimeout(boot,700);
})();