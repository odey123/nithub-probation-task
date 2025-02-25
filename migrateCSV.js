const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const Product = require('./models/Product'); // Adjust the path if needed
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('DB connection error:', err);
        process.exit(1); // Exit on DB connection failure
    });

// Function to import CSV data
const importCSV = async () => {
    const products = [];
    const csvFilePath = 'products.csv'; // Update this path if needed

    // Check if the file exists
    if (!fs.existsSync(csvFilePath)) {
        console.error(`File not found: ${csvFilePath}`);
        process.exit(1);
    }

    // Read the CSV file
    fs.createReadStream(csvFilePath)
        .pipe(csvParser({ headers: true }))
        .on('data', (row) => {
            // Ensure correct data types and provide defaults
            products.push({
                name: row.name || 'Unnamed Product',
                price: parseFloat(row.price) || 0, 
                description: row.description || 'No description',
                category: row.category || 'Uncategorized',
                stock: parseInt(row.stock) || 0
            });
        })
        .on('end', async () => {
            try {
                if (products.length === 0) {
                    console.log('No products found in CSV.');
                    return;
                }

                // Insert data into MongoDB
                await Product.insertMany(products);
                console.log('CSV data imported successfully');
            } catch (error) {
                console.error('Error inserting data:', error);
            } finally {
                mongoose.connection.close();
            }
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            mongoose.connection.close();
        });
};

// Run the import function
importCSV();
