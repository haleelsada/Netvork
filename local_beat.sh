#! /bin/sh
echo "======================================================================"
echo "Welcome to local beat. this will do the function of celery beat" 
echo "It helps in running crontab jobs"
echo "You can rerun this without any issues."
echo "----------------------------------------------------------------------"
if [ -d ".env" ];
then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run setup.sh first"
    exit N
fi

# Activate virtual env
. .env/bin/activate
export ENV=development
celery -A main.celery beat --max-interval 1 -l info
deactivate
