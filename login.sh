#!/usr/bin/env bash
echo "Please enter your Instagram credentials"
echo -n "Username: "
read username
echo -n "Password: "
read -s password
cat << EOF > account.json
{"username": "$username", "password": "$password" }
EOF
