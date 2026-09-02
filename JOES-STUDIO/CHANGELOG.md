# Changelog

All notable application changes are recorded here.

## Current development line — September 2026

### Pro activation and UI

- Replaced the former **Support Author / author-key** launcher with the unified **Pro** button in the same header location.
- Removed the separate permanent Pro launcher behavior so Pro has one primary entry point.
- Added a single universal local Pro activation key workflow.
- Added SHA-256 verification of the supplied activation key.
- Persisted local activation state in browser storage.
- Removed the old multi-key/Firebase activation flow from the active Pro activation path.
- Removed the old plaintext activation-key seed file from the repository.

### Pro production tools

- Added editable `.paper` / `.json` project-template import through the project loader.
- Added image-template import as an editable/selectable Fabric image object.
- Added XLSX, XLS and CSV import.
- Added worksheet selection and record navigation.
- Added Excel-to-canvas field binding.
- Added live spreadsheet record application to bound objects.
- Added batch PDF generation.
- Added print-preview access.
- Added alignment controls.
- Added horizontal and vertical flipping.
- Added duplication, grouping and ungrouping helpers.
- Added visual guides.
- Added browser-local page snapshots with restore/delete support.
- Added Pro keyboard shortcuts.

### Documentation

- Added a complete project README.
- Added a dedicated Pro activation and feature reference.
- Added a user guide for editable templates and spreadsheet-driven printing.
- Documented the current local activation security model and its limitations.
- Documented the distinction between object-based `.paper`/`.json` templates and flattened image templates.

## Licensing roadmap

The current release uses local browser activation. Server-backed licensing, centralized validation, revocation and activation management remain future work.
