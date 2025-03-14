/**
 * ModalManager - A comprehensive class to manage multiple modals
 * Works with any web project, including Webflow
 * 
 * Features:
 * - Manages z-index and stacking of multiple modals
 * - Handles focus trapping for accessibility
 * - Provides methods for opening, closing, and querying modals
 * - Keyboard support (Escape to close)
 * - Proper event delegation
 * 
 * Default selectors:
 * - Modal containers: .modal-wrapper
 * - Close buttons: .modal-close
 * - Trigger attribute: data-modal
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
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      
      // Initialize
      this.init();
    }
    
    init() {
      // Use event delegation for all click events
      document.addEventListener('click', this.handleClick);
      
      // Add keyboard support
      if (this.options.closeOnEscape) {
        document.addEventListener('keydown', this.handleKeyDown);
      }
    }
    
    /**
     * Handle all click events through delegation
     */
    handleClick(event) {
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
      
      // Handle closing modals via close button
      if (target.matches(this.options.closeButtonSelector) || 
          target.closest(this.options.closeButtonSelector)) {
        event.preventDefault();
        const modal = target.closest(this.options.modalSelector);
        if (modal) {
          this.close(modal.id);
        }
      }
      
      // Handle closing modals via outside click
      if (this.options.closeOnOutsideClick && 
          target.matches(this.options.modalSelector) && 
          target === event.currentTarget) {
        const modalId = target.id;
        if (modalId && this.isOpen(modalId)) {
          this.close(modalId);
        }
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
      document.removeEventListener('click', this.handleClick);
      document.removeEventListener('keydown', this.handleKeyDown);
      this.closeAll();
      this.openModals = [];
    }
  }
  
  // Automatically initialize when included directly in a page
  // This can be removed if you prefer to initialize manually
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