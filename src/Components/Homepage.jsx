import { Wrench, Shovel, ShoppingCart, Store, Package, TrendingUp } from "lucide-react";
import '../index.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";


function Homepage() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState("All Categories");
    const [searchQuery, setSearchQuery] = useState("");

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

        // Use search endpoint if there's a search query
        if (searchQuery) {
            url = "http://localhost:8080/api/items/search";
            params.name = searchQuery;
        }

        axios
            .get(url, { params })
            .then((response) => setItems(response.data))
            .catch((error) => console.error("Error fetching items:", error));
    }, [category, searchQuery]);

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
                    <a
                    href="#store"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                    <Store className="w-5 h-5" />
                    Store
                    </a>
                    <a
                    href="#orders"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                    <Package className="w-5 h-5" />
                    My Orders
                    </a>
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

            {/* Items Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                        <button className="flex-1 bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition">
                        Buy Now
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {/* Footer */}
            <footer className="mt-auto py-6 text-gray-500 text-center">
                <p>© {new Date().getFullYear()} N-Tech Hardware. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Homepage;