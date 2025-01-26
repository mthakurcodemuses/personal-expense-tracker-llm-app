import os
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json
import shutil
from pathlib import Path
from pdf_processor import parse_expenses

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

@app.post("/api/upload-statement")
async def upload_statement(statement: UploadFile):
    if not statement.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save the uploaded file
    file_path = uploads_dir / statement.filename
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(statement.file, buffer)
        
        # Process the PDF
        expenses = parse_expenses(str(file_path))
        
        # Clean up the file
        file_path.unlink()
        
        return expenses
    except Exception as e:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=str(e))

# Serve static files in production
if os.getenv("NODE_ENV") == "production":
    app.mount("/", StaticFiles(directory="dist/public", html=True))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
