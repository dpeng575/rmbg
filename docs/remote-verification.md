# SwitchBG remote verification

This checklist is the acceptance record for DONG-2, DONG-3, DONG-4 and DONG-5.
Per the product owner's request, no local build, lint, browser or inference checks were run before push.
Record `Pass`, `Fail` or `Not supported` in the Result column while testing the deployed branch.

## Automated smoke commands

```bash
BASE_URL=https://your-preview.example npm run test:e2e:desktop
BASE_URL=https://your-preview.example npm run test:e2e:mobile
```

The desktop script covers a real model run, original/result comparison, background compositing,
JPEG and PNG downloads, reset confirmation, cross-origin isolation and self-hosted model requests.
The mobile script covers a 390 px touch viewport, a real model run and the invalid-format path.

## Core scenarios

| # | Platform | Scenario | Expected result | Result |
|---:|---|---|---|---|
| 1 | Desktop Chrome | Select one JPG | Single-image processing view opens | Pending remote verification |
| 2 | Desktop Chrome | Select 10 JPG/PNG/WebP files at once | Batch queue shows exactly 10 photos | Pending remote verification |
| 3 | Desktop Chrome | Add one file while in batch mode | File is appended; mode stays batch | Pending remote verification |
| 4 | Desktop Chrome | Upload two valid files rapidly through the input | Only the newest single task may update the single result | Pending remote verification |
| 5 | Desktop Chrome | Upload a corrupt file named `.jpg` | Stable decode error appears; no indefinite spinner | Pending remote verification |
| 6 | Desktop Chrome | Upload a file over 22 MB | File-size error appears before model loading | Pending remote verification |
| 7 | Desktop Chrome | Use a 12-20 MP phone photo | Processing completes; resize notice appears only when the 16 MP/4096 px budget is exceeded | Pending remote verification |
| 8 | Desktop Chrome | Use an image over 60 MP or 12,000 px on one side | Dimension-limit error explains the supported limit | Pending remote verification |
| 9 | Desktop Chrome | Cancel during the first model download | Download stops where supported; cancelled state remains retryable | Pending remote verification |
| 10 | Desktop Chrome | Block `/models/` requests, then retry | Network/model-download error remains visible; manual retry works after unblocking | Pending remote verification |
| 11 | Desktop Chrome private window with storage restricted | Start first model load | Cache/storage error is distinguished when the browser exposes it | Pending remote verification |
| 12 | Desktop Chrome without WebGPU | Process a sample | WASM fallback completes, or a browser-support error remains actionable | Pending remote verification |
| 13 | Desktop Chrome | Process, replace, remove queue items and clear the queue repeatedly | Current results stay correct; memory/Object URLs do not grow continuously | Pending remote verification |
| 14 | Android Chrome, 390 px touch viewport | Upload, cancel, remove queue item and download | Controls fit without overlap; touch remove works; status is announced | Pending remote verification |
| 15 | Safari current stable | Upload JPG/WebP, process, select background and download | Core single-image flow completes; unsupported capabilities show a stable error | Pending remote verification |

## Accessibility spot checks

- Reach upload, background choices, queue actions and downloads using Tab/Shift+Tab and Enter/Space.
- Confirm progress uses a live region and error content uses `role="alert"`.
- Confirm icon-only queue actions have accessible names and at least the existing button hit area.
- At 320 px and 390 px widths, confirm queue rows and the ready-state toolbar do not overlap.

## Browser scope

- Desktop Chrome: automated smoke plus scenarios 1-13.
- Android Chrome: mobile emulation script, followed by scenario 14 on a physical device when available.
- Safari: scenario 15 on macOS/iOS. Playwright WebKit is useful for regression but is not a substitute for current Safari hardware testing.
