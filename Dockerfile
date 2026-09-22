FROM python:3.12-slim

WORKDIR /app

# Copy all application code, data, and scripts
COPY . /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONIOENCODING=utf-8
ENV PYTHONUTF8=1
ENV PORT=8080

EXPOSE 8080

CMD ["python", "api/server.py"]
