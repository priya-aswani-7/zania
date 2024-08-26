"""This file contains the script to initialize the connection to the database, set up the database schema, and populate the documents table with initial data if it does not already exist. Environment variables for the database URL are loaded from a .env file."""

from sqlalchemy import create_engine, MetaData, inspect
from databases import Database
from dotenv import load_dotenv
import os
load_dotenv()

database_url = os.getenv("DATABASE_URL")

# Initialize database and metadata
database = Database(database_url)
metadata = MetaData()


engine = create_engine(database_url)


from app.db.models import documents

# Function to create the documents table and insert data if not exists
async def init_db():
    
    inspector = inspect(engine)
    if not inspector.has_table("documents"):
        documents.create(engine)

    
    query = documents.select()
    rows = await database.fetch_all(query)
    

    if not rows:
        values = [
            {"type": "bank-draft", "title": "Bank Draft", "position": 0, "imgpath": "bankDraft.jpg"},
            {"type": "bill-of-lading", "title": "Bill of Lading", "position": 1, "imgpath": "billOfLading.jpg"},
            {"type": "invoice", "title": "Invoice", "position": 2, "imgpath": "invoice.jpg"},
            {"type": "bank-draft-2", "title": "Bank Draft 2", "position": 3, "imgpath": "bankDraft2.jpg"},
            {"type": "bill-of-lading-2", "title": "Bill of Lading 2", "position": 4, "imgpath": "billOfLading2.jpg"},
        ]
        
        # Insert the data into the documents table
        await database.execute_many(query=documents.insert(), values=values)
