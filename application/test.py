from models import *

users = db.session.query(User).all()

for i in users:
    print(i)
    break