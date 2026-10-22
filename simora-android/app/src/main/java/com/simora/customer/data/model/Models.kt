package com.simora.customer.data.model

data class Product(
    val id: String,
    val name: String,
    val hindiName: String? = null,
    val category: String,
    val price: Double,
    val originalPrice: Double,
    val unit: String,
    val image: String,
    val rating: Double,
    val reviewCount: Int,
    val inStock: Boolean = true,
    val description: String,
    val deliveryMins: Int = 10,
    val discountPercent: Int = (((originalPrice - price) / originalPrice) * 100).toInt()
)

data class Category(
    val id: String,
    val name: String,
    val hindiName: String,
    val icon: String
)

data class CartItem(
    val product: Product,
    val quantity: Int
)

enum class OrderStatus {
    PLACED,
    PACKED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}

data class Order(
    val id: String,
    val orderNumber: String,
    val items: List<CartItem>,
    val subtotal: Double,
    val deliveryFee: Double,
    val discount: Double,
    val total: Double,
    val status: OrderStatus,
    val deliveryPin: String,
    val deliveryAddress: String,
    val riderName: String = "Rahul Sharma",
    val riderPhone: String = "+91 98111 22334",
    val riderVehicle: String = "Honda Activa (KA 01 EK 4482)",
    val createdAt: String,
    val estimatedMinutes: Int = 10
)

data class UserProfile(
    val id: String,
    val name: String,
    val phone: String,
    val isLoggedIn: Boolean = false
)

data class DeliveryAddress(
    val id: String,
    val tag: String,
    val addressLine: String,
    val city: String,
    val pincode: String,
    val isDefault: Boolean = false
)
