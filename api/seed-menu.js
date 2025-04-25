// api/seed-menu.js
const openDb = require('./db');

async function seed() {

    const db = await openDb();

    // Clear the 'menu' table before seeding new data
    await db.run('DELETE FROM menu');
    console.log('✅ Cleared existing menu items.');

    // Sample data with "Main" category
    const menuItems = [
    { id: 1, name: 'Pancakes', price: 5.99, description: 'Fluffy pancakes with syrup & butter', image: '' },
    { id: 2, name: 'Omelette', price: 6.99, description: 'Three-egg omelette with cheese & veggies', image: 'omelette.jpeg' },
    { id: 3, name: 'French Toast', price: 4.99, description: 'Golden brown French toast with cinnamon', image: 'frenchToast.jpeg' },
    { id: 4, name: 'Waffles', price: 6.49, description: 'Belgian waffles with berries', image: 'waffles.jpg' },
    { id: 5, name: 'Bagel & Cream Cheese', price: 3.99, description: 'Toasted bagel with cream cheese', image: 'bagel.jpeg' },
    { id: 6, name: 'Avocado Toast', price: 7.49, description: 'Sourdough topped with avocado & eggs', image: 'avocadoToast.jpeg' },
    { id: 7, name: 'Smoothie Bowl', price: 8.99, description: 'Berry smoothie with granola and fruit', image: 'smoothie.jpeg' },
    ];

    // Insert sample data into the 'menu' table with "Main" as category
    for (const item of menuItems) {
    await db.run(
        `INSERT INTO menu (id, name, description, category, price, image) VALUES (?, ?, ?, ?, ?, ?)`,
        [item.id, item.name, item.description, 'Main', item.price, item.image]
    );
    }

    console.log('✅ Sample menu items inserted with "Main" category.');
}

seed();
