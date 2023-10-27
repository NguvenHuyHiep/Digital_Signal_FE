rm -rf deploy/web/*
npm run build:prod
#npm run build:admin:prod

git -c credential.helper= -c core.quotepath=false \
-c log.showSignature=false add --ignore-errors -A -f -- deploy/*

git -c credential.helper= -c core.quotepath=false \
-c log.showSignature=false commit -m "deploy" -- deploy/*
