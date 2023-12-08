docker login adview.cxview.ai
docker build -t adview.cxview.ai/lpdev/dsd/dsd-frontend-cache-uat:latest -f ./docker/Dockerfile_cache .
docker push adview.cxview.ai/lpdev/dsd/dsd-frontend-cache-uat:latest
