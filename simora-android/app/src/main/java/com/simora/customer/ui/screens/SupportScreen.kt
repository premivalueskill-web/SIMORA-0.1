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
import com.simora.customer.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SupportScreen(
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("SIMORA Customer Care", fontWeight = FontWeight.Bold) },
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
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Instant Contact Card
            Surface(
                color = SimoraGreen,
                shape = RoundedCornerShape(18.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("Need help with an ongoing order?", color = SimoraYellow, fontWeight = FontWeight.Black, fontSize = 15.sp)
                    Text("Our support team is live 24x7 to resolve any issue in under 60 seconds.", color = Color.White, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp, bottom = 14.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Button(
                            onClick = { /* Action */ },
                            colors = ButtonDefaults.buttonColors(containerColor = SimoraYellow),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.Call, contentDescription = null, tint = Slate950, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Call Support", color = Slate950, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }

                        OutlinedButton(
                            onClick = { /* Action */ },
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color.White),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
                        ) {
                            Icon(Icons.Default.Chat, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Chat on WhatsApp", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
            }

            // FAQs
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Frequently Asked Questions", fontWeight = FontWeight.Bold, fontSize = 15.sp)

                    val faqs = listOf(
                        "How does 10-minute delivery work?" to "We dispatch from high-density hyper-local dark stores located within 2 km of your location.",
                        "What if an item is missing or damaged?" to "Instant doorstep refund or immediate replacement without questions asked.",
                        "What are the payment options accepted?" to "UPI (Google Pay, PhonePe, Paytm), Cash on Delivery, and Credit/Debit cards.",
                        "Are vegetables and fruits fresh?" to "100% farm-direct procurement daily at 4 AM to ensure unmatched farm freshness."
                    )

                    faqs.forEach { (q, a) ->
                        Column {
                            Text(q, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                            Text(a, color = Slate600, fontSize = 12.sp, modifier = Modifier.padding(top = 2.dp))
                            Divider(modifier = Modifier.padding(top = 10.dp), color = Slate100)
                        }
                    }
                }
            }
        }
    }
}
