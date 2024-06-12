````markdown
# Photovoltaic Electricity Planning Project

This project is a web application developed to help users plan their photovoltaic electricity systems. Users can create, update, and delete projects, define multiple photovoltaic products, and choose between different predefined photovoltaic system products. The application provides a visual map where users can view and manage the locations of their photovoltaic products.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization (login, registration, profile update, and deletion)
- Dashboard for managing projects
- Add, update, and delete photovoltaic products
- Choose from predefined photovoltaic products (e.g., Hanwha QxCells, First Solar, Aiko, JinkoSolar)
- Visual map for viewing and managing product locations
- Responsive UI with React Bootstrap

## Technologies Used

- **Frontend:**
  - React
  - React Bootstrap
  - Leaflet (for map visualization)
  - Axios (for API requests)
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/photovoltaic-electricity-planning.git
   cd photovoltaic-electricity-planning
   ```
````

2. **Install dependencies:**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory and add the following variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application:**

   ```bash
   # Run the backend
   cd backend
   npm run dev

   # Run the frontend
   cd ../frontend
   npm start
   ```

## Usage

### Dashboard

- **View Projects:** See an overview of all your projects.
- **Add Project:** Create a new project with a name and description.
- **Edit Project:** Modify the details of an existing project.
- **Delete Project:** Remove a project from your list.

### Project Details

- **View Project Information:** See the name, description, and associated photovoltaic products of the project.
- **Add Product:** Open a form to add a new product to the project.
- **Edit Product:** Modify the details of an existing product.
- **Delete Product:** Remove a product from the project.
- **Visual Map:** View and manage the locations of the products on a map.

### Adding/Editing a Product

- **Form Fields:**

  - Product Name
  - Power Peak
  - Orientation (N/E/S/W)
  - Inclination/Tilt
  - Area (m²)
  - Latitude (set via map click)
  - Longitude (set via map click)

- **Visual Map:**
  - Click on the map to set the latitude and longitude for the product.
  - Search for locations using the search box and set the coordinates based on the selected result.

## API Endpoints

### User Routes

- **POST /api/users/register:** Register a new user.
- **POST /api/users/login:** Log in an existing user.
- **GET /api/users/profile:** Get the logged-in user's profile.
- **PUT /api/users/profile:** Update the logged-in user's profile.
- **DELETE /api/users/profile:** Delete the logged-in user's profile.

### Project Routes

- **GET /api/projects:** Get all projects for the logged-in user.
- **POST /api/projects:** Create a new project.
- **GET /api/projects/:id:** Get details of a specific project.
- **PUT /api/projects/:id:** Update a specific project.
- **DELETE /api/projects/:id:** Delete a specific project.

### Product Routes

- **POST /api/projects/:projectId/products:** Add a new product to a project.
- **GET /api/projects/:projectId/products/:productId:** Get details of a specific product.
- **PUT /api/projects/:projectId/products/:productId:** Update a specific product.
- **DELETE /api/projects/:projectId/products/:productId:** Delete a specific product.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request to propose changes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

```

### Explanation of the ToC Linking

1. **Section Titles**: Ensure each section title is unique and accurately reflects the content.
2. **ToC Links**: The links in the ToC use the format `[Link Text](#lowercased-title-with-hyphens)`. This format converts spaces to hyphens and converts the text to lowercase.
3. **Special Characters**: If your section titles contain special characters, they should be omitted or replaced in the link format. For example, "API Endpoints" becomes `#api-endpoints`.

This structure ensures that the links in the Table of Contents navigate correctly to the respective sections in your README.
```
