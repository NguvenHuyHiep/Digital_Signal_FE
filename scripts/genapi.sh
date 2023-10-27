#myServices=("auth" "core" "course" "class-content" "question" "resources")
myServices=( "course")

#npm install @openapitools/openapi-generator-cli@2.7.0 -g

for service in ${myServices[@]}; do

  openapi-generator-cli generate \
  -i https://dev.learnhub.vn/docs/${service}/swagger/api-core/swagger.json \
  -o projects/app-api/src/lib/api \
  --api-package controller/${service} \
  --model-package models \
  -g typescript-angular


  git -c credential.helper= -c core.quotepath=false \
  -c log.showSignature=false checkout HEAD -- projects/app-api/src/lib/api/controller/${service}/api.ts

  cp -r projects/app-api/src/lib/api/models/models.ts projects/app-api/src/lib/api/models/${service}-models.ts

  git -c credential.helper= -c core.quotepath=false \
  -c log.showSignature=false checkout HEAD -- projects/app-api/src/lib/api/models/models.ts

  git -c credential.helper= -c core.quotepath=false \
  -c log.showSignature=false checkout HEAD -- projects/app-api/src/lib/api/index.ts

  git -c credential.helper= -c core.quotepath=false \
  -c log.showSignature=false checkout HEAD -- projects/app-api/src/lib/api/api.module.ts

  sed -i "s/const APIS/const ${service}_APIS/g" projects/app-api/src/lib/api/controller/${service}/api.ts

done

sed -i "s/'..\/variables'/'..\/..\/variables'/g" projects/app-api/src/lib/api/controller/*/*.service.ts
sed -i "s/'..\/configuration'/'..\/..\/configuration'/g" projects/app-api/src/lib/api/controller/*/*.service.ts
sed -i "s/'..\/encoder'/'..\/..\/encoder'/g" projects/app-api/src/lib/api/controller/*/*.service.ts

rm -rf projects/app-api/src/lib/api/.openapi-generator
rm -rf projects/app-api/src/lib/api/git_push.sh
rm -rf projects/app-api/src/lib/api/.openapi-generator-ignore

git -c credential.helper= -c core.quotepath=false \
-c log.showSignature=false add --ignore-errors -A -f -- projects/app-api/src/lib/api/*

git -c credential.helper= -c core.quotepath=false \
-c log.showSignature=false commit -m "Generate API" -- projects/app-api/src/lib/api/*
