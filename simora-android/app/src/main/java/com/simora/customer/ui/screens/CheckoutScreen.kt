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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simora.customer.data.model.Order
import com.simora.customer.ui.theme.*
import com.simora.customer.viewmodel.SimoraViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CheckoutScreen(
    viewModel: SimoraViewModel,
    onBack: () -> Unit,
    onOrderPlaced: (Order) -> Unit
) {
    val selectedAddress by viewModel.selectedAddress.collectAsState()
    val cart by viewModel.cart.collectAsState()
    var selectedPayment by remember { mutableStateOf("UPI") }
    var selectedInstruction by remember { mutableStateOf("Ring Doorbell") }
    var isPlacingOrder by remember { mutableStateOf(false) }

    val subtotal = cart.sumOf { it.product.price * it.quantity }
    val deliveryFee = if (subtotal > 199 || subtotal == 0.0) 0.0 else 15.0
    val discount = if (subtotal > 150) 30.0 else 0.0
    val total = subtotal + deliveryFee - discount

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Checkout & Payment", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
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
                        Text("Pay via $selectedPayment", color = Slate500, fontSize = 11.sp)
                        Text("₹${total.toInt()}", fontWeight = FontWeight.Black, fontSize = 22.sp, color = Slate900)
                    }

                    Button(
                        onClick = {
                            isPlacingOrder = true
                            val order = viewModel.placeOrder(selectedAddress, selectedPayment)
                            onOrderPlaced(order)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SimoraGreen),
                        shape = RoundedCornerShape(14.dp),
                        enabled = !isPlacingOrder
                    ) {
                        Text("Place Order", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(Icons.Default.Check, contentDescription = null, tint = SimoraYellow)
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
                .background(Slate50)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Delivery Address Card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Home, contentDescription = null, tint = SimoraGreen)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Delivering To: ${selectedAddress.tag}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                        Surface(color = SimoraGreenLight, shape = RoundedCornerShape(6.dp)) {
                            Text("10 MINS", color = SimoraGreenDark, fontSize = 10.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                    }

                    Text(
                        text = "${selectedAddress.addressLine}, ${selectedAddress.city} - ${selectedAddress.pincode}",
                        color = Slate700,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(top = 6.dp)
                    )
                }
            }

            // Delivery Instructions
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Delivery Instructions", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(10.dp))
                    val instructions = listOf("Ring Doorbell", "Leave with Guard", "Avoid Calling", "Leave at Door")
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        instructions.take(2).forEach { inst ->
                            FilterChip(
                                selected = selectedInstruction == inst,
                                onClick = { selectedInstruction = inst },
                                label = { Text(inst, fontSize = 11.sp) }
                            )
                        }
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 4.dp)) {
                        instructions.drop(2).forEach { inst ->
                            FilterChip(
                                selected = selectedInstruction == inst,
                                onClick = { selectedInstruction = inst },
                                label = { Text(inst, fontSize = 11.sp) }
                            )
                        }
                    }
                }
            }

            // Payment Options
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Payment Method", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(12.dp))

                    val methods = listOf(
                        Triple("UPI", "Google Pay / PhonePe / Paytm", "⚡ Instant & Zero Contact"),
                        Triple("COD", "Cash / UPI on Delivery", "💵 Pay to rider at doorstep"),
                        Triple("CARD", "Credit / Debit Cards", "💳 Visa, Mastercard, RuPay")
                    )

                    methods.forEach { (code, title, desc) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedPayment = code }
                                .padding(vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = selectedPayment == code,
                                onClick = { selectedPayment = code },
                                colors = RadioButtonDefaults.colors(selectedColor = SimoraGreen)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(title, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text(desc, color = Slate500, fontSize = 11.sp)
                            }
                        }
                        if (code != "CARD") Divider(color = Slate100)
                    }
                }
            }
        }
    }
}
