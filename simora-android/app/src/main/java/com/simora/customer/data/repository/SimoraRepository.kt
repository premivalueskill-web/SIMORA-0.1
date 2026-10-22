package com.simora.customer.data.repository

import com.simora.customer.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SimoraRepository {

    val categories = listOf(
        Category("all", "All Items", "सभी सामान", "🛒"),
        Category("fruits_veg", "Fresh Veggies & Fruits", "ताज़ी सब्ज़ियाँ व फल", "🥦"),
        Category("dairy_bread", "Dairy, Bread & Eggs", "दूध, ब्रेड व अंडे", "🥛"),
        Category("snacks_drinks", "Snacks & Cold Drinks", "स्नैक्स व ड्रिंक्स", "🍪"),
        Category("staples", "Atta, Rice & Dal", "आटा, चावल व दाल", "🌾"),
        Category("cooking_essentials", "Masala & Cooking Oils", "मसाले व तेल", "🧂"),
        Category("cleaning_home", "Cleaning & Household", "सफाई व घरेलू सामान", "🧼")
    )

    val products = listOf(
        Product(
            id = "prod-1",
            name = "Farm Fresh Hybrid Tomatoes",
            hindiName = "ताज़ा हाइब्रिड टमाटर",
            category = "fruits_veg",
            price = 28.0,
            originalPrice = 42.0,
            unit = "1 kg",
            image = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
            rating = 4.8,
            reviewCount = 284,
            description = "Hand-picked, vine-ripened red juicy tomatoes sourced directly from local Indian farmers."
        ),
        Product(
            id = "prod-2",
            name = "Amul Taaza Homogenised Toned Milk",
            hindiName = "अमूल ताज़ा टोंड दूध",
            category = "dairy_bread",
            price = 54.0,
            originalPrice = 56.0,
            unit = "1 Litre",
            image = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
            rating = 4.9,
            reviewCount = 512,
            description = "Rich, fresh and sanitized toned milk packet for your morning tea, coffee, and daily nutrition."
        ),
        Product(
            id = "prod-3",
            name = "Aashirvaad Shudh Chakki Atta",
            hindiName = "आशीर्वाद शुद्ध चक्की आटा",
            category = "staples",
            price = 245.0,
            originalPrice = 280.0,
            unit = "5 kg",
            image = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
            rating = 4.9,
            reviewCount = 420,
            description = "100% whole wheat grains ground to perfection for ultra-soft, fluffy phulkas and rotis."
        ),
        Product(
            id = "prod-4",
            name = "Fresh Green Coriander (Dhaniya)",
            hindiName = "ताज़ा हरा धनिया",
            category = "fruits_veg",
            price = 12.0,
            originalPrice = 20.0,
            unit = "100 g",
            image = "https://images.unsplash.com/photo-1588879462719-75f8f844b241?auto=format&fit=crop&w=400&q=80",
            rating = 4.7,
            reviewCount = 145,
            description = "Crisp, aromatic, freshly plucked green coriander leaves for flavorful Indian curries and garnishing."
        ),
        Product(
            id = "prod-5",
            name = "Amul Salted Butter",
            hindiName = "अमूल मक्खन",
            category = "dairy_bread",
            price = 58.0,
            originalPrice = 60.0,
            unit = "100 g",
            image = "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
            rating = 4.9,
            reviewCount = 380,
            description = "Utterly butterly delicious classic pasteurised butter made from pure milk fat."
        ),
        Product(
            id = "prod-6",
            name = "Lay's India's Magic Masala Potato Chips",
            hindiName = "लेज़ मैजिक मसाला चिप्स",
            category = "snacks_drinks",
            price = 20.0,
            originalPrice = 20.0,
            unit = "50 g",
            image = "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
            rating = 4.8,
            reviewCount = 310,
            description = "Crunchy sliced potato chips seasoned with authentic Indian street spices."
        ),
        Product(
            id = "prod-7",
            name = "Tata Salt Iodized Crystal Salt",
            hindiName = "टाटा नमक देश का नमक",
            category = "cooking_essentials",
            price = 28.0,
            originalPrice = 30.0,
            unit = "1 kg",
            image = "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=400&q=80",
            rating = 4.9,
            reviewCount = 640,
            description = "Vacuum-evaporated iodized cooking salt for balanced nutrition and daily cooking."
        ),
        Product(
            id = "prod-8",
            name = "Fresh Red Onions (Pyaaz)",
            hindiName = "ताज़ा लाल प्याज",
            category = "fruits_veg",
            price = 38.0,
            originalPrice = 50.0,
            unit = "1 kg",
            image = "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80",
            rating = 4.6,
            reviewCount = 190,
            description = "Firm, aromatic dry red onions sourced from Nashik farms for rich gravies."
        ),
        Product(
            id = "prod-9",
            name = "Fortune Sunlite Refined Sunflower Oil",
            hindiName = "फॉर्च्यून सनफ्लावर तेल",
            category = "cooking_essentials",
            price = 145.0,
            originalPrice = 170.0,
            unit = "1 Litre Pouch",
            image = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
            rating = 4.8,
            reviewCount = 230,
            description = "Light, non-greasy cooking oil enriched with Vitamin A & D for healthy heart cooking."
        ),
        Product(
            id = "prod-10",
            name = "Coca-Cola Zero Sugar Can",
            hindiName = "कोका कोला ज़ीरो",
            category = "snacks_drinks",
            price = 40.0,
            originalPrice = 40.0,
            unit = "300 ml",
            image = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
            rating = 4.7,
            reviewCount = 180,
            description = "Chilled sparkling beverage with crisp iconic cola taste and zero sugar."
        )
    )

    val defaultAddresses = listOf(
        DeliveryAddress(
            id = "addr-1",
            tag = "Home",
            addressLine = "Flat 402, Green Glen Residency, 5th Main",
            city = "Koramangala, Bengaluru",
            pincode = "560034",
            isDefault = true
        ),
        DeliveryAddress(
            id = "addr-2",
            tag = "Work",
            addressLine = "Tower B, Level 6, Tech Village",
            city = "Bellandur, Bengaluru",
            pincode = "560103",
            isDefault = false
        )
    )
}
