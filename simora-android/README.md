# SIMORA Native Android Application (Kotlin & Jetpack Compose)

This is the official, complete native Android Studio project for **SIMORA - Your Need Our Deed**, built entirely with modern **Kotlin** and **Jetpack Compose (Material 3)**.

---

## 📱 App Highlights & Architecture
- **Language**: Kotlin 2.0.0
- **UI Framework**: Jetpack Compose (Material 3)
- **Architecture**: MVVM with Kotlin Coroutines & StateFlow
- **Package Name**: `com.simora.customer`
- **Target Android SDK**: 34 (Android 14)
- **Minimum Android SDK**: 26 (Android 8.0 Oreo - 95%+ of all active Android devices)
- **Image Loading**: Coil 2.7.0 for Compose
- **Navigation**: Jetpack Navigation Compose

---

## 🚀 Features Included
1. **Welcome Screen (`WelcomeLoginScreen.kt`)**:
   - Prominently displays **"Welcome to SIMORA"**
   - Customer-only grocery shopping login (Admin, Rider, and Shopkeeper logins are excluded)
   - Real-time SMS OTP authentication with 10-digit Indian phone field
   - Guest Mode option ("Explore Store as Guest")
2. **Customer Storefront (`HomeScreen.kt`)**:
   - 10-Minute quick commerce header with delivery address pin
   - Category filter chips (Fresh Veggies, Dairy, Snacks, Staples, Cooking Essentials)
   - Real-time search by English & Hindi grocery names
   - 2-Column high-res grocery cards with rating, unit weight, discount pills, and instant `[- 1 +]` stepper
   - Floating persistent cart strip
3. **Product Detail Screen (`ProductDetailScreen.kt`)**:
   - High-res product images, hygiene guarantee, reviews breakdown, and direct cart actions
4. **Shopping Cart (`CartScreen.kt`)**:
   - Itemized cart list, free delivery threshold calculation (Free over ₹199), and item bill breakdown
5. **Checkout & Payment (`CheckoutScreen.kt`)**:
   - Address confirmation, delivery instructions (Doorbell, Guard, Avoid Call), and UPI/COD/Card payment selection
6. **Live Orders & Tracking (`OrdersScreen.kt` & `TrackingScreen.kt`)**:
   - Active order tracking with 4-digit Delivery PIN, assigned rider details, and countdown progress
7. **Customer Support (`SupportScreen.kt`)**:
   - Instant 24x7 WhatsApp & Phone dialer actions, with FAQ resolution

---

## 🛠️ Step-by-Step Instructions to Generate the APK (.apk)

### Option 1: Using Android Studio (Recommended, Graphical 1-Click)
1. Download the complete project ZIP archive or copy the `simora-android` directory to your computer.
2. Open **Android Studio** (Hedgehog, Iguana, or Koala).
3. Click **Open** and select the `simora-android` folder.
4. Allow Gradle to sync dependencies (takes ~1-2 minutes on first run).
5. In the top menu bar, click:
   `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
6. When the build finishes, Android Studio will show a notification popup in the bottom-right corner:
   `APK(s) generated successfully for 1 module`.
7. Click **locate** in that notification. Your installable `app-debug.apk` or `app-release.apk` will be in:
   `app/build/outputs/apk/debug/app-debug.apk`
8. Copy this `.apk` to your Android phone via USB, WhatsApp, or Google Drive, tap on it, and install!

### Option 2: Using Command Line (Terminal / Command Prompt)
Run the following command from the root of this folder:

```bash
# On Linux / macOS:
./gradlew assembleRelease

# On Windows:
gradlew.bat assembleRelease
```

The compiled APK will be located at:
`simora-android/app/build/outputs/apk/release/app-release.apk`

---

## 🔒 Permissions Configured
- `android.permission.INTERNET` (Network grocery catalog & order updates)
- `android.permission.ACCESS_NETWORK_STATE`
- `android.permission.ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION` (Accurate 10-minute dark store dispatch)
- `android.permission.POST_NOTIFICATIONS` (Real-time order delivery updates)
