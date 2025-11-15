import {
  Wrench,
  Shovel,
  ShoppingCart,
  Store,
  Package,
  TrendingUp,
} from "lucide-react";
import "../index.css";
import { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaBox,
  FaTruck,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaTimes,
  FaEdit,
  FaCheckCircle,
  FaTag,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";

function Mockup() {
  const items = [
    {
      id: 1,
      itemName: "Hammer",
      category: "Hand Tools",
      unit: "pcs",
      price: 250,
      quantity: 50,
    },
    {
      id: 2,
      itemName: "Screwdriver Set",
      category: "Hand Tools",
      unit: "set",
      price: 400,
      quantity: 30,
    },
    {
      id: 3,
      itemName: "Electric Drill",
      category: "Power Tools",
      unit: "pcs",
      price: 3500,
      quantity: 20,
    },
    {
      id: 4,
      itemName: "Tape Measure",
      category: "Measuring Tools",
      unit: "pcs",
      price: 150,
      quantity: 80,
    },
    {
      id: 5,
      itemName: "Wrench Set",
      category: "Hand Tools",
      unit: "set",
      price: 600,
      quantity: 25,
    },
    {
      id: 6,
      itemName: "Pliers",
      category: "Hand Tools",
      unit: "pcs",
      price: 180,
      quantity: 60,
    },
    {
      id: 7,
      itemName: "Circular Saw",
      category: "Power Tools",
      unit: "pcs",
      price: 5200,
      quantity: 15,
    },
    {
      id: 8,
      itemName: "Safety Gloves",
      category: "Safety Gear",
      unit: "pair",
      price: 120,
      quantity: 100,
    },
    {
      id: 9,
      itemName: "Toolbox",
      category: "Storage",
      unit: "pcs",
      price: 950,
      quantity: 40,
    },
    {
      id: 10,
      itemName: "Level Ruler",
      category: "Measuring Tools",
      unit: "pcs",
      price: 300,
      quantity: 50,
    },
  ];

  const [cart, setCart] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [alertMessage, setAlertMessage] = useState(""); // <-- new state

  // Update item quantity
  const handleItemQuantityUpdate = (itemId, change) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity + change, 0) }
          : item
      )
    );
  };

  // Add item to cart
  const handleAddToCart = (item) => {
    setCart((prev) => [
      ...prev,
      { cartId: Date.now(), item, quantity: 1, total_price: item.price },
    ]);

    // Show alert
    setAlertMessage(`${item.itemName} added to cart!`);
    setTimeout(() => setAlertMessage(""), 2500); // hide after 2.5s
  };

  // Remove from cart
  const handleRemoveFromCart = (cartId) => {
    setCart((prev) => prev.filter((c) => c.cartId !== cartId));
  };

  // Edit item quantity
  const handleEdit = (item) => {
    setEditingItem(item);
    setNewQuantity(item.quantity);
  };

  const handleSaveEdit = () => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === editingItem.id ? { ...i, quantity: Number(newQuantity) } : i
      )
    );
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Alert */}
      {alertMessage && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
               bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg
               z-50 text-xl font-bold animate-fade-in-out text-center">
          {alertMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6"></h1>
      <section
        className="relative flex flex-col items-start text-left mt-5 mx-6 px-6 py-20 
                    bg-black rounded-2xl shadow-lg overflow-hidden">
        {/* Animated background icons */}
        <Wrench className="absolute top-10 left-10 text-gray-700 opacity-80 w-16 h-16 animate-bounce" />
        <Shovel className="absolute top-20 right-20 text-gray-700 opacity-80 w-16 h-16 animate-bounce" />

        <Wrench className="absolute bottom-20 left-1/4 text-gray-700 opacity-70 w-14 h-14 animate-bounce" />
        <Shovel className="absolute bottom-16 right-1/3 text-gray-700 opacity-70 w-14 h-14 animate-bounce" />

        <Wrench className="absolute top-1/3 right-1/4 text-gray-700 opacity-60 w-12 h-12 animate-bounce" />
        <Shovel className="absolute bottom-1/4 left-1/3 text-gray-700 opacity-60 w-12 h-12 animate-bounce" />
        {/* Content */}
        <div className="relative z-10 ml-10">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Welcome to N-Tech Hardware
          </h2>
          <p className="text-gray-300 max-w-xl mb-6">
            You may have noticed some of the tools used during your home
            inspection. Now you too can own some of these tools and other items
            needed as a homeowner.
          </p>
        </div>
      </section>

      {/* Items Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto mt-8">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Item Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-100 transition-all duration-200">
                <td className="p-3 font-medium">{item.id}</td>
                <td className="p-3 font-medium">{item.itemName}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.unit}</td>
                <td className="p-3">₱{item.price}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2 hover:bg-blue-600 transition">
                      <FaShoppingCart /> Add
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Cart</h2>
      {cart.length > 0 ? (
        <div className="space-y-4">
          {cart.map((c) => (
            <div
              key={c.cartId}
              className="bg-white p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{c.item.itemName}</h3>
                <p>Price: ₱{c.total_price}</p>
              </div>
              <button
                onClick={() => handleRemoveFromCart(c.cartId)}
                className="bg-red-500 text-white px-3 py-1 rounded">
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Edit Item: {editingItem.itemName}
            </h2>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              min={0}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mockup;
