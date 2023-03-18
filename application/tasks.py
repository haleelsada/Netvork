from application.workers import celery
from datetime import datetime
import smtplib,csv,os,shutil,zipfile,time
from datetime import datetime
from application.models import *
from application import controllers
from celery.schedules import crontab

@celery.on_after_finalize.connect
def setup_periodic_tasks(sender,**kwargs):
    sender.add_periodic_task(
        crontab(hour=ist(16,0)[0],minute=ist(16,0)[1]),mail_send.s()   
    )
    sender.add_periodic_task(
        crontab(0, 0, day_of_month='1'),mail_send_monthly.s()   
    )

@celery.task
def mail_send():
    print('inside mail send')
    users = db.session.query(User).all()
    for user in users:
        posts = db.session.query(Post).filter(Post.Uid == user.id).all()
        if len(posts)==0:
            daily_mail(user.name,user.email)
            continue
        flag=0
        today = datetime.today()
        for post in posts:
            d = post.Created
            date = datetime(int(d.split('-')[0]),int(d.split('-')[1]),int(d.split('-')[2]),0)
            break  
            if (today-date).days!=1:
                flag=1
                break
        if flag==1:
            daily_mail(user.name,user.email)

@celery.task
def mail_send_monthly():
    print('inside monthly mail')
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("21f1003974@ds.study.iitm.ac.in", "tqevflufhzlqmfda")
    users = db.session.query(User).all()
    for user in users:
         monthly_report(user.name,user.email,s)
    s.quit()
        

#function to change utc to itc to put in crontab,eg: hour=ist(11,37)[0],minute=ist(11,37)[1]
def ist(a,b):
    if b>30:
        a=(a-5)%24
        b=b-30
    else:
       a=(a-6)%24
       b=b+30
    return a,b

#finction to send daily reminder
def daily_mail(name,mail):
    print('inside daily mail')
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("21f1003974@ds.study.iitm.ac.in", "tqevflufhzlqmfda")
    message = '''From: From Person <from@fromdomain.com> 
To: To Person <to@todomain.com>
MIME-Version: 1.0
Content-type: text/html
Subject: Netvork Daily post reminder
Dear {0},
<br>
We hope this email finds you well! We're writing to you today to encourage you to share your thoughts and ideas on our blog app, Netvork.
<br>
At Netvork, we believe that everyone has a unique perspective and valuable insights to offer. 
<br>
That's why we created a platform that allows people from all walks of life to connect, engage, and share their knowledge and experiences with others.
<br>
Thank you for being a valuable member of our Netvork community, and we look forward to reading your blog post soon!
<br>
Best regards,
<br>
Netvork Team'''.format(name)
    s.sendmail("21f1003974@ds.study.iitm.ac.in", mail, message)
    s.quit()
    print('mail send')

@celery.task
def export(uid,pid):
    print('inside download post as zip in tasks')

    filename = "static/export/post/post.csv"
    fields = ['Name','Title','Caption','Created','Image']
    
    post = db.session.query(Post).filter(Post.Pid == pid).first()
    row = ['',post.Title,post.Caption.replace('\n',' ').replace('\r',' '),post.Created,post.Img_url]
    name = db.session.query(User).filter(User.id == post.Uid).first().name
    row[0]=name

    with open(filename, 'w') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(fields)
        csvwriter.writerow(row)

    shutil.copy('static/photos/'+post.Img_url, 'static/export/post/'+post.Img_url)
    #print(os.getcwd())
    os.chdir('static/export')

    filename=uid+pid+'.zip'

    zipfile.ZipFile(filename, mode='w').write('post/'+post.Img_url)
    zipfile.ZipFile(filename, mode='a').write('post/post.csv')
    os.chdir('../../')
    print('zip created :',filename)

@celery.task
def test():
    print('inside test task on3')
    time.sleep(15)
    print('inside task test two')

#function to send monthly report
def monthly_report(name,mail,s):
    uid = db.session.query(User).filter(User.email == mail).first().id
    myposts = db.session.query(Post).filter(Post.Uid == uid).all()
    
    m1 = '''From: From Person <from@fromdomain.com> 
To: To Person <to@todomain.com>
MIME-Version: 1.0
Content-type: text/html
Subject: Netvork Monthly report
<div>
<h2>Dear <b>{0}</b>,</h2>
<h3>here is your monthly report</h3>

<h3><b>Posts you have created : {1}</b></h3>
<br>'''.format(name,len(myposts))
    m1+='''
<table style="border-collapse: collapse; width: 80%;">
<tr>
    <th style="border: solid #1D2A35; padding:8px">Top creaters this week</th>
    <th style="border: solid #1D2A35; padding:8px">Posts</th>
</tr>
'''
    follow_ = db.session.query(Follow).filter(Follow.Uid == uid).first().Following
    if follow_ != '':
        follow=[int(i) for i in follow_.split(',')]
    else:follow = []
    user_post = {}
    for i in follow:
        c=0
        user = db.session.query(User).filter(User.id == i).first().name
       
        posts = db.session.query(Post).filter(Post.Uid == i).all()
        for post in posts:
            created =[int(i) for i in post.Created.split('-')]
            today = [int(i) for i in datetime.today().strftime('%Y-%m-%d').split('-')]
            if (today[1]>created[1]) and ((today[1]-created[1])<2 or (today[1]==1 and created[1]==12)):
                    c+=1

        if c!=0:
            m1+='''
<tr>
<td style="border: solid #1D2A35; padding:8px"><b>{0}</b></td>
<td style="border: solid #1D2A35; padding:8px">{1}</td>
</tr>
'''.format(user,c)
            
    m1+='''
</table> 
<br>
Thank you for being a valuable member of our Netvork community, and we look forward to reading your blog post soon!
<br>
Best regards,
<br>
Netvork Team

</div>'''
    #print(m1)   
    try:
        s.sendmail("21f1003974@ds.study.iitm.ac.in", mail, m1)
        print('mail send to ',name)
    except Exception as e:
        print('failed to email ',name,' with error ',str(e))

