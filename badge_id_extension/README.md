# HID Card Calculator & Hex Converter

A Microsoft Edge browser extension that converts HID Corporate 1000 35-bit hexadecimal values to card format information, plus bidirectional hex/decimal conversion tools.

## Features

### HID 35-bit Card Calculator
- Convert hex values to card format information:
  - Bit Pattern
  - Card Format (HID Corporate 1000 35 Bit)
  - Internal Card #
  - Facility Code
- Input validation and error handling
- Copy results to clipboard

### Hex/Decimal Converter
- Bidirectional conversion:
  - Hex → Decimal
  - Decimal → Hex
- Input validation
- Copy results to clipboard

### Extension Features
- **Popup Interface** - Access via extension icon in toolbar
- **Popout Window** - Open in separate window for convenience
- **Context Menu** - Right-click on selected hex text to calculate

## Installation

### Method 1: Load Unpacked (Development)

1. Download or clone this repository to your local machine
2. Open Microsoft Edge browser
3. Navigate to `edge://extensions/`
4. Enable **Developer mode** toggle (top-right corner)
5. Click **Load unpacked** button
6. Select the `badge_id_extension` directory
7. Extension is now installed and ready to use!

### Method 2: Package and Install (Production)

1. Navigate to `edge://extensions/`
2. Enable **Developer mode**
3. Click **Pack extension**
4. Select the `badge_id_extension` directory
5. Click **Pack extension**
6. This will create a `.crx` file that can be shared and installed

## Usage

### Using the Popup - HID 35-bit Card Calculator

1. Click the extension icon in the Edge toolbar
2. Select the **HID 35-bit** tab
3. Enter the hex value (e.g., `123456789A`)
4. Click **Calculate**
5. View the results:
   - Bit Pattern
   - Card Format
   - Internal Card #
   - Facility Code
6. Click **Copy Results** to copy to clipboard
7. Click **Reset** to clear and start over

### Using the Popup - Hex/Decimal Converter

1. Click the extension icon in the Edge toolbar
2. Select the **Hex/Decimal** tab
3. Enter a value in the input field
4. Select conversion direction:
   - **Hex → Decimal** - Convert hex to decimal
   - **Decimal → Hex** - Convert decimal to hex
5. Click **Convert**
6. View the converted result
7. Click **Copy Result** to copy to clipboard
8. Click **Reset** to clear and start over

### Using Context Menu

1. Highlight/select a hex value on any webpage
2. Right-click the selected text
3. Select **Calculate Selected Hex (HID 35-bit)**
4. The popup will open with:
   - Results pre-populated
   - Results automatically copied to clipboard
   - Confirmation notification displayed

### Using Popout Window

1. Open the extension popup
2. Click the **popout button** (arrow icon) in the header
3. The calculator will open in a separate window
4. This allows you to keep the calculator visible while browsing

## HID Corporate 1000 35-bit Format

The extension uses the HID Corporate 1000 35-bit Wiegand format:

```
[Parity][Facility Code (16 bits)][Card Number (16 bits)][Parity]
```

- **Total bits**: 35
- **Facility Code**: Bits 2-17 (16 bits)
- **Card Number**: Bits 18-33 (16 bits)
- **Parity bits**: Bit 1 (even parity), Bit 35 (odd parity)

## Example Usage

### HID 35-bit Calculation

**Input:** `123456789A`

**Output:**
- Bit Pattern: `000100100011010001010110011110001001010`
- Card Format: HID Corporate 1000 35 Bit
- Internal Card #: 23457
- Facility Code: 4660

### Hex to Decimal Conversion

**Input:** `FF`

**Output:** `255`

### Decimal to Hex Conversion

**Input:** `255`

**Output:** `FF`

## File Structure

```
badge_id_extension/
├── manifest.json          # Extension manifest (V3)
├── popup.html            # Popup UI structure
├── popup.css             # Popup styling
├── popup.js              # Popup logic & conversion algorithms
├── background.js         # Service worker for context menu
├── icons/
│   ├── icon-16.svg       # 16x16 icon
│   ├── icon-48.svg       # 48x48 icon
│   └── icon-128.svg      # 128x128 icon
├── PLAN.md               # Detailed implementation plan
└── README.md             # This file
```

## Permissions

The extension requires the following permissions:

- **contextMenus** - For right-click context menu integration
- **clipboardWrite** - For copying results to clipboard
- **notifications** - For confirmation notifications

## Browser Compatibility

- **Microsoft Edge** (Chromium-based) - Fully supported
- **Google Chrome** - Compatible (same extension format)
- **Brave** - Compatible
- **Opera** - Compatible

## Troubleshooting

### Extension not loading
- Ensure Developer mode is enabled
- Check that all files are in the correct directory structure
- Look for error messages in `edge://extensions/`

### Context menu not appearing
- Reload the extension from `edge://extensions/`
- Ensure you have selected text before right-clicking

### Copy to clipboard not working
- Check browser permissions for clipboard access
- Ensure you're on a secure page (HTTPS) or local file

### Calculation results incorrect
- Verify the hex value is valid (0-9, A-F)
- Ensure the hex length is appropriate for 35-bit format (max 9 characters)

## Development

### Building from Source

All files are plain HTML, CSS, and JavaScript - no build process required.

### Modifying the Extension

1. Make changes to the source files
2. Go to `edge://extensions/`
3. Click the **Reload** button on the extension card
4. Changes will take effect immediately

## Future Enhancements

Potential future features:
- Support for additional card formats (26, 33, 34, 37, 40 bit)
- History of recent calculations
- Export results to CSV/JSON
- Keyboard shortcuts
- Dark mode toggle
- Batch calculation for multiple hex values
- Auto-detect input format (hex vs decimal)

## License

This extension is based on the Brivo Access Control Card Calculator.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the detailed implementation plan in `PLAN.md`
3. Test with known valid hex values

## Credits

- Original concept: [Brivo Card Calculator](https://www.brivo.com/resources/card-calculator/)
- Extension implementation: Custom implementation
