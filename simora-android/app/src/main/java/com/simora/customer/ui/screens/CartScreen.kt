package com.simora.customer.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.simora.customer.ui.theme.*
import com.simora.customer.viewmodel.SimoraViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    viewModel: SimoraViewModel,
    onBack: () -> Unit,
    onProceedToCheckout: () -> Unit
) {
    val cart by viewModel.cart.collectAsState()
    val selectedAddress by viewModel.selectedAddress.collectAsState()

    val subtotal = cart.sumOf { it.product.price * it.quantity }
    val deliveryFee = if (subtotal > 199 || subtotal == 0.0) 0.0 else 15.0
    val discount = if (subtotal > 150) 30.0 else 0.0
    val total = subtotal + deliveryFee - discount

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Shopping Cart (${cart.sumOf { it.quantity }})", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (cart.isNotEmpty()) {
                        TextButton(onClick = { viewModel.clearCart() }) {
                            Text("Clear", color = Red500, fontWeight = FontWeight.Bold)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        bottomBar = {
            if (cart.isNotEmpty()) {
                Surface(
                    color = Color.White,
                    shadowElevation = 16.dp,
                    shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Total Amount", color = Slate500, fontSize = 11.sp)
                                Text("₹${total.toInt()}", fontWeight = FontWeight.Black, fontSize = 22.sp, color = Slate900)
                            }
                            Button(
                                onClick = onProceedToCheckout,
                                colors = ButtonDefaults.buttonColors(containerColor = SimoraGreen),
                                shape = RoundedCornerShape(14.dp),
                                contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
                            ) {
                                Text("Proceed to Checkout", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Spacer(modifier = Modifier.width(6.dp))
                                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = SimoraYellow)
                            }
                        }
                    }
                }
            }
        }
    ) { padding ->
        if (cart.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .background(Slate50),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(24.dp)
                ) {
                    Icon(
                        Icons.Default.RemoveShoppingCart,
                        contentDescription = null,
                        tint = Slate400,
                        modifier = Modifier.size(72.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Your cart is empty", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Slate900)
                    Text(
                        "Add fresh veggies, dairy, snacks and essentials for instant 10-minute delivery",
                        color = Slate500,
                        fontSize = 13.sp,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                        modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
                    )
                    Button(
                        onClick = onBack,
                        colors = ButtonDefaults.buttonColors(containerColor = SimoraGreen),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Browse Groceries", fontWeight = FontWeight.Bold)
                    }
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .background(Slate50),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Delivery ETA header card
                item {
                    Surface(
                        color = SimoraGreenDark,
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("⚡", fontSize = 26.sp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text("Delivering in 10 Minutes", color = Color.White, fontWeight = FontWeight.Black, fontSize = 14.sp)
                                Text("To ${selectedAddress.addressLine}", color = SimoraYellow, fontSize = 11.sp, maxLines = 1)
                            }
                        }
                    }
                }

                // Cart Items
                items(cart) { item ->
                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AsyncImage(
                                model = item.product.image,
                                contentDescription = item.product.name,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .size(60.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(Slate100)
                            )

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(item.product.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900, maxLines = 1)
                                Text(item.product.unit, color = Slate500, fontSize = 11.sp)
                                Text("₹${item.product.price.toInt()}", fontWeight = FontWeight.Black, fontSize = 14.sp, color = SimoraGreenDark)
                            }

                            // Stepper
                            Surface(
                                color = SimoraGreen,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "−",
                                        color = Color.White,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 16.sp,
                                        modifier = Modifier
                                            .clickable { viewModel.updateCartQuantity(item.product.id, -1) }
                                            .padding(horizontal = 6.dp)
                                    )
                                    Text(
                                        text = "${item.quantity}",
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
                                            .clickable { viewModel.updateCartQuantity(item.product.id, 1) }
                                            .padding(horizontal = 6.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                // Bill Summary Card
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("Bill Summary", fontWeight = FontWeight.Black, fontSize = 14.sp, color = Slate900)
                            Divider(color = Slate100)

                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Item Total", color = Slate700, fontSize = 13.sp)
                                Text("₹${subtotal.toInt()}", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                            }

                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Delivery Partner Fee", color = Slate700, fontSize = 13.sp)
                                Text(if (deliveryFee == 0.0) "FREE" else "₹${deliveryFee.toInt()}", color = if (deliveryFee == 0.0) SimoraGreen else Slate900, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }

                            if (discount > 0) {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("SIMORA Super Saver", color = SimoraGreen, fontSize = 13.sp)
                                    Text("-₹${discount.toInt()}", color = SimoraGreen, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                }
                            }

                            Divider(color = Slate200)

                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Grand Total", fontWeight = FontWeight.Black, fontSize = 15.sp, color = Slate900)
                                Text("₹${total.toInt()}", fontWeight = FontWeight.Black, fontSize = 16.sp, color = SimoraGreenDark)
                            }
                        }
                    }
                }
            }
        }
    }
}
