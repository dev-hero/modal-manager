# Modal Manager

A lightweight, accessible modal management system for web projects.

## Features

- 🔄 **Multi-Modal Support** - Properly manages multiple modals with correct stacking and z-index
- ♿ **Accessibility** - Keyboard navigation, focus trapping, and ARIA attributes
- 🖱️ **Click Behaviors** - Close on outside click, close button support
- ⌨️ **Keyboard Support** - Close with Escape key, tab trapping within modal
- 📱 **Mobile-Friendly** - Works on all devices and screen sizes
- 🔌 **Easy Integration** - Works with simple HTML structure
- 🪶 **Lightweight** - No dependencies, vanilla JavaScript
- 🧩 **Form Compatible** - Works with HubSpot forms and other complex form elements

## Installation

Modal Manager can be added to your project in several ways. Choose the method that best fits your workflow:

### Option 1: CDN (Simplest)

Add Modal Manager directly to your HTML using jsDelivr CDN:

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/@dev-hero/modal-manager/dist/modalManager.min.js"></script>

<!-- Specific version (recommended for production) -->
<script src="https://cdn.jsdelivr.net/npm/@dev-hero/modal-manager@1.0.2/dist/modalManager.min.js"></script>
```

This approach requires no build tools and works in any project. The script automatically initializes when loaded.

### Option 2: npm for Build Systems

If you use npm and a build system (webpack, Rollup, Vite, etc.):

1. Install the package:
   ```bash
   npm install @dev-hero/modal-manager
   ```

2. Import it in your JavaScript:
   ```javascript
   // ES Module syntax
   import ModalManager from '@dev-hero/modal-manager';
   
   // Create an instance with custom options (optional)
   const modalManager = new ModalManager({
     // Custom options here
   });
   ```

This is the recommended approach for modern web applications. The `node_modules` folder should be added to your `.gitignore` file as per best practices.

### Option 3: Direct Download

1. Download the latest [`modalManager.min.js`](https://cdn.jsdelivr.net/npm/@dev-hero/modal-manager/dist/modalManager.min.js) file
2. Include it in your project:
   ```html
   <script src="path/to/modalManager.min.js"></script>
   ```

### Option 4: Git Submodule (Advanced)

For projects that need to track the library source code:

```bash
git submodule add https://github.com/yourusername/modal-manager.git vendor/modal-manager
```

Then reference it in your HTML:
```html
<script src="vendor/modal-manager/dist/modalManager.min.js"></script>
```

## Basic Usage

1. Include the script in your HTML using one of the installation methods above.

2. Create your modal HTML structure:

```html
<!-- Trigger Button -->
<button data-modal="my-modal">Open Modal</button>

<!-- Modal Structure -->
<div id="my-modal" class="modal-wrapper">
  <div class="modal-content">
    <button class="modal-close" aria-label="Close">×</button>
    <h2>Modal Title</h2>
    <p>Modal content goes here...</p>
    <button class="modal-close">Close</button>
  </div>
</div>
```

3. Add basic CSS for your modals:

```css
.modal-wrapper {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  position: relative;
  background-color: white;
  margin: 10% auto;
  padding: 20px;
  width: 80%;
  max-width: 600px;
  border-radius: 4px;
}

.modal-close {
  cursor: pointer;
}

body.modal-open {
  overflow: hidden;
}
```

That's it! The Modal Manager automatically initializes when the page loads and handles your modals.

## Required Elements

- **Modal Container**: Must have the class `.modal-wrapper` and a unique ID
- **Modal Trigger**: Any element with the attribute `data-modal="modal-id"` where "modal-id" matches the ID of the modal to open
- **Close Button**: Elements with the class `.modal-close` will close the parent modal when clicked

## JavaScript API

The Modal Manager is accessible globally as `window.modalManager` and provides these methods:

```javascript
// Open a modal by ID
window.modalManager.open('modal-id');

// Close a modal by ID
window.modalManager.close('modal-id');

// Close all open modals
window.modalManager.closeAll();

// Check if a modal is open
if (window.modalManager.isOpen('modal-id')) {
  // Do something
}

// Get all currently open modals
const openModals = window.modalManager.getOpenModals();

// Get the top-most (active) modal
const activeModal = window.modalManager.getActiveModal();
```

## Advanced Usage

### Custom Events

The Modal Manager fires events you can listen for:

```javascript
// Listen for modal open events
document.addEventListener('modal:open', function(e) {
  console.log('Modal opened:', e.detail.modalId);
});

// Listen for modal close events
document.addEventListener('modal:close', function(e) {
  console.log('Modal closed:', e.detail.modalId);
});
```

### Custom Configuration

You can customize the Modal Manager by re-initializing it with custom options:

```javascript
// Re-initialize with custom options
window.modalManager = new ModalManager({
  closeOnEscape: true,  // Enable/disable escape key to close
  closeOnOutsideClick: true,  // Enable/disable clicking outside to close
  modalSelector: '.my-custom-modal-class',  // Custom modal class
  closeButtonSelector: '.my-custom-close-button',  // Custom close button class
  modalTriggerAttribute: 'data-custom-modal',  // Custom trigger attribute
  baseZIndex: 2000  // Starting z-index for modals
});
```

### Manual Initialization

If you prefer to initialize the Modal Manager yourself:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  window.modalManager = new ModalManager({
    // Your custom options here
  });
});
```

## Using with Build Tools

### Webpack/Rollup/Vite

When using build tools, you can import the module:

```javascript
import ModalManager from '@dev-hero/modal-manager';

// Initialize with options
const modalManager = new ModalManager({
  closeOnEscape: true,
  modalSelector: '.my-custom-modal-class',
  // Additional options...
});
```

### Browserify/CommonJS

For CommonJS environments:

```javascript
const ModalManager = require('@dev-hero/modal-manager');

// Initialize as needed
const modalManager = new ModalManager();
```

## HubSpot Form Compatibility

Modal Manager is designed to work seamlessly with HubSpot forms:

- Close buttons work properly without triggering form validation
- Background clicks bypass form validation events
- Focus management is preserved even with complex forms

No additional configuration is needed for HubSpot compatibility.

## Building from Source

To build the project from source:

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/modal-manager.git
   cd modal-manager
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build the distribution files
   ```bash
   npm run build
   ```

This will create minified version in the `dist` directory.

## Development

For development with automatic rebuilding:

```bash
npm run dev
```

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- IE11 not supported

## Troubleshooting

- **Modals not opening**: Check that your modal IDs match the `data-modal` attribute values
- **Close button not working**: Ensure it has the `.modal-close` class
- **Click outside not closing**: Make sure your modal structure has the correct container element with `.modal-wrapper`
- **Z-index issues**: Check if other elements on your page have higher z-index values
- **Forms preventing modal close**: Update to the latest version (1.0.2+) which has improved form compatibility

## Changelog

### v1.0.2
- Full HubSpot form compatibility
- Improved close button behavior for better form interaction
- Enhanced background click detection algorithm
- Fixed compatibility issues with form validation
- Expanded documentation with more installation options

### v1.0.1
- Improved event handling for modal close buttons
- Enhanced background click detection for better form compatibility
- Added initial HubSpot form compatibility
- Fixed issues with form validation when closing modals

### v1.0.0
- Initial release with core modal functionality
- Accessibility features
- Multiple modal support

## License

MIT License - free to use in personal and commercial projects.