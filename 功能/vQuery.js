//绑定
function bind(el, ev, fn) {
    if (el.addEventListener) {
        var This = this;
        el.addEventListener(ev, function (ev) { 
            if (fn.apply(el) == false) {
                ev.preventDefault();
                ev.cancelBubble = true;
          }
        },false);
    } else {
        el.attachEvent('on' + ev, function (ev) {
            if (fn.apply(el) == false) {
                ev.cancelBubble = true;
                return false;
            }
        });
    }
};
//获取类
function getByClass(oParent, sClass) {
    var arr = [];
    var elems = oParent.getElementsByTagName("*");
    for (var i = 0; i < elems.length; i++){
        if (elems[i].className === sClass) {
            arr.push(elems[i]);
        }
    }
    return arr;
};
//类数组转换成数组
function toArray(el) {
    var arr = [];
    for (var i = 0; i < el.length; i++){
        arr.push(el[i]);
    }
    return arr;
};
//获取计算后的样式
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj,false)[attr];
    }
};
function vQuery(vArg) {
    this.elements = [];
    switch (typeof vArg) {
        case 'function':
             bind(window, 'load', vArg);
            break;
        case 'string':
            switch (vArg.charAt(0)) {
                case '#':
                    this.elements.push(this.el = document.getElementById(vArg.substring(1)));
                    break;
                case '.':
                    this.elements = getByClass(document, vArg.substring(1));
                    break;
                default:
                    this.elements = toArray(document.getElementsByTagName(vArg));
                    break;
            }
            break;
        case 'object':
            if (vArg.constructor == Array) {
                this.elements = vArg;
            } else {
                this.elements.push(vArg);
            } 
            break;
    }
};

function $(vArg) {
    return new vQuery(vArg);
};
vQuery.prototype.html = function (str) {
    if (!str) {
        return this.elements[0].innerHTML;
    } else {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].innerHTML = str;
        }
    }
    return this;
};
vQuery.prototype.click = function (fn) {
    // for (var i = 0; i < this.elements.length; i++){
    //     bind(this.elements[i],'click',fn)
    // }
    this.on('click', fn);
     return this;
};
vQuery.prototype.mousemove = function (fn) {
    // for (var i = 0; i < this.elements.length; i++){
    //     bind(this.elements[i],'mousemove',fn)
    // }
    this.on('mousemove', fn);
     return this;
};
vQuery.prototype.on = function (ev, fn) {
    for (var i = 0; i < this.elements.length; i++) {
        bind(this.elements[i], ev, fn);
    }
     return this;
};
vQuery.prototype.hide = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none'
    }
     return this;
};
vQuery.prototype.show = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block'
    }
     return this;
};
vQuery.prototype.hover = function (overFn, outFn) {
   
        this.on('mousemove', overFn);
        this.on('mouseout', outFn);
    
     return this;
};
vQuery.prototype.css = function (attr, value) {
    if (arguments.length === 2) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style[attr] = value;
        }
    } else if (arguments.length === 1) {
        if (typeof attr === 'object') {
            for (var key in attr) {
                for (var i = 0; i < this.elements.length; i++) {
                    this.elements[i].style[key] = attr[key];
                }
            }
        } else {
             return getStyle(this.elements[0], attr);
        }
    }
     //return this;
};
vQuery.prototype.attr = function (attr, value) {
    if (arguments.length === 2) {
        for (var i = 0; i < this.elements.length; i++) {
            //this.elements[i][attr] = value;
            this.elements[i].setAttribute(attr, value);
        }
    } else if (arguments.length === 1) {
        return this.elements[0].getAttribute(attr);
    }
     return this;
};
vQuery.prototype.eq = function (num) {
    return $(this.elements[num]);
};
vQuery.prototype.index = function () {
    var elems = this.elements[0].parentNode.children;
    for (var i = 0; i < elems.length; i++) {
        if (elems[i] == this.elements[0]) {
            return i;
        }
    }
    return this;
};
vQuery.prototype.find = function (el) {
    var arr = [];
    if (el.charAt(0) === '.') {
        for (var i = 0; i < this.elements.length; i++){
            arr = arr.concat(getByClass(this.elements[i],el.substring(1)))
        }
    } else {
        for (var i = 0; i < this.elements.length; i++) {
            arr = arr.concat(toArray(this.elements[i].getElementsByTagName(el)));
        }    
    }
    return $(arr);
};
$.extend = function (json) {
    for (var key in json) {
        $[key] = json[key];
    }
    return this;
};
$.fn = {};
$.fn.extend = function (json) {
    for (var key in json) {
        vQuery.prototype[key] = json[key]
    }
    
};
$.trim = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
};
$.leftTrim = function (str) {
    return str.replace(/^\s+/g, '');
};
$.rightTrim = function (str) {
    return str.replace(/\s+$/g, '');
}