import { Wrench, Shovel, ShoppingCart, Store, Package, TrendingUp } from "lucide-react";
import '../index.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


function Homepage() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState("All Categories");
    const [searchQuery, setSearchQuery] = useState("");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [orderMessage, setOrderMessage] = useState("");
    const [showOrderMessage, setShowOrderMessage] = useState(false); 
    const [orderForm, setOrderForm] = useState({
        customer_name: "",
        quantity: 1,
        unit: "kilo",
        address: "",
        contact_number: "",
        payment_type: "Gcash"
    });
    const [activeSection, setActiveSection] = useState("store");
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [editingOrder, setEditingOrder] = useState(null);
    const [newQuantity, setNewQuantity] = useState(1);
    const [newAddress, setNewAddress] = useState("");
    const [topSellingData, setTopSellingData] = useState([]);
    const [phone, setPhone] = useState("");

    const fetchItems = async () => {
        try {
            let url = "https://wide-rings-jam.loca.lt/api/items";
            let params = {};

            if (category && category !== "All Categories") {
            params.category = category;
            }

            if (searchQuery) {
            url = "https://wide-rings-jam.loca.lt/api/items/search";
            params.name = searchQuery;
            }

            const response = await axios.get(url, { params });
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleItemQuantityUpdate = (itemId, change) => {
        setItems((prevItems) =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(item.quantity + change, 0) }
                    : item
            )
        );
    };

    useEffect(() => {
        fetchItems();

        const interval = setInterval(() => {
            fetchItems();
        }, 5000);

        return () => clearInterval(interval);
    }, [category, searchQuery]);

    const handleOrderSubmit = async () => {
        try {
            const orderPayload = {
                item: { id: currentItem.id },
                customer_name: orderForm.customer_name,
                order_name: currentItem.itemName,
                quantity: orderForm.quantity,
                unit: orderForm.unit,
                total_price: currentItem.price * orderForm.quantity,
                address: orderForm.address,
                contactNumber: orderForm.contact_number,
                order_date: new Date().toISOString().split("T")[0],
                employee_id: 1,
                payment_type: orderForm.payment_type
            };

            const orderResponse = await axios.post(
                "https://wide-rings-jam.loca.lt/api/orders",
                orderPayload
            );
            const orderId = orderResponse.data.orderId;

            if (orderForm.payment_type === "CashOnDelivery") {
                const codResponse = await axios.post(
                    "https://wide-rings-jam.loca.lt/payments/create-checkout",
                    {
                        amount: Number(orderPayload.total_price),
                        productId: Number(currentItem.id),
                        orderId: Number(orderId),
                        paymentType: "CashOnDelivery"
                    }
                );

                if (codResponse.data.codSuccess) {
                    setOrders(prev => [
                        ...prev,
                        {
                            orderId,
                            customer_name: orderForm.customer_name,
                            order_name: currentItem.itemName,
                            quantity: orderForm.quantity,
                            unit: orderForm.unit,
                            total_price: orderPayload.total_price,
                            address: orderForm.address,
                            contactNumber: orderForm.contact_number,
                            order_date: orderPayload.order_date,
                            employee_id: 1,
                            item_id: currentItem.id,
                            item: { ...currentItem, quantity: currentItem.quantity - orderForm.quantity }, // update quantity
                            payment_type: "CashOnDelivery"
                        }
                    ]);

                    setItems(prevItems => prevItems.map(i =>
                        i.id === currentItem.id ? { ...i, quantity: i.quantity - orderForm.quantity } : i
                    ));

                    setCurrentItem(prev => ({ ...prev, quantity: prev.quantity - orderForm.quantity }));

                    setShowOrderModal(false);
                    setAlertMessage("Order placed successfully! Please prepare cash on delivery.");
                    setTimeout(() => setAlertMessage(""), 3000);
                } else {
                    setOrderMessage("❌ Something went wrong. Please try again.");
                    setShowOrderMessage(true);
                    setTimeout(() => setShowOrderMessage(false), 3000);
                }
                } else {
                    const paymentResponse = await axios.post(
                        "https://wide-rings-jam.loca.lt/payments/create-checkout",
                        {
                            amount: Number(orderPayload.total_price),
                            productId: Number(currentItem.id),
                            orderId: Number(orderId),
                            paymentType: orderForm.payment_type
                        }
                    );

                if (paymentResponse.data.checkoutUrl) {
                    window.location.href = paymentResponse.data.checkoutUrl;
                } else {
                    setOrderMessage("❌ Something went wrong. Please try again.");
                    setShowOrderMessage(true);
                    setTimeout(() => setShowOrderMessage(false), 3000);
                }
            }

            setShowOrderModal(false);

        } catch (err) {
            console.error("Error creating order/payment:", err);
            setOrderMessage("❌ Something went wrong. Please try again.");
            setShowOrderMessage(true);
            setTimeout(() => setShowOrderMessage(false), 3000);
        }
    };

    const handleBuyNowClick = (item) => {
        setCurrentItem(item);
        setShowOrderModal(true);
    };

    const fetchOrdersByPhone = async () => {
        try {
            const res = await axios.get(`https://wide-rings-jam.loca.lt/api/orders/by-phone/${phone}`);
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]); 
        }
    };

    // handleCancel function
    const handleCancel = async (orderId, itemId) => {
        try {
            await axios.delete(`https://wide-rings-jam.loca.lt/api/orders/${orderId}/cancel`);

            setAlertMessage("Order cancelled successfully");

            setOrders(prev => prev.filter(order => order.orderId !== orderId));

            handleItemQuantityUpdate(itemId, 1);

            setTimeout(() => setAlertMessage(""), 3000);
        } catch (error) {
            console.error("Error cancelling order:", error);

            setAlertMessage("Failed to cancel order");
            setTimeout(() => setAlertMessage(""), 3000);
        }
    };

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const handleAddToCart = (item) => {
        const newCartItem = {
            cartId: Date.now(),
            item: item,
            quantity: 1,
            total_price: item.price,
        };

        setCart((prev) => [...prev, newCartItem]);

        setOrderMessage(
            `✅ ${item.itemName} (₱${item.price}) added to cart successfully!`
        );
        setShowOrderMessage(true);

        setTimeout(() => {
            setShowOrderMessage(false);
        }, 2000);
        };

        const handleRemoveFromCart = (cartId) => {
        setCart((prev) => prev.filter((c) => c.cartId !== cartId));
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setNewQuantity(order.quantity);
        setNewAddress(order.address || "");
        };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(
            `https://wide-rings-jam.loca.lt/api/orders/${editingOrder.orderId}`,
            {
                ...editingOrder,
                quantity: newQuantity,
                address: newAddress,
            }
            );

            const updatedOrder = {
            orderNo: response.data.orderId,
            item: response.data.item?.itemName || "N/A",
            customer: response.data.customer_name,
            quantity: response.data.quantity,
            price: `₱${response.data.total_price}`,
            address: response.data.address,
            payment: response.data.payment_type,
            date: response.data.order_date,
            status: response.data.status || "Pending",
            };

            setOrders((prevOrders) =>
            prevOrders.map((o) =>
                o.orderNo === updatedOrder.orderNo ? updatedOrder : o
            )
            );

            await fetchItems();
            setEditingOrder(null);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const handleDelivered = async (orderId) => {
        try {
            const response = await axios.put(`https://wide-rings-jam.loca.lt/api/orders/${orderId}/delivered`);
            setOrders(prev =>
                prev.map(o => o.orderId === orderId ? { ...o, status: "Delivered" } : o)
            );
        } catch (err) {
            console.error("Error marking delivered:", err);
        }
    };

    useEffect(() => {
        axios
            .get("https://kind-beers-rescue.loca.lt/")
            .then((res) => {
            // Transform API data
            const transformed = res.data.map((entry) => ({
                id: entry.item.id,
                name: entry.item.itemName,
                percentage: parseFloat(entry.item.percentage),
                sales: parseInt(entry.item.quantity, 10), // use quantity as "sales"
                image: entry.item.imagePath, // may be null
            }));

            setTopSellingData(transformed);
            })
            .catch((err) => console.error("Error fetching top selling items:", err));
    }, []);

    return(
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="w-full flex justify-between items-center bg-black py-5 px-6">
                <h1 className="flex items-center gap-3 text-xl font-bold text-white">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    N-Tech Hardware
                </h1>

                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                    <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-3 pr-9 py-1.5 text-sm border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 10.5a7.5 7.5 0 0012.9 6.15z"
                        />
                    </svg>
                </div>
            </header>

           <section className="relative flex flex-col items-start text-left mt-5 mx-6 px-6 py-20 
                    bg-black rounded-2xl shadow-lg overflow-hidden">

                {/* Animated background icons */}
                <Wrench 
                className="absolute top-10 left-10 text-gray-700 opacity-80 w-16 h-16 animate-bounce"
                />
                <Shovel 
                className="absolute top-20 right-20 text-gray-700 opacity-80 w-16 h-16 animate-bounce"
                />

                <Wrench 
                className="absolute bottom-20 left-1/4 text-gray-700 opacity-70 w-14 h-14 animate-bounce"
                />
                <Shovel 
                className="absolute bottom-16 right-1/3 text-gray-700 opacity-70 w-14 h-14 animate-bounce"
                />

                <Wrench 
                className="absolute top-1/3 right-1/4 text-gray-700 opacity-60 w-12 h-12 animate-bounce"
                />
                <Shovel 
                className="absolute bottom-1/4 left-1/3 text-gray-700 opacity-60 w-12 h-12 animate-bounce"
                />
                {/* Content */}
                <div className="relative z-10 ml-10">
                    <h2 className="text-4xl font-extrabold text-white mb-4">
                    Welcome to N-Tech Hardware
                    </h2>
                    <p className="text-gray-300 max-w-xl mb-6">
                        You may have noticed some of the tools used during your home inspection. Now you too can own some of these tools and other items needed as a homeowner.
                    </p>
                </div>
            </section>

            <nav className="bg-white shadow-md py-4 px-10 mt-5 rounded-xl mx-auto max-w-6xl">
                <div className="flex justify-center gap-12">
                    <button
                    onClick={() => setActiveSection("store")}
                    className={`flex items-center gap-2 font-medium transition ${
                        activeSection === "store" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    }`}
                    >
                    <Store className="w-5 h-5" />
                    Store
                    </button>
                     <button
                    onClick={() => setActiveSection("orders")}
                    className={`flex items-center gap-2 font-medium transition ${
                        activeSection === "orders" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    }`}
                    >
                    <Package className="w-5 h-5" />
                    My Orders
                    </button>
                   <button
                    onClick={() => setActiveSection("cart")}
                    className={`flex items-center gap-2 font-medium transition ${
                        activeSection === "cart" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    }`}
                    >
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                    </button>
                    <button
                        onClick={() => setActiveSection("topSelling")}
                        className={`flex items-center gap-2 font-medium transition ${
                        activeSection === "topSelling"
                            ? "text-blue-600"
                            : "text-gray-700 hover:text-blue-600"
                        }`}
                    >
                        <TrendingUp className="w-5 h-5" />
                        Top Selling
                    </button>
                </div>
            </nav>

             {/* Category Dropdown */}
            <div className="flex justify-start items-center gap-4 p-6">
                <label htmlFor="category" className="text-gray-700 font-medium">
                Category:
                </label>
                <select
                id="category"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                <option value="All Categories">All Categories</option>
                <option value="tools">Tools</option>
                <option value="plumbing Tools">Plumbing Tools</option>
                <option value="electronics">Electronics</option>
                </select>
            </div>

            <div className="p-6">
                {alertMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white p-6 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                    <svg
                        className="w-6 h-6 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-black text-lg font-medium">{alertMessage}</span>
                    </div>
                </div>
                )}

                {activeSection === "store" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
                        <img
                            src={`https://tame-rice-hear.loca.lt/${item.imagePath.replace(/\\/g, "/")}`}
                            alt={item.itemName}
                            className="w-full h-40"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{item.itemName}</h3>
                            <p className="text-sm text-gray-600 capitalize">Category: {item.category}</p>
                            <p className="text-sm text-gray-600">Unit: {item.unit}</p>
                            <p className="text-xl font-bold mt-2">₱{item.price}</p>
                            <p className="text-sm text-gray-500">Stock: {item.quantity}</p>
                            <div className="flex gap-2 mt-3">
                            <button
                            className="flex-1 bg-gray-300 text-black py-2 rounded-xl hover:bg-gray-400 transition"
                            onClick={() => handleAddToCart(item)}
                            >
                            Add to Cart
                            </button>
                            <button
                                className="flex-1 bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
                                onClick={() => handleBuyNowClick(item)}
                            >
                                Buy Now
                            </button>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}

                {activeSection === "orders" && (
                    <div className="space-y-4">
                        {/* Always show phone number input */}
                        <div className="mb-4 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border p-2 rounded flex-grow"
                        />
                        <button
                            onClick={fetchOrdersByPhone}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                        >
                            View My Orders
                        </button>
                        </div>

                        {/* Show orders if available */}
                        {orders.length > 0 ? (
                        orders.map((order) => (
                            <div
                            key={order.orderId}
                            className={`shadow rounded-xl p-4 flex justify-between items-start ${
                                order.status === "Delivered"
                                ? "bg-green-100 border border-green-300"
                                : "bg-white"
                            }`}
                            >
                            {/* Left Section: Image + Details */}
                            <div className="flex items-start gap-4">
                                {order.item ? (
                                <img
                                    src={`https://wide-rings-jam.loca.lt/${order.item.imagePath.replace(/\\/g, "/")}`}
                                    alt={order.item.itemName}
                                    className="w-40 h-40 rounded-lg"
                                />
                                ) : (
                                <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                                    No Image
                                </div>
                                )}
                                <div>
                                <h3 className="text-lg font-bold">
                                    {order.item ? order.item.itemName : "No Item"}
                                </h3>
                                <p className="text-sm text-gray-600">Customer: {order.customer_name}</p>
                                <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                                <p className="text-sm text-gray-600">
                                    Payment:{" "}
                                    {order.payment_type === "CashOnDelivery"
                                    ? "Cash on Delivery"
                                    : order.payment_type || "Cash on Delivery"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Status: {order.status || "Pending"}
                                </p>
                                <p className="text-sm text-gray-800 font-semibold">
                                    Total: ₱{order.total_price}
                                </p>
                                </div>
                            </div>

                            {/* Right Section: Actions */}
                            <div className="flex flex-row gap-2 self-end">
                                <button
                                className="px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                                onClick={() => handleCancel(order.orderId, order.item.id)}
                                >
                                Cancel
                                </button>
                                <button
                                className="px-3 py-1 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                                onClick={() => handleEdit(order)}
                                >
                                Edit
                                </button>
                                <button
                                className="px-3 py-1 border border-green-500 text-green-500 rounded-lg hover:bg-green-50"
                                onClick={() => handleDelivered(order.orderId)}
                                >
                                Delivered
                                </button>
                            </div>
                            </div>
                        ))
                        ) : (
                        <p className="text-gray-600">No orders found.</p>
                        )}
                    </div>
                    )}

                    {showOrderMessage && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                        <div className="bg-white p-6 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                            <span>{orderMessage}</span>
                        </div>
                        </div>
                    )}

                    {activeSection === "cart" && (
                    <div className="space-y-4">
                    {cart.length > 0 ? (
                    cart.map((cartItem) => (
                        <div
                        key={cartItem.cartId}
                        className="bg-white shadow rounded-xl p-4 flex justify-between items-start"
                        >
                        {/* Left Section: Image + Details */}
                        <div className="flex items-start gap-4">
                            {/* Item Image */}
                            {cartItem.item?.imagePath ? (
                            <img
                                src={`https://wide-rings-jam.loca.lt/${cartItem.item.imagePath.replace(/\\/g, "/")}`}
                                alt={cartItem.item.itemName}
                                className="w-40 h-40 rounded-lg"
                            />
                            ) : (
                            <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                                No Image
                            </div>
                            )}

                            {/* Cart Item Details */}
                            <div>
                            <h3 className="text-lg font-bold">
                                {cartItem.item?.itemName || "No Item"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Category: {cartItem.item?.category || "N/A"}
                            </p>
                            <p className="text-sm text-gray-800 font-semibold">
                                Total: ₱{cartItem.total_price}
                            </p>
                            </div>
                        </div>

                        {/* Right Section: Action Buttons */}
                        <div className="flex flex-row gap-2 self-end">
                            <button
                            className="px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                            onClick={() => handleRemoveFromCart(cartItem.cartId)}
                            >
                            Remove
                            </button>
                            <button
                            className="px-3 py-1 border border-green-500 text-green-500 rounded-lg hover:bg-green-50"
                            onClick={() => setActiveSection("store")}
                            >
                            Checkout
                            </button>
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-gray-600">Your cart is empty.</p>
                    )}
                </div>
                )}

               {activeSection === "topSelling" && (
                <div className="mt-10">
                    {/* Chart */}
                    <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topSellingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <defs>
                        <linearGradient id="redOrangeGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ff0000" />
                            <stop offset="100%" stopColor="#ffa500" />
                        </linearGradient>
                        </defs>
                        <Bar
                        dataKey="sales"
                        fill="url(#redOrangeGradient)"
                        radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                    </ResponsiveContainer>

                    {/* Top items cards */}
                    <div className="flex flex-col gap-4 mt-6">
                    {topSellingData.slice(0, 5).map((item, index) => (
                        <div
                        key={index}
                        className="w-full bg-white p-4 rounded-xl shadow-md flex gap-4"
                        >
                        {/* Item image or placeholder */}
                        {item.image ? (
                            <img
                            src={item.image}
                            alt={item.name}
                            className="w-40 h-40 rounded-lg"
                            />
                        ) : (
                            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                            📦
                            </div>
                        )}

                        {/* Item details + button */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Percentage: {item.percentage}%
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                Sold: {item.sales}
                            </p>
                            </div>

                            {/* Checkout button */}
                            <div className="flex justify-end mt-3">
                            <button
                                onClick={() => setActiveSection("store")}
                                className="px-3 py-1 border border-green-500 text-green-500 rounded-lg hover:bg-green-50"
                            >
                                Checkout
                            </button>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>

            {showOrderMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white p-6 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                        <span>{orderMessage}</span>
                    </div>
                </div>
            )}

            {showOrderModal && (
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Order Details for {currentItem.itemName}</h2>

                        <input
                            type="text"
                            placeholder="Customer Name"
                            className="w-full mb-2 p-2 border rounded"
                            value={orderForm.customer_name}
                            onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})}
                        />

                        <input
                            type="number"
                            placeholder="Quantity"
                            className="w-full mb-2 p-2 border rounded"
                            min={1}
                            value={orderForm.quantity}
                            onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                        />

                        <div class="relative w-full mb-2">
                            <select
                                value={orderForm.unit}
                                onChange={(e) => setOrderForm({ ...orderForm, unit: e.target.value })}
                                className="
                                    appearance-none
                                    block
                                    w-full
                                    bg-white
                                    border
                                    border-black-500
                                    rounded-md
                                    py-2
                                    px-3
                                    pr-10
                                    text-black-700
                                    leading-tight
                                    focus:outline-none
                                    focus:border-gray-700
                                    focus:ring-1
                                    focus:ring-gray-700
                                "
                            >
                                <option value="kilo">Kilo</option>
                                <option value="box">Box</option>
                                <option value="piece">Piece</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-black-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="relative w-full mb-2">
                            <select
                                value={orderForm.payment_type}
                                onChange={(e) => setOrderForm({ ...orderForm, payment_type: e.target.value })}
                                className="
                                    appearance-none
                                    block
                                    w-full
                                    bg-white
                                    border
                                    border-black-500
                                    rounded-md
                                    py-2
                                    px-3
                                    pr-10
                                    text-black-700
                                    leading-tight
                                    focus:outline-none
                                    focus:border-gray-700
                                    focus:ring-1
                                    focus:ring-gray-700
                                "
                            >
                                <option value="Gcash">Gcash</option>
                                <option value="PayMaya">PayMaya</option>
                                <option value="CashOnDelivery">Cash on Delivery</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-black-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Address"
                            className="w-full mb-2 p-2 border rounded"
                            value={orderForm.address}
                            onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                        />

                        <input
                            type="text"
                            placeholder="Contact Number"
                            className="w-full mb-2 p-2 border rounded"
                            value={orderForm.contact_number}
                            onChange={(e) => setOrderForm({...orderForm, contact_number: e.target.value})}
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                            className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                            onClick={() => setShowOrderModal(false)}
                            >
                            Cancel
                            </button>
                       <button
                            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                            onClick={handleOrderSubmit}
                            >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
            )}

           {editingOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Edit Order</h2>

                <label className="block mb-2 text-sm">Quantity</label>
                <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-4"
                />

                <label className="block mb-2 text-sm">Address</label>
                <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-4"
                />

                <div className="flex justify-end gap-2">
                    <button
                    className="px-3 py-1 border border-gray-500 text-gray-500 rounded-lg hover:bg-gray-50"
                    onClick={() => setEditingOrder(null)}
                    >
                    Cancel
                    </button>
                    <button
                    className="px-3 py-1 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                    onClick={handleSaveEdit}
                    >
                    Save
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* Footer */}
            <footer className="mt-auto py-6 text-gray-500 text-center">
                <p>© {new Date().getFullYear()} N-Tech Hardware. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Homepage;
