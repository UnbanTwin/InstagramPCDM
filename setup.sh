echo "Please enter your Instagram username"
read username
echo "Now enter your password"
read password
cat << EOF > account.json
{"username": "$username", "password": "$password" }
EOF
