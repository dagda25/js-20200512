export default class SortableTable {
    constructor(header, { data }) {
        this.header = header;
        this.data = data;
        this.subElements = {};
        this.subElements.body = document.createElement('div');
        this.subElements.header = document.createElement('div');
        this.getSubElements();
        this.render(this.data);

    }

    getTableHeader(header) {
        return header
        .map(item => {
            return `
            <div class="sortable-table__cell" data-name=${item.id} data-sortable=${item.sortable} data-order=${this.sortStatus.value === item.id ? this.sortStatus.order : ""}>
                <span>${item.title}</span>
                <span class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>
            </div>
            `;
        })
        .join('');

    }

    getTableBody(header, data) {
        return data
        .map(item => {
            let row = header.map((column) => {
                if(column.template) {
                    return column.template(item[column.id]);
                }
                
                return `<div class="sortable-table__cell">${item[column.id]}</div>`;
            })
            .join('');
            return `
            <a href="/products/${item.id}" class="sortable-table__row">${row}</a>
            `;
        })
        .join('');
    }

    getTemplate(header, data) {
        return `
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getTableHeader(header)}
            </div>
            <div data-element="body" class="sortable-table__body">
            ${this.getTableBody(header, data)}
            </div>
        </div>
        `;

    }

    getSubElements() {
        this.subElements.body.innerHTML = this.getTableBody(this.header, this.data);
        this.subElements.header.innerHTML = this.getTableHeader(this.header);
    }

    render(data) {
        const element = document.createElement('div');

        element.innerHTML = this.getTemplate(this.header, data);
    
        this.element = element.firstElementChild;
    }

    sort(fieldValue, orderValue) {

        let sortedData = this.data;
        let sortType = 'string';
        for (let column of this.header) {
            if (column.id === fieldValue) {
                sortType = column.sortType;
                break;
            }
        }

        if(sortType === 'string') {
            sortStrings(sortedData, orderValue);
        } else {
            sortNumbers(sortedData, orderValue);
        }

        this.sortStatus = {value: fieldValue, order: orderValue};

        this.remove();
        this.render(sortedData);
        this.getSubElements();
        this.show(this.root);

        function sortStrings(arr, param = 'asc') {
            return arr.sort((a, b) => {
                if (param === 'asc') {
                    return a[fieldValue].localeCompare(b[fieldValue], 'default', { caseFirst: 'upper' });
                } else if (param === 'desc') {
                    return -(a[fieldValue].localeCompare(b[fieldValue], 'default', { caseFirst: 'upper' }));   
                }
            });
        }

        function sortNumbers(arr, param = 'asc') {
            const factor = param === 'asc' ? 1 : -1;
            arr.sort((first, second) => {
                if (first[fieldValue] > second[fieldValue]) return factor;
                if (first[fieldValue] === second[fieldValue]) return 0;
                if (first[fieldValue] < second[fieldValue]) return -factor;
            });
        }
        
    }

    show(parent) {
        parent ? parent.append(this.element) : document.body.append(this.element);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

    root = document.getElementById('root');
    sortStatus = {value: "", order: ""};
}
