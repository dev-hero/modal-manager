/**
 * ModalManager - A comprehensive class to manage multiple modals
 * 
 * Features:
 * - Manages z-index and stacking of multiple modals
 * - Handles focus trapping for accessibility
 * - Provides methods for opening, closing, and querying modals
 * - Keyboard support (Escape to close)
 * - Proper event delegation
 * - HubSpot form compatibility
 * 
 * Default selectors:
 * - Modal containers: .modal-wrapper
 * - Close buttons: .modal-close
 * - Trigger attribute: data-modal
 * 
 * Version: 1.0.2
 */
class ModalManager {
    constructor(options = {}) {
      // Default options
      this.options = {
        closeOnEscape: true,
        closeOnOutsideClick: true,
        modalSelector: '.modal-wrapper',
        modalTriggerAttribute: 'data-modal',
        closeButtonSelector: '.modal-close',
        baseZIndex: 1000,
        ...options
      };
      
      // State
      this.openModals = [];
      this.lastFocusedElement = null;
      
      // Bind methods to maintain 'this' context
      this.handleCloseButtonMouseDown = this.handleCloseButtonMouseDown.bind(this);
      this.handleTriggerClick = this.handleTriggerClick.bind(this);
      this.handleBackgroundMouseDown = this.handleBackgroundMouseDown.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      
      // Initialize
      this.init();
    }
    
    init() {
      // Use mousedown for close buttons (highest priority)
      document.addEventListener('mousedown', this.handleCloseButtonMouseDown, true);
      
      // Use mousedown for background clicks (high priority)
      document.addEventListener('mousedown', this.handleBackgroundMouseDown, true);
      
      // Use regular click for trigger buttons (normal priority)
      document.addEventListener('click', this.handleTriggerClick);
      
      // Add keyboard support
      if (this.options.closeOnEscape) {
        document.addEventListener('keydown', this.handleKeyDown);
      }
    }
    
    /**
     * Handle close button interactions on mousedown
     * This bypasses form validation completely
     */
    handleCloseButtonMouseDown(event) {
      // Check if clicking on a close button
      if (event.target.matches(this.options.closeButtonSelector) || 
          event.target.closest(this.options.closeButtonSelector)) {
          
        // Find the parent modal
        const modal = event.target.closest(this.options.modalSelector);
        if (modal && modal.id && this.isOpen(modal.id)) {
          // Stop all event propagation immediately
          event.preventDefault();
          event.stopPropagation();
          
          // Close modal immediately
          this.close(modal.id);
          
          // Return false to prevent other handlers
          return false;
        }
      }
    }
    
    /**
     * Direct background click detection using mousedown
     * This approach bypasses form validation events completely
     */
    handleBackgroundMouseDown(event) {
      if (!this.options.closeOnOutsideClick) return;
      
      // Check if clicking directly on modal background and not any child element
      if (event.target.matches(this.options.modalSelector)) {
        const modalId = event.target.id;
        
        // Store x/y coordinates of the click
        const clickX = event.clientX;
        const clickY = event.clientY;
        
        // Check that click is not on a child element
        const isClickOnBackground = !Array.from(event.target.children).some(child => {
          const rect = child.getBoundingClientRect();
          return (
            clickX >= rect.left &&
            clickX <= rect.right &&
            clickY >= rect.top &&
            clickY <= rect.bottom
          );
        });
        
        if (isClickOnBackground && modalId && this.isOpen(modalId)) {
          // Important: Prevent default and stop propagation immediately
          event.preventDefault();
          event.stopPropagation();
          
          // Close the modal immediately rather than waiting for click
          // This approach bypasses form validation completely
          this.close(modalId);
          
          // Return false to prevent other handlers
          return false;
        }
      }
    }
    
    /**
     * Handle modal trigger clicks
     */
    handleTriggerClick(event) {
      const { target } = event;
      
      // Handle opening modals
      if (target.hasAttribute(this.options.modalTriggerAttribute) || 
          target.closest(`[${this.options.modalTriggerAttribute}]`)) {
        event.preventDefault();
        
        const trigger = target.hasAttribute(this.options.modalTriggerAttribute) ? 
                       target : 
                       target.closest(`[${this.options.modalTriggerAttribute}]`);
        
        const modalId = trigger.getAttribute(this.options.modalTriggerAttribute);
        this.open(modalId);
      }
    }
    
