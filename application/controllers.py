from flask import Flask, request, flash, redirect, url_for
from flask import render_template,send_from_directory
from flask import current_app as app
from application.models import *
from flask_login import login_user,login_required, current_user
from flask_security import login_required
import random,json,os,shutil,zipfile,requests,time,smtplib
from flask_jwt_extended import create_access_token, jwt_required
from datetime import datetime
from flask_login import LoginManager
from application import tasks
from main import socketio,emit


@app.route('/')
def root():
    return render_template('login.html')


@app.route('/login')
def login():
    print('inside login')
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login_post():
    # print('inside login post')
    # login code goes here
    email = request.form.get('email')
    email=email.lower()
    password = request.form.get('password')
    #remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()
    
    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    # if the user doesn't exist or password is wrong, reload the page

    if not user:
        #print('no user\n')
        flash('Wrong email try again.','error')
        return redirect(url_for('login'))
        
    if not (user.password == password):
        #print('password wrong....\n')
        flash('Please check your password and try again.','error')
        return redirect(url_for('login'))  
        
    # if the above check passes, then we know the user has the right credentials
    global token
    token = create_access_token(identity=email)
    print("Login Succeeded!, access_token= ",token)
    
    login_user(user, remember=True)
    return redirect(url_for('application',token=token))
    
@app.route('/signup')
def signup():
    return render_template('signup.html')
    
@app.route('/signup', methods=['POST'])
def signup_post():
    # code to validate and add user to database goes here
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')
	
	
    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database

    if user: # if a user is found, we want to redirect back to signup page so user can try again
        flash('Email already used','error')
        return redirect(url_for('login'))

    # create a new user with the form data. Hash the password so the plaintext version isn't saved.
    strng='abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    fs=''.join(random.choices(strng,k=8))
    
    new_user = User(email=email, name=name, password=password,fs_uniquifier=fs,Img_url="")
    db.session.add(new_user)
    db.session.commit
    
    new_user = db.session.query(User).filter(User.email == email).first()
    id=new_user.id
    try:
        f = request.files['imgfile']
        print('inside try')
        f.save(f.filename)
        newname='post_'+str(id)+'.'+f.filename.split('.')[1]
        #f = secure_filename(f.filename)
        os.rename(f.filename,newname)
        shutil.move(newname, 'static/photos/'+newname)
        new_user.Img_url=newname
    except:pass

    new_user_follow = Follow(Uid=id, Following='', Followers='')

    db.session.add(new_user_follow)
    db.session.commit()
    flash('New user registered','error2')
    return redirect(url_for('login'))
    
        
    
    
@app.route("/application", methods=["GET", "POST"])
@login_required
def application():
    try:
        print('this is token',token)
        return render_template('application.html',token=token)
    except:
        print('\ntoken gone \n')
        return render_template('application.html',token='')
    
@app.route("/edit/list/<lid>", methods=["GET", "POST"])
@login_required
def edit(lid):
    
    return render_template('edit.html',id=lid)
    
@app.route("/newpost", methods=["GET", "POST"])
@login_required
def newpost():
    
    return render_template('newpost.html')
    
@app.route("/editpost", methods=["GET", "POST"])
@login_required
def editpost():
    
    return render_template('editpost.html')
    
@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    flash("Succesfully logged out","error2")
    return redirect(url_for('login'))
    
@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    return render_template('profile.html')
    
@app.route("/follow", methods=["GET", "POST"])
@login_required
def follow():  
    return render_template('follow.html')

@app.login_manager.user_loader
def load_user(user_id):
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return User.query.get(int(user_id))

@app.route("/newpost", methods=['GET','POST'])
def newcard(lid):	
    return render_template("newpost.html",name=name,uid=uid)

@app.route('/download/<filename>', methods=['GET', 'POST'])
def download(filename):
    print('inside download root')
    filename = filename
    # Appending app path to upload folder path within app root folder
    uploads = os.path.join(app.root_path, 'static/export')
    # Returning file from appended path
    return send_from_directory(uploads, filename, as_attachment=True)
