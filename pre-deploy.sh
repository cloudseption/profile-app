#!/bin/bash

# Prep deployment package
npm run build
zip -r deployment_package ./dist
aws s3 cp ./deployment_package.zip s3://cloudception-bucket/public/
rm ./deployment_package.zip