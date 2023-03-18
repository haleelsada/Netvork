from .database import db
from flask_login import login_manager,UserMixin



class User(db.Model,UserMixin):
    __tablename__ = 'User'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True,nullable=False, unique=True)
    email = db.Column(db.String,unique=True)
    name = db.Column(db.String,unique=True)
    password = db.Column(db.String, unique=True )
    fs_uniquifier = db.Column(db.String(225),unique=True,nullable=False)
    Post = db.relationship("Post",lazy="subquery")
    Img_url = db.Column(db.String)
 
class Post(db.Model):
    __tablename__ = 'Post'
    Pid = db.Column(db.Integer, autoincrement=True, primary_key=True,nullable=False, unique=True)
    Title = db.Column(db.String)
    Caption = db.Column(db.String)
    Img_url = db.Column(db.String)
    Created = db.Column(db.String)
    Uid = db.Column(db.Integer,db.ForeignKey("User.id"), nullable=False)
    
class Follow(db.Model):
    __tablename__ = 'Follow'
    Uid = db.Column(db.Integer, primary_key=True,nullable=False, unique=True)
    Following = db.Column(db.String)
    Followers = db.Column(db.String)
    
    

		
