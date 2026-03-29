import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Database
const db = new Database("vtmart.db");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    price REAL NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    product_interest TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial products if empty
const count = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (count.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (product_name, category, subcategory, price, image_url, description, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialProducts = [
    ["Almond", "Almonds", "Almond", 800, "/images/Almonds.png", "Premium quality California almonds.", 1],
    ["Mamro Almond", "Almonds", "Mamro Almond", 1200, "/images/Mamro_Almonds.png", "High-grade Mamro almonds, rich in oil.", 0],
    ["Plain Cashew", "Cashews", "Plain Cashew", 900, "/images/Plain_Cashews.png", "Whole white cashews.", 1],
    ["Salted Cashew", "Cashews", "Salted Cashew", 950, "/images/Salted_Cashews.png", "Roasted and lightly salted cashews.", 0],
    ["Mirchi Cashew", "Cashews", "Mirchi Cashew", 980, "/images/Mirchi_Cashews.png", "Spicy chili coated cashews.", 0],
    ["Plain Pistachio", "Pistachios", "Plain Pistachio", 1100, "/images/Pistachios.png", "Unsalted premium pistachios.", 1],
    ["Salted Pistachio", "Pistachios", "Salted Pistachio", 1150, "/images/salted_pistachios.png", "Roasted and salted pistachios.", 0],
    ["Black Raisins", "Raisins", "Black Raisins", 400, "/images/Black_raisins.png", "Sweet and seedless black raisins.", 0],
    ["Indian Raisins", "Raisins", "Indian Raisins", 350, "/images/Kishmish.png", "Golden Indian raisins.", 1],
    ["Figs", "Premium Dry Fruits", "Figs", 1000, "/images/Dried_figs.png", "Dried premium figs (Anjeer).", 1],
    ["Apricot", "Premium Dry Fruits", "Apricot", 850, "/images/apricot.png", "Sweet dried apricots.", 0],
    ["Walnut", "Special Dry Fruits", "Walnut", 1300, "/images/walnut.png", "Kashmiri walnuts without shell.", 1],
    ["Kahrek", "Special Dry Fruits", "Kahrek", 300, "/images/kahrek.png", "Dry dates.", 0],
    ["Mix Dry Fruits", "Mix Packs", "Mix Dry Fruits", 950, "/images/mix_dryfruits.png", "A healthy mix of premium dry fruits.", 1],
  ];

  const insertMany = db.transaction((products) => {
    for (const p of products) insertProduct.run(...p);
  });
  insertMany(initialProducts);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    try {
      const products = db.prepare("SELECT * FROM products ORDER BY category, product_name").all();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", (req, res) => {
    try {
      const products = db.prepare("SELECT * FROM products WHERE is_featured = 1 LIMIT 4").all();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  app.post("/api/leads", (req, res) => {
    const { name, phone, city, product_interest, message } = req.body;
    
    if (!name || !phone || !city) {
      return res.status(400).json({ error: "Name, phone, and city are required." });
    }

    try {
      const insert = db.prepare(`
        INSERT INTO leads (name, phone, city, product_interest, message)
        VALUES (?, ?, ?, ?, ?)
      `);
      const info = insert.run(name, phone, city, product_interest, message);
      res.status(201).json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit lead" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
