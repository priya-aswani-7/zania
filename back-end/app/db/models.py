"""This script defines the schema for the 'documents' table using SQLAlchemy. It includes the table name, column names, data types, and constraints. The table definition is used for creating and manipulating the 'documents' table in the database."""

from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

documents = Table(
    "documents",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("type", String, nullable=False),
    Column("title", String, nullable=False),
    Column("position", Integer, nullable=False),
    Column("imgpath",String, nullable=False)
)
