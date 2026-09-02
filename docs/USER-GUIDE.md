# Joes Studio User Guide

## 1. Start a design

Open Joes Studio and use the main canvas editor to create or edit a layout. The editor is based on Fabric.js, so canvas objects can be selected and manipulated individually when the project data contains separate objects.

## 2. Use the Pro button

The old **Support Author / author-key** control has been replaced by **Pro** in the same header location.

- **Pro** means the local Pro license has not been activated in this browser.
- Click it and enter the authorized Pro activation key.
- After successful activation, the Pro workflow becomes available.

## 3. Import an editable project template

For a genuinely object-based editable template, use a `.paper` or compatible `.json` project file.

1. Open **Pro**.
2. Select **Upload Template**.
3. Choose the `.paper` or `.json` file.
4. Joes Studio loads the project through its project-data loader.
5. Select objects on the canvas and edit them normally.

### Image templates

You can also import PNG, JPEG, WebP and SVG artwork. The imported artwork becomes a Fabric image object that can be selected, moved, resized and transformed.

A flattened image is not automatically separated into its original text, shapes, logos and other components. If each component must be independently editable, create/export the template as a Joes Studio `.paper`/`.json` project with separate canvas objects.

## 4. Prepare spreadsheet data

For variable-data printing, prepare an Excel or CSV worksheet with a header row. For example:

| StudentName | RegistrationNo | Course |
|---|---|---|
| Jane Doe | REG001 | Pharmacy |
| John Doe | REG002 | Nursing |

The header names become the fields available for binding.

## 5. Import Excel

1. Open **Pro**.
2. Select **Import Excel**.
3. Choose `.xlsx`, `.xls` or `.csv`.
4. Select the worksheet if necessary.
5. Confirm that the record count and field list are displayed.

## 6. Bind fields to the design

1. Select a text object on the canvas.
2. Open the Pro panel's **Excel fields** section.
3. Select a field, such as `StudentName`.
4. The text object is bound to that field.
5. Move through records using the previous/next controls to verify the output.

The underlying variable representation is similar to:

```text
{{StudentName}}
```

When a record is applied, the value from that row is placed into the bound text object.

## 7. Preview records

Use the record controls in the Pro panel to move through the imported rows. Check long names, missing values, registration numbers and other fields before producing the final batch.

## 8. Generate a batch PDF

When the design and field mappings are correct:

1. Load the spreadsheet.
2. Confirm the correct worksheet.
3. Verify the field bindings.
4. Click **Batch PDF**.
5. Joes Studio renders the design for each spreadsheet record.
6. The generated PDF contains one design page per record.

The PDF is saved locally by the browser using a filename derived from the spreadsheet filename.

## 9. Use production tools

The Pro panel also provides:

- **Print Preview** for checking the print result.
- **Left / Center / Right** horizontal alignment.
- **Top / Middle / Bottom** vertical alignment.
- **Duplicate** for copying the active object.
- **Group / Ungroup** for object organization where supported.
- **Flip H / Flip V** for horizontal and vertical flipping.
- **Guides** for a temporary visual alignment grid.

## 10. Save local pages

Use **Save Current Page** to save a local snapshot of the current design.

A saved page can later be restored or deleted from **Local pages**. These pages are stored in the current browser and are not synchronized to a server.

## 11. Keyboard shortcuts

- `Ctrl + D` / `Cmd + D`: duplicate the active object.
- `Ctrl + P` / `Cmd + P`: Pro print preview.
- `Esc`: hide the Pro panel.

## 12. Choosing the correct template format

| Requirement | Recommended format |
|---|---|
| Individually editable text and graphics | `.paper` / project `.json` |
| Quick placement of finished artwork | PNG/JPEG/WebP/SVG |
| Spreadsheet-driven names/data | `.paper` / `.json` with bound objects |
| Mass production | Spreadsheet + Pro Batch PDF |

## 13. Privacy and storage

The current Pro activation state and saved local pages are browser-local. Spreadsheet processing is performed in the browser by the bundled XLSX engine, and the batch PDF is generated locally by the application.

Do not treat browser local storage as a backup. Export/save important project files using the application's available project workflow.
