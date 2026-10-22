package com.simora.customer.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simora.customer.data.model.Order
import com.simora.customer.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrackingScreen(
    order: Order,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Live Delivery Tracking", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Slate50)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Live Status Card
            Surface(
                color = SimoraGreenDark,
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Arriving In", color = SimoraYellow, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("${order.estimatedMinutes} Minutes", color = Color.White, fontSize = 26.sp, fontWeight = FontWeight.Black)
                        }

                        Surface(
                            color = SimoraYellow,
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Column(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text("DELIVERY OTP", fontSize = 9.sp, fontWeight = FontWeight.Black, color = Slate950)
                                Text(order.deliveryPin, fontSize = 18.sp, fontWeight = FontWeight.Black, color = Slate950)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    LinearProgressIndicator(
                        progress = { 0.75f },
                        modifier = Modifier.fillMaxWidth().height(6.dp).clip(CircleShape),
                        color = SimoraYellow,
                        trackColor = Color.White.copy(alpha = 0.2f)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Rider has picked up your package from SIMORA Dark Store",
                        color = Color.White.copy(alpha = 0.85f),
                        fontSize = 11.sp
                    )
                }
            }

            // Delivery Partner Info Card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(SimoraGreenLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.DirectionsBike, contentDescription = null, tint = SimoraGreenDark)
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(order.riderName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text(order.riderVehicle, color = Slate500, fontSize = 11.sp)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Star, contentDescription = null, tint = SimoraYellow, modifier = Modifier.size(12.dp))
                            Text(" 4.9 Rating · Vaccinated", color = Slate700, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }

                    IconButton(
                        onClick = { /* Trigger phone dialer */ },
                        modifier = Modifier.background(SimoraGreen, CircleShape)
                    ) {
                        Icon(Icons.Default.Phone, contentDescription = "Call", tint = Color.White)
                    }
                }
            }

            // Destination Card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Delivery Address", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate500)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(order.deliveryAddress, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = Slate900)
                }
            }
        }
    }
}
