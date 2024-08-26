"""This file sets up and initializes the Starlette application. It includes environment variable loading, middleware configuration, database connection management, and route setup."""

import sys
import os
from dotenv import load_dotenv
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from app.db.database import database, init_db
from app.routes import routes

# Load environment variables
load_dotenv()

# Dynamically add the backend directory to the system path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Define the middleware
middleware = [
    Middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]),
]

# Define the startup function
async def on_startup():
    await database.connect()
    await init_db()  # Ensure the documents table is created and data is inserted if not exists

# Define the shutdown function
async def on_shutdown():
    await database.disconnect()

# Initialize the Starlette application
app = Starlette(
    routes=routes,
    middleware=middleware,
    on_startup=[on_startup],
    on_shutdown=[on_shutdown]
)
