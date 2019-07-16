#!/bin/bash

set -e
set -x

docker pull postgres

docker stop postgres || echo ok
docker rm postgres || echo ok

docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres

sleep 3

npm start

docker rm postgres
