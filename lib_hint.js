class lib_hint {
    constructor() {

        this.Form = new lib_hint_form();
        this.Message = new lib_hint_message();
        this.Components = new lib_hint_component();
    }

    start() {
        var icons = document.createElement('link');
        icons.rel = 'stylesheet';
        icons.href = 'https://use.fontawesome.com/releases/v5.6.1/css/all.css';
        icons.integrity = 'sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP';
        icons.crossOrigin = 'anonymous';
        document.head.appendChild(icons);

        var font = document.createElement('link');
        font.rel = 'stylesheet';
        font.href = 'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap';
        document.head.appendChild(font);

        var style = document.createElement('style');
        style.innerHTML = 'html, body, #root { height: 100%; width: 100%; overflow: hidden; margin: 0; padding: 0; position: absolute; display: flex; align-items: center; justify-content: center; }';
        document.head.appendChild(style);

        this.renderCmp({
            type: 'div',
            id: 'root',
            htype: 'root'
        }, document.body);
    }

    defineCmp(component) {
        var ok = false;
        for (var prop in component) {
            if (prop == 'htype')
                ok = true;
        }
        if (ok) {
            this.Components.saveToList(component);
        }
    }

    getDefined(htype) {
        var el = this.Components.getHType(htype);
        if (el) {
            return el;
        }
        else return null;
    }

    getCmp(htype) {
        return document.body.querySelector('[htype = "' + htype + '"]');
    }

    renderCmp(component, parent) {
        var element = document.createElement(component.type);
        for (var prop in component) {
            switch (prop) {
                case 'type':
                    break;
                case 'style': {
                    var styleList = '';
                    for (var style in component[prop]) {
                        var styleName = style;
                        for (var i = 0; i < styleName.length; i++) {
                            if (styleName[i].toUpperCase() === styleName[i])
                                styleName = styleName.replace(styleName[i], '-' + styleName[i].toLowerCase());
                        }
                        styleList += styleName + ': ' + component[prop][style] + '; ';
                        element.setAttribute(prop, styleList);
                    }
                    break;
                }
                case 'text': {
                    element.innerHTML = component[prop];
                    break;
                }
                case 'items': {
                    for (i = 0; i < component[prop].length; i++) {
                        this.renderCmp(component[prop][i], element);
                    }
                    break;
                }
                case 'className': {
                    element.setAttribute('class', component[prop]);
                    break;
                }
                default: {
                    element.setAttribute(prop, component[prop]);
                    break;
                }
            }
        }
        parent.appendChild(element);
        return element;
    }

    removeCmp(id) {
        if (id !== 'root') {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
        } else console.log('Error! Root element cannot be deleted!');
    }

    createHandler(func, props) {
        if (func.name)
            var name = func.name;
        else name = func;
        if (props) {
            for (var i = 0; i < props.length; i++) {
                props[i] = '"' + props[i] + '"';
            }
            return name + '(' + props.toString() + ')';
        } else return name + '()';
    }

    request(type, url, headers, body, handler) {
        $.ajax({
            type: type,
            async: true,
            url: url,
            headers: headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(body),
            success: handler(response)
        })
    }
}

class lib_hint_form {
    constructor() {
        this.amount = 0;
    }

    create(form) {
        var height = 150;
        var width = 150;

        var title = '';
        var headerColor = '#4A76A8';
        var headerTextColor = '#FFFFFF';

        var items = [];

        for (var prop in form) {
            switch (prop) {
                case 'height':
                    height = form[prop];
                    break;
                case 'width':
                    width = form[prop];
                    break;
                case 'title':
                    title = form[prop];
                    break;
                case 'headerColor':
                    headerColor = form[prop];
                    break;
                case 'headerTextColor':
                    headerTextColor = form[prop];
                    break;
                case 'items':
                    items = form[prop];
                    break;
            }
        }

        var id = 'form' + this.amount;
        var idForm = 'idForm' + this.amount;
        this.amount++;

        Hint.renderCmp({
            type: 'div',
            id: id,
            style: {
                height: '100%',
                width: '100%',
                background: 'rgba(0,0,0,0.9)',
                position: 'absolute',
                zIndex: 1000,
                top: 0,
                left: 0
            },
            items: [
                {
                    type: 'div',
                    id: idForm,
                    style: {
                        height: height + 'px',
                        width: width + 'px',
                        background: headerColor,
                        position: 'absolute',
                        top: 'calc(50% - ' + height / 2 + 'px)',
                        left: 'calc(50% - ' + width / 2 + 'px)',
                        padding: 0,
                        borderRadius: '3px'
                    },
                    items: [
                        {
                            type: 'div',
                            text: title,
                            style: {
                                height: '30px',
                                lineHeight: '30px',
                                width: 'calc(100% - 10px)',
                                padding: '0 0 0 10px',
                                background: headerColor,
                                cursor: 'pointer',
                                color: headerTextColor,
                                fontSize: '14px',
                                margin: 0,
                                fontFamily: '\'Ubuntu\', sans-serif',
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px',
                                float: 'left',
                            },
                            items: [{
                                type: 'div',
                                className: 'fa fa-times',
                                style: {
                                    float: 'right',
                                    paddingRight: '10px',
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    lineHeight: '30px',
                                    fontSize: '14px',
                                    color: headerTextColor
                                },
                                onmouseover: 'this.style.opacity = 1',
                                onmouseout: 'this.style.opacity = 0.8',
                                onclick: Hint.createHandler('Hint.removeCmp', [id])
                            }
                            ]
                        }, {
                            type: 'div',
                            style: {
                                height: 'calc(100% - 50px)',
                                width: 'calc(100% - 20px)',
                                padding: '10px',
                                margin: 0,
                                background: 'white',
                                borderBottomLeftRadius: '3px',
                                borderBottomRightRadius: '3px',
                                overflow: 'auto',
                                float: 'left'
                            },
                            items: items
                        }
                    ]
                }
            ]
        }, Hint.getCmp('root'));
        $('#' + idForm).draggable();
    }
}

class lib_hint_message {
    constructor() {
    }

    show(message) {
        var height = 150;
        var width = 150;

        var title = '';
        var headerColor = '#4A76A8';
        var headerTextColor = '#FFFFFF';
        var type = '<div class="far fa-dot-circle"></div>';
        var text = '';

        for (var prop in message) {
            switch (prop) {
                case 'type':
                    switch (message[prop]) {
                        case 'info': {
                            type = '<div class="fas fa-info-circle"></div>';
                            break;
                        }
                        case 'question': {
                            type = '<div class="fas fa-question-circle"></div>';
                            break;
                        }
                        case 'error': {
                            type = '<div class="fas fa-exclamation-circle"></div>';
                            break;
                        }
                        default: {
                            type = '<div class="far fa-dot-circle"></div>';
                            break;
                        }
                    }
                    break;
                case 'height':
                    height = message[prop];
                    break;
                case 'width':
                    width = message[prop];
                    break;
                case 'title':
                    title = '<span style="margin: 0 0 0 10px;">' + message[prop] + '</span>';
                    break;
                case 'headerColor':
                    headerColor = message[prop];
                    break;
                case 'headerTextColor':
                    headerTextColor = message[prop];
                    break;
                case 'text':
                    text = message[prop];
                    break;
            }
        }

        Hint.Form.create({
            height: height,
            width: width,
            title: type + title,
            headerColor: headerColor,
            headerTextColor: headerTextColor,
            items: [
                {
                    type: 'div',
                    text: text,
                    style: {
                        color: 'rgb(15,15,15)',
                        fontSize: '14px',
                        fontFamily: '\'Ubuntu\', sans-serif',
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        overflow: 'auto'
                    }
                }
            ]
        })
    }
}

class lib_hint_component {

    constructor() {
        this.list = [{
            type: 'div',
            id: 'root',
            htype: 'root'
        }];
    }

    saveToList(component) {
        this.list.push(component);
    }

    getHType(htype) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].htype == htype)
                return this.list[i];
        }
        return null;
    }

}

const Hint = new lib_hint();
