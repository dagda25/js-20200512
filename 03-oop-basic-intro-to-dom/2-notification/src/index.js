export default class NotificationMessage {
    element; 

    constructor(message, options) {
        this.message = message;
        this.options = options;

        this.render();
    }
  
    get template() {
        return `
            <div class="notification ${this.options.type}" style="--value:20s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                <div class="notification-header">${this.options.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
                </div>
            </div>
        `;
    }
  
    render() {
      const element = document.createElement('div');

      element.innerHTML = this.template;
  
      this.element = element.firstElementChild;
    }

    show() {
      const body = document.querySelector('body');
      const notification = body.querySelector('.notification');

      if (notification) {
          notification.remove();
      }

      body.append(this.element);

      if (this.options.duration){
        const context = this;
        setTimeout(() => context.remove(), this.options.duration);
      }
    }
  
    remove() {
      this.element.remove();
    }
  
}
