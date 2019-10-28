import Vue from 'vue';

function getWrap() {
    let wrap: HTMLElement = document.createElement('div');
    wrap.style.position = 'fixed';
    wrap.style.zIndex = '99999';
    wrap.id = 'st-drag-wrap'

    document.body.appendChild(wrap);

    return wrap;
}

function removeElement(el: HTMLElement) {
    const parent = el.parentNode;
    if (parent) {
        parent.removeChild(el);
    }
    return null;
}


Vue.directive('stdrag', (el, { value }) => {
    if (!value) return;
    
    const component: any = value.component;
    const offset: any = value.offset;

    if (component) {
        el.onmousedown = (e) => {
            let wrap: any = getWrap();
            let offsetX: number = 0;
            let offsetY: number = 0;

            wrap.appendChild(component.$el);

            if (offset) {
                const rect: any = wrap.getBoundingClientRect();
                if (offset.x == 'center') {
                    offsetX = rect.width / 2;
                } else if (offset.x == 'left') {
                    offsetX = 0;
                } else if (offset.x == 'right') {
                    offsetX = rect.width;
                } else {
                    offsetX = parseInt(offset.x, 10) || 0;
                }

                if (offset.y == 'center') {
                    offsetY = rect.height / 2;
                } else if (offset.y == 'top') {
                    offsetY = 0;
                } else if (offset.y == 'bottom') {
                    offsetY = rect.height;
                } else {
                    offsetY = parseInt(offset.y, 10) || 0;
                }
            }

            document.onmousemove = (e) => {
                wrap.style.left = e.clientX - offsetX + 'px';
                wrap.style.top = e.clientY - offsetY + 'px';
            }

            document.onmouseup = (e) => {
                wrap = removeElement(wrap);
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    }
})
