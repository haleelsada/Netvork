import os
from flask_socketio import SocketIO, emit
from flask import Flask
from flask_restful import Resource, Api
from application import config,workers
from application.config import LocalDevelopmentConfig
from application.database import db
from flask_login import LoginManager
from flask_cors import CORS
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from flask_caching import Cache


app = None
api = None
celery = None
cache = None
def create_app():
    app = Flask(__name__, template_folder="templates")
    CORS(app,resources={r"/api/*": {"origins": "*"}})
    #login_manager.init_app(app)
    if os.getenv('ENV', "development") == "production":
      raise Exception("Currently no production config is setup.")
    else:
      print("Staring Local Development")
      app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api = Api(app)
    
    UPLOAD_FOLDER = '/static/photos'

    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
    login_manager = LoginManager()
    login_manager.login_view = 'login'
    login_manager.init_app(app)
    
    app.app_context().push()
    
    celery = workers.celery
    
    celery.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend =  app.config["CELERY_RESULT_BACKEND"],
        #timezone = 'Asia/Kolkata'
    )
    celery.Task = workers.ContextTask
    app.app_context().push()
    cache = Cache(app)
    app.app_context().push()

    return app, api, celery, cache

app, api, celery, cache= create_app()
socketio = SocketIO(app,cors_allowed_origins="*")

jwt = JWTManager(app)
# Import all the controllers so they are loaded
from application.controllers import *

from application.api import API
api.add_resource(API, "/api/test")

# Add all restful controllers
from application.api import UserAPI
api.add_resource(UserAPI, "/api/user")

if __name__ == '__main__':
  # Run the Flask app
  socketio.run(app,host='0.0.0.0',port=8080)
