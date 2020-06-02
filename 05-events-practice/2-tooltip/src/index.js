class Tooltip {
    element; // HTMLElement;
    elementWithTooltip;

    onEnter = (event) => {
        console.log(event.target);
        if (event.target.dataset.tooltip != undefined) { 
            this.elementWithTooltip = event.target;
            event.target.addEventListener('pointermove', this.onMove)
        }
    }

    onMove = (event) => {
        this.elementWithTooltip.append(this.element);
        this.elementWithTooltip.addEventListener('pointerout', this.onLeave)
    }

    onLeave = (event) => {
        this.element.remove();
        this.elementWithTooltip.removeEventListener('pointerout', this.onLeave);
        this.elementWithTooltip.removeEventListener('pointermove', this.onMove)
    }

    constructor() {
      this.render();
    }

    getTemplate() {
        return `<div class="tooltip">This is tooltip</div>`;
    }
  
    render() {
        const element = document.createElement('div');

        element.innerHTML = this.getTemplate();
    
        this.element = element.firstElementChild;
    }

    initialize() {
        document.addEventListener('pointermove', this.onEnter); 
    }
  
    remove () {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
      document.removeEventListener('pointermove', this.onEnter); 
    }
}

const tooltip = new Tooltip();

export default tooltip;
