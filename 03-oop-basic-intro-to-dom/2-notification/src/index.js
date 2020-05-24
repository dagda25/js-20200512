export default class NotificationMessage {
    element; 

    constructor(message, { duration = 2000, type = 'success' } = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;

        this.render();
    }
  
    get template() {
        return `
            <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
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

    show(parent) {
      const body = document.querySelector('body');
      const notification = body.querySelector('.notification');

      if (notification) { 
          notification.remove();
      }

      if (parent) {
        parent.append(this.element);
      } else {
        body.append(this.element);
      }

      if (this.duration){
        const context = this;
        setTimeout(() => context.remove(), this.duration);
      }
    }
  
    remove() {
      this.element.remove();
    }

    destroy() {
      this.remove();
    }
  
}
