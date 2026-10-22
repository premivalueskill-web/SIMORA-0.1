package com.simora.customer.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.simora.customer.data.model.*
import com.simora.customer.data.repository.SimoraRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SimoraViewModel(
    private val repository: SimoraRepository = SimoraRepository()
) : ViewModel() {

    // User State
    private val _user = MutableStateFlow(
        UserProfile(id = "usr-guest", name = "Guest", phone = "", isLoggedIn = false)
    )
    val user: StateFlow<UserProfile> = _user.asStateFlow()

    // Products & Categories
    val categories = repository.categories
    val allProducts = repository.products

    private val _selectedCategory = MutableStateFlow("all")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    // Cart State
    private val _cart = MutableStateFlow<List<CartItem>>(emptyList())
    val cart: StateFlow<List<CartItem>> = _cart.asStateFlow()

    // Orders State
    private val _orders = MutableStateFlow<List<Order>>(
        listOf(
            Order(
                id = "ord-8821",
                orderNumber = "SIM-8821",
                items = listOf(
                    CartItem(repository.products[0], 2),
                    CartItem(repository.products[1], 1)
                ),
                subtotal = 110.0,
                deliveryFee = 0.0,
                discount = 20.0,
                total = 90.0,
                status = OrderStatus.OUT_FOR_DELIVERY,
                deliveryPin = "4821",
                deliveryAddress = "Flat 402, Green Glen Residency, Koramangala",
                createdAt = "Today, 10 mins ago",
                estimatedMinutes = 4
            )
        )
    )
    val orders: StateFlow<List<Order>> = _orders.asStateFlow()

    // Selected Address
    private val _selectedAddress = MutableStateFlow(repository.defaultAddresses[0])
    val selectedAddress: StateFlow<DeliveryAddress> = _selectedAddress.asStateFlow()

    // Selected product for detail sheet
    private val _selectedProduct = MutableStateFlow<Product?>(null)
    val selectedProduct: StateFlow<Product?> = _selectedProduct.asStateFlow()

    fun setSelectedCategory(catId: String) {
        _selectedCategory.value = catId
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setSelectedProduct(product: Product?) {
        _selectedProduct.value = product
    }

    // OTP Auth methods
    fun verifyOtpAndLogin(phone: String, name: String) {
        val cleanPhone = phone.filter { it.isDigit() }.takeLast(10)
        _user.value = UserProfile(
            id = "u-$cleanPhone",
            name = if (name.isNotBlank()) name else "SIMORA Customer",
            phone = "+91 $cleanPhone",
            isLoggedIn = true
        )
    }

    fun logout() {
        _user.value = UserProfile(id = "usr-guest", name = "Guest", phone = "", isLoggedIn = false)
    }

    // Cart management
    fun addToCart(product: Product) {
        val current = _cart.value.toMutableList()
        val index = current.indexOfFirst { it.product.id == product.id }
        if (index >= 0) {
            val item = current[index]
            current[index] = item.copy(quantity = item.quantity + 1)
        } else {
            current.add(CartItem(product, 1))
        }
        _cart.value = current
    }

    fun updateCartQuantity(productId: String, delta: Int) {
        val current = _cart.value.toMutableList()
        val index = current.indexOfFirst { it.product.id == productId }
        if (index >= 0) {
            val newQty = current[index].quantity + delta
            if (newQty <= 0) {
                current.removeAt(index)
            } else {
                current[index] = current[index].copy(quantity = newQty)
            }
            _cart.value = current
        }
    }

    fun clearCart() {
        _cart.value = emptyList()
    }

    fun placeOrder(address: DeliveryAddress, paymentMethod: String): Order {
        val cartItems = _cart.value
        val subtotal = cartItems.sumOf { it.product.price * it.quantity }
        val deliveryFee = if (subtotal > 199) 0.0 else 15.0
        val discount = if (subtotal > 150) 30.0 else 0.0
        val total = subtotal + deliveryFee - discount
        val pin = (1000..9999).random().toString()
        val orderNo = "SIM-" + (1000..9999).random()

        val newOrder = Order(
            id = "ord-${System.currentTimeMillis()}",
            orderNumber = orderNo,
            items = cartItems,
            subtotal = subtotal,
            deliveryFee = deliveryFee,
            discount = discount,
            total = total,
            status = OrderStatus.PLACED,
            deliveryPin = pin,
            deliveryAddress = "${address.tag}: ${address.addressLine}, ${address.city}",
            createdAt = "Just now",
            estimatedMinutes = 10
        )

        _orders.value = listOf(newOrder) + _orders.value
        clearCart()
        return newOrder
    }
}
