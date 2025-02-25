# E-Commerce API

This is a REST API for an e-commerce platform, built using Express and MongoDB. It provides functionality for managing products, orders, and users, and includes security measures such as JWT authentication and rate limiting.

## Features
- **Product Management**: Add, update, delete, and fetch product details.
- **Order Management**: Place and track orders.
- **User Management**: Register, login, and authenticate users using JWT.
- **Rate Limiting**: Prevent abuse of API endpoints using `express-rate-limit`.
- **Optimized Queries**: Ensure high performance for handling large amounts of data.
- **Data Migration**: Import products from CSV files.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/ecommerce-api.git
   cd ecommerce-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the environment variables in a `.env` file:
   ```sh
   CONNECTION_STRING=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Running the API
Start the server:
```sh
npm start
```

## Rate Limiting
To prevent excessive requests, the API implements rate limiting:
- **Global Limit**: 100 requests per 15 minutes per IP.
- **Product Route Limit**: 50 requests per 10 minutes per IP.

Rate limiting is configured in `app.js` using `express-rate-limit`:
```js
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
});
app.use('/api', apiLimiter);
```

## API Endpoints
### Products
- `GET /products` - Retrieve all products.
- `POST /products` - Add a new product.
- `PUT /products/:id` - Update a product.
- `DELETE /products/:id` - Delete a product.

### Orders
- `POST /orders` - Place an order.
- `GET /orders/:id` - Retrieve order details.

### Users
- `POST /users/register` - Register a new user.
- `POST /users/login` - Authenticate user and receive a token.

## Data Import
To import products from a CSV file, run:
```sh
node importCSV.js
```
Ensure the CSV file `products.csv` is in the root directory and contains fields: `name, price, description, category, stock`.

## License
This project is licensed under the MIT License.

## Contact
For questions or support, open an issue on the repository or contact the developer.