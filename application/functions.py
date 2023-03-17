import os,random
from main import cache
from application.models import *

#to get user and posts data with api get method after login
@cache.cached(timeout=60,key_prefix='getdata')
def getdata(email):
	user = db.session.query(User).filter(User.email == email).first()
	id=user.id
	data=[id,user.name]
	posts= db.session.query(Post).all()
	
	# get the id of people I following
	try:
		myfollowing = [int(i) for i in db.session.query(Follow).filter(Follow.Uid == id).first().Following.split(',')]
	except:myfollowing=[]
	
	# only show posts of people I follow
	nposts=[]
	for i in posts:
		
		if i.Uid in myfollowing or i.Uid==id:
			nposts.append([i.Uid, i.Pid, i.Title, i.Caption, i.Created,i.Img_url]) #uid,pid,title,caption,created,img_url
	
	users= db.session.query(User).all()
	nusers=[]
	# get all users details
	for i in users:
		follow=db.session.query(Follow).filter(Follow.Uid == i.id).first()
		nusers.append([i.id, i.name, i.Img_url,follow.Following,follow.Followers]) #uid,name,Img_url,following,followers
	
	random.shuffle(nposts)
	random.shuffle(nusers)    
	data.append(nposts)
	data.append(nusers)
	return data