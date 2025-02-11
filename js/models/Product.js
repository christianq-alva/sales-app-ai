function Product(name, price, stock) {
    this.name = name;
    this.price = price;
    this.stock = stock;
}

const products = [];

Product.prototype.addProduct = function() {
    products.push(this);
};

Product.getAllProducts = function() {
    return products;
};