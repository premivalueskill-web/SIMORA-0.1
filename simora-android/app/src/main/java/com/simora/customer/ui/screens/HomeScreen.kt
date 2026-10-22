package com.simora.customer.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.simora.customer.data.model.CartItem
import com.simora.customer.data.model.Category
import com.simora.customer.data.model.Product
import com.simora.customer.ui.theme.*
import com.simora.customer.viewmodel.SimoraViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: SimoraViewModel,
    onNavigateToCart: () -> Unit,
    onNavigateToOrders: () -> Unit,
    onNavigateToSupport: () -> Unit,
    onSelectProduct: (Product) -> Unit
) {
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val cart by viewModel.cart.collectAsState()
    val user by viewModel.user.collectAsState()
    val selectedAddress by viewModel.selectedAddress.collectAsState()

    val filteredProducts = remember(selectedCategory, searchQuery) {
        viewModel.allProducts.filter { product ->
            val matchesCategory = selectedCategory == "all" || product.category == selectedCategory
            val matchesSearch = searchQuery.isBlank() || 
                product.name.contains(searchQuery, ignoreCase = true) ||
                (product.hindiName?.contains(searchQuery, ignoreCase = true) == true)
            matchesCategory && matchesSearch
        }
    }

    val cartItemCount = cart.sumOf { it.quantity }
    val cartSubtotal = cart.sumOf { it.product.price * it.quantity }

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SimoraGreen)
                    .statusBarsPadding()
            ) {
                // Micro top banner
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(SimoraGreenDark)
                        .padding(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "⚡ 10-Minute Delivery | Free over ₹199",
                        color = SimoraYellow,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Code: SIMORA50",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                // Main Top Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "SIMORA",
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 20.sp,
                                letterSpacing = (-0.5).sp
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                color = SimoraYellow,
                                shape = RoundedCornerShape(4.dp)
                            ) {
                                Text(
                                    text = "10 MIN",
                                    color = Slate950,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                )
                            }
                        }

                        // Delivery location
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(top = 2.dp)
                        ) {
                            Icon(
                                Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = SimoraYellow,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(2.dp))
                            Text(
                                text = "${selectedAddress.tag} - ${selectedAddress.city}",
                                color = Color.White.copy(alpha = 0.9f),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }

                    // Top Action Icons
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = onNavigateToSupport,
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color.White.copy(alpha = 0.15f), CircleShape)
                        ) {
                            Icon(
                                Icons.Default.HeadsetMic,
                                contentDescription = "Support",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        IconButton(
                            onClick = onNavigateToOrders,
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color.White.copy(alpha = 0.15f), CircleShape)
                        ) {
                            Icon(
                                Icons.Default.ReceiptLong,
                                contentDescription = "Orders",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        // Cart badge
                        BadgedBox(
                            badge = {
                                if (cartItemCount > 0) {
                                    Badge(
                                        containerColor = SimoraYellow,
                                        contentColor = Slate950
                                    ) {
                                        Text(
                                            text = cartItemCount.toString(),
                                            fontWeight = FontWeight.Black,
                                            fontSize = 10.sp
                                        )
                                    }
                                }
                            }
                        ) {
                            IconButton(
                                onClick = onNavigateToCart,
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(Color.White.copy(alpha = 0.15f), CircleShape)
                            ) {
                                Icon(
                                    Icons.Default.ShoppingCart,
                                    contentDescription = "Cart",
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }
                }

                // Search Bar
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { viewModel.setSearchQuery(it) },
                    placeholder = {
                        Text(
                            "Search \"milk\", \"atta\", \"tomatoes\", \"chips\"...",
                            fontSize = 13.sp,
                            color = Slate500
                        )
                    },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = null, tint = SimoraGreen)
                    },
                    trailingIcon = {
                        if (searchQuery.isNotBlank()) {
                            IconButton(onClick = { viewModel.setSearchQuery("") }) {
                                Icon(Icons.Default.Close, contentDescription = "Clear", tint = Slate500)
                            }
                        }
                    },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 6.dp)
                        .padding(bottom = 10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White,
                        focusedBorderColor = Color.Transparent,
                        unfocusedBorderColor = Color.Transparent
                    ),
                    shape = RoundedCornerShape(16.dp)
                )
            }
        },
        bottomBar = {
            // Floating Cart Bottom Strip when cart has items
            AnimatedVisibility(
                visible = cartItemCount > 0,
                enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
                exit = slideOutVertically(targetOffsetY = { it }) + fadeOut()
            ) {
                Surface(
                    color = SimoraGreen,
                    shadowElevation = 12.dp,
                    shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp, vertical = 14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "$cartItemCount ITEMS IN CART",
                                color = SimoraYellow,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black
                            )
                            Text(
                                text = "₹${cartSubtotal.toInt()}",
                                color = Color.White,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black
                            )
                        }

                        Button(
                            onClick = onNavigateToCart,
                            colors = ButtonDefaults.buttonColors(containerColor = SimoraYellow),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text(
                                text = "View Cart",
                                color = Slate950,
                                fontWeight = FontWeight.Black,
                                fontSize = 14.sp
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Slate950)
                        }
                    }
                }
            }
        }
    ) { padding ->
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Slate50),
            contentPadding = PaddingValues(bottom = 80.dp)
        ) {
            // 1. Promotional Banner Hero item
            item(span = { GridItemSpan(2) }) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    shape = RoundedCornerShape(20.dp),
                    color = SimoraGreenDark
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Surface(
                                color = SimoraYellow,
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text(
                                    text = "SUPER SAVER",
                                    color = Slate950,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Black,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "Fresh Vegetables & Daily Essentials",
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp,
                                lineHeight = 20.sp
                            )
                            Text(
                                text = "Up to 50% OFF · Delivered in 10 minutes",
                                color = Color.White.copy(alpha = 0.8f),
                                fontSize = 12.sp,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                        Text(
                            text = "🥦⚡",
                            fontSize = 38.sp
                        )
                    }
                }
            }

            // 2. Category Chips Bar
            item(span = { GridItemSpan(2) }) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(viewModel.categories) { category ->
                        val isSelected = selectedCategory == category.id
                        FilterChip(
                            selected = isSelected,
                            onClick = { viewModel.setSelectedCategory(category.id) },
                            label = {
                                Text(
                                    text = "${category.icon} ${category.name}",
                                    fontSize = 12.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = SimoraGreen,
                                selectedLabelColor = Color.White,
                                containerColor = Color.White,
                                labelColor = Slate800
                            ),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }
                }
            }

            // 3. Section Title
            item(span = { GridItemSpan(2) }) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (selectedCategory == "all") "Daily Essentials & Groceries" 
                                   else viewModel.categories.firstOrNull { it.id == selectedCategory }?.name ?: "Products",
                            fontWeight = FontWeight.Black,
                            fontSize = 17.sp,
                            color = Slate900
                        )
                        Text(
                            text = "${filteredProducts.size} items available nearby",
                            fontSize = 11.sp,
                            color = Slate500
                        )
                    }
                }
            }

            // 4. Products Grid Cards
            items(filteredProducts) { product ->
                val cartItem = cart.firstOrNull { it.product.id == product.id }
                ProductGridCard(
                    product = product,
                    quantityInCart = cartItem?.quantity ?: 0,
                    onAddToCart = { viewModel.addToCart(product) },
                    onIncrement = { viewModel.updateCartQuantity(product.id, 1) },
                    onDecrement = { viewModel.updateCartQuantity(product.id, -1) },
                    onClick = { onSelectProduct(product) }
                )
            }
        }
    }
}

@Composable
fun ProductGridCard(
    product: Product,
    quantityInCart: Int,
    onAddToCart: () -> Unit,
    onIncrement: () -> Unit,
    onDecrement: () -> Unit,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .padding(6.dp)
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(10.dp)
        ) {
            // Product Image Container with 10-min badge
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Slate100)
            ) {
                AsyncImage(
                    model = product.image,
                    contentDescription = product.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // 10-Min Badge
                Surface(
                    color = Color.White.copy(alpha = 0.95f),
                    shape = RoundedCornerShape(6.dp),
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(6.dp)
                ) {
                    Text(
                        text = "⚡ 10 MINS",
                        color = SimoraGreenDark,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                    )
                }

                // Discount Pill
                if (product.discountPercent > 0) {
                    Surface(
                        color = SimoraGreen,
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(6.dp)
                    ) {
                        Text(
                            text = "${product.discountPercent}% OFF",
                            color = Color.White,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Rating
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Default.Star,
                    contentDescription = null,
                    tint = SimoraYellow,
                    modifier = Modifier.size(13.dp)
                )
                Spacer(modifier = Modifier.width(2.dp))
                Text(
                    text = "${product.rating}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp,
                    color = Slate800
                )
                Text(
                    text = " (${product.reviewCount})",
                    fontSize = 10.sp,
                    color = Slate400
                )
            }

            // Name
            Text(
                text = product.name,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp,
                color = Slate900,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 17.sp,
                modifier = Modifier.padding(top = 2.dp)
            )

            // Hindi Name
            if (product.hindiName != null) {
                Text(
                    text = product.hindiName,
                    fontSize = 11.sp,
                    color = Slate500,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Text(
                text = product.unit,
                fontSize = 11.sp,
                color = Slate500,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(top = 2.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Price and Add / Stepper
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "₹${product.price.toInt()}",
                        fontWeight = FontWeight.Black,
                        fontSize = 15.sp,
                        color = Slate900
                    )
                    if (product.originalPrice > product.price) {
                        Text(
                            text = "₹${product.originalPrice.toInt()}",
                            fontSize = 11.sp,
                            color = Slate400,
                            textDecoration = TextDecoration.LineThrough
                        )
                    }
                }

                // Add to cart or Stepper button
                if (quantityInCart == 0) {
                    OutlinedButton(
                        onClick = onAddToCart,
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = SimoraGreen
                        ),
                        border = androidx.compose.foundation.BorderStroke(1.5.dp, SimoraGreen),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "ADD",
                            fontWeight = FontWeight.Black,
                            fontSize = 12.sp
                        )
                    }
                } else {
                    Surface(
                        color = SimoraGreen,
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "−",
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp,
                                modifier = Modifier
                                    .clickable { onDecrement() }
                                    .padding(horizontal = 6.dp)
                            )
                            Text(
                                text = "$quantityInCart",
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(horizontal = 4.dp)
                            )
                            Text(
                                text = "+",
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp,
                                modifier = Modifier
                                    .clickable { onIncrement() }
                                    .padding(horizontal = 6.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