    /**
     * Handle keyboard events
     */
    handleKeyDown(event) {
      // Close top-most modal on Escape
      if (event.key === 'Escape' && this.openModals.length > 0) {
        event.preventDefault();
        const topModalId = this.openModals[this.openModals.length - 1];
        this.close(topModalId);
      }
      
      // Handle Tab key for focus trapping
      if (event.key === 'Tab' && this.openModals.length > 0) {
        this.handleTabKey(event);
      }
    }
    
    /**
     * Trap focus within the currently active modal
     */
    handleTabKey(event) {
      if (this.openModals.length === 0) return;
      
      const topModalId = this.openModals[this.openModals.length - 1];
      const modal = document.getElementById(topModalId);
      if (!modal) return;
      
      const focusableElements = this.getFocusableElements(modal);
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If Shift+Tab and on first element, wrap to last element
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } 
      // If Tab and on last element, wrap to first element
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
    
    /**
     * Get all focusable elements within a container
     */
    getFocusableElements(container) {
      return Array.from(container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.hasAttribute('disabled') && el.style.display !== 'none');
    }
    
    /**
     * Open a modal by ID
     */
    open(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal || this.isOpen(modalId)) return;
      
      // Store the currently focused element to restore later
      this.lastFocusedElement = document.activeElement;
      
      // Add to open modals stack
      this.openModals.push(modalId);
      
      // Update z-index based on stack position
      modal.style.zIndex = this.options.baseZIndex + this.openModals.length;
      
      // Show the modal
      modal.style.display = 'block';
      
      // Set ARIA attributes
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      
      // Move focus to the first focusable element
      const focusableElements = this.getFocusableElements(modal);
      if (focusableElements.length > 0) {
        setTimeout(() => {
          focusableElements[0].focus();
        }, 100);
      }
      
      // Dispatch custom event
      modal.dispatchEvent(new CustomEvent('modal:open', {
        bubbles: true,
        detail: { modalId }
      }));
    }
    
    /**
     * Close a modal by ID
     */
    close(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal || !this.isOpen(modalId)) return;
      
      // Remove from open modals stack
      const index = this.openModals.indexOf(modalId);
      if (index !== -1) {
        this.openModals.splice(index, 1);
      }
      
      // Hide the modal
      modal.style.display = 'none';
      
      // Set ARIA attributes
      modal.setAttribute('aria-hidden', 'true');
      
      if (this.openModals.length === 0) {
        document.body.classList.remove('modal-open');
      }
      
      // Restore focus to the element that was focused before opening
      if (this.openModals.length === 0 && this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      } else if (this.openModals.length > 0) {
        // If there are still open modals, focus on the top one
        const topModalId = this.openModals[this.openModals.length - 1];
        const topModal = document.getElementById(topModalId);
        if (topModal) {
          const focusableElements = this.getFocusableElements(topModal);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      }
      
      // Dispatch custom event
      modal.dispatchEvent(new CustomEvent('modal:close', {
        bubbles: true,
        detail: { modalId }
      }));
    }
    
    /**
     * Close all open modals
     */
    closeAll() {
      const modalIds = [...this.openModals];
      modalIds.forEach(id => this.close(id));
    }
    
    /**
     * Check if a modal is currently open
     */
    isOpen(modalId) {
      return this.openModals.includes(modalId);
    }
    
    /**
     * Get the currently open modals
     */
    getOpenModals() {
      return [...this.openModals];
    }
    
    /**
     * Get the top-most (active) modal
     */
    getActiveModal() {
      if (this.openModals.length === 0) return null;
      return this.openModals[this.openModals.length - 1];
    }
    
    /**
     * Clean up event listeners when no longer needed
     */
    destroy() {
      document.removeEventListener('mousedown', this.handleCloseButtonMouseDown, true);
      document.removeEventListener('mousedown', this.handleBackgroundMouseDown, true);
      document.removeEventListener('click', this.handleTriggerClick);
      document.removeEventListener('keydown', this.handleKeyDown);
      this.closeAll();
      this.openModals = [];
    }
  }
  
  // Automatically initialize when included directly in a page
  (function() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Initialize on DOM ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initModalManager);
    } else {
      // DOM already loaded, run right away
      initModalManager();
    }
    
    function initModalManager() {
      // Make the modal manager accessible globally
      window.modalManager = new ModalManager();
    }
  })();
  
  // If using as a module (optional)
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ModalManager;
  }