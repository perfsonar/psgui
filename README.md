# perfSONAR pScheduler GUI for on-demand measurement

psGUI in combination with psproxy allows users to start on-demand measurement between two nodes from the MaDDash grid.

## Configuration

Clone repository and edit src/includes/TestDefaultValues.js to configure URLs. Build the app with:
```
yarn build
```
This builds the app for production to the `build` folder. Make that folder root of the web server. Also, this version does not support users so it is a good idea to protect access to it using web server authentication.

nginx example:
```
server {
        listen 80 default_server;
        root /var/www/psgui/build;
        auth_basic "Please enter username and password";
        auth_basic_user_file /etc/nginx/.htpasswd;
}
```
