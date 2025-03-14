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

## Installation

### Direct Download

Download the latest version from the [releases page](https://github.com/dev-hero/modal-manager/releases) and include it in your project:

```html
<script src="path/to/modalManager.min.js"></script>
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/dev-hero/modal-manager@1.0.0/dist/modalManager.min.js"></script>
```

### NPM

```bash
npm install @dev-hero/modal-manager
```

Then import it in your project:

```javascript
// ES Module
import ModalManager from '@dev-hero/modal-manager';

// CommonJS
const ModalManager = require('@dev-hero/modal-manager');
```

## Basic Usage

1. Include the script in your HTML:

```html
<script src="path/to/modalManager.min.js"></script>
```

2. Create your modal HTML structure:

```html
<!-- Trigger Button -->
<button data-modal="my-modal">Open Modal</button>

<!-- Modal Structure -->
<div id="my-modal" class="modal-wrapper">
  <div class="modal-content">
    <span class="modal-close">&times;</span>
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

## Building from Source

To build the project from source:

1. Clone the repository
   ```bash
   git clone https://github.com/dev-hero/modal-manager.git
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

## License

MIT License - free to use in personal and commercial projects.