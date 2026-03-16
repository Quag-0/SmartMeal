const mongoose = require("mongoose");
require("dotenv").config();
const Recipe = require("./models/Recipe");

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/smartmeal";

const recipes = [
  {
    id: 1,
    name: "Vegetable Stir Fry",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    cookingTime: 25,
    category: "vegetarian",
    type: "asian",
    ingredients: [
      { name: "Broccoli", quantity: "200g", category: "vegetables" },
      { name: "Carrots", quantity: "150g", category: "vegetables" },
      { name: "Soy Sauce", quantity: "2 tbsp", category: "dry-goods" },
      { name: "Garlic", quantity: "3 cloves", category: "vegetables" },
      { name: "Ginger", quantity: "1 inch", category: "vegetables" },
    ],
    instructions: [
      "Cut broccoli into florets and slice carrots into thin strips.",
      "Mince garlic and ginger finely.",
      "Heat oil in a wok over high heat.",
      "Add garlic and ginger, stir for 30 seconds.",
      "Add broccoli and carrots, stir fry for 3-4 minutes.",
      "Add soy sauce and toss to coat evenly.",
      "Cook until vegetables are tender-crisp.",
      "Serve hot over steamed rice.",
    ],
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    cookingTime: 20,
    category: "western",
    type: "western",
    ingredients: [
      { name: "Chicken Breast", quantity: "300g", category: "meat-fish" },
      { name: "Lettuce", quantity: "1 head", category: "vegetables" },
      { name: "Tomatoes", quantity: "2", category: "vegetables" },
      { name: "Olive Oil", quantity: "3 tbsp", category: "dry-goods" },
      { name: "Lemon", quantity: "1", category: "vegetables" },
    ],
    instructions: [
      "Season chicken breast with salt and pepper.",
      "Preheat grill or grill pan to medium-high heat.",
      "Brush chicken with olive oil and grill for 6-7 minutes per side.",
      "Let chicken rest for 5 minutes, then slice.",
      "Wash and chop lettuce into bite-sized pieces.",
      "Slice tomatoes into wedges.",
      "Whisk olive oil and lemon juice for dressing.",
      "Combine lettuce, tomatoes, and chicken in a bowl.",
      "Drizzle with dressing and serve.",
    ],
  },
  {
    id: 3,
    name: "Pad Thai",
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop",
    cookingTime: 35,
    category: "asian",
    type: "asian",
    ingredients: [
      { name: "Rice Noodles", quantity: "200g", category: "dry-goods" },
      { name: "Shrimp", quantity: "200g", category: "meat-fish" },
      { name: "Bean Sprouts", quantity: "100g", category: "vegetables" },
      { name: "Peanuts", quantity: "50g", category: "dry-goods" },
      { name: "Tamarind Paste", quantity: "2 tbsp", category: "dry-goods" },
    ],
    instructions: [
      "Soak rice noodles in warm water for 30 minutes.",
      "Make sauce: mix tamarind paste, fish sauce, and sugar.",
      "Chop peanuts and set aside for garnish.",
      "Heat oil in a wok over high heat.",
      "Add shrimp and cook until pink, about 2 minutes.",
      "Push shrimp aside and scramble 2 eggs.",
      "Add drained noodles and sauce, toss to combine.",
      "Cook for 2-3 minutes until noodles absorb sauce.",
      "Add bean sprouts and toss briefly.",
      "Serve topped with crushed peanuts and lime wedges.",
    ],
  },
  {
    id: 4,
    name: "Spaghetti Carbonara",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
    cookingTime: 30,
    category: "western",
    type: "western",
    ingredients: [
      { name: "Spaghetti", quantity: "400g", category: "dry-goods" },
      { name: "Bacon", quantity: "150g", category: "meat-fish" },
      { name: "Eggs", quantity: "4", category: "dry-goods" },
      { name: "Parmesan Cheese", quantity: "100g", category: "dry-goods" },
      { name: "Garlic", quantity: "2 cloves", category: "vegetables" },
    ],
    instructions: [
      "Cook spaghetti in salted boiling water until al dente.",
      "Meanwhile, cut bacon into small cubes.",
      "Whisk eggs with grated Parmesan in a bowl.",
      "Fry bacon in a large pan until crispy.",
      "Add minced garlic and cook for 1 minute.",
      "Reserve 1 cup pasta water, then drain pasta.",
      "Add hot pasta to the pan with bacon (remove from heat).",
      "Quickly pour egg mixture over pasta, tossing constantly.",
      "Add pasta water as needed to create creamy sauce.",
      "Serve immediately with extra Parmesan.",
    ],
  },
  {
    id: 5,
    name: "Vegetable Curry",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    cookingTime: 40,
    category: "vegetarian",
    type: "asian",
    ingredients: [
      { name: "Potatoes", quantity: "300g", category: "vegetables" },
      { name: "Cauliflower", quantity: "200g", category: "vegetables" },
      { name: "Coconut Milk", quantity: "400ml", category: "dry-goods" },
      { name: "Curry Paste", quantity: "2 tbsp", category: "dry-goods" },
      { name: "Onions", quantity: "2", category: "vegetables" },
    ],
    instructions: [
      "Cut potatoes into 1-inch cubes and cauliflower into florets.",
      "Dice onions finely.",
      "Heat oil in a large pot over medium heat.",
      "Add onions and cook until softened.",
      "Add curry paste and stir for 1-2 minutes.",
      "Add potatoes and stir to coat with spices.",
      "Pour in coconut milk and bring to a simmer.",
      "Add cauliflower and cook for 15-20 minutes.",
      "Season with salt to taste.",
      "Serve hot with rice or naan bread.",
    ],
  },
  {
    id: 6,
    name: "Beef Tacos",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    cookingTime: 25,
    category: "western",
    type: "western",
    ingredients: [
      { name: "Ground Beef", quantity: "400g", category: "meat-fish" },
      { name: "Taco Shells", quantity: "8", category: "dry-goods" },
      { name: "Lettuce", quantity: "1 head", category: "vegetables" },
      { name: "Tomatoes", quantity: "3", category: "vegetables" },
      { name: "Cheddar Cheese", quantity: "100g", category: "dry-goods" },
    ],
    instructions: [
      "Brown ground beef in a skillet over medium-high heat.",
      "Drain excess fat from the beef.",
      "Add taco seasoning and 1/4 cup water, simmer 5 minutes.",
      "Heat taco shells according to package directions.",
      "Shred cheddar cheese.",
      "Shred lettuce and dice tomatoes.",
      "Warm beef mixture slightly before serving.",
      "Fill taco shells with beef.",
      "Top with lettuce, tomatoes, and cheese.",
      "Serve immediately with salsa and sour cream.",
    ],
  },
  {
    id: 7,
    name: "Mushroom Risotto",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
    cookingTime: 45,
    category: "vegetarian",
    type: "western",
    ingredients: [
      { name: "Arborio Rice", quantity: "300g", category: "dry-goods" },
      { name: "Mushrooms", quantity: "300g", category: "vegetables" },
      { name: "Vegetable Stock", quantity: "1L", category: "dry-goods" },
      { name: "Parmesan Cheese", quantity: "80g", category: "dry-goods" },
      { name: "Onion", quantity: "1", category: "vegetables" },
    ],
    instructions: [
      "Heat vegetable stock in a saucepan, keep warm.",
      "Slice mushrooms and sauté in butter until browned.",
      "Remove mushrooms and set aside.",
      "Finely chop onion.",
      "Sauté onion in the same pan until translucent.",
      "Add Arborio rice and toast for 2 minutes.",
      "Add white wine (optional) and stir until absorbed.",
      "Add warm stock one ladle at a time, stirring constantly.",
      "Continue adding stock for 18-20 minutes until rice is creamy.",
      "Stir in mushrooms and Parmesan cheese.",
      "Season with salt and pepper, serve immediately.",
    ],
  },
  {
    id: 8,
    name: "Teriyaki Salmon",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    cookingTime: 25,
    category: "asian",
    type: "asian",
    ingredients: [
      { name: "Salmon Fillet", quantity: "400g", category: "meat-fish" },
      { name: "Soy Sauce", quantity: "3 tbsp", category: "dry-goods" },
      { name: "Mirin", quantity: "2 tbsp", category: "dry-goods" },
      { name: "Sugar", quantity: "1 tbsp", category: "dry-goods" },
      { name: "Sesame Seeds", quantity: "1 tbsp", category: "dry-goods" },
    ],
    instructions: [
      "Mix soy sauce, mirin, and sugar to make teriyaki sauce.",
      "Pat salmon fillets dry with paper towels.",
      "Heat oil in a pan over medium-high heat.",
      "Place salmon skin-side down in the pan.",
      "Cook for 4-5 minutes until skin is crispy.",
      "Flip salmon and cook for another 3-4 minutes.",
      "Pour teriyaki sauce over the salmon.",
      "Let the sauce simmer and glaze the fish for 1-2 minutes.",
      "Toast sesame seeds in a dry pan.",
      "Serve salmon topped with toasted sesame seeds and steamed rice.",
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for seeding");

    await Recipe.deleteMany({});
    const created = await Recipe.insertMany(recipes);
    console.log(`Inserted ${created.length} recipes`);
    mongoose.disconnect();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
