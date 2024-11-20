/**
 * @name AutoExpandRoles
 * @author b1aids
 * @authorId 756267479214587975
 * @invite https://discord.gg/ddev
 * @version 1.0.0
 * @description Automatically expands roles in Discord by clicking the expand button, optimized for performance and removes the collapse button.
 */

module.exports = class AutoExpandRoles {
    constructor() {
        this.initialized = false;
        this.observer = null;
        this.debounceTimeout = null;
        this.clickedButtons = new WeakSet();
    }

    start() {
        this.observeRoleExpanders();
    }

    stop() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.clickedButtons = new WeakSet(); // Clear cache on stop
    }

    observeRoleExpanders() {
        const observerConfig = { childList: true, subtree: true };

        this.observer = new MutationObserver(() => {
            if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                const target = document.body;
                if (target) {
                    this.expandRoles(target);
                    this.removeCollapseButtons(target);
                }
            }, 100); // Execute every 100ms max
        });

        const targetNode = document.body;
        if (targetNode) {
            this.observer.observe(targetNode, observerConfig);
            this.expandRoles(document.body); // Trigger an initial check
            this.removeCollapseButtons(document.body); // Remove collapse buttons initially
        }
    }

    expandRoles(node) {
        const buttons = node.querySelectorAll(".expandButton_e6f2d0");
        buttons.forEach((button) => {
            if (
                button.getAttribute("role") === "button" &&
                !this.clickedButtons.has(button) // Skip already clicked buttons
            ) {
                button.click();
                this.clickedButtons.add(button); // Mark as clicked
            }
        });
    }

    removeCollapseButtons(node) {
        const collapseButtons = node.querySelectorAll(".collapseButton_e6f2d0");
        collapseButtons.forEach((button) => {
            button.remove();
        });
    }
};
