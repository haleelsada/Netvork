import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
    DEBUG = False
    SQLITE_DB_DIR = None
    SECRET_KEY = "IMBATMAN"
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    JWT_SECRET_KEY = "IMBATMAN"
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND =  "redis://localhost:6379/2"
    UPLOAD_FOLDER = "/static/export"
    CACHE_TYPE = "RedisCache0"
    CHACHE_REDIS_HOST = "localhost"
    CHACHE_REDIS_PORT = 6379
    
class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR = os.path.join(basedir, "../db_directory")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "testdb.sqlite3")
    DEBUG = False
    CACHE_TYPE = "RedisCache"
    CHACHE_REDIS_HOST = "localhost"
    CHACHE_REDIS_PORT = 6379
