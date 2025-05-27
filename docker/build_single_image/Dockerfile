FROM python:3.9

RUN apt-get update && \
    apt-get install -y \
    nginx \
    supervisor \
    git \
    net-tools \
    vim

# Set working directory
WORKDIR /psproxy

# Clone and set up the Flask app
RUN git clone https://github.com/perfsonar/psproxy.git . && \
    pip install -r requirements.txt
#ENV FLASK_ENV=development
COPY example_config.py /psproxy/config.py

# Install Node.js, Yarn, git, and Nginx
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs && \
    npm install --global yarn

# nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .htpasswd /etc/nginx/.htpasswd
COPY nginx.crt /etc/nginx/ssl/nginx.crt
COPY nginx.key /etc/nginx/ssl/nginx.key

# Clone and build the React app
WORKDIR /psgui
RUN git clone https://github.com/perfsonar/psgui.git .
COPY custom_TestDefaultValues.js /psgui/src/includes/TestDefaultValues.js
#ENV NODE_ENV development
RUN yarn install && \
    yarn build

# Supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Gunicorn log dir
RUN mkdir -p /var/log/gunicorn/

# Clean up APT
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Expose ports
EXPOSE 443

# Start Nginx and the Flask app
# CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Copy and set entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
