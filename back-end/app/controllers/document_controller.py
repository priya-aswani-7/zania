"""This module defines various API endpoints for managing documents and images.
It provides functionality to fetch, add, update, delete documents, and serve images."""

from starlette.responses import FileResponse,JSONResponse
import os
from app.db.database import database
from app.db.models import documents
BASE_URL = "http://localhost:8000";

# Fetches all documents from the database and processes their image paths
async def get_documents(request):
    try:
        query = documents.select()
        results = await database.fetch_all(query=query)
        results_as_dicts = [dict(result) for result in results]
        processed_results=[]
        for result in results_as_dicts:
            if "imgpath" in result:
                result["imgpath"] = f"{BASE_URL}/static/{result['imgpath']}"
            processed_results.append(result)
        
        return JSONResponse(processed_results)
        
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    
# Adds a new document to the database
async def add_document(request):
    try:
        data = await request.json()

        if not data:
            return JSONResponse({"error": "Request body is empty"}, status_code=400)


        required_fields = ["type", "title", "position","imgpath"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return JSONResponse({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status_code=400)
        

        if not isinstance(data["title"], str):
            return JSONResponse({"error": "Field 'title' must be a string"}, status_code=400)
        if not isinstance(data["type"], str):
            return JSONResponse({"error": "Field 'type' must be a string"}, status_code=400)
        if not isinstance(data["position"], int):
            return JSONResponse({"error": "Field 'position' must be an integer"}, status_code=400)
        if not isinstance(data["imgpath"], str):
            return JSONResponse({"error": "Field 'imgpath' must be an integer"}, status_code=400)
        

        query = documents.insert().values(
            type=data["type"],
            title=data["title"],
            position=data["position"]
        )
        await database.execute(query=query)
        
        return JSONResponse({"status": "Document added"}, status_code=201)
    
    except KeyError as e:
        return JSONResponse({"error": f"Missing required field: {e}"}, status_code=400)
    
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

#Updates an existing document in the database based on its ID.
async def update_document(request):
    try:
        document_id_str = request.path_params.get("id")
        

        if not document_id_str.isdigit():
            return JSONResponse({"error": "Invalid document ID format"}, status_code=400)
        
        document_id = int(document_id_str) 
        
        existing_document = await fetch_document_by_id(document_id)
        if not existing_document:
            return JSONResponse({"error": f"Document with ID {document_id} not found"}, status_code=404)
        
        data = await request.json()
        
        update_values = {}
        
        required_fields = ["type", "title", "position"]
        for field in required_fields:
            if field in data:
                update_values[field] = data[field]
            else:
                update_values[field] = existing_document[field]  

        if "title" in update_values and not isinstance(update_values["title"], str):
            return JSONResponse({"error": "Field 'title' must be a string"}, status_code=400)
        if "type" in update_values and not isinstance(update_values["type"], str):
            return JSONResponse({"error": "Field 'type' must be a string"}, status_code=400)
        if "position" in update_values and not isinstance(update_values["position"], int):
            return JSONResponse({"error": "Field 'position' must be an integer"}, status_code=400)
        
        query = documents.update().where(documents.c.id == document_id).values(**update_values)
        await database.execute(query=query)
        
        return JSONResponse({"status": "Document updated"}, status_code=200)
    
    
    
    except KeyError as e:
        return JSONResponse({"error": f"Missing required field: {e}"}, status_code=400)
    
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

#Fetches a document by its ID.
async def fetch_document_by_id(document_id):
    query = documents.select().where(documents.c.id == document_id)
    result = await database.fetch_one(query=query)
    return dict(result) if result else None

#Deletes a document from the database based on its ID.
async def delete_document(request):
    try:
        document_id_str = request.path_params.get("id")
        
        if not document_id_str.isdigit():
            return JSONResponse({"error": "Invalid document ID format"}, status_code=400)
        
        document_id = int(document_id_str)  # Convert to int

        if not document_id:
            return JSONResponse({"error": "Missing document ID"}, status_code=400)
        
        existing_document = await fetch_document_by_id(document_id)
        if not existing_document:
            return JSONResponse({"error": f"Document with ID {document_id} not found"}, status_code=404)
        
        query = documents.delete().where(documents.c.id == document_id)
        await database.execute(query=query)
        
        return JSONResponse({"status": "Document deleted"}, status_code=200)
    
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
