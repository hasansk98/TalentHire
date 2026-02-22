
import os
import abc
import boto3
from typing import Optional
from backend.core.config import settings

class BaseStorage(abc.ABC):
    @abc.abstractmethod
    async def upload(self, content: bytes, filename: str, folder: str = "resumes") -> str:
        """Uploads a file and returns the URI or path."""
        pass

    @abc.abstractmethod
    async def delete(self, path: str):
        """Deletes a file."""
        pass

class LocalStorage(BaseStorage):
    def __init__(self, upload_dir: str = "storage"):
        self.upload_dir = upload_dir
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

    async def upload(self, content: bytes, filename: str, folder: str = "resumes") -> str:
        target_dir = os.path.join(self.upload_dir, folder)
        os.makedirs(target_dir, exist_ok=True)
        file_path = os.path.join(target_dir, filename)
        with open(file_path, "wb") as f:
            f.write(content)
        return file_path

    async def delete(self, path: str):
        if os.path.exists(path):
            os.remove(path)

class S3Storage(BaseStorage):
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket = settings.S3_BUCKET_NAME

    async def upload(self, content: bytes, filename: str, folder: str = "resumes") -> str:
        key = f"{folder}/{filename}"
        self.s3.put_object(Bucket=self.bucket, Key=key, Body=content)
        return f"s3://{self.bucket}/{key}"

    async def delete(self, path: str):
        key = path.replace(f"s3://{self.bucket}/", "")
        self.s3.delete_object(Bucket=self.bucket, Key=key)

def get_storage() -> BaseStorage:
    if settings.STORAGE_BACKEND == "s3":
        return S3Storage()
    return LocalStorage()
