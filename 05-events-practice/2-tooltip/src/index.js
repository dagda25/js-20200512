class Tooltip {
    element;
    elementWithTooltip;

    onEnter = (event) => {
        if (event.target.dataset.tooltip != undefined) { 
            this.elementWithTooltip = event.target;
            this.element.textContent = `${event.target.dataset.tooltip}`;

            event.target.addEventListener('pointermove', this.onMove);
        }
    }

    onMove = (event) => {
        this.element.classList.remove('hide');
        this.element.style.left = event.clientX + 5 + 'px';
        this.element.style.top = event.clientY + 5 + 'px';

        this.elementWithTooltip.addEventListener('pointerout', this.onLeave);
    }

    onLeave = (event) => {
        this.element.classList.add('hide');
        this.elementWithTooltip.removeEventListener('pointerout', this.onLeave);
        this.elementWithTooltip.removeEventListener('pointermove', this.onMove)
    }

    constructor() {
      this.render();
    }

    getTemplate() {
        return `<div class="tooltip" style="left: -999px"></div>`;
    }
  
    render() {
        const element = document.createElement('div');

        element.innerHTML = this.getTemplate();
    
        this.element = element.firstElementChild;
        document.body.append(this.element);
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
