#!/bin/sh
openssl asn1parse -genconf def.asn1 -noout -out /dev/stdout |
    openssl rsa -inform der -pubin -out src/pubkey.pem
