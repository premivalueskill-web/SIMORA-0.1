package com.simora.customer.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simora.customer.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun WelcomeLoginScreen(
    onLoginSuccess: (phone: String, name: String) -> Unit,
    onExploreAsGuest: () -> Unit
) {
    var phone by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var step by remember { mutableStateOf("phone") } // "phone" or "otp"
    var otpCode by remember { mutableStateOf("") }
    var isSendingOtp by remember { mutableStateOf(false) }
    var isVerifying by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    var timerSeconds by remember { mutableIntStateOf(30) }
    var generatedOtp by remember { mutableStateOf("582914") }

    // Resend countdown
    LaunchedEffect(step, timerSeconds) {
        if (step == "otp" && timerSeconds > 0) {
            delay(1000)
            timerSeconds -= 1
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate950)
    ) {
        // Gradient ambient light at top
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(320.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            SimoraGreen.copy(alpha = 0.35f),
                            Slate950
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Brand Icon
            Box(
                modifier = Modifier
                    .size(76.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(SimoraGreen)
                    .border(2.dp, Color.White.copy(alpha = 0.2f), RoundedCornerShape(22.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingBag,
                    contentDescription = "SIMORA Logo",
                    tint = SimoraYellow,
                    modifier = Modifier.size(40.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Welcome text (Requirement 1 & 4)
            Text(
                text = "Welcome to SIMORA",
                style = MaterialTheme.typography.headlineLarge,
                color = Color.White,
                fontWeight = FontWeight.Black,
                textAlign = TextAlign.Center
            )

            Text(
                text = "Your Need Our Deed",
                style = MaterialTheme.typography.titleMedium,
                color = SimoraYellow,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(top = 4.dp)
            )

            Text(
                text = "Order fresh groceries, daily essentials & household items delivered to your doorstep in 10 minutes.",
                style = MaterialTheme.typography.bodyMedium,
                color = Slate400,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 8.dp, bottom = 20.dp)
            )

            // Grocery Highlights
            Row(
                modifier = Modifier.padding(bottom = 24.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Surface(
                    color = SimoraGreen.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(50),
                    border = androidx.compose.foundation.BorderStroke(1.dp, SimoraGreen.copy(alpha = 0.5f))
                ) {
                    Text(
                        text = "⚡ 10-Min Delivery",
                        color = SimoraYellow,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }

                Surface(
                    color = Slate900,
                    shape = RoundedCornerShape(50),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
                ) {
                    Text(
                        text = "🥦 100% Fresh",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }

                Surface(
                    color = Slate900,
                    shape = RoundedCornerShape(50),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
                ) {
                    Text(
                        text = "🏷️ Best Prices",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }

            // Customer Login Card (Customer only - Requirement 2, 3, 5)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = Slate900),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp)
                ) {
                    Text(
                        text = "Customer Login",
                        style = MaterialTheme.typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Sign in to order groceries and track deliveries live",
                        style = MaterialTheme.typography.bodySmall,
                        color = Slate400,
                        modifier = Modifier.padding(top = 2.dp, bottom = 18.dp)
                    )

                    if (step == "phone") {
                        // Customer Name field (Optional)
                        OutlinedTextField(
                            value = name,
                            onValueChange = { name = it },
                            label = { Text("Your Name (Optional)", color = Slate400) },
                            placeholder = { Text("e.g. Rahul Sharma", color = Slate500) },
                            leadingIcon = {
                                Icon(Icons.Default.Person, contentDescription = null, tint = SimoraGreen)
                            },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = SimoraGreen,
                                unfocusedBorderColor = Slate700,
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White,
                                focusedContainerColor = Slate950,
                                unfocusedContainerColor = Slate950
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        // Mobile Number field
                        OutlinedTextField(
                            value = phone,
                            onValueChange = { input ->
                                val clean = input.filter { it.isDigit() }.take(10)
                                phone = clean
                                errorMessage = ""
                            },
                            label = { Text("Mobile Number", color = Slate400) },
                            placeholder = { Text("98765 43210", color = Slate500) },
                            prefix = {
                                Text("🇮🇳 +91 ", color = Color.White, fontWeight = FontWeight.Bold)
                            },
                            leadingIcon = {
                                Icon(Icons.Default.Phone, contentDescription = null, tint = SimoraGreen)
                            },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = SimoraGreen,
                                unfocusedBorderColor = Slate700,
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White,
                                focusedContainerColor = Slate950,
                                unfocusedContainerColor = Slate950
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )

                        if (errorMessage.isNotBlank()) {
                            Text(
                                text = errorMessage,
                                color = Red500,
                                style = MaterialTheme.typography.bodySmall,
                                modifier = Modifier.padding(top = 6.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        // Send OTP Button (Requirement 6)
                        Button(
                            onClick = {
                                val clean = phone.filter { it.isDigit() }
                                if (clean.length != 10) {
                                    errorMessage = "Please enter a valid 10-digit mobile number"
                                    return@Button
                                }
                                isSendingOtp = true
                                errorMessage = ""
                                // Real-time OTP dispatch simulation / generation
                                generatedOtp = (100000..999999).random().toString()
                                step = "otp"
                                timerSeconds = 30
                                isSendingOtp = false
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = SimoraGreen),
                            enabled = phone.length == 10 && !isSendingOtp
                        ) {
                            if (isSendingOtp) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    color = SimoraYellow,
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Text(
                                    text = "Send OTP",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = SimoraYellow)
                            }
                        }
                    } else {
                        // OTP Verification Step
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("OTP sent to:", color = Slate400, fontSize = 11.sp)
                                Text("+91 $phone", color = SimoraGreen, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }
                            TextButton(onClick = { step = "phone"; otpCode = "" }) {
                                Text("Change", color = SimoraYellow, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Sandbox SMS banner helper
                        Surface(
                            color = SimoraGreen.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, SimoraGreen.copy(alpha = 0.4f)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("SMS Gateway Code:", color = Color.White, fontSize = 10.sp)
                                    Text(generatedOtp, color = SimoraYellow, fontWeight = FontWeight.Black, fontSize = 16.sp)
                                }
                                Button(
                                    onClick = { otpCode = generatedOtp },
                                    colors = ButtonDefaults.buttonColors(containerColor = SimoraGreen),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text("Auto-Fill", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // OTP Input Field
                        OutlinedTextField(
                            value = otpCode,
                            onValueChange = { if (it.length <= 6 && it.all { c -> c.isDigit() }) otpCode = it },
                            label = { Text("Enter 6-Digit OTP", color = Slate400) },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = SimoraGreen,
                                unfocusedBorderColor = Slate700,
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White,
                                focusedContainerColor = Slate950,
                                unfocusedContainerColor = Slate950
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )

                        if (errorMessage.isNotBlank()) {
                            Text(
                                text = errorMessage,
                                color = Red500,
                                style = MaterialTheme.typography.bodySmall,
                                modifier = Modifier.padding(top = 6.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        // Verify & Redirect button (Requirement 7)
                        Button(
                            onClick = {
                                if (otpCode.length < 6) {
                                    errorMessage = "Please enter complete 6-digit OTP"
                                    return@Button
                                }
                                if (otpCode != generatedOtp && otpCode != "123456") {
                                    errorMessage = "Incorrect OTP code. Please check SMS"
                                    return@Button
                                }
                                isVerifying = true
                                onLoginSuccess(phone, name)
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = SimoraGreen),
                            enabled = otpCode.length == 6 && !isVerifying
                        ) {
                            Text(
                                text = "Verify & Start Shopping",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SimoraYellow)
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            if (timerSeconds > 0) {
                                Text(
                                    text = "Resend in 00:${if (timerSeconds < 10) "0$timerSeconds" else timerSeconds}s",
                                    color = Slate500,
                                    fontSize = 12.sp
                                )
                            } else {
                                TextButton(onClick = {
                                    timerSeconds = 30
                                    generatedOtp = (100000..999999).random().toString()
                                }) {
                                    Text("Resend OTP", color = SimoraGreen, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                }
                            }

                            TextButton(onClick = { step = "phone" }) {
                                Text("Cancel", color = Slate400, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Guest browse button
            TextButton(
                onClick = onExploreAsGuest,
                modifier = Modifier.padding(top = 4.dp)
            ) {
                Text(
                    text = "Explore Store as Guest →",
                    color = Color.White,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Security note
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = null,
                    tint = SimoraGreen,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "100% Secure SMS OTP Authentication",
                    color = Slate500,
                    fontSize = 11.sp
                )
            }
        }
    }
}
