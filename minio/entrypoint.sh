#!/bin/sh

echo "Checking mount..."

if [ ! -f /data/.mounted ]; then
  echo "ERROR: /data is not properly mounted!"
  exit 1
fi

echo "Mount verified"

exec minio server /data --console-address ":9001"