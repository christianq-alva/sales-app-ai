function Sale(product, customer, quantity) {
    this.product = product;
    this.customer = customer;
    this.quantity = quantity;
    this.total = product.price * quantity;
}

const sales = [];

Sale.prototype.addSale = function() {
    sales.push(this);
};

Sale.getAllSales = function() {
    return sales;
};