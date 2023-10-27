docker build -t aninfosys.asia:8082/Digital Signage/fe:1.0  -f ./docker/Dockerfile .
docker push aninfosys.asia:8082/Digital Signage/fe:1.0
docker stack deploy ctedu --resolve-image always --compose-file docker/docker-compose.yml --with-registry-auth
