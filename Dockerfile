FROM nginx:alpine

# 設定ファイルをコピー
COPY nginx.conf /etc/nginx/nginx.conf.template

# Renderの$PORTを反映させるための起動コマンド
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
