# Joes Studio Pro

## Overview

Joes Studio Pro adds variable-data printing, editable project-template import and additional production tools to the normal canvas editor.

The **Pro** button occupies the same header position previously used by **Support Author / author-key**. The old activation route is no longer the permanent UI. Clicking **Pro** opens the local activation dialog when Pro is not activated; after activation it opens the Pro tools panel.

## Activation

Pro uses one universal local activation key in the current release.

### Activation flow

1. Click **Pro** in the application header.
2. Enter the authorized Pro activation key supplied with the distribution.
3. Click **Activate Pro**.
4. The key is checked locally using SHA-256.
5. On success, the browser stores the activated state locally.
6. The Pro tools panel opens.

The application does not publish the plaintext activation key in the documentation.

### Persistence

The activation state is stored in browser `localStorage` using the key:

```text
joes-studio-premium-v2
```

Activation is therefore tied to the browser's local storage. Clearing site data, changing browsers or using a different device may require activation again.

### Security model

The current Pro system is intentionally local. Because Joes Studio is a client-side static application, a determined user who can modify the JavaScript can bypass client-side restrictions. This implementation should not be treated as server-grade license enforcement.

A future licensing service can add server-side validation, key revocation, activation limits, device management and auditability without changing the user-facing Pro workflow.

## Pro tools panel

The Pro panel currently contains:

### Template import

**Upload Template** accepts:

- `.paper`
- `.json`
- `.png`
- `.jpeg` / `.jpg`
- `.webp`
- `.svg`

`.paper` and `.json` files are interpreted as Joes Studio project data and passed to the application's project loader. When the project contains individual Fabric objects, those objects remain independently selectable/editable.

Image templates are imported as a Fabric image object. They remain selectable, movable, scalable and transformable, but a flattened image is not automatically converted into separate text, shapes and graphics.

### Excel import

**Import Excel** accepts:

- `.xlsx`
- `.xls`
- `.csv`

The workbook is loaded in the browser with the bundled XLSX engine. If multiple worksheets are available, the worksheet selector can be used to change the active sheet.

The panel displays:

- Record count.
- Available field names.
- Current record number.
- Previous/next record controls.

### Field binding

To bind spreadsheet data to a text object:

1. Select the target canvas object.
2. Load the spreadsheet.
3. Select the desired worksheet.
4. Tap the required field in **Excel fields**.

The object receives a variable binding similar to:

```text
{{StudentName}}
```

When a record is applied, the matching spreadsheet value replaces the variable in the text object. Bound objects are updated as the user moves between records.

Bindings are stored on the Fabric object as `dataBinding`/`binding` metadata, including the selected field and worksheet.

### Batch PDF

**Batch PDF** renders every imported spreadsheet record into the current design and produces one PDF page per record.

The output filename is derived from the spreadsheet filename and ends with:

```text
-batch.pdf
```

Before generating a batch, make sure all required fields are mapped and preview several records.

### Print Preview

**Print Preview** opens the application's existing print-preview workflow when available, with a fallback to the normal print function.

### Alignment

The panel provides six alignment commands for the active object:

- Left
- Center
- Right
- Top
- Middle
- Bottom

Alignment uses the current canvas dimensions as the reference frame.

### Transform and object tools

Pro also exposes:

- Duplicate.
- Group.
- Ungroup.
- Flip Horizontal.
- Flip Vertical.
- Alignment guides.

Grouping/ungrouping follows the application's existing Fabric object rules. Protected/special groups such as tables and barcodes are not forcibly ungrouped by the Pro helper.

### Local pages

**Save Current Page** stores a snapshot of the current design locally in the browser.

Saved pages contain the page settings and canvas JSON required by the project loader. They can be restored or deleted from the **Local pages** section.

The page collection is stored under:

```text
joes-studio-pages-v1
```

This is local browser storage, not cloud synchronization.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + D` | Duplicate the active object while Pro is unlocked |
| `Ctrl/Cmd + P` | Open Pro print preview while Pro is unlocked |
| `Esc` | Hide the Pro panel |

## Runtime architecture

The Pro implementation is split into two responsibilities:

- `joes-studio-pro.js` — Pro tools and production workflows.
- `joes-studio-premium.js` — activation state and the unified Pro launcher.

The activation module exposes `window.JoesStudioPremium`, while the tools module exposes `window.JoesStudioPro`.

The tools module checks Pro access before performing protected operations. If access is not active, it routes the user back to the activation flow rather than executing the operation.

## Troubleshooting

### Pro button still appears as Support Author

Refresh the application after deployment. If an old cached JavaScript asset is being used, perform a hard refresh or clear the site's cached data.

### Template will not load

Check that the `.paper`/`.json` file is valid Joes Studio project JSON. An arbitrary JSON document is not automatically a valid Joes Studio project.

### Image template is not individually editable

A PNG/JPEG/WebP/SVG import is a single image object. Use a `.paper`/`.json` project containing individual Fabric objects when individual text, shapes and images must remain separately editable.

### Excel fields are missing

Confirm that the workbook contains at least one populated row and that the correct worksheet is selected. Field names are derived from the worksheet's row keys.

### Batch PDF does not generate

Confirm that Pro is activated, spreadsheet records are loaded, and the PDF engine is available. The current workflow renders the canvas to PNG for each record and places each rendered design on a PDF page.

## Future licensing direction

The local key system is the current deployment model. The intended upgrade path is a server-backed licensing layer that preserves the same **Pro** button and activation experience while moving authorization decisions off the client.
