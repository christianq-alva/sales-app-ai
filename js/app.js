document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productTableBody = document.getElementById('productTableBody');
    const clientForm = document.getElementById('clientForm');
    const clientTableBody = document.getElementById('clientTableBody');
    const saleForm = document.getElementById('saleForm');
    const saleTableBody = document.getElementById('saleTableBody');

    // Load sale options when sales tab is activated
    document.getElementById('ventas-tab').addEventListener('click', () => {
        loadSaleFormOptions();
    });

    // Registrar productos
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productStock = document.getElementById('productStock').value;

        const newProduct = new Product(productName, productPrice, productStock);
        newProduct.addProduct();

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${newProduct.name}</td>
            <td>${newProduct.price}</td>
            <td>${newProduct.stock}</td>
            <td>
                <button class="btn btn-sm btn-warning update-stock">Actualizar Stock</button>
            </td>
        `;

        productTableBody.appendChild(newRow);

        // Limpiar el formulario
        productForm.reset();

        // Actualizar opciones en el formulario de ventas
        loadSaleFormOptions();
    });

    productTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('update-stock')) {
            const row = event.target.closest('tr');
            const stockCell = row.children[2];
            const newStock = prompt('Ingrese el nuevo stock:', stockCell.textContent);
            if (newStock !== null) {
                stockCell.textContent = newStock;
            }
        }
    });

    // Registrar clientes
    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const clientName = document.getElementById('clientName').value;
        const clientEmail = document.getElementById('clientEmail').value;

        const newCustomer = new Customer(clientName, clientEmail);
        newCustomer.addCustomer();

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${newCustomer.name}</td>
            <td>${newCustomer.email}</td>
            <td>
                <button class="btn btn-sm btn-warning update-email">Actualizar Email</button>
            </td>
        `;

        clientTableBody.appendChild(newRow);

        // Limpiar el formulario
        clientForm.reset();

        // Actualizar opciones en el formulario de ventas
        loadSaleFormOptions();
    });

    clientTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('update-email')) {
            const row = event.target.closest('tr');
            const emailCell = row.children[1];
            const newEmail = prompt('Ingrese el nuevo email:', emailCell.textContent);
            if (newEmail !== null) {
                emailCell.textContent = newEmail;
            }
        }
    });

    // Registrar ventas
    saleForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const productId = document.getElementById('saleProduct').value;
        const customerId = document.getElementById('saleCustomer').value;
        const saleQuantity = document.getElementById('saleQuantity').value;

        const product = Product.getAllProducts()[productId];
        const customer = Customer.getAllCustomers()[customerId];

        // Check if there's enough stock
        if (parseInt(saleQuantity) > parseInt(product.stock)) {
            alert('No hay suficiente stock disponible');
            return;
        }

        const newSale = new Sale(product, customer, saleQuantity);
        newSale.addSale();

        // Update product stock
        product.stock = parseInt(product.stock) - parseInt(saleQuantity);
        const productRow = productTableBody.children[productId];
        if (productRow) {
            productRow.children[2].textContent = product.stock;
        }

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${newSale.product.name}</td>
            <td>${newSale.customer.name}</td>
            <td>${newSale.quantity}</td>
            <td>${newSale.total}</td>
        `;

        saleTableBody.appendChild(newRow);

        // Limpiar el formulario
        saleForm.reset();
    });

    // Cargar productos y clientes en el formulario de ventas
    function loadSaleFormOptions() {
        const saleProductSelect = document.getElementById('saleProduct');
        const saleCustomerSelect = document.getElementById('saleCustomer');

        saleProductSelect.innerHTML = '';
        saleCustomerSelect.innerHTML = '';

        Product.getAllProducts().forEach((product, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = product.name;
            saleProductSelect.appendChild(option);
        });

        Customer.getAllCustomers().forEach((customer, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = customer.name;
            saleCustomerSelect.appendChild(option);
        });
    }

    // Llamar a la función para cargar las opciones al cargar la página
    loadSaleFormOptions();
});

// Search functionality
function searchTable(tableId, query) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.forEach(row => {
        const text = Array.from(row.cells)
            .map(cell => cell.textContent.toLowerCase())
            .join(' ');
        const isMatch = text.includes(query.toLowerCase());
        row.style.display = isMatch ? '' : 'none';
    });
}

// Sort functionality
function sortTable(tableId, column, direction) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
        const aValue = a.querySelector(`td[data-${column}]`).dataset[column];
        const bValue = b.querySelector(`td[data-${column}]`).dataset[column];

        if (column === 'price' || column === 'stock') {
            return direction === 'asc' 
                ? parseFloat(aValue) - parseFloat(bValue)
                : parseFloat(bValue) - parseFloat(aValue);
        }

        return direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });

    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
}

// Event Listeners
document.querySelectorAll('input[data-table]').forEach(input => {
    input.addEventListener('input', (e) => {
        const tableId = e.target.dataset.table + 'Table';
        searchTable(tableId, e.target.value);
    });
});

document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', (e) => {
        const column = e.target.dataset.sort;
        const currentDir = e.target.classList.contains('sort-asc') ? 'desc' : 'asc';

        document.querySelectorAll('th').forEach(el => 
            el.classList.remove('sort-asc', 'sort-desc')
        );
        e.target.classList.add(`sort-${currentDir}`);

        const tableId = e.target.closest('table').id;
        sortTable(tableId, column, currentDir);
    });
});