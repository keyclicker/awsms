FROM postgres:15-alpine

ADD create_authentication.sql /docker-entrypoint-initdb.d
ADD create_inventory.sql /docker-entrypoint-initdb.d
ADD create_payment.sql /docker-entrypoint-initdb.d
