/* Joes Studio Smart Template Converter: raster -> editable SVG/Fabric objects. */
(function () {
  'use strict';

  const state = { tracerLoaded: false, loading: null };

  function toast(message, type) {
    if (window.Utils && Utils.toast) return Utils.toast(message, type || 'info');
    if (window.Toastify) Toastify({ text: message, duration: 3200, gravity: 'top', position: 'right' }).showToast();
  }

  function waitForApp() {
    if (!window.App || !App.canvas || !window.fabric) return setTimeout(waitForApp, 300);
    install();
  }

  function loadTracer() {
    if (window.ImageTracer) return Promise.resolve(window.ImageTracer);
    if (state.loading) return state.loading;
    state.loading = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-joes-imagetracer]');
      if (existing) {
        const check = () => window.ImageTracer ? resolve(window.ImageTracer) : setTimeout(check, 100);
        check();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.js';
      script.async = true;
      script.dataset.joesImagetracer = '1';
      script.onload = () => window.ImageTracer ? resolve(window.ImageTracer) : reject(new Error('ImageTracer loaded without its API.'));
      script.onerror = () => reject(new Error('Could not load the raster-to-vector engine. Check your internet connection and try again.'));
      document.head.appendChild(script);
    });
    return state.loading;
  }

  function getSelectedImage() {
    const active = App.canvas.getActiveObject && App.canvas.getActiveObject();
    if (active && (active.type === 'image' || active.templateImage)) return active;
    const images = App.canvas.getObjects().filter(o => o.type === 'image' && (o.templateImage || o.name));
    return images.length === 1 ? images[0] : null;
  }

  function imageSource(image) {
    const el = image && image._element;
    if (!el) return null;
    return el.currentSrc || el.src || null;
  }

  function makeEditableObjects(svg, sourceImage) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromString(svg, (objects, options) => {
        try {
          if (!objects || !objects.length) throw new Error('The vectorizer did not produce editable artwork.');

          const group = fabric.util.groupSVGElements(objects, options);
          const targetWidth = sourceImage.getScaledWidth();
          const targetHeight = sourceImage.getScaledHeight();
          const svgWidth = Number(options.width) || Number(group.width) || sourceImage.width || 1;
          const svgHeight = Number(options.height) || Number(group.height) || sourceImage.height || 1;
          const sx = targetWidth / svgWidth;
          const sy = targetHeight / svgHeight;

          group.set({
            left: sourceImage.left,
            top: sourceImage.top,
            originX: 'center',
            originY: 'center',
            scaleX: sx,
            scaleY: sy,
            angle: sourceImage.angle || 0,
            flipX: !!sourceImage.flipX,
            flipY: !!sourceImage.flipY
          });

          // Add as one temporary group, then ungroup so every SVG path becomes
          // a normal Fabric object that can be selected, recolored, moved, etc.
          App.canvas.add(group);
          App.canvas.setActiveObject(group);
          group.toActiveSelection();
          const editable = App.canvas.getActiveObjects();
          editable.forEach((o, i) => {
            o.templateVector = true;
            o.name = 'Template vector ' + (i + 1);
            o.selectable = true;
            o.evented = true;
            o.excludeFromExport = false;
          });
          App.canvas.discardActiveObject();
          resolve(editable);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  async function convert(options) {
    const image = getSelectedImage();
    if (!image) {
      toast('Select the uploaded template image first.', 'error');
      return;
    }

    const src = imageSource(image);
    if (!src) {
      toast('The selected image has no usable source.', 'error');
      return;
    }

    const originalLeft = image.left;
    const originalTop = image.top;
    const originalAngle = image.angle || 0;
    const originalScaleX = image.scaleX || 1;
    const originalScaleY = image.scaleY || 1;
    const originalFlipX = !!image.flipX;
    const originalFlipY = !!image.flipY;

    try {
      toast('Analyzing template and converting artwork to editable vectors…', 'info');
      const tracer = await loadTracer();
      const preset = options && options.preset ? options.preset : 'posterized2';

      await new Promise((resolve, reject) => {
        tracer.imageToSVG(src, async svg => {
          try {
            if (!svg || svg.indexOf('<svg') < 0) throw new Error('The vectorizer returned an invalid SVG.');
            const objects = await makeEditableObjects(svg, image);
            if (!objects.length) throw new Error('No editable objects were created.');

            // Remove the raster only after successful vectorization. This keeps
            // the original template recoverable if conversion fails.
            App.canvas.remove(image);
            App.canvas.requestRenderAll();
            try { App.history.saveState(); App.state.hasUnsavedChanges = true; } catch (_) {}

            if (window.JoesStudioOCR && options && options.ocr) {
              try { await window.JoesStudioOCR.extract(image); } catch (_) {}
            }

            toast('Template converted: ' + objects.length + ' editable vector objects created.', 'success');
            resolve();
          } catch (e) {
            reject(e);
          }
        }, preset);
      });
    } catch (e) {
      // The image is still on the canvas if conversion failed.
      image.set({ left: originalLeft, top: originalTop, angle: originalAngle, scaleX: originalScaleX, scaleY: originalScaleY, flipX: originalFlipX, flipY: originalFlipY });
      App.canvas.setActiveObject(image);
      App.canvas.requestRenderAll();
      toast(e.message || 'Template conversion failed.', 'error');
    }
  }

  function addButton(panel) {
    if (!panel || panel.querySelector('#jspVectorize')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'mt-2';
    wrapper.innerHTML = '<button id="jspVectorize" class="jsp-btn w-full">Convert Template to Editable Design</button><div class="text-gray-500 mt-1">Turns raster artwork into individually editable vector objects. Best for certificates, cards, labels and flat graphics.</div>';
    const anchor = panel.querySelector('#jspTemplate');
    if (anchor && anchor.parentElement) anchor.parentElement.insertAdjacentElement('afterend', wrapper);
    else panel.querySelector('.p-3')?.appendChild(wrapper);
    wrapper.querySelector('#jspVectorize').onclick = () => convert({ preset: 'posterized2', ocr: false });
  }

  function install() {
    if (window.JoesStudioVectorize) return;
    window.JoesStudioVectorize = { convert, loadTracer };
    const poll = () => {
      const panel = document.getElementById('jspPanel');
      if (panel) addButton(panel);
      setTimeout(poll, 500);
    };
    poll();
  }

  waitForApp();
})();
