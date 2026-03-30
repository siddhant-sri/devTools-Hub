@echo off
node node_modules\@nestjs\cli\bin\nest.js g module proxy
node node_modules\@nestjs\cli\bin\nest.js g controller proxy
node node_modules\@nestjs\cli\bin\nest.js g service proxy

node node_modules\@nestjs\cli\bin\nest.js g module collections
node node_modules\@nestjs\cli\bin\nest.js g controller collections
node node_modules\@nestjs\cli\bin\nest.js g service collections

node node_modules\@nestjs\cli\bin\nest.js g module logs
node node_modules\@nestjs\cli\bin\nest.js g controller logs
node node_modules\@nestjs\cli\bin\nest.js g service logs
node node_modules\@nestjs\cli\bin\nest.js g gateway logs

node node_modules\@nestjs\cli\bin\nest.js g module auth
node node_modules\@nestjs\cli\bin\nest.js g controller auth
node node_modules\@nestjs\cli\bin\nest.js g service auth

node node_modules\@nestjs\cli\bin\nest.js g module users
node node_modules\@nestjs\cli\bin\nest.js g controller users
node node_modules\@nestjs\cli\bin\nest.js g service users
exit
