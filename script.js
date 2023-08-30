const homeSection = document.getElementById('home-section')
const cartSection = document.getElementById('cart-section')
const productsContainer = document.getElementById('products-container')
const cartContainer = document.getElementById('cart-container')
const totalItems = document.getElementById('total-items')
const cartLength = document.getElementById('cart-length')
const totalPrice = document.getElementById('total-price')
const menuIcon = document.getElementById('menu-icon')
var notyf = new Notyf()

const cart = JSON.parse(localStorage.getItem('cart')) || []

function updateLs(){
    localStorage.setItem('cart',JSON.stringify(cart))
    fetchCart() 
}

function displayHome(){
    homeSection.style.display="block"
    cartSection.style.display="none"
}

function displayCart(){
    homeSection.style.display="none"
    cartSection.style.display="block"
}


async function fetchProducts(){
    const res = await fetch("http://fakestoreapi.com/products")
    const products = await res.json()
    displayProducts(products)

}

function displayProducts(products){
    products.forEach((product)=>{
        let productBox = document.createElement('div')
        productBox.classList.add('card','shadow')
        productBox.innerHTML = `
        
        <img src=${product.image} alt="product" class="card-img-top">
        <button class="btn btn-dark">ADD TO CART</button>
        
        ` 
        productsContainer.appendChild(productBox)

        productBox.querySelector('.btn').addEventListener('click',()=>{
            addToCart(product)
        })
    })

}

function addToCart(product){
    const index = cart.findIndex(item=>item.id===product.id)

    if(index>-1){
        cart[index].quantity+=1
       notyf.success("Product already added")
        
    }else{  
        product.quantity=1;
        cart.push(product)
        notyf.success("Product is added to cart")

    }
     updateLs()
    
}

function fetchCart(){
    totalItems.innerHTML = cart.length
    cartLength.innerHTML = cart.length

    calculateTotalPrice()
   
    if(cart.length==0){
        cartContainer.innerHTML = `<h5 class="text-center">Cart is empty!!</h5>`
        return
    }
   

    cartContainer.innerHTML=""
    cart.forEach((item,index)=>{
        let cartBox = document.createElement('div')
        cartBox.classList.add('row','rounded','bg-light')
        cartBox.innerHTML = `
        <div class="col-lg-3"><img src=${item.image} alt="product" class="img-fluid"></div>
                <div class="col-lg-3">$ ${(item.price * item.quantity).toFixed(2)}</div>
                <div class="col-lg-3 gap-2">
                <button class="btn border decrement">-</button>
                <button class="btn border">${item.quantity}</button>
                <button class="btn border increment">+</button>
                </div>
                <div class="col-lg-3"><button class="btn btn-danger"><i class="fa fa-trash"></i></button></div>
        
        ` 
        cartContainer.appendChild(cartBox)

        cartBox.querySelector('.btn-danger').addEventListener('click',()=>{
            removeProduct(index)
       })
        
       cartBox.querySelector('.increment').addEventListener('click',()=>{
            incrementQuantity(index)
       })
       cartBox.querySelector('.decrement').addEventListener('click',()=>{
        decrementQuantity(index)
   })
    })
   

}


function removeProduct(index){
    cart.splice(index,1)
    notyf.success('Product removed from cart')
    updateLs()

}

function incrementQuantity(index){
    cart[index].quantity+=1
    
    updateLs()
}
function decrementQuantity(index){
    if(cart[index].quantity>1){
        cart[index].quantity-=1
        updateLs()
    }
}
function calculateTotalPrice(){
    const tPrice = cart.reduce((total, item) => {
        return total + item.price * item.quantity; // Calculate the total price for each item
    }, 0); // Initialize the total with 0

    totalPrice.innerHTML = `$${tPrice.toFixed(2)}`; // Convert the total price to a string with 2 decimal places
}


fetchProducts()
fetchCart()

function toggleMenu(){
    if(menuIcon.classList.contains('fa-bars')){
        menuIcon.classList.replace('fa-bars','fa-xmark')
    }else{
        menuIcon.classList.replace('fa-xmark','fa-bars')
    }
}

// const obj = {
//     title:"iphone",
//     desc:"this is a new phone",
//     quantity:1
// }
// console.log({...obj,quantity:obj.quantity+1})
