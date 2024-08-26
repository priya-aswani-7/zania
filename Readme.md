# Overview
This project is a web application that features a draggable content grid on the homepage, allowing users to rearrange content cards. The application is built with React, Material-UI, and Docker. It interacts with a backend API to fetch and update document data.

## Prerequisites
Before setting up and running the project, ensure you have the following installed:

Docker: Make sure Docker is installed on your system. Install Docker.
Setup and Installation
### Step 1: Clone the Repository
bash

git clone <repository-url>

cd <repository-directory>

### Step 2: Build and Run with Docker
This project is containerized using Docker. Follow these steps to build and run the application:

#### Build the Docker containers:

bash

docker compose build

#### Run the Docker containers:

bash

docker compose up

This command will start the frontend and backend services defined in your docker-compose.yml file.

### Step 3: Access the Application
Once the Docker containers are up and running, you can access the application by navigating to http://localhost:3000 in your web browser.

## Frontend Overview
The frontend is built using React and Material-UI. Below is an overview of the key components and their functionalities:

### Home.js
This is the homepage of the application. It displays a grid of content cards that can be dragged and rearranged.

### State Management:

items: Holds the list of content cards fetched from the API.
previousItemsRef and changedItemsRef: Used to track changes in the positions of content cards for saving updates.
saving: Indicates whether the app is currently saving changes.
timeSinceLastSave: Tracks the time elapsed since the last save operation.

### API Interaction:

The useEffect hook fetches documents on component mount using the fetchDocuments function.
The useInterval hook is used to automatically save changes to the backend every 5 seconds if there are any updates.

### Drag and Drop Functionality:

handleDragStart, handleDragEnter, handleDragOver, and handleDragEnd functions manage the drag-and-drop logic for rearranging the content cards.

### ContentCard.js
This component represents an individual content card within the grid.

#### Props:

title: The title of the content.
imgPath: The path to the image associated with the content.
position: The current position of the card in the grid.
Drag-and-drop handler functions: Passed down from Home.js to manage the drag-and-drop functionality.
State Management:

loading: Manages the loading state of the image.
open: Controls the visibility of the modal that displays the image in full size.
Drag-and-Drop Functionality:

The card is made draggable using the draggable attribute, and the various drag-and-drop handlers manage the reordering of the cards.

## Backend Overview

The backend is built using Python's Starlette framework, a lightweight and asynchronous web framework. The backend handles CRUD operations (Create, Read, Update, Delete) for managing documents and serves static images via API endpoints. It uses SQLAlchemy for ORM (Object Relational Mapping) and Databases for asynchronous database interactions. PostgreSQL is used as the database.

The Core Components of the backend are as follows:

### Database Layer (database.py):
Database Initialization: The database is initialized using the databases library, with a connection URL stored in environment variables (.env file).
Engine Creation: An SQLAlchemy engine is created to interact with the PostgreSQL database.
Table Creation and Data Insertion: The init_db function ensures that the documents table is created if it doesn’t exist, and inserts initial data if the table is empty.

### Models (models.py):
Documents Table: Defines the documents table schema with fields: id, type, title, position, and imgpath. SQLAlchemy is used to define the table schema.

### Controllers (document_controller.py):

CRUD Operations:
**get_documents**: Fetches all documents from the database, processes the imgpath to include the base URL, and returns the documents in JSON format.
**add_document**: Accepts JSON input, validates the required fields, and inserts a new document into the database.
**update_document**: Updates an existing document's fields based on the provided document ID.
**delete_document**: Deletes a document from the database using its ID.

### Routing (routes.py):
API Endpoints:
#### /documents:
GET: Retrieves all documents.

POST: Adds a new document.

#### /documents/{id}:
PUT: Updates an existing document by ID.

DELETE: Deletes a document by ID.

#### /static/{filename}: Serves static image files.
_The above API endpoints are based on the principles of REST APIs._

### Application Entry Point (main.py):

Middleware: Configures CORS (Cross-Origin Resource Sharing) to allow requests from any origin.

Startup and Shutdown:
on_startup: Connects to the database and initializes the documents table if it doesn't exist.
on_shutdown: Disconnects from the database.

Starlette Application: Initializes the application with routes and middleware configurations.

### Environment Configuration
.env File: Contains sensitive configurations like the DATABASE_URL. The database connection URL is loaded using dotenv.

### Dependencies
Listed in requirements.txt, the key dependencies include:

Starlette: Web framework.

Databases: Async database toolkit.

SQLAlchemy: SQL toolkit and ORM.

Uvicorn: ASGI server for running the application.

psycopg2-binary and asyncpg: PostgreSQL drivers.

python-dotenv: For loading environment variables from .env files.
