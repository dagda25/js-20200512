export default class RangePicker {
    element;
    subElements = {};
    currentMonth;
    firstDate;
    secondDate;
    firstChosenField;
    secondChosenField;

    onOpen = (event) => {
        event.target.closest('.rangepicker').classList.toggle('rangepicker_open');
        this.subElements.selector.innerHTML = `${this.getCalendar(this.from)}`;
    }

    onClose = (event) => {
        if (event.target.classList.contains('rangepicker__selector-control-left') || event.target.classList.contains('rangepicker__selector-control-right')) return;
        if (!event.target.closest('.rangepicker')) {
            this.element.classList.remove('rangepicker_open');
        }
    }

    onMonthChange = (event) => {
      if (event.target.classList.contains('rangepicker__selector-control-left')) {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
        this.subElements.selector.innerHTML = this.getCalendar(this.currentMonth);
      }
      if (event.target.classList.contains('rangepicker__selector-control-right')) {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
        this.subElements.selector.innerHTML = this.getCalendar(this.currentMonth);
      }
    }

    onSelect = (event) => {
        if (event.target.classList.contains('rangepicker__cell')) {
            if (!this.firstDate) {

                this.from = new Date(parseInt(event.target.dataset.value));
                this.to = this.from;
                this.firstDate = this.from;
                
                [...this.subElements.selector.querySelectorAll('.rangepicker__cell')].forEach((item) => {
                    item.classList.remove('rangepicker__selected-between');
                    item.classList.remove('rangepicker__selected-from');
                    item.classList.remove('rangepicker__selected-to');
                })
                event.target.classList.add('rangepicker__selected-from');
                this.firstChosenField = event.target;

            } else if (this.firstDate && !this.secondDate) {

                if (this.from > new Date(parseInt(event.target.dataset.value))) {
                    this.to = this.from;
                    this.from = new Date(parseInt(event.target.dataset.value));
                } else {
                    this.to = new Date(parseInt(event.target.dataset.value));
                }

                this.refreshInput();

                event.target.closest('.rangepicker').classList.toggle('rangepicker_open');

                this.firstChosenField = null;
                this.secondChosenField = null;
                this.firstDate = null;
                this.secondDate = null;

                this.subElements.selector.innerHTML = `${this.getCalendar(this.from)}`;
            }
        }
    }

    constructor({
        from = new Date(2019, 9, 2),
        to = new Date(2019, 10, 5)
      }) {
    
        this.from = from;
        this.to = to;
        this.currentMonth = this.from;

        this.render();
        this.initEventListeners();
    }

    initEventListeners() {
        this.subElements.input.addEventListener('click', this.onOpen);
        document.addEventListener('click', this.onClose);
        this.subElements.selector.addEventListener('click', this.onMonthChange);
        this.subElements.selector.addEventListener('click', this.onSelect);
    }

    getTemplate() {
        return `
        <div class="rangepicker">
            <div class="rangepicker__input" data-element="input">
            <span data-element="from">${this.getDateString(this.from)}</span> -
            <span data-element="to">${this.getDateString(this.to)}</span>
            </div>
            <div class="rangepicker__selector" data-element="selector"></div>
        </div>
        `;
    }

    refreshInput() {
        this.subElements.input.innerHTML = `
            <span data-element="from">${this.getDateString(this.from)}</span> -
            <span data-element="to">${this.getDateString(this.to)}</span>
        `;
    }

    getDateString(date) {
        return `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}.${date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)}.${date.getFullYear()}`;
    }

    getMonthName(date) {
        const months = [
            'январь',
            'февраль',
            'март',
            'апрель',
            'май',
            'июнь',
            'июль',
            'август',
            'сентябрь',
            'октябрь',
            'ноябрь',
            'декабрь'           
        ];

        return months[date.getMonth()];
    }

    getDayCells(date) {
        let dayNumber = 1;
        let newDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
        let result = `<button type="button" class="rangepicker__cell ${this.isSelected(newDate)}" data-value="${newDate.getTime()}" style="--start-from:${newDate.getDay() + 1}">${newDate.getDate()}</button>`;

        dayNumber++;
        newDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
        for (; date.getMonth() === newDate.getMonth(); ) {
            result += `<button type="button" class="rangepicker__cell ${this.isSelected(newDate)}" data-value="${newDate.getTime()}">${newDate.getDate()}</button>`;
            dayNumber++;
            newDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
        }
        return result;
    }

    isSelected(date) {
        if (date.getTime() === this.from.getTime()) {
            return 'rangepicker__selected-from';
        }

        if (date.getTime() === this.to.getTime()) {
            return 'rangepicker__selected-to';
        }

        if (date.getTime() > this.from.getTime() && date.getTime() < this.to.getTime()) {
            return 'rangepicker__selected-between';
        }
        return '';
    }

    getMonthTable(date) {
        return `
        <div class="rangepicker__calendar">
            <div class="rangepicker__month-indicator">
            <time datetime="${this.getMonthName(date)}">${this.getMonthName(date)}</time>
            </div>
            <div class="rangepicker__day-of-week">
            <div>Пн</div>
            <div>Вт</div>
            <div>Ср</div>
            <div>Чт</div>
            <div>Пт</div>
            <div>Сб</div>
            <div>Вс</div>
            </div>
            <div class="rangepicker__date-grid">
            ${this.getDayCells(date)}
            </div>
        </div>`

    }

    getCalendar(date) {
        return `
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            ${this.getMonthTable(date)}
            ${this.getMonthTable(new Date(date.getFullYear(), date.getMonth() + 1))}
        `;
    }
  
    render() {
        const wrapper = document.createElement('div');
    
        wrapper.innerHTML = this.getTemplate();
    
        const element = wrapper.firstElementChild;
    
        this.element = element;
        this.subElements = this.getSubElements(element);
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');

        return [...elements].reduce((accum, subElement) => {
            accum[subElement.dataset.element] = subElement;

            return accum;
        }, {});
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = {};
    }
}
