from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
DB_NAME = os.getenv('DB_NAME')


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'

    db.init_app(app)

    # IMPORT MODELS ----------------------------------------------------------
    from .models import User, Workout  

    # IMPORT ROUTES ----------------------------------------------------------
    from .api_auth import auth_bp
    from .api_workouts import workouts_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(workouts_bp)


    with app.app_context():
        db.create_all()

    return app