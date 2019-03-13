FROM node:8.11.3-alpine
LABEL maintainer="xergioalex@gmail.com"

RUN apk -v --update add python py-pip groff less mailcap make && \
    pip install --upgrade awscli s3cmd python-magic && \
    apk -v --purge del py-pip && \
    rm /var/cache/apk/*