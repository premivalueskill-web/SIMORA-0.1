package com.simora.customer.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.simora.customer.data.model.Product
import com.simora.customer.ui.theme.*
import com.simora.customer.viewmodel.SimoraViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductDetailScreen(
    product: Product,
    viewModel: SimoraViewModel,
    onBack: () -> Unit,
    onGoToCart: () -> Unit
) {
    val cart by viewModel.cart.collectAsState()
    val cartItem = cart.firstOrNull { it.product.id == product.id }
    val quantity = cartItem?.quantity ?: 0

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(product.name, maxLines = 1, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = onGoToCart) {
                        BadgedBox(
                            badge = {
                                if (cart.isNotEmpty()) {
                                    Badge(containerColor = SimoraYellow, contentColor = Slate950) {
                                        Text("${cart.sumOf { it.quantity }}", fontWeight = FontWeight.Black)
                                    }
                                }
                            }
                        ) {
                            Icon(Icons.Default.ShoppingCart, contentDescription = "Cart")
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = Slate900
                )
            )
        },
        bottomBar = {
            Surface(
                color = Color.White,
                shadowElevation = 16.dp,
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
                        Text("Price", color = Slate500, fontSize = 11.sp)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "₹${product.price.toInt()}",
                                fontWeight = FontWeight.Black,
                                fontSize = 22.sp,
                                color = Slate900
                            )
                            if (product.originalPrice > product.price) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "₹${product.originalPrice.toInt()}",
                                    fontSize = 13.sp,
                                    color = Slate400,
                                    textDecoration = TextDecoration.LineThrough
                                )
                            }
                        }
                    }

                    if (quantity == 0) {
                        Button(
                            onClick = { viewModel.addToCart(product) },
                            colors = ButtonDefaults.buttonColors(containerColor = SimoraGreen),
                            shape = RoundedCornerShape(14.dp),
                            contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
                        ) {
                            Icon(Icons.Default.AddShoppingCart, contentDescription = null, tint = SimoraYellow)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("ADD TO CART", fontWeight = FontWeight.Black, fontSize = 14.sp)
                        }
                    } else {
                        Surface(
                            color = SimoraGreen,
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                            ) {
                                IconButton(
                                    onClick = { viewModel.updateCartQuantity(product.id, -1) },
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Text("−", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Black)
                                }
                                Text(
                                    text = "$quantity in cart",
                                    color = Color.White,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 14.sp,
                                    modifier = Modifier.padding(horizontal = 12.dp)
                                )
                                IconButton(
                                    onClick = { viewModel.updateCartQuantity(product.id, 1) },
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Text("+", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Black)
                                }
                            }
                        }
                    }
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .background(Color.White)
        ) {
            // Hero Image
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .background(Slate100)
            ) {
                AsyncImage(
                    model = product.image,
                    contentDescription = product.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                Surface(
                    color = SimoraGreen,
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(16.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(Icons.Default.Bolt, contentDescription = null, tint = SimoraYellow, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(2.dp))
                        Text("10-Minute Delivery", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }
                }
            }

            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = product.name,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Black,
                    color = Slate900
                )

                if (product.hindiName != null) {
                    Text(
                        text = product.hindiName,
                        style = MaterialTheme.typography.titleMedium,
                        color = Slate500,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }

                Row(
                    modifier = Modifier.padding(top = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = SimoraGreen.copy(alpha = 0.1f),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Icon(Icons.Default.Star, contentDescription = null, tint = SimoraYellow, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("${product.rating} (${product.reviewCount} reviews)", color = SimoraGreenDark, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }

                    Spacer(modifier = Modifier.width(10.dp))
                    Text("Unit: ${product.unit}", color = Slate700, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                }

                Divider(modifier = Modifier.padding(vertical = 16.dp), color = Slate200)

                Text("About This Product", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Slate900)
                Text(
                    text = product.description,
                    color = Slate700,
                    fontSize = 13.sp,
                    lineHeight = 20.sp,
                    modifier = Modifier.padding(top = 6.dp)
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Trust Badges
                Surface(
                    color = Slate50,
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Verified, contentDescription = null, tint = SimoraGreen, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("100% Quality & Freshness Guarantee", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.AccessTime, contentDescription = null, tint = SimoraGreen, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Packed hygienically at local SIMORA Dark Store", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.AssignmentReturn, contentDescription = null, tint = SimoraGreen, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("No questions asked return at doorstep", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }
        }
    }
}
