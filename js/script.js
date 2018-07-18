function Position(x,y){
    this.x = x;
    this.y = y;
}
var DandD = {
    init:function(){
        this.showcase = document.querySelector('.showcase');
        this.basketMenu = document.querySelector('.basket_menu');
        this.basis = document.querySelector('.basis');
        this.basket = document.querySelector('.basket');
        this.basketCase = document.querySelector('.basket_case');
        this.totalCost = document.querySelector('.total');
        this.allProducts = document.querySelectorAll('.product');
        this.products = Array.prototype.slice.call(this.allProducts);
        this.lastProduct = null;
        this.cost = 0;
        this.amount = 1;
        this.leadmode = false;
        this.leadelem = null;
        this.events();
    },
    events:function(){
        this.showcase.addEventListener('mousedown',function(e){
            if(e.target.classList.contains('product') && parseInt(e.target.getAttribute('data-amount'))>0 ) this.choice(e.target,new Position(e.clientX,e.clientY));
        }.bind(this));
        this.basis.addEventListener('mousemove',function(e){
            this.lead(new Position(e.clientX,e.clientY));
        }.bind(this));
        this.basis.addEventListener('mouseup',function(e){
            this.release(new Position(e.clientX,e.clientY));
        }.bind(this));
        this.basket.addEventListener('click',function(){
            this.basketCase.classList.toggle('active');
            if(this.basketCase.classList.contains('active')){
                this.basketCase.style.display = 'block'
            }else{this.basketCase.style.display = ''}
        }.bind(this))
    },
    choice:function(elem,position){
        this.leadmode = true;
        this.lastProduct = elem;
        this.leadelem = elem.cloneNode(true);
        this.leadelem.style.position = 'fixed';
        this.leadelem.style.transform = 'scale(0.5)';
        this.leadelem.style.zIndex = 666;
        this.showcase.appendChild(this.leadelem);
        this.setPosition(position);
    },
    setPosition:function(position){
        this.leadelem.style.left = position.x-this.leadelem.offsetWidth/2+'px';
        this.leadelem.style.top = position.y-this.leadelem.offsetHeight/2+'px';
    },
    release:function(position){
        if(this.leadelem!==null){
            var stock = this.leadelem.classList;
            var inStock = this.basketMenu.querySelectorAll('.'+stock[1]+'');
            var basket = this.basket.getBoundingClientRect();
            var basketMenu = this.basketMenu.getBoundingClientRect();
            if(inStock.length==0){
                if((position.x>=basket.left && position.x<=(basket.left+basket.width) && position.y>=basket.top && position.y<=(basket.top+basket.height)) || (position.x>=basketMenu.left && position.x<=(basketMenu.left+basketMenu.width) && position.y>=basketMenu.top && position.y<=(basketMenu.top+basketMenu.height)) ){
                    var rest = parseInt(this.lastProduct.getAttribute('data-amount')-1);
                    this.lastProduct.setAttribute('data-amount',rest);
                    this.lastProduct.children[1].innerHTML = parseInt(rest);
                    this.cost+=parseInt(this.leadelem.getAttribute('data-cost'));
                    var newElem = this.leadelem.cloneNode(true);
                    newElem.setAttribute('data-amount',this.amount)
                    newElem.style.position = '';
                    newElem.style.top = '';
                    newElem.style.left = '';
                    newElem.style.zIndex = '';
                    newElem.style.transform = '';
                    newElem.children[1].innerHTML = this.amount;
                    newElem.addEventListener('click',function(){
                        this.cost-=parseInt(newElem.getAttribute('data-cost')*newElem.getAttribute('data-amount'));
                        this.totalCost.innerHTML = this.cost;
                        this.setAmount(newElem);
                        newElem.remove();
                    }.bind(this));
                    
                    this.leadelem.remove();
                    this.leadmode = false;
                    this.leadelem = null;
                    this.basketMenu.appendChild(newElem);
                    this.totalCost.innerHTML = this.cost;
                }else{
                    this.leadelem.remove();
                };                
            }else{
                if((position.x>=basket.left && position.x<=(basket.left+basket.width) && position.y>=basket.top && position.y<=(basket.top+basket.height)) || (position.x>=basketMenu.left && position.x<=(basketMenu.left+basketMenu.width) && position.y>=basketMenu.top && position.y<=(basketMenu.top+basketMenu.height)) ){
                    var rest = parseInt(this.lastProduct.getAttribute('data-amount')-1);
                    this.lastProduct.setAttribute('data-amount',rest);
                    this.lastProduct.children[1].innerHTML = parseInt(rest);
                    var lastAmount = parseInt(inStock[0].children[1].innerHTML);
                    inStock[0].children[1].innerHTML = lastAmount+1;
                    this.cost+=parseInt(inStock[0].getAttribute('data-cost'));
                    this.totalCost.innerHTML = this.cost;
                    inStock[0].setAttribute('data-amount',parseInt(inStock[0].getAttribute('data-amount'))+1)
                    this.leadelem.remove();
                    this.leadmode = false;
                    this.leadelem = null
                }else{
                    this.leadelem.remove();
                };
            }
        };
    },
    lead:function(position){
        if(this.leadmode) this.setPosition(position);
    },
    setAmount:function(elem){
        var currentClass = elem.classList[1];
        var currentProduct = this.products.filter(function(elem){
            return elem.classList.contains(''+currentClass+'');
        });
        var summ = parseInt(currentProduct[0].getAttribute('data-amount'))+parseInt(elem.getAttribute('data-amount'));
        currentProduct[0].setAttribute('data-amount',summ);
        currentProduct[0].children[1].innerHTML = summ;
    }
}
DandD.init();