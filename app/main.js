// alert("Este boiler funciona");
window.onload = () => {
    // FUNCIÓN CARRITO
    let overlayProduct = document.getElementById("overlayProduct");
    let detailsImage = overlayProduct.querySelector("#details img");
    let cartIcon = document.querySelector(".cartIcon");
    let overlayCart = document.querySelector(".overlayCart");
    let closeCartIcon = document.querySelector(".headerCart .closeIcon");
    let addCartButtons = document.querySelectorAll(".addCart");
    let emptyCartSection = document.querySelector(".emptyCart");
    let fullCartSection = document.querySelector(".fullCart");

    let productQuantities = new Map();

    function openOverlayCart() {
        overlayCart.style.display = "block";
        updateTotalProducts();
    }

    function closeOverlayCart() {
        overlayCart.style.display = "none";
    }

    function closeOverlayProduct() {
        overlayProduct.style.display = "none";
    }

    function calculateProductSubtotal(productCart) {
        let price = parseFloat(productCart.dataset.price) || 0;
        let quantity = productQuantities.get(productCart.dataset.title) || 1;
    
        console.log(price * quantity);
        return price * quantity;
    }

    function calculateTotalSubtotal() {
        let products = document.querySelectorAll(".productCart");
        let totalSubtotal = 0;
    
        products.forEach((product) => {
            totalSubtotal += calculateProductSubtotal(product);
        });
    
        return totalSubtotal;
    }

    function updatePrices() {
    let totalPriceElement = document.querySelector(".totalPrice p");
    let subtotalPriceElement = document.querySelector(".priceSubtotal");
    let nrProductsElement = document.querySelector(".nrProducts p");

    let totalSubtotal = calculateTotalSubtotal();
    let totalProducts = calculateTotalProducts();

    if (nrProductsElement) {
        nrProductsElement.textContent = totalProducts.toString();

        if (totalProducts === 0) {
            nrProductsElement.parentElement.classList.add("hidden");
        } else {
            nrProductsElement.parentElement.classList.remove("hidden");
        }
    }

    if (totalSubtotal === 0) {
        emptyCartSection.style.display = "flex";
        fullCartSection.style.display = "none";
    } else {
        emptyCartSection.style.display = "none";
        fullCartSection.style.display = "flex";
    }

    if (totalPriceElement) {
        totalPriceElement.textContent = `Total: €${totalSubtotal.toFixed(2)}`;
    }

    if (subtotalPriceElement) {
        subtotalPriceElement.textContent = `€${totalSubtotal.toFixed(2)} EUR`;
    }
}

    function calculateTotalProducts() {
    let totalProducts = 0;

    document.querySelectorAll(".productCart").forEach((productCart) => {
        let quantityElement = productCart.querySelector(".masMenos .nr");
        let quantity = parseInt(quantityElement.textContent) || 0;
        totalProducts += quantity;
    });

    return totalProducts;
}

    function addToCart() {
        let detailsTitleElement = overlayProduct.querySelector(".titleProduct p");
        let detailsPriceElement = overlayProduct.querySelector(".price p");
        let detailsImageSrc = overlayProduct.querySelector("#details img").src;
    
        let detailsTitle = detailsTitleElement.textContent || "";
        let detailsPrice = parsePrice(detailsPriceElement.textContent);
    
        let existingProduct = document.querySelector(`.productCart[data-title="${detailsTitle}"]`);
    
        if (existingProduct) {
            updateProductQuantity(detailsTitle, "add");
        } else {
            let productKey = detailsTitle.toLowerCase().replace(/\s+/g, '-');
            productQuantities.set(productKey, 1);
    
            let productCart = document.createElement("div");
            productCart.classList.add("productCart");
            productCart.dataset.title = detailsTitle;
            productCart.dataset.price = detailsPrice;
    
            productCart.innerHTML = `
                <div class="imgBoxCart">
                    <img src="${detailsImageSrc}" alt="${detailsTitle}">
                </div>
                <div class="infoProduct">
                    <div class="titleProductCart">
                        <p>${detailsTitle}</p>
                    </div>
                    <div class="priceProductCart">
                        <p>€${detailsPrice.toFixed(2)}</p>
                    </div>
                    <div class="nrProduct">
                        <div class="masMenos">
                            <p class="sign" id="menos">-</p>
                            <p class="nr" id="nr">1</p>
                            <p class="sign" id="mas">+</p>
                        </div>
                        <div class="remove">
                            <p class="removeButton">REMOVE</p>
                        </div>
                    </div>
                </div>
            `;
    
            let productsBox = overlayCart.querySelector(".productsBox");
            if (productsBox) {
                productsBox.appendChild(productCart);
            }
    
            let masMenos = productCart.querySelector(".masMenos");
            masMenos.querySelector("#menos").addEventListener("click", function () {
                updateProductQuantity(detailsTitle, "remove");
                updatePrices();
            });
            masMenos.querySelector("#mas").addEventListener("click", function () {
                updateProductQuantity(detailsTitle, "add");
                updatePrices();
            });
    
            let removeButton = productCart.querySelector(".removeButton");
            removeButton.addEventListener("click", function () {
                removeProductCart(detailsTitle);
            });
        }
    
        emptyCartSection.style.display = "none";
        fullCartSection.style.display = "flex";
    
        openOverlayCart();
        closeOverlayProduct();
    
        updatePrices();
        updateTotalProducts();
    }
    
    function removeProductCart(productKey) {
        let productCart = getProductCartElement(productKey);
    
        if (productCart) {
    
            productCart.remove();
    
            productQuantities.delete(productKey);
    
            let totalSubtotal = calculateTotalSubtotal();
            let subtotalPriceElement = document.querySelector(".priceSubtotal");
            if (subtotalPriceElement) {
                subtotalPriceElement.textContent = `€${Math.max(totalSubtotal, 0).toFixed(2)} EUR`;
            }
    
            if (totalSubtotal === 0) {
                emptyCartSection.style.display = "flex";
                fullCartSection.style.display = "none";
            } else {
                emptyCartSection.style.display = "none";
                fullCartSection.style.display = "flex";
            }
    
            updateTotalPrice();
    
            updateTotalProducts();
    
            if (calculateTotalSubtotal() === 0) {
                hideNrProducts();
            }
        }
    }
    
    function hideNrProducts() {
        let nrProductsElement = document.querySelector(".nrProducts p");
    
        if (nrProductsElement) {
            nrProductsElement.parentElement.style.display = "none";
        }
    }

    function updateTotalProducts() {
        let totalProducts = calculateTotalProducts();
        let nrProductsElement = document.querySelector(".nrProducts p");
        let emptyCartSection = document.querySelector(".emptyCart");
        let fullCartSection = document.querySelector(".fullCart");
    
        if (nrProductsElement && emptyCartSection && fullCartSection) {
            if (totalProducts === 0) {
                nrProductsElement.parentElement.style.display = "none";
                emptyCartSection.style.display = "flex";
                fullCartSection.style.display = "none";
            } else {
                nrProductsElement.parentElement.style.display = "block";
                emptyCartSection.style.display = "none";
                fullCartSection.style.display = "flex";
            }
        }
    
        if (nrProductsElement) {
            nrProductsElement.textContent = totalProducts.toString();
        }
    }
    
    function getProductCartElement(productKey) {
        let productsBox = overlayCart.querySelector(".productsBox");
        let productCarts = productsBox.querySelectorAll(".productCart");
    
        for (let productCart of productCarts) {
            if (productCart.dataset.title === productKey) {
                return productCart;
            }
        }
    
        return null;
    }
    
    function updateProductQuantity(productKey, action) {
        let currentQuantity = productQuantities.get(productKey) || 1;
    
        if (action === "add") {
            productQuantities.set(productKey, currentQuantity + 1);
        } else if (action === "remove") {
            if (currentQuantity > 1) {
                productQuantities.set(productKey, currentQuantity - 1);
            } else {
                removeProductCart(productKey);
                return;
            }
        }
    
        let productCart = getProductCartElement(productKey);
    
        if (productCart) {
            let quantityElement = productCart.querySelector(".nr");
            let priceElement = productCart.querySelector(".priceProductCart p");
            let price = parseFloat(productCart.dataset.price) || 0;
    
            quantityElement.textContent = productQuantities.get(productKey);
            priceElement.textContent = `€${(price * productQuantities.get(productKey)).toFixed(2)}`;
        }
    }
       
    function updateTotalPrice() {
        let products = document.querySelectorAll(".productCart");
        let totalPriceElement = document.querySelector(".totalPrice p");
        let totalPrice = 0;
    
        products.forEach((product) => {
            let priceElement = product.querySelector(".priceProductCart p");
            let quantityElement = product.querySelector(".masMenos .nr");
            let price = parsePrice(priceElement.textContent);
            let quantity = parseInt(quantityElement.textContent);
    
            let productSubtotal = price * quantity;
    
            totalPrice += productSubtotal;
        });
    
        if (totalPriceElement) {
            totalPriceElement.textContent = `Total: €${totalPrice.toFixed(2)}`;
        }
    }
    
    function parsePrice(price) {
        const match = price ? price.match(/([\d.,]+)/) : null;
    
        if (match && match[0]) {
            return parseFloat(match[0].replace(",", ".")) || 0;
        } else {
            return 0;
        }
    }

    // FUNCIÓN DETALLES PRODUCTO
    function toggleOverlay(event, isAddToCart) {
        let detailsTitleElement = overlayProduct.querySelector(".titleProduct p");
        let detailsPriceElement = overlayProduct.querySelector(".price p");
        let detailsDescriptionElement = overlayProduct.querySelector(".textDescription p");

        let card = event.currentTarget;
        let title = card.dataset.title || "";
        let price = card.dataset.price || "";
        let description = card.dataset.description || "";
        let imageUrlElement = card.querySelector("img");

        let imageUrl = imageUrlElement ? imageUrlElement.src : null;

        detailsTitleElement.textContent = title;
        detailsPriceElement.textContent = price;
        detailsDescriptionElement.textContent = description;

        if (imageUrl && detailsImage) {
            detailsImage.src = imageUrl;
        }

        overlayProduct.style.display = "block";

        if (isAddToCart && title && price && imageUrl) {
            addToCart(title, price);
        }
    }

    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleOverlay(event, false);
        });
    });

    if (cartIcon && overlayCart && closeCartIcon) {
        cartIcon.addEventListener("click", function (event) {
            event.stopPropagation();
            openOverlayCart();
        });

        closeCartIcon.addEventListener("click", closeOverlayCart);

        overlayCart.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        addCartButtons.forEach(function (button) {
            button.addEventListener("click", function (event) {
                addToCart(event.currentTarget.dataset.title, event.currentTarget.dataset.price);
            });
        });
    }

    overlayProduct.addEventListener("click", function (event) {
        let isClickInsideDetails = event.target.closest("#details");

        if (!isClickInsideDetails) {
            closeOverlayProduct();
        }
    });

    function initializeCart() {
        emptyCartSection.style.display = "flex";
        fullCartSection.style.display = "none";
        hideNrProducts();

    }

    initializeCart();

    // PESTAÑA PERFIL

    let profileIcon = document.querySelector(".profileIcon img");
    let profileOptions = document.querySelector(".profileOptions");

    if (profileIcon) {
        profileIcon.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleProfileOptions();
        });
    }

    if (profileOptions) {
        document.addEventListener("click", function () {
            if (profileOptions.style.display === "block") {
                profileOptions.style.display = "none";
            }
        });

        profileOptions.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    function toggleProfileOptions() {
        if (profileOptions) {
            profileOptions.style.display = (profileOptions.style.display === "block") ? "none" : "block";
        }
    }

    window.toggleProfileOptions = toggleProfileOptions;


    profileIcon.addEventListener("click", function(event) {
        event.stopPropagation();
        toggleProfileOptions();
    });


    // GALERÍA IMÁGENES

    let imgActual = 0;
    let miniaturas = document.querySelectorAll(".mini");

    let btnIzq = document.querySelector("#left");
    let btnDcha = document.querySelector("#right");

    if (btnIzq && btnDcha) {
        btnIzq.addEventListener("click", () => {
            imgActual == 0 ? (imgActual = miniaturas.length - 1) : imgActual--;
            cambioimagen(miniaturas[imgActual]);
        });

        btnDcha.addEventListener("click", () => {
            imgActual == miniaturas.length - 1 ? (imgActual = 0) : imgActual++;
            cambioimagen(miniaturas[imgActual]);
        });
    }

    function cambioimagen(item) {
        let imagengrande = document.querySelector("#imgBox");
        imagengrande.src = item.src;
        imagengrande.alt = item.alt;

        miniaturas.forEach((elem) => {
            elem.classList.remove("active");
        });
        item.classList.add("active");
    }

    miniaturas.forEach((item) => {
        item.addEventListener("click", (event) => {
            imgActual = item.dataset.num;
            cambioimagen(item);
        });
    });

   

    // BOTÓN ARRIBA

    let upButton = document.querySelector('.up');

    if (upButton) {
        upButton.classList.add('hidden');

        window.addEventListener('scroll', function () {
            var scrollPosition = window.scrollY;
            var scrollThreshold = 200;

            if (scrollPosition > scrollThreshold) {
                upButton.classList.remove('hidden');
            } else {
                upButton.classList.add('hidden');
            }
        });

    }



};
