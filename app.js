// Definir el módulo principal
var app = angular.module("burgerQueen", []);

// Definir controlador
app.controller('CafeteriaController', ($scope, $http) => {
    $scope.products = [];
    $scope.order = [];

    const API_URL = "https://localhost:7212/api/products";
    let isNPFVisible = false;

    // Mostrar formulario
    $scope.seeForm = () => {
        const screenNewProduct = document.getElementById("screenNewProduct");
        screenNewProduct.style.display = isNPFVisible ? "none" : "flex";
        isNPFVisible = !isNPFVisible;
        console.log(isNPFVisible);
    };


    // Cargar todos los productos desde la DB
    $scope.updateProducts = () => {
        $http.get(API_URL)
            .then(response => {
                $scope.products = response.data;
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error al cargar productos', error);
            });
    };

    // Añadir un nuevo producto
    $scope.newProduct = () => {
        const name = document.getElementById('newProductName').value;
        const price = document.getElementById('newProductPrice').value;
        const description = document.getElementById('newProductDescription').value;

        const newProduct = { name, price, description };

        $http.post(API_URL + "/single", newProduct)
            .then(response => {
                alert('Producto añadido');
                $scope.updateProducts();
            })
            .catch(error => {
                console.error('Error al añadir producto:', error);
            });
    };

    // Editar un producto seleccionado
    $scope.editProduct = () => {
        const product = $scope.products.find(p => p.selected);

        if (product) {
            product.name = prompt('Nuevo nombre:', product.name) || product.name;
            product.price = parseFloat(prompt('Nuevo precio:', product.price)) || product.price;

            $http.put(`${API_URL}/${product.id}`, product)
                .then(response => {
                    alert('Producto actualizado');
                    $scope.updateProducts();
                })
                .catch(error => {
                    console.error('Error al actualizar el producto:', error);
                });
        } else {
            alert('Selecciona un producto para editar.');
        }
    };

    // Eliminar un producto seleccionado
    $scope.removeProduct = () => {
        const product = $scope.products.find(p => p.selected);

        if (product) {
            $http.delete(`${API_URL}/${product.id}`)
                .then(response => {
                    alert('Producto eliminado');
                    $scope.updateProducts();
                })
                .catch(error => {
                    console.error('Error al eliminar un producto:', error);
                });
        } else {
            alert('Selecciona un producto para eliminar.');
        }
    };

    // Agregar productos al pedido
    $scope.addToOrder = () => {
        $scope.order = $scope.products.filter(p => p.selected);
    };

    $scope.updateProducts();

})