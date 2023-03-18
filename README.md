# Netvork
Social media app using flask
Netvork provides a platform for people to share their thoughts, experiences, and ideas, and to engage with others in meaningful ways. With a clean and user-friendly interface, Netvork aims to create a positive online environment for people to connect and engage with each other.
![screenshot](https://github.com/haleelsada/Netvork/blob/main/static/photos/ss%20Netvork.png?raw=true)
## Technologies used
The following technologies were used to build this app:
- Flask for API and backend
- VueJS for UI 
- Jinja2 templates 
- Bootstrap
- SQLite for database
- Redis for caching
- Redis and Celery for batch jobs

## Features
The app has the following features:

- Flask security and token based authentication
- Ability for users to create and edit their posts
- Ability for users to see posts of other users
- Follow/unfollow functionality for users
- Feed displaying posts from followed users
- Search functionality to find other users
- Daily reminder to post via email
- Monthly report via email
- Export posts in feed

## Installation

To run this app on your local machine, follow these steps:

Install `DB Browser for SQlite` to manage database and `Redis` for jobs and database

1.Clone this repository
```
git clone https://github.com/haleelsada/Netvork.git
```
2.open terminal inside this repository and run local_setup.sh to setup environment and isntall packages needed
```
cd Netvork
sh local_setup.sh
```
3.activate virtual environment
```
source .env/bin/activate
```
4.run local_run.sh to run the app
```
sh local_run.sh
```
5.open a new terminal branch to run celery worker
```
sh local_workers.sh
```
6.open another terminal to run celery beat
```
sh local_beat.sh
```
7.open browser and search
```
http://127.0.0.1:8080/
```

## Contributers
[Haleel Sada](https://github.com/haleelsada)
## Licence
This project is licensed under the MIT License - see the [LICENSE](https://github.com/haleelsada/Netvork/blob/main/LICENSE) file for details.

