docker login adview.cxview.ai -u AdView -p adview@2023
docker build -t adview.cxview.ai/lpdev/dsd/dsd-frontend-uat:latest -f ./docker/Dockerfile_uat .
docker push adview.cxview.ai/lpdev/dsd/dsd-frontend-uat:latest
