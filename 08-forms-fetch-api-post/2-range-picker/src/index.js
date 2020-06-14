export default class RangePicker {
    element;
    subElements = {};
    currentMonth;

    onOpen = (event) => {
      event.target.closest('.rangepicker').classList.toggle('rangepicker_open');
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
        this.subElements.selector.addEventListener('click', this.onMonthChange);
    }

    getTemplate() {
        return `
        <div class="rangepicker">
            <div class="rangepicker__input" data-element="input">
            <span data-element="from">${this.getDateString(this.from)}</span> -
            <span data-element="to">${this.getDateString(this.to)}</span>
            </div>
            <div class="rangepicker__selector" data-element="selector">
                ${this.getCalendar(this.from)}
            </div>

        </div>
        `;
    }

    getDateString(date) {
        return `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}.${date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)}.${date.getFullYear()}`;
    }

    getMonthName(date) {
        const months = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'           
        ];

        return months[date.getMonth()];
    }

    getDayCells(date) {
        let dayNumber = 1;
        let newDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
        let result = `<button type="button" class="rangepicker__cell" data-value="${newDate}" style="--start-from:${newDate.getDay() + 1}">${newDate.getDate()}</button>`;

        dayNumber++;
        newDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
        for (; date.getMonth() === newDate.getMonth(); ) {
            result += `<button type="button" class="rangepicker__cell" data-value="${newDate}">${newDate.getDate()}</button>`;
            dayNumber++;
            newDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
        }
        return result;
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
