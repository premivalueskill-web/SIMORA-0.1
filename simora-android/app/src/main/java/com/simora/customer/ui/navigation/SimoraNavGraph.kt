package com.simora.customer.ui.navigation

import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.simora.customer.data.model.Order
import com.simora.customer.ui.screens.*
import com.simora.customer.viewmodel.SimoraViewModel

object SimoraDestinations {
    const val WELCOME_LOGIN = "welcome_login"
    const val HOME = "home"
    const val PRODUCT_DETAIL = "product_detail"
    const val CART = "cart"
    const val CHECKOUT = "checkout"
    const val ORDERS = "orders"
    const val TRACKING = "tracking"
    const val SUPPORT = "support"
}

@Composable
fun SimoraNavGraph(
    viewModel: SimoraViewModel,
    navController: NavHostController = rememberNavController()
) {
    val selectedProduct by viewModel.selectedProduct.collectAsState()
    var activeTrackingOrder by remember { mutableStateOf<Order?>(null) }

    NavHost(
        navController = navController,
        startDestination = SimoraDestinations.WELCOME_LOGIN
    ) {
        // First Screen: Welcome to SIMORA with customer login
        composable(SimoraDestinations.WELCOME_LOGIN) {
            WelcomeLoginScreen(
                onLoginSuccess = { phone, name ->
                    viewModel.verifyOtpAndLogin(phone, name)
                    navController.navigate(SimoraDestinations.HOME) {
                        popUpTo(SimoraDestinations.WELCOME_LOGIN) { inclusive = true }
                    }
                },
                onExploreAsGuest = {
                    navController.navigate(SimoraDestinations.HOME)
                }
            )
        }

        // Customer Storefront
        composable(SimoraDestinations.HOME) {
            HomeScreen(
                viewModel = viewModel,
                onNavigateToCart = { navController.navigate(SimoraDestinations.CART) },
                onNavigateToOrders = { navController.navigate(SimoraDestinations.ORDERS) },
                onNavigateToSupport = { navController.navigate(SimoraDestinations.SUPPORT) },
                onSelectProduct = { product ->
                    viewModel.setSelectedProduct(product)
                    navController.navigate(SimoraDestinations.PRODUCT_DETAIL)
                }
            )
        }

        // Product Details
        composable(SimoraDestinations.PRODUCT_DETAIL) {
            selectedProduct?.let { product ->
                ProductDetailScreen(
                    product = product,
                    viewModel = viewModel,
                    onBack = { navController.popBackStack() },
                    onGoToCart = { navController.navigate(SimoraDestinations.CART) }
                )
            }
        }

        // Cart
        composable(SimoraDestinations.CART) {
            CartScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onProceedToCheckout = { navController.navigate(SimoraDestinations.CHECKOUT) }
            )
        }

        // Checkout
        composable(SimoraDestinations.CHECKOUT) {
            CheckoutScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onOrderPlaced = { order ->
                    activeTrackingOrder = order
                    navController.navigate(SimoraDestinations.TRACKING) {
                        popUpTo(SimoraDestinations.HOME) { inclusive = false }
                    }
                }
            )
        }

        // Orders
        composable(SimoraDestinations.ORDERS) {
            OrdersScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onTrackOrder = { order ->
                    activeTrackingOrder = order
                    navController.navigate(SimoraDestinations.TRACKING)
                }
            )
        }

        // Live Order Tracking
        composable(SimoraDestinations.TRACKING) {
            val fallbackOrder = viewModel.orders.collectAsState().value.firstOrNull()
            val orderToTrack = activeTrackingOrder ?: fallbackOrder
            if (orderToTrack != null) {
                TrackingScreen(
                    order = orderToTrack,
                    onBack = { navController.popBackStack() }
                )
            }
        }

        // Customer Support
        composable(SimoraDestinations.SUPPORT) {
            SupportScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}
