import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  DeliveryAddress, 
  Order, 
  DeliveryPartner, 
  Coupon, 
  AppNotification, 
  UserProfile, 
  ProductCategory,
  OrderStatus,
  PaymentMethod,
  AppRole,
  StoreInfo,
  ShopkeeperProfile,
  DeliveryPartnerProfile
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ADDRESSES, 
  INITIAL_RIDERS, 
  AVAILABLE_COUPONS,
  CATEGORIES 
} from '../data/initialData';

interface AppContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  user: UserProfile;
  loginWithPhone: (phone: string, name: string) => void;
  logout: () => void;

  // Real-Time Mobile OTP Auth & Starting Login Screen
  isAuthenticated: boolean;
  showLoginScreen: boolean;
  setShowLoginScreen: (show: boolean) => void;
  authToken: string | null;
  loginWithVerifiedOtp: (
    token: string, 
    phone: string, 
    role: AppRole, 
    name?: string, 
    extra?: { storeName?: string; vehiclePlate?: string }
  ) => void;

  // Delivery Partner State
  riderProfile: DeliveryPartnerProfile;
  updateRiderProfile: (profile: Partial<DeliveryPartnerProfile>) => void;

  // Shopkeeper & Store Management
  storeInfo: StoreInfo;
  updateStoreInfo: (info: Partial<StoreInfo>) => void;
  toggleStoreOpen: () => void;
  shopkeeperUser: ShopkeeperProfile;
  loginShopkeeper: (phone: string, storeName: string, ownerName?: string) => void;
  logoutShopkeeper: () => void;
  
  // Products
  products: Product[];
  activeCategory: ProductCategory | 'all';
  setActiveCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  addProduct: (p: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Addresses
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress | null;
  setSelectedAddress: (addr: DeliveryAddress) => void;
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => DeliveryAddress;
  deleteAddress: (id: string) => void;

  // Coupons
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;

  // Orders
  orders: Order[];
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  placeOrder: (orderPayload: {
    address: DeliveryAddress;
    paymentMethod: PaymentMethod;
    tip: number;
    instructions?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string) => void;
  verifyDeliveryPin: (orderId: string, pin: string) => boolean;

  // Delivery Partners
  riders: DeliveryPartner[];
  activeRider: DeliveryPartner;
  toggleRiderOnline: (riderId: string) => void;
  assignOrderToRider: (orderId: string, riderId: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  unreadNotificationsCount: number;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isOrdersModalOpen: boolean;
  setIsOrdersModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isSmartListModalOpen: boolean;
  setIsSmartListModalOpen: (open: boolean) => void;
  isPlayStoreModalOpen: boolean;
  setIsPlayStoreModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current active mode: customer | rider | shopkeeper
  const [role, setRole] = useState<AppRole>(() => {
    const saved = localStorage.getItem('simora_role') as AppRole;
    if (saved === 'shopkeeper' || saved === 'rider') return saved;
    return 'customer';
  });

  // Auth Session & Starting Screen States
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('simora_auth_token');
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedToken = localStorage.getItem('simora_auth_token');
    const isAuth = localStorage.getItem('simora_is_authenticated');
    return Boolean(savedToken && isAuth === 'true');
  });

  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(() => {
    const savedToken = localStorage.getItem('simora_auth_token');
    const isAuth = localStorage.getItem('simora_is_authenticated');
    return !(savedToken && isAuth === 'true');
  });

  // Delivery Partner Profile
  const [riderProfile, setRiderProfile] = useState<DeliveryPartnerProfile>(() => {
    const saved = localStorage.getItem('simora_rider_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: 'rider-1',
      name: 'Rahul Sharma',
      phone: '+91 98111 22334',
      vehicle: 'Honda Activa 6G',
      vehiclePlate: 'KA 01 EK 4482',
      rating: 4.9,
      isOnline: true,
      isLoggedIn: false
    };
  });

  // Store information for Shopkeeper Interface
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => {
    const saved = localStorage.getItem('simora_store_info');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: 'store-104',
      storeName: 'SIMORA Dark Store #104',
      storeCode: 'BLR-KRM-104',
      ownerName: 'Ramesh Patel',
      phone: '+91 98450 11223',
      email: 'merchant.koramangala@simora.in',
      address: 'Plot 48, Industrial Layout, 5th Block Koramangala',
      city: 'Bengaluru',
      pincode: '560034',
      isOpen: true,
      gstNumber: '29AABCS1429B1Z2',
      fssaiNumber: '11223334000129'
    };
  });

  // Shopkeeper profile
  const [shopkeeperUser, setShopkeeperUser] = useState<ShopkeeperProfile>(() => {
    const saved = localStorage.getItem('simora_shopkeeper');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: 'merch-88',
      name: 'Ramesh Patel',
      phone: '+91 98450 11223',
      storeName: 'SIMORA Dark Store #104',
      storeId: 'store-104',
      isLoggedIn: true,
    };
  });

  // User auth state with local storage
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('simora_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: 'u-101',
      name: 'Shree Kumar',
      phone: '+91 98765 43210',
      email: 'theshree156@gmail.com',
      isLoggedIn: true,
    };
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('simora_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  // Addresses
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('simora_addresses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ADDRESSES;
  });

  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(() => {
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('simora_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[4], quantity: 2 },
    ];
  });

  // Coupons
  const [coupons] = useState<Coupon[]>(AVAILABLE_COUPONS);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('simora_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Initial sample order for instant testing
    return [
      {
        id: 'ord-simora-8821',
        orderNumber: 'SIM-8821',
        userId: 'u-101',
        customerName: 'Shree Kumar',
        customerPhone: '+91 98765 43210',
        items: [
          { product: INITIAL_PRODUCTS[0], quantity: 1 },
          { product: INITIAL_PRODUCTS[1], quantity: 2 },
        ],
        subtotal: 102,
        deliveryFee: 0,
        handlingFee: 5,
        discount: 0,
        tip: 20,
        total: 127,
        address: INITIAL_ADDRESSES[0],
        status: 'out_for_delivery',
        paymentMethod: 'razorpay_upi',
        paymentStatus: 'paid',
        deliveryPin: '4892',
        assignedRiderId: 'rider-1',
        assignedRider: INITIAL_RIDERS[0],
        createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
        estimatedDeliveryTime: '3 mins',
        instructions: 'Please ring the doorbell and leave at door step',
        routeCoordinates: {
          storeLat: 12.9340,
          storeLng: 77.6180,
          currentLat: 12.9348,
          currentLng: 77.6225,
          targetLat: INITIAL_ADDRESSES[0].latitude,
          targetLng: INITIAL_ADDRESSES[0].longitude,
        }
      }
    ];
  });

  // Riders
  const [riders, setRiders] = useState<DeliveryPartner[]>(() => {
    const saved = localStorage.getItem('simora_riders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RIDERS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Order Out for Delivery!',
      message: 'Rahul Sharma is on the way with your order #SIM-8821. Estimated delivery in 3 mins.',
      timestamp: '2 mins ago',
      read: false,
      type: 'order',
      orderId: 'ord-simora-8821',
    },
    {
      id: 'notif-2',
      title: 'Welcome to SIMORA',
      message: 'Your Need Our Deed! Use code SIMORA50 on your first grocery delivery.',
      timestamp: '1 hour ago',
      read: true,
      type: 'promo',
    }
  ]);

  // Navigation / Filter State
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSmartListModalOpen, setIsSmartListModalOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('simora_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('simora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('simora_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('simora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('simora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('simora_riders', JSON.stringify(riders));
  }, [riders]);

  useEffect(() => {
    localStorage.setItem('simora_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('simora_store_info', JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    localStorage.setItem('simora_shopkeeper', JSON.stringify(shopkeeperUser));
  }, [shopkeeperUser]);

  // Store & Shopkeeper functions
  const updateStoreInfo = (info: Partial<StoreInfo>) => {
    setStoreInfo(prev => {
      const updated = { ...prev, ...info };
      return updated;
    });
  };

  const toggleStoreOpen = () => {
    setStoreInfo(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  const loginShopkeeper = (phone: string, storeName: string, ownerName?: string) => {
    const updated: ShopkeeperProfile = {
      id: 'merch-' + Date.now().toString().slice(-4),
      name: ownerName || storeInfo.ownerName || 'Store Manager',
      phone,
      storeName: storeName || storeInfo.storeName || 'SIMORA Dark Store',
      storeId: storeInfo.id,
      isLoggedIn: true,
    };
    setShopkeeperUser(updated);
    setRole('shopkeeper');
  };

  const logoutShopkeeper = () => {
    const guest: ShopkeeperProfile = {
      id: '',
      name: '',
      phone: '',
      storeName: '',
      storeId: '',
      isLoggedIn: false,
    };
    setShopkeeperUser(guest);
    setRole('customer');
  };

  const updateRiderProfile = (updates: Partial<DeliveryPartnerProfile>) => {
    setRiderProfile(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('simora_rider_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const loginWithVerifiedOtp = (
    token: string, 
    phone: string, 
    userRole: AppRole, 
    name?: string, 
    extra?: { storeName?: string; vehiclePlate?: string }
  ) => {
    setAuthToken(token);
    localStorage.setItem('simora_auth_token', token);
    localStorage.setItem('simora_is_authenticated', 'true');
    setIsAuthenticated(true);
    setShowLoginScreen(false);
    setRole(userRole);
    localStorage.setItem('simora_role', userRole);

    if (userRole === 'customer') {
      const updatedUser: UserProfile = {
        id: 'u-' + phone.replace(/\D/g, '').slice(-4),
        name: name || 'SIMORA Customer',
        phone,
        isLoggedIn: true,
      };
      setUser(updatedUser);
      localStorage.setItem('simora_user', JSON.stringify(updatedUser));
    } else if (userRole === 'rider') {
      const updatedRider: DeliveryPartnerProfile = {
        id: 'rider-1',
        name: name || 'Rahul Sharma',
        phone,
        vehicle: 'Honda Activa 6G',
        vehiclePlate: extra?.vehiclePlate || 'KA 01 EK 4482',
        rating: 4.9,
        isOnline: true,
        isLoggedIn: true,
      };
      setRiderProfile(updatedRider);
      localStorage.setItem('simora_rider_profile', JSON.stringify(updatedRider));
    } else if (userRole === 'shopkeeper') {
      const updatedShopkeeper: ShopkeeperProfile = {
        id: 'merch-' + phone.replace(/\D/g, '').slice(-4),
        name: name || 'Store Manager',
        phone,
        storeName: extra?.storeName || storeInfo.storeName || 'SIMORA Dark Store #104',
        storeId: storeInfo.id,
        isLoggedIn: true,
      };
      setShopkeeperUser(updatedShopkeeper);
      localStorage.setItem('simora_shopkeeper', JSON.stringify(updatedShopkeeper));
      if (extra?.storeName) {
        updateStoreInfo({ storeName: extra.storeName });
      }
    }

    setNotifications(prev => [
      {
        id: 'n-' + Date.now(),
        title: 'Verified with Mobile OTP',
        message: `Welcome to SIMORA (${userRole.toUpperCase()}). You are securely logged in with +91 ${phone.replace(/\D/g, '').slice(-10)}.`,
        timestamp: 'Just now',
        read: false,
        type: 'system',
      },
      ...prev
    ]);
  };

  // Legacy/Fallback login with phone
  const loginWithPhone = (phone: string, name: string) => {
    loginWithVerifiedOtp('mock_sess_' + Date.now(), phone, 'customer', name);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    if (authToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      }).catch(() => {});
    }
    setAuthToken(null);
    setIsAuthenticated(false);
    setShowLoginScreen(true);
    localStorage.removeItem('simora_auth_token');
    localStorage.setItem('simora_is_authenticated', 'false');
    setUser({
      id: '',
      name: 'Guest',
      phone: '',
      isLoggedIn: false,
    });
    setRiderProfile(prev => ({ ...prev, isLoggedIn: false }));
    setShopkeeperUser(prev => ({ ...prev, isLoggedIn: false }));
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Address operations
  const addAddress = (addr: Omit<DeliveryAddress, 'id'>): DeliveryAddress => {
    const newAddress: DeliveryAddress = {
      ...addr,
      id: 'addr-' + Date.now(),
    };
    const updated = [newAddress, ...addresses.map(a => addr.isDefault ? { ...a, isDefault: false } : a)];
    setAddresses(updated);
    setSelectedAddress(newAddress);
    return newAddress;
  };

  const deleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated[0] || null);
    }
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try SIMORA50 or WELCOME100' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return { 
        success: false, 
        message: `Minimum order value for ${found.code} is ₹${found.minOrderValue}. Add items worth ₹${found.minOrderValue - cartSubtotal} more!` 
      };
    }
    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const discountAmount = React.useMemo(() => {
    if (!activeCoupon) return 0;
    if (activeCoupon.discountType === 'flat') {
      return activeCoupon.discountValue;
    }
    const percentAmount = Math.round((cartSubtotal * activeCoupon.discountValue) / 100);
    return activeCoupon.maxDiscount ? Math.min(percentAmount, activeCoupon.maxDiscount) : percentAmount;
  }, [activeCoupon, cartSubtotal]);

  // Order Operations
  const placeOrder = ({
    address,
    paymentMethod,
    tip,
    instructions
  }: {
    address: DeliveryAddress;
    paymentMethod: PaymentMethod;
    tip: number;
    instructions?: string;
  }): Order => {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ord-simora-${orderNum}`;
    const deliveryFee = cartSubtotal > 199 || activeCoupon?.code === 'FREEDEL' ? 0 : 25;
    const handlingFee = 5;
    const finalTotal = Math.max(0, cartSubtotal + deliveryFee + handlingFee + tip - discountAmount);

    // Generate random 4-digit secret delivery pin
    const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString();

    // Assign nearest active rider
    const availableRider = riders.find(r => r.isOnline) || riders[0];

    const newOrder: Order = {
      id: orderId,
      orderNumber: `SIM-${orderNum}`,
      userId: user.id || 'u-guest',
      customerName: user.name || address.recipientName,
      customerPhone: user.phone || address.phone,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      handlingFee,
      discount: discountAmount,
      tip,
      total: finalTotal,
      address,
      status: 'placed',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
      deliveryPin,
      assignedRiderId: availableRider.id,
      assignedRider: availableRider,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '10-12 mins',
      instructions,
      routeCoordinates: {
        storeLat: address.latitude + 0.006,
        storeLng: address.longitude - 0.005,
        currentLat: address.latitude + 0.006,
        currentLng: address.longitude - 0.005,
        targetLat: address.latitude,
        targetLng: address.longitude,
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Add notification
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: `Order #${newOrder.orderNumber} Confirmed!`,
        message: `Dark Store has received your order of ${newOrder.items.length} items. Delivery partner assigned.`,
        timestamp: 'Just now',
        read: false,
        type: 'order',
        orderId: newOrder.id,
      },
      ...prev
    ]);

    // Set tracking
    setActiveTrackingOrderId(newOrder.id);

    // Auto simulate progression for realistic demo
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'packed', 'Items packed and checked at Hub');
    }, 4000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'out_for_delivery', `${availableRider.name} is speeding towards your location`);
    }, 9000);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const isDelivered = status === 'delivered';
        return {
          ...order,
          status,
          deliveredAt: isDelivered ? new Date().toISOString() : order.deliveredAt,
          paymentStatus: isDelivered && order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus,
        };
      })
    );

    // Notify user
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      let title = `Order Update: #${targetOrder.orderNumber}`;
      let message = note || `Status updated to ${status.replace(/_/g, ' ')}`;
      if (status === 'delivered') {
        title = `Order #${targetOrder.orderNumber} Delivered!`;
        message = 'Thank you for choosing SIMORA – Your Need Our Deed. Enjoy your groceries!';
      }
      setNotifications(prev => [
        {
          id: 'notif-' + Date.now(),
          title,
          message,
          timestamp: 'Just now',
          read: false,
          type: 'order',
          orderId,
        },
        ...prev
      ]);
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: 'cancelled',
          paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : 'pending',
        };
      })
    );

    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Order Cancelled',
        message: `Order #${orderId} has been cancelled. Any online payment will be refunded to your original payment method.`,
        timestamp: 'Just now',
        read: false,
        type: 'order',
        orderId,
      },
      ...prev
    ]);
  };

  const verifyDeliveryPin = (orderId: string, enteredPin: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;
    if (order.deliveryPin === enteredPin.trim()) {
      updateOrderStatus(orderId, 'delivered', 'Order handed over after successful OTP/PIN verification.');
      return true;
    }
    return false;
  };

  // Product CRUD for Admin
  const addProduct = (p: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...p,
      id: 'p-custom-' + Date.now(),
      rating: 4.8,
      reviewCount: 1,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // Delivery partner toggle
  const toggleRiderOnline = (riderId: string) => {
    setRiders(prev =>
      prev.map(r => (r.id === riderId ? { ...r, isOnline: !r.isOnline } : r))
    );
  };

  const assignOrderToRider = (orderId: string, riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    if (!rider) return;
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              assignedRiderId: riderId,
              assignedRider: rider,
              status: order.status === 'placed' ? 'assigned' : order.status,
            }
          : order
      )
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const activeRider = riders[0];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        loginWithPhone,
        logout,
        isAuthenticated,
        showLoginScreen,
        setShowLoginScreen,
        authToken,
        loginWithVerifiedOtp,
        riderProfile,
        updateRiderProfile,
        storeInfo,
        updateStoreInfo,
        toggleStoreOpen,
        shopkeeperUser,
        loginShopkeeper,
        logoutShopkeeper,
        products,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedProductForDetail,
        setSelectedProductForDetail,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        deleteAddress,
        coupons,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        orders,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        verifyDeliveryPin,
        riders,
        activeRider,
        toggleRiderOnline,
        assignOrderToRider,
        notifications,
        markNotificationRead,
        unreadNotificationsCount,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isSmartListModalOpen,
        setIsSmartListModalOpen,
        isPlayStoreModalOpen,
        setIsPlayStoreModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
