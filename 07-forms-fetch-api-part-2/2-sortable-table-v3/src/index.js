import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    element;
    subElements = {};
    headersConfig = [];
    data = [];

    onSort = (event) => {
        const targetColumn = event.target.closest(".sortable-table__cell[data-sortable='true']");
        if (targetColumn) {
            const newOrder = targetColumn.dataset.order === 'desc' ? 'asc' : 'desc';
            this.resetOrder();
            targetColumn.dataset.order = newOrder;
            this.id = targetColumn.dataset.id;
            this.order = targetColumn.dataset.order;

            this.update();
        }
    }

    constructor(headersConfig = [], {
        url = '',
        sorted = {
          id: headersConfig.find(item => item.sortable).id,
          order: 'asc'
        },
        start = 1,
        end = 30
      } = {}) {
    
        this.headersConfig = headersConfig;
        this.sorted = sorted;
        this.start = start;
        this.end = end;
        this.id = 'name';
        this.order = 'asc';
        this.url = new URL(url, BACKEND_URL);

        this.render();
        this.update();
        this.initEventListeners();
    }

    async loadData(id, order, start = this.start, end = this.end) {

        this.url.searchParams.set('_sort', id);
        this.url.searchParams.set('_order', order);
        this.url.searchParams.set('_start', start);
        this.url.searchParams.set('_end', end);

        this.element.classList.add('sortable-table_loading');

        const data = await fetchJson(this.url);
        this.element.classList.remove('sortable-table_loading');
        this.data = data;

        return data;
    }

    initEventListeners() {
        this.subElements.header.addEventListener('click',  this.onSort);
    }

    async update() {
        await this.loadData(this.id, this.order, this.start, this.end);
        console.log(this.data.length);
        /*if (this.data.length) {
            this.element.classList.remove('sortable-table_empty');
        } else {
            this.element.classList.add('sortable-table_empty');
            return; 
        }*/
        this.subElements.body.innerHTML = this.getTableRows(this.data);
    }

    resetOrder() {
       [...this.subElements.header.children].forEach((elem) => {
            elem.dataset.order = '';
       })
    }
  
    getTableHeader() {
      return `<div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}</div>`;
    }
  
    getHeaderRow({id, title, sortable}) {
      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
          <span>${title}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
        </div>
      `;
    }
  
  
    getTableBody(data) {
      return `
        <div data-element="body" class="sortable-table__body">
          ${this.getTableRows(data)}
        </div>`;
    }
  
    getTableRows(data) {
      return data.map(item => `
        <div class="sortable-table__row">
          ${this.getTableRow(item, data)}
        </div>`
      ).join('');
    }
  
    getTableRow(item) {
      const cells = this.headersConfig.map(({id, template}) => {
        return {
          id,
          template
        };
      });
      return cells.map(({id, template}) => {
        return template
          ? template(item[id])
          : `<div class="sortable-table__cell">${item[id]}</div>`;
      }).join('');
    }
  
    getTable(data) {
      return `
        <div class="sortable-table">
          ${this.getTableHeader()}
          ${this.getTableBody(data)}
        </div>`;
    }
  
    render() {
      const wrapper = document.createElement('div');
  
      wrapper.innerHTML = this.getTable(this.data);
  
      const element = wrapper.firstElementChild;
  
      this.element = element;
      this.subElements = this.getSubElements(element);
    }
  
    sort(field, order) {
      const sortedData = this.sortData(field, order);
      const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
      const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);
  
      allColumns.forEach(column => {
        column.dataset.order = '';
      });

      currentColumn.dataset.order = order;
  
      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  
    sortData(field, order) {
      const arr = [...this.data];
      const column = this.headersConfig.find(item => item.id === field);
      const {sortType, customSorting} = column;
      const direction = order === 'asc' ? 1 : -1;
  
      return arr.sort((a, b) => {
        switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], 'ru');
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[field] - b[field]);
        }
      });
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
  
  
