#!/bin/bash

echo "Copy static assets with one year expiry."
aws s3 sync ./dist/ s3://grand-performance/ --cache-control max-age=31536000 --exclude '*.html'

echo "Copy HTML files with one day expiry."
aws s3 sync ./dist/ s3://grand-performance/ --cache-control max-age=86400 --include '*.html'

echo "Invalidate CloudFront cache."
aws cloudfront create-invalidation --distribution-id E3AEV9ZGOHT698 --paths /