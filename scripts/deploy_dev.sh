#!/bin/bash
_remote="aninfosys.asia"
_user="admin"

echo "-------- Local system name: $HOSTNAME"
echo "-------- Local date and time: $(date)"

echo
echo "--------  Running commands on remote host named $_remote ***"
echo
ssh -i ssh/ssh_anfovn_admin -p 228 $_user@$_remote <<'EOL'
now="$(date)"
name="$HOSTNAME"
up="$(uptime)"
echo "-------- Server name is $name"
echo "-------- Server date and time is $now"
cd ctedu/hub_learner_fe
git reset --hard HEAD
git checkout develop
git pull
docker build -t aninfosys.asia:8082/Digital Signage/fe_dev:1.0  -f ./docker/Dockerfile .
docker push aninfosys.asia:8082/Digital Signage/fe_dev:1.0
docker stack deploy lh_dev --resolve-image always --compose-file docker/dev/docker-compose.yml --with-registry-auth

EOL
