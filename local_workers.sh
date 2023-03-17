#! /bin/sh
echo "======================================================================"
echo "Welcome to local worker. This will run the celery jobs" 
echo "tasks, and scheduled jobs."
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
celery -A main.celery worker -l info
deactivate
