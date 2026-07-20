"""
Logging configuration for FastAPI backend.

This module provides structured logging with:
- Different log levels for different components
- JSON formatting for production
- Human-readable formatting for development
- Request/response logging middleware
- Error and exception logging
"""

import json
import logging
import sys
from datetime import datetime
from typing import Any, Dict, Optional

from pythonjsonlogger import jsonlogger


class JSONFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter that includes timestamp and level name."""
    
    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]) -> None:
        super().add_fields(log_record, record, message_dict)
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name
        
        # Add exception info if present
        if record.exc_info:
            log_record['exception'] = self.formatException(record.exc_info)
        
        # Add stack info if present
        if record.stack_info:
            log_record['stack_info'] = self.formatStack(record.stack_info)


def setup_logging(log_level: str = "INFO", log_format: str = "json") -> None:
    """
    Configure logging for the application.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_format: Output format ('json' for production, 'text' for development)
    """
    level = getattr(logging, log_level.upper(), logging.INFO)
    
    # Create formatter based on format type
    if log_format == "json":
        formatter = JSONFormatter(
            fmt='%(timestamp)s %(level)s %(logger)s %(message)s'
        )
    else:
        formatter = logging.Formatter(
            fmt='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    
    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Add stream handler
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setLevel(level)
    stream_handler.setFormatter(formatter)
    root_logger.addHandler(stream_handler)
    
    # Set levels for specific loggers
    logging.getLogger("uvicorn").setLevel(level)
    logging.getLogger("uvicorn.access").setLevel(level)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("jose").setLevel(logging.WARNING)
    
    # Suppress noisy library logs
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("urllib3.connectionpool").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger with the specified name.
    
    Args:
        name: Logger name (typically __name__)
    
    Returns:
        Configured logger instance
    """
    return logging.getLogger(name)


class LoggingMiddleware:
    """
    FastAPI middleware for logging HTTP requests and responses.
    
    This middleware logs:
    - Incoming request details (method, path, headers, body size)
    - Response details (status code, response size, duration)
    - Errors and exceptions
    """
    
    def __init__(self, app, logger: Optional[logging.Logger] = None):
        self.app = app
        self.logger = logger or get_logger("http")
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        request_id = datetime.utcnow().isoformat() + "-" + str(id(scope) & 0xFFFFFFFF)
        
        # Log request
        method = scope.get("method", "UNKNOWN")
        path = scope.get("path", "/")
        query_string = scope.get("query_string", b"").decode("utf-8") or ""
        full_path = f"{path}?{query_string}" if query_string else path
        
        headers = dict(scope.get("headers", []))
        client = headers.get(b"x-forwarded-for", headers.get(b"x-real-ip", b"")).decode("utf-8") or "unknown"
        user_agent = headers.get(b"user-agent", b"").decode("utf-8") or "unknown"
        
        # Read request body size
        body_size = 0
        if scope.get("body"):
            body_size = len(scope["body"])
        
        self.logger.info(
            "Request started",
            extra={
                "request_id": request_id,
                "http": {
                    "method": method,
                    "path": full_path,
                    "client_ip": client,
                    "user_agent": user_agent,
                    "body_size": body_size,
                }
            }
        )
        
        start_time = datetime.utcnow()
        
        try:
            await self.app(scope, receive, send)
        except Exception as e:
            duration = (datetime.utcnow() - start_time).total_seconds() * 1000
            self.logger.error(
                "Request failed",
                extra={
                    "request_id": request_id,
                    "http": {
                        "method": method,
                        "path": full_path,
                        "status_code": 500,
                        "duration_ms": round(duration, 2),
                    },
                    "error": str(e),
                    "error_type": type(e).__name__,
                },
                exc_info=True
            )
            raise
        else:
            duration = (datetime.utcnow() - start_time).total_seconds() * 1000
            self.logger.info(
                "Request completed",
                extra={
                    "request_id": request_id,
                    "http": {
                        "method": method,
                        "path": full_path,
                        "duration_ms": round(duration, 2),
                    }
                }
            )
