
class WebComponentExtends extends HTMLElement {
	constructor() {
		super();
		this.$root = document;
		this.$root.$on = this.$on;
		this.$root.$emit = this.$emit;
	}
	$emit(name, data){
		this.dispatchEvent(new CustomEvent(name, { detail: data }));
	}
	$on(name, fx){
		this.addEventListener(name, e => fx(e.detail, e))
	}
	createElement(tagName, props = {}, attrs = {}, on = {}){
		let element = document.createElement(tagName);
		Object.keys(props).forEach(prop => element[prop] = props[prop])
		Object.keys(attrs).forEach(attr => element.setAttribute(attr, attrs[attr]))
		Object.keys(on).forEach(eventName => element.addEventListener(eventName, event => {
			on[eventName](event, element)
		}))
		return element;
	}
}

class BtnWithCount extends WebComponentExtends {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.count = 0;
	}
	connectedCallback() {
		
		let btn = this.createElement('button', 
			{
				innerText:'Кнопка'
			}, 
			{
				type:'button'
			},
			{
				click: (event, element) => {
					element.innerText = 'Кнопка '+ this.count;
					this.count++;
					this.$root.$emit('counter::update', element.innerText)
					console.log(event)
				},
				focus:console.log,
				blur:console.log,
			}
		);	
		this.shadowRoot.append(btn);
	}
}

class InformerListener extends WebComponentExtends {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.$el = this.createElement('div', {innerHTML:'Пусто'});
		this.$root.$on('counter::update', data => {
			this.$el.innerHTML = data;
		})
		this.shadowRoot.append(this.$el);
	}
}

window.customElements.define("button-count", BtnWithCount);
window.customElements.define("informer-listener", InformerListener);



