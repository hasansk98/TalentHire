import os
import zipfile
import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime

router = APIRouter()

@router.get("/download-project")
def download_project():
    """
    Zips the entire project directory (excluding node_modules, .git, etc.)
    and returns it as a streaming response.
    """
    # Define directories/files to exclude
    EXCLUDE_DIRS = {'node_modules', '.git', '__pycache__', 'dist', '.next', '.venv', 'storage'}
    EXCLUDE_FILES = {'.env', '.env.local', 'talenthire.db'} # Exclude sensitive or DB files

    # Use a BytesIO object to store the zip file in memory
    memory_file = io.BytesIO()
    
    try:
        with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
            # The root directory is the current working directory
            root_dir = os.getcwd()
            
            for root, dirs, files in os.walk(root_dir):
                # Modify dirs in-place to skip excluded directories
                dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
                
                for file in files:
                    if file in EXCLUDE_FILES:
                        continue
                        
                    file_path = os.path.join(root, file)
                    # Create an archive name relative to the root directory
                    archive_name = os.path.relpath(file_path, root_dir)
                    zipf.write(file_path, archive_name)
                    
        memory_file.seek(0)
        
        filename = f"talenthire-ai-project-{datetime.now().strftime('%Y%m%d-%H%M%S')}.zip"
        
        return StreamingResponse(
            memory_file,
            media_type="application/x-zip-compressed",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project archive: {str(e)}")
