# 📄 joes studio - Simple Print Paper Design Tool

**joes studio** is a lightweight, powerful web-based visual print design tool. It requires no installation - just open your browser to use. It supports designing various standard office paper and calligraphy practice paper, and includes powerful **Variable Data** functionality to easily batch generate and print labels, certificates, badges, pay stubs, and more by importing Excel data.

---

## ✨ Core Features

### 1. 🎨 Rich Paper Template Library

Built-in preset templates for different scenarios, with parametric one-click adjustments:

* **Standard Sizes**: A3, A4, A5, B4, B5 and custom sizes.
* **Office/Study**: Lined paper, grid paper, English paper, sheet music paper.
* **Calligraphy/Traditional**: Tianzige, Mizige, Huizige, Jiugongge (support custom colors, dotted lines).
* **Geometric Shapes**: Dot grid, triangle grid, hexagon grid.

### 2. 🚀 Powerful Variable Data Printing

This is joes studio killer feature, designed for batch tasks:

* **Excel Data Source**: Import `.xlsx` files, auto-detect headers.
* **Data Binding**: Bind canvas text, barcodes, images to Excel fields.
* **Batch Generation**: Design one template, auto-generate hundreds/thousands of pages with different content (e.g., batch print badges with different names and photos).
* **Smart Serial Numbers**: Support auto-generating incrementing/decrementing serial numbers.

### 3. 🛠️ Professional Visual Editor

Canvas built on Fabric.js, providing desktop-like operation experience:

* **Full Layer Management**: Layer locking, hiding, sorting.
* **WYSIWYG Tables**: Built-in powerful table editor, support cell merge, split, style customization.
* **Vector Drawing**: Rectangle, circle, polygon, lines and smart rounded corners.
* **Barcode/QR Code Generation**: Support 30+ mainstream barcode formats including QR Code, Code128, EAN-13, with dynamic content binding.

### 4. 🖨️ Flexible Output & Printing

* **Export PDF**: Based on jsPDF, support multi-page batch export, vector-level clarity.
* **Native Printing**: Directly call browser print interface, support print preview.
* **Local Font Support**: Directly use fonts installed on user's computer (no upload needed).

### 5. 🔒 Security & Privacy

* **Pure Frontend**: All data processing (including Excel parsing, image rendering) is done locally in the browser.
* **Data Never Leaves**: Your designs and business data will not be uploaded to any server, absolutely safe.

---

## 💡 Application Scenarios

* **Education/Training**: Custom practice sheets, letter paper, sheet music creation.
* **Administrative Office**: Batch print employee badges, meeting table cards, fixed asset labels.
* **Warehousing/Logistics**: Generate product labels with barcodes/QR codes, shipping lists.
* **Personal Use**: Make journal pages, calendars, to-do lists.

---

## 💻 Tech Stack

* **Core Engine**: [Fabric.js](http://fabricjs.com/) (Canvas interaction)
* **Style Framework**: TailwindCSS (UI building)
* **PDF Generation**: jsPDF & svg2pdf
* **Data Processing**: SheetJS (Excel parsing)
* **Barcode Generation**: bwip-js
* **Font Processing**: Opentype.js (font parsing)

---

## ⚡ Quick Start

1. Open `index.html` (Chrome or Edge browser recommended).
2. Click **"New Blank Paper"** or select a preset from the template library.
3. **Design**: Add text, shapes, or tables from the top toolbar.
4. **Data Binding (Optional)**: Switch to "Data Source" panel, load local Excel file, select element and bind field in property panel.
5. **Output**: Click "Print" or "Export PDF" in the top right corner.



## ⌨️ Keyboard Shortcuts

| Keys | Function | Notes |
| :--- | :--- | :--- |
| `Ctrl` + `C` | Copy | Copy canvas elements |
| `Ctrl` + `V` | Paste | Paste to canvas |
| `Ctrl` + `Z` | Undo | Revert last operation |
| `Ctrl` + `Y` | Redo | Restore next operation |
| `Ctrl` + `S` | Save | Save as .paper project file |
| `Ctrl` + `O` | Open | Open .paper project file |
| `Ctrl` + `P` | Print | Call browser print |
| `Delete` | Delete | Delete selected elements |
| `Alt` + Drag | Pan canvas | Hand tool mode |
| `Shift` + Click | Multi-select | Select multiple elements |
| Arrow keys (`↑` `↓` `←` `→`) | Nudge | Move 2px each time |

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository.
2. Create Feat_xxx branch.
3. Submit code.
4. Create Pull Request.

## 📄 License

This project is open-sourced under [MIT License](LICENSE). You can use it for personal or commercial purposes for free, but please retain the original author's copyright notice.
