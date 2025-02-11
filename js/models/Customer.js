function Customer(name, email) {
    this.name = name;
    this.email = email;
}

const customers = [];

Customer.prototype.addCustomer = function() {
    customers.push(this);
};

Customer.getAllCustomers = function() {
    return customers;
};