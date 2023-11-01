# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy only the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

# Install FastAPI, Uvicorn, and other dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the application
COPY . /app

# Define environment variable for Uvicorn
ENV UVICORN_HOST 0.0.0.0
ENV UVICORN_PORT 8000
ENV UVICORN_RELOAD true

# Run Uvicorn when the container launches
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
