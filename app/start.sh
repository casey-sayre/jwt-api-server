#!/bin/bash
export NODE_PORT=5000
export NODE_KEY_PATH='../keys/id_rsa.pub'
export NODE_SQL_USER='root'
export NODE_SQL_HOST='localhost'
export NODE_SQL_PW'rootpassword'
export NODE_AUTH_URL='http://localhost:5100'
pm2 start ./index.js
