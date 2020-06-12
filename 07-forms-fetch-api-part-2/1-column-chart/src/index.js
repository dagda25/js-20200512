import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;
  domain = 'https://course-js.javascript.ru/';

  constructor({
        url = 'api/dashboard/sales',
        range = {
          from: new Date('2020-04-06'),
          to: new Date('2020-05-06')
        },
        label = 'sales',
        formatHeading = data => data,
        link = ''
      } = {}) {
    this.url = url;
    this.label = label;
    this.range = range;
    this.link = link;
    this.data = null;
    this.range = range;
    this.formatHeading = formatHeading;

    this.render();
    this.update(this.range.from, this.range.to);
  }

  async getData(url) {
    const route = new URL(this.url, this.domain);//`${url}${this.range.from}${this.range.to}`;
    route.searchParams.set('from', this.range.from);
    route.searchParams.set('to', this.range.to);
    const result = await fetchJson(route);
    this.data = result;
    return result;
  }

  getColumnBody() {
    if (this.data) {
      const dataValues = Object.values(this.data);
      const maxValue = Math.max(...dataValues);

      return dataValues
      .map(item => {
        const scale = this.chartHeight / maxValue;
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
    }
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.getTotalValue()}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody()}
          </div>
        </div>
      </div>
    `;
  }

  getTotalValue() {
    if (this.data) {
      return this.formatHeading(Object.values(this.data).reduce((sum, current) => sum + current, 0));
    }
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async update(from, to) {
    this.range.from = from;
    this.range.to = to;
    await this.getData(this.url);
    this.element.classList.remove('column-chart_loading');
    this.subElements.header.textContent = this.getTotalValue();
    this.subElements.body.innerHTML = this.getColumnBody();
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}

