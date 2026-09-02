# Joes Studio

Joes Studio is a browser-based design and print editor for creating editable documents, ID cards, certificates, badges, tickets, labels, and other print-ready layouts. It uses Fabric.js for the canvas editor and runs as a static web application, making it suitable for GitHub Pages and offline-capable deployments after the required assets have loaded.

## Current capabilities

### Core editor

- Fabric.js canvas-based object editing.
- Text, images, shapes, barcodes and other canvas elements supported by the application.
- Object selection, positioning, resizing and editing.
- Project save/load through the application's project data format.
- Print and PDF workflows.
- Included `.paper` templates in the `templates/` directory.

### Pro tools

The **Pro** control replaces the former **Support Author / author-key** control in the application header. There is no separate permanent Support Author launcher.

Pro currently provides:

- Local Pro activation using one universal activation key.
- Editable `.paper` / `.json` template import through the project loader.
- Template image import as a selectable/editable Fabric canvas image.
- XLSX, XLS and CSV spreadsheet import.
- Worksheet selection and record navigation.
- Excel field binding to canvas objects using fields such as `{{Name}}`.
- Live record preview by applying spreadsheet values to bound objects.
- Batch PDF generation, one output page per spreadsheet record.
- Print preview access.
- Object alignment: left, center, right, top, middle and bottom.
- Horizontal and vertical flipping.
- Object duplication.
- Group and ungroup operations where supported by the editor.
- Visual alignment guides.
- Local multi-page design snapshots saved in browser storage.
- Page restore and deletion.
- Pro keyboard shortcuts for duplication and print preview.

See [docs/PRO.md](docs/PRO.md) for the detailed Pro workflow.

## Editable templates

Joes Studio distinguishes between two template import paths:

1. **`.paper` / `.json` project templates** — parsed as Joes Studio project data and passed to the project loader. Objects remain individual editable canvas objects when the project data contains individual Fabric objects.
2. **PNG/JPEG/WebP/SVG template images** — imported as a Fabric image object. The image itself can be selected, moved, scaled and transformed on the canvas, but its artwork is not automatically decomposed into separate text and shape objects.

For a fully editable design where individual text and graphics must remain independently editable, use a `.paper` / `.json` project template rather than a flattened raster image.

## Excel data workflow

The Pro spreadsheet workflow is designed for variable-data printing:

1. Open **Pro**.
2. Import an `.xlsx`, `.xls` or `.csv` file.
3. Select the worksheet when the workbook contains multiple sheets.
4. Select a canvas object.
5. Choose an Excel field to bind it to the selected object.
6. Use the previous/next record controls to preview different records.
7. Generate a batch PDF when the layout is ready.

A text object bound to a field is represented internally using a binding such as `{{Name}}`. During record processing, the matching spreadsheet value is written into the object before rendering/export.

## Pro activation

Pro activation is currently **local and browser-based**. The application verifies the supplied universal key by comparing its SHA-256 digest with the built-in digest and stores the activated state in browser `localStorage`.

The activation state is stored under:

```text
joes-studio-premium-v2
```

The activation key itself is intentionally not published in this README. Use the Pro key supplied by the project owner/distributor.

### Important security note

This deployment is a client-side static application. Local activation is therefore a convenience/licensing mechanism, not a tamper-proof security boundary. A future server-backed activation service can replace the local mechanism when centralized licensing, revocation, device management or stronger enforcement is required.

## Project structure

```text
.
├── index.html
├── joes-studio-pro.js
├── joes-studio-premium.js
├── joes-studio-ocr.js
├── joes-studio-vectorize.js
├── static/
│   ├── joes-studio-pro.js
│   ├── joes-studio-premium.js
│   ├── joes-studio-ocr.js
│   ├── joes-studio-vectorize.js
│   ├── toastify-js.js
│   ├── xlsx.full.min.js
│   └── ...
└── templates/
    ├── templates.json
    ├── *.paper
    └── ...
```

The application currently keeps compatibility copies of several assets at the repository root and under `static/`. The runtime bootstrap uses the application paths defined in `index.html`/the loading scripts; do not remove or rename an asset merely because a duplicate-looking copy exists without first checking its references.

## Included templates

The repository includes example `.paper` projects such as:

- `standard_a4.paper`
- `certificate.paper`
- `student_id_card.paper`
- `badge_with_barcode.paper`
- `event_ticket.paper`
- `red_head.paper`
- `text.paper`
- `text_logo.paper`

The template catalogue is maintained in `templates/templates.json`.

## Running the project

Joes Studio is a static web application. It can be served from a local HTTP server or deployed to GitHub Pages.

For GitHub Pages, the repository's published site should point to the branch/folder containing `index.html` and the referenced assets.

For local development, use a small HTTP server rather than opening `index.html` directly with `file://` when browser security restrictions affect asset loading.

## Deployment

The primary repository is:

**Quranhub1/JOES-STUDIO**

The `main` branch is the source of truth for the current application.

## Documentation

- [Pro tools and activation](docs/PRO.md)
- [Template and Excel user workflow](docs/USER-GUIDE.md)
- [Repository changelog](CHANGELOG.md)

## Licensing and distribution

Refer to the repository's licensing/distribution policy before redistributing the application or Pro functionality. Pro activation is intended for authorized users and is currently enforced locally in the browser.
