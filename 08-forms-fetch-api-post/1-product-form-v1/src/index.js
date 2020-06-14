//import SortableList from '../../../09-tests-routes-browser-history-api/2-sortable-list/solution/index.js';
import escapeHtml from './utils/escape-html.js';
import ImageUploader from './utils/image-uploader/index.js';
import fetchJson from './utils/fetch-json.js';


const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';


export default class ProductForm {
    element;
    subElements = {};
    headersConfig = [];
    data = [];

    makeRequest = async (event) => {
        event.preventDefault();

        if (this.productId) {
            const formData = new FormData(this.subElements.productForm);
            formData.append('id', this.productId);
            const response = await fetchJson(this.url, {
                method: 'PATCH',
                headers: {'Content-type': 'application/json'},
                body: formData
            });
            const result = await response.json();
            this.element.dispatchEvent(new CustomEvent('product-updated', {
                detail: { result }, 
                bubbles: true 
            }));
        } else {
            const response = await fetchJson(this.url, {
                method: 'PUT',
                body: new FormData(this.subElements.ProductForm)
            });
            const result = await response.json();
            this.element.dispatchEvent(new CustomEvent('product-saved', {
                detail: { result }, 
                bubbles: true 
            }));
        }
    }
  
    onUpload = async (event) => {
      let uploader = new ImageUploader();
  
      let result;
  
      try {
        result = await uploader.upload(event.target.files[0]);
        alert('Изображение загружено');
      } catch(err) {
        alert('Ошибка загрузки изображения');
        console.error(err);
      } 

      this.productData.images.push({
        url: result.data.link,
        name: event.target.files[0].name
      });

      this.subElements.sortableListContainer.children[1].innerHTML = `${this.getImages()}`;
      console.log(this.subElements);
    }

    onDelete = (event) => {
        console.log(this.productData.images);
        if (event.target.closest('.sortable-list__item')) {
            event.target.closest('.sortable-list__item').remove();
            const newImages = this.productData.images.filter((item) => {
                return item.name !== event.target.parentElement.previousElementSibling.lastElementChild.textContent.trim();
            });
            this.productData.images = newImages;
        }
        console.log(this.productData.images);
    }

    constructor(productData, productId) {
    
        this.productData = productData;
        this.productId = productId;
        this.url = new URL('/api/rest/products', BACKEND_URL);

        this.render();
    }

    getTemplate() {
        return `
            <div class="product-form">
                <form data-element="productForm" class="form-grid">
                <div class="form-group form-group__half_left">
                    <fieldset>
                    <label class="form-label">Название товара</label>
                    <input required="" type="text" name="title" class="form-control" placeholder="Название товара" value="${this.productData.title}">
                    </fieldset>
                </div>
                <div class="form-group form-group__wide">
                    <label class="form-label">Описание</label>
                    <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${this.productData.description}</textarea>
                </div>
                <div class="form-group form-group__wide" data-element="sortableListContainer">
                <label class="form-label">Фото</label>
                <div data-element="imageListContainer">
                <ul class="sortable-list">
                    ${this.getImages()}
                </ul>
                </div>
                <input type="file" name="uploadImage" class="button-primary-outline" data-element="productUpload"><span>Загрузить</span></input>
                </div>
                <div class="form-group form-group__half_left">
                    <label class="form-label">Категория</label>
                    <select class="form-control" name="subcategory">
                        ${this.getCategories()}
                    </select>
                </div>
                <div class="form-group form-group__half_left form-group__two-col">
                    <fieldset>
                    <label class="form-label">Цена ($)</label>
                    <input required="" type="number" name="price" class="form-control" placeholder="100" value="${this.productData.price}">
                    </fieldset>
                    <fieldset>
                    <label class="form-label">Скидка ($)</label>
                    <input required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.productData.discount}">
                    </fieldset>
                </div>
                <div class="form-group form-group__part-half">
                    <label class="form-label">Количество</label>
                    <input required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.productData.quantity}">
                </div>
                <div class="form-group form-group__part-half">
                    <label class="form-label">Статус</label>
                    <select class="form-control" name="status">
                    <option value="1">Активен</option>
                    <option value="0">Неактивен</option>
                    </select>
                </div>
                <div class="form-buttons">
                    <button type="submit" name="save" class="button-primary-outline" data-element="productSubmit">
                    ${this.getSubmitButton()}
                    </button>
                </div>
                </form>
            </div>
        `;
    }

    getSubmitButton() {
        return this.productId ? 'Сохранить товар' : 'Добавить товар';
    }

    getCategories() {
        return this.productData.categories.map((item) => {
            return `<option value="${item.value}">${item.text}</option>`;
        })
        .join('');
    }

    getImage(image) {
        return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="${image.url}">
            <input type="hidden" name="source" value="${image.name}">
            <span>
            <img src="icon-grab.svg" data-grab-handle alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
            <span>${image.name}</span>
            </span>
            <button type="button">
            <img src="icon-trash.svg" data-delete-handle alt="delete">
            </button>
        </li>
        `;
    }

    getImages() {
        return `                    
            ${this.productData.images.map((item) => {
                return this.getImage(item);
            })
            .join('')}
        `;
    }

    render() {
        const wrapper = document.createElement('div');
    
        wrapper.innerHTML = this.getTemplate();
    
        const element = wrapper.firstElementChild;
    
        this.element = element;
        this.subElements = this.getSubElements(element);

        this.subElements.productForm.addEventListener('submit', this.makeRequest);
        this.subElements.productUpload.addEventListener('change', this.onUpload);
        this.subElements.sortableListContainer.addEventListener('click', this.onDelete);
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
