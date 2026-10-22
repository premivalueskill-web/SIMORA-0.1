export type ProductCategory = 
  | 'vegetables_fruits'
  | 'dairy_breakfast'
  | 'snacks_munchies'
  | 'cold_drinks_juices'
  | 'staples_kitchen'
  | 'personal_care';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  hindiName?: string;
  iconName: string;
  tagline: string;
  count?: number;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  unit: string; // e.g., "500 g", "1 kg", "1 L", "1 pack (6 pcs)"
  image: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  deliveryTimeMins: number; // e.g., 9-12 mins
  badge?: string; // "Bestseller", "Organic", "Direct Farm", "Offer"
  description: string;
  ingredients?: string;
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  recipientName: string;
  phone: string;
  houseFlat: string;
  areaStreet: string;
  landmark?: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export type OrderStatus = 
  | 'placed' 
  | 'packed' 
  | 'assigned' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 
  | 'cod' 
  | 'razorpay_upi' 
  | 'razorpay_card' 
  | 'razorpay_netbanking';

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicle: string;
  vehiclePlate: string;
  photoUrl: string;
  currentLat: number;
  currentLng: number;
  isOnline: boolean;
  activeOrderId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  handlingFee: number;
  discount: number;
  tip: number;
  total: number;
  address: DeliveryAddress;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'cod_pending' | 'refunded';
  deliveryPin: string; // 4-digit OTP to verify delivery with rider
  assignedRiderId?: string;
  assignedRider?: DeliveryPartner;
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveredAt?: string;
  instructions?: string;
  routeCoordinates?: {
    storeLat: number;
    storeLng: number;
    currentLat: number;
    currentLng: number;
    targetLat: number;
    targetLng: number;
  };
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
  orderId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export type AppRole = 'customer' | 'rider' | 'shopkeeper';

export interface DeliveryPartnerProfile {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  vehiclePlate: string;
  rating: number;
  isOnline: boolean;
  isLoggedIn: boolean;
}

export interface StoreInfo {
  id: string;
  storeName: string;
  storeCode: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  isOpen: boolean;
  gstNumber?: string;
  fssaiNumber?: string;
}

export interface ShopkeeperProfile {
  id: string;
  name: string;
  phone: string;
  storeName: string;
  storeId: string;
  isLoggedIn: boolean;
  avatar?: string;
}


