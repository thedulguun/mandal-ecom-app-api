curl 'https://api.ebuuhia.mn/api/v1/login' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'Cache-Control: no-cache' \
  -H 'Referer: https://ebuuhia.mn/' \
  -H 'accept-language: mn' \
  -H 'Pragma: no-cache' \
  -H 'sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'Expires: 0' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"mandalbeauty@yahoo.com","password":"12345678","device_token":null}'

response:

  {"user":{"user_id":2015,"shop_name":"Мандал онлайн шоп1","email":"mandalbeauty@yahoo.com","first_name":"boldoo ","last_name":"saraa","driver_name":null,"r_d":"УД04040404","phone":99537771,"phone1":99537771,"password":"$2b$10$3Atc1MHYXtnlqNyaA/bZVutklnRwA0s/7wsZGjpFxcktoBHgrIqKK","role":"customer","address":null,"address1":null,"car_number":null,"car_type":null,"type":null,"bank_type":"Хаан банк","bank_num":"MN620005005176599539","bank_name":"Номун Мөнхбаатар","price":6000,"approve":1,"active":1,"token":"null"},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY3VzdG9tZXIiLCJlbWFpbCI6Im1hbmRhbGJlYXV0eUB5YWhvby5jb20iLCJpYXQiOjE3NjUxNTc2MjgsImV4cCI6MTc2NTIxNzYyOH0.4wsHn3YdDfO1Tmy8tGnB_9MMPdPTqXmtmgugikqxtvg","tokenExpTime":"2025-12-09 02:13"}