"""This file sets up routing for the application using Starlette. It defines the routes and their associated handlers, including static file serving and CRUD operations for documents."""

from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from app.controllers.document_controller import get_documents, add_document, update_document, delete_document

routes = [
    Mount("/static", StaticFiles(directory="app/static/images"), name="static"),
    Route("/documents", get_documents, methods=["GET"]),
    Route("/documents", add_document, methods=["POST"]),
    Route("/documents/{id}", update_document, methods=["PUT"]),
    Route("/documents/{id}", delete_document, methods=["DELETE"]),
]
