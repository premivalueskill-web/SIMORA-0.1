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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simora.customer.data.model.Order
import com.simora.customer.data.model.OrderStatus
import com.simora.customer.ui.theme.*
import com.simora.customer.viewmodel.SimoraViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen(
    viewModel: SimoraViewModel,
    onBack: () -> Unit,
    onTrackOrder: (Order) -> Unit
) {
    val orders by viewModel.orders.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Orders", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->
        if (orders.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                Text("No orders placed yet", color = Slate500)
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
                items(orders) { order ->
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Order #${order.orderNumber}", fontWeight = FontWeight.Black, fontSize = 15.sp)
                                    Text(order.createdAt, color = Slate400, fontSize = 11.sp)
                                }

                                val statusColor = when (order.status) {
                                    OrderStatus.DELIVERED -> SimoraGreen
                                    OrderStatus.CANCELLED -> Red500
                                    else -> SimoraYellow
                                }
                                Surface(
                                    color = if (order.status == OrderStatus.OUT_FOR_DELIVERY) SimoraGreenDark else statusColor.copy(alpha = 0.15f),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text(
                                        text = order.status.name.replace("_", " "),
                                        color = if (order.status == OrderStatus.OUT_FOR_DELIVERY) Color.White else statusColor,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Black,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Divider(modifier = Modifier.padding(vertical = 10.dp), color = Slate100)

                            order.items.forEach { item ->
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("${item.quantity}x ${item.product.name}", color = Slate700, fontSize = 12.sp, modifier = Modifier.weight(1f))
                                    Text("₹${(item.product.price * item.quantity).toInt()}", fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
                                }
                            }

                            Divider(modifier = Modifier.padding(vertical = 10.dp), color = Slate100)

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Total: ₹${order.total.toInt()}", fontWeight = FontWeight.Black, fontSize = 15.sp, color = Slate900)

                                if (order.status != OrderStatus.DELIVERED && order.status != OrderStatus.CANCELLED) {
                                    Button(
                                        onClick = { onTrackOrder(order) },
                                        colors = ButtonDefaults.buttonColors(containerColor = SimoraGreen),
                                        shape = RoundedCornerShape(10.dp),
                                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                                    ) {
                                        Icon(Icons.Default.DirectionsBike, contentDescription = null, tint = SimoraYellow, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Track Live", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
