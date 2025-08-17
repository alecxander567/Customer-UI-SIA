import { Wrench, Shovel, ShoppingCart, Store, Package, TrendingUp } from "lucide-react";
import '../index.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";

function Homepage() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState("All Categories");
    const [searchQuery, setSearchQuery] = useState("");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
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


    useEffect(() => {
        axios.get("http://localhost:8080/api/items")
            .then(response => {
            console.log("Items from API:", response.data); 
            setItems(response.data);
            })
            .catch(error => {
            console.error("Error fetching items:", error);
            });
    }, []);

    // Fetch items whenever the category changes
    useEffect(() => {
        const url =
        category && category !== "All Categories"
            ? `http://localhost:8080/api/items?category=${category}`
            : "http://localhost:8080/api/items";

        axios
        .get(url)
        .then((response) => {
            setItems(response.data);
        })
        .catch((error) => {
            console.error("Error fetching items:", error);
        });
    }, [category]);

    useEffect(() => {
        let url = "http://localhost:8080/api/items";
        let params = {};

        if (category && category !== "All Categories") {
            params.category = category;
        }

        if (searchQuery) {
            url = "http://localhost:8080/api/items/search";
            params.name = searchQuery;
        }

        axios
            .get(url, { params })
            .then((response) => setItems(response.data))
            .catch((error) => console.error("Error fetching items:", error));
    }, [category, searchQuery]);

    const handleOrderSubmit = async () => {
        try {
            const total_price = currentItem.price * orderForm.quantity;
            const orderPayload = {
                item: { id: currentItem.id },
                customer_name: orderForm.customer_name,
                quantity: orderForm.quantity,
                unit: orderForm.unit,
                total_price,
                address: orderForm.address,
                contact_number: orderForm.contact_number,
                order_date: new Date().toISOString().split("T")[0],
                employee_id: 1,
                payment_type: orderForm.payment_type
            };

            const orderResponse = await axios.post("http://localhost:8080/api/orders", orderPayload);
            const orderId = orderResponse.data.order_id; 

            setShowOrderModal(false);

            if (orderForm.payment_type !== "Cash on Delivery") {
                await checkout(currentItem, orderForm.quantity);
            } else {
                alert("Order placed! Payment will be collected on delivery.");
            }

        } catch (error) {
            console.error("Error creating order/payment:", error);
            alert("Error creating order/payment. Check console.");
        }
    };

    const handleBuyNowClick = (item) => {
        setCurrentItem(item);
        setShowOrderModal(true);
    };

    const checkout = async (item, quantity) => {
        const amountInCentavos = item.price * quantity * 100;

        const response = await axios.post("http://localhost:8080/payments/create-checkout", {
            amount: amountInCentavos,
            productId: item.id
        });

        window.location.href = response.data.checkoutUrl;
    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/orders")
        .then(response => {
            setOrders(response.data);
        })
        .catch(error => {
            console.error("Error fetching orders:", error);
        });
    }, []); //

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
                    <a
                    href="#cart"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                    </a>
                    <a
                    href="#top-selling"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                    <TrendingUp className="w-5 h-5" />
                    Top Selling
                    </a>
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
            {activeSection === "store" && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
                    <img
                        src={`http://localhost:8080/${item.imagePath.replace(/\\/g, "/")}`}
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
                        <button className="flex-1 bg-gray-300 text-black py-2 rounded-xl hover:bg-gray-400 transition">
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
                {orders.length > 0 ? (
                orders.map((order) => (
                    <div
                    key={order.order_id}
                    className="bg-white shadow rounded-xl p-4 flex items-center gap-4"
                    >
                    {/* Item Image */}
                    {order.item ? (
                        <img
                        src={`http://localhost:8080/${order.item.imagePath.replace(/\\/g, "/")}`}
                        alt={order.item.itemName}
                        className="w-50 h-50"
                        />
                    ) : (
                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                        No Image
                        </div>
                    )}

                    {/* Order Details */}
                    <div>
                        <h3 className="text-lg font-bold">
                        {order.item ? order.item.itemName : "No Item"}
                        </h3>
                        <p className="text-sm text-gray-600">Customer: {order.customer_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                        <p className="text-sm text-gray-600">
                        Payment: {order.payment_type === "CashOnDelivery" ? "Cash on Delivery" : order.payment_type || "Cash on Delivery"}
                        </p>
                        <p className="text-sm text-gray-600">Status: {order.status || "Pending"}</p>
                        <p className="text-sm text-gray-800 font-semibold">
                        Total: ₱{order.total_price}
                        </p>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-gray-600">No orders found.</p>
                )}
            </div>
            )}

            </div>

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

            {/* Footer */}
            <footer className="mt-auto py-6 text-gray-500 text-center">
                <p>© {new Date().getFullYear()} N-Tech Hardware. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Homepage;