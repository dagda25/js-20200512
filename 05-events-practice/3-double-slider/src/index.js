export default class DoubleSlider {
    element; 

    onDragStart = (event) => {
        this.draggable = event.target;

        document.addEventListener('dragstart', () => false);
        document.addEventListener('pointermove', this.onDrag);
    }

    onDrag = (event) => {
        document.addEventListener('pointerup', (event) => {
            document.removeEventListener('pointermove', this.onDrag);
            this.element.dispatchEvent(new CustomEvent('range-select', {
                detail: { from: this.rangeValue.min, to: this.rangeValue.max }, 
                bubbles: true 
            }));
        });

        let left = event.clientX - this.draggable.closest('.range-slider__inner').getBoundingClientRect().left;

        if (this.draggable.classList.contains('range-slider__thumb-left')) {

            if (left < 0) {
                this.draggable.style.left = '0%';
                this.rangeRelative.min = 0;
            } else if (left > this.draggable.closest('.range-slider__inner').getBoundingClientRect().width / 100 * this.rangeRelative.max) {
                this.draggable.style.left = this.rangeRelative.max + '%';
            } else {
                this.rangeRelative.min = left / this.draggable.closest('.range-slider__inner').getBoundingClientRect().width * 100; 
                this.draggable.style.left = this.rangeRelative.min + '%';
            }

            this.draggable.closest('.range-slider__inner').firstElementChild.style.left = this.draggable.style.left;

            this.draggable.style.zIndex = '99';
        }

        if (this.draggable.classList.contains('range-slider__thumb-right')) {

            if (left < this.draggable.closest('.range-slider__inner').getBoundingClientRect().width / 100 * this.rangeRelative.min) {
                this.draggable.style.right = 100 - this.rangeRelative.min + '%';
                this.rangeRelative.max = this.rangeRelative.min;
            } else if (left > this.draggable.closest('.range-slider__inner').getBoundingClientRect().width) {
                this.draggable.style.right = '0%';
                this.rangeRelative.max = 100;
            } else {
                this.rangeRelative.max = left / this.draggable.closest('.range-slider__inner').getBoundingClientRect().width * 100;  
                this.draggable.style.right = 100 - this.rangeRelative.max + '%';
            }

            this.draggable.closest('.range-slider__inner').firstElementChild.style.right = this.draggable.style.right;

            this.draggable.style.zIndex = '99';
        }

        this.updateSliderValue(this.rangeRelative.min, this.rangeRelative.max);

    }

    constructor({
        min = 100,
        max = 200,
        formatValue = value => '$' + value,
        selected = {},
      } = {}) {
        this.min = min;
        this.max = max;
        this.from = selected.from || min;
        this.to = selected.to || max;
        this.formatValue = formatValue;

        this.rangeValue = {min: this.from, max: this.to};
        this.rangeRelative = {min: (this.from - min) / (max - min) * 100, max: (this.to - min) / (max - min) * 100};

        this.render();
        this.initEventListeners();

    }
  
    initEventListeners() {
        const thumbLeft = this.element.querySelector('.range-slider__thumb-left');
        const thumbRight = this.element.querySelector('.range-slider__thumb-right');

        thumbLeft.addEventListener('pointerdown', this.onDragStart);
        thumbRight.addEventListener('pointerdown', this.onDragStart);
    }



    getTemplate(min, max, from, to) {
        return `<div class="range-slider">
                    <span data-element="from">${this.formatValue(from)}</span>
                    <div class="range-slider__inner">
                    <span data-element="progress" class="range-slider__progress" style="left:${(from - min) / (max - min) * 100}%; right:${100 - (to - min) / (max - min) * 100}%"></span>
                    <span data-element="thumbLeft" class="range-slider__thumb-left" style="left:${(from - min) / (max - min) * 100}%"></span>
                    <span data-element="thumbRight" class="range-slider__thumb-right" style="right:${100 - (to - min) / (max - min) * 100}%"></span>
                    </div>
                    <span data-element="to">${this.formatValue(to)}</span>
                </div>`;
    }
  
    render() {
        const element = document.createElement('div');

        element.innerHTML = this.getTemplate(this.min, this.max, this.from, this.to);
    
        this.element = element.firstElementChild;
    }

    updateSliderValue(min, max) {
        this.rangeValue.min = Math.round(((this.max - this.min) * min / 100 + this.min));
        this.rangeValue.max = Math.round(((this.max - this.min) * max / 100 + this.min));
        this.element.firstElementChild.textContent = `${this.formatValue(this.rangeValue.min)}`;
        this.element.lastElementChild.textContent = `${this.formatValue(this.rangeValue.max)}`;
    }
  
    remove () {
        this.element.remove();
    }
  
    destroy() {
        this.remove();
    }
}
