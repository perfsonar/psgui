# This Dockerfile builds the API only.

FROM python:3.9

WORKDIR /psproxy
RUN git clone https://github.com/perfsonar/psproxy.git .

RUN pip install -r ./requirements.txt

ENV FLASK_ENV development

EXPOSE 5000
