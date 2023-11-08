  openapi-generator-cli generate \
  -i http://aninfosys.asia:8079/dsd/swagger/v3/api-docs \
  -o projects/app-api/src/lib/api \
  --api-package controller \
  --model-package models \
  -g typescript-angular


git -c credential.helper= -c core.quotepath=false \
-c log.showSignature=false add --ignore-errors -A -f -- projects/app-api/src/lib/api/*

git -c credential.helper= -c core.quotepath=false \
-c log.showSignature=false commit -m "Generate API" -- projects/app-api/src/lib/api/*
