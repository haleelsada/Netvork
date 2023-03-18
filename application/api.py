from flask_restful import Resource, Api
from flask_restful import fields, marshal_with,marshal
from flask_restful import reqparse
from application.validation import BusinessValidationError, NotFoundError
from application.models import *
from application.database import db
from application import functions
from flask import current_app as app
from datetime import datetime
import werkzeug,os,shutil,random
from werkzeug.utils import secure_filename
from .functions import *
from flask import abort, jsonify, request
from flask_security import auth_required, login_required
from flask_jwt_extended import jwt_required,get_jwt_identity
from main import socketio,emit
from application import tasks
import time

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument('username')
create_user_parser.add_argument('email')

update_user_parser = reqparse.RequestParser()
update_user_parser.add_argument('email')

resource_fields = {
    'user_id':   fields.Integer,
    'username':    fields.String,
    'email':    fields.String
}


class UserAPI(Resource):
    #get user details
    @jwt_required()
    def get(self):
        try:
            print('inside api\n')
            email=get_jwt_identity()
            #a = time.perf_counter_ns()
            data = functions.getdata(email)
            #b = time.perf_counter_ns()
            #print('this is time taken :',b-a)
            return jsonify(data)  
        except:abort(400,'Operation Failed') 
        
    #create post
    @jwt_required()
    def post(self):
        try:
            email=get_jwt_identity()
            user = db.session.query(User).filter(User.email == email).first()
            id=user.id
        
            print('inside post userapi')
        
            title=request.form['postname']
            caption=request.form['caption']
               
            post=Post(Title=request.form['postname'],Caption=request.form['caption'],Img_url='',Created=datetime.today().strftime('%Y-%m-%d'),Uid=id)
            db.session.add(post)
            db.session.commit()

            post = db.session.query(Post).filter(Post.Title == request.form['postname']).first()       
            pid=post.Pid
            try:
                f = request.files['photo']
                f.save(f.filename)
                newname='post_'+str(id)+'_'+str(pid)+'.'+f.filename.split('.')[1]
                #f = secure_filename(f.filename)
                os.rename(f.filename,newname)
                post.Img_url=newname
                shutil.move(newname, 'static/photos/'+newname)
            except:pass
            db.session.commit()
            print('moved to static/image')
            return ('new post created') 
        except:abort(400,'Operation failed')

    #delete post
    @jwt_required()
    def delete(self):
        try:
            id=request.form['id']
            post = db.session.query(Post).filter(Post.Pid == id).first()
            db.session.delete(post)
            db.session.commit()
            print('post with id deleted',id)
        except:
            abort(400,'Operation failed')

    #edit post
    @jwt_required()
    def put(self):
        try:
            id=request.form['id']
        
            post = db.session.query(Post).filter(Post.Pid == id).first()
        
            post.Title=request.form['postname']
            post.Caption=request.form['caption']
        
            try:

                f = request.files['photo']
                f.save(f.filename)
                newname='post_'+str(post.Uid)+'_'+str(post.Pid)+'.'+f.filename.split('.')[1]
                #f = secure_filename(f.filename)
                os.rename(f.filename,newname)
        
                shutil.move(newname, 'static/photos/'+newname)
                post.Img_url=newname
            except:
                pass
            db.session.commit()
        except:
            abort(400,'Operation failed')

		
test_api_resource_fields = {
    'msg':    fields.String,
}

class API(Resource):
    
    @jwt_required()
    def put(self):   #api to follow and unfollow people
        try:
            email=get_jwt_identity()
            user = db.session.query(User).filter(User.email == email).first()
            me=user.id
            id=request.args.get('id')
            if me==id:
                return
            follow=db.session.query(Follow).filter(Follow.Uid == me).first()
            f=follow.Following
        
            other_person=db.session.query(Follow).filter(Follow.Uid == int(id)).first()
            f_=other_person.Followers
        
            if str(id) in follow.Following:
                f=f.replace(str(id),'').strip(',').replace(',,',',')
                follow.Following=f           
            
                f_=f_.replace(str(me),'').strip(',').replace(',,',',')
                other_person.Followers=f_
           
            else:
                f=f+','+str(id)
                f=f.strip(',')
                follow.Following=f
            
                f_=f_+','+str(me)
                f_=f_.strip(',')
            
                other_person.Followers=f_
            db.session.commit()
        
            return 200
        except:
            abort(400,'Operation failed')

