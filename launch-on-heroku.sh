#!/bin/bash
echo "Loading deployment package"
wget https://s3-us-west-2.amazonaws.com/cloudception-bucket/public/deployment_package.zip
unzip ./deployment_package.zip
rm ./deployment_package.zip