request:

curl 'https://api.ebuuhia.mn/api/v1/getItemCustomer?startLimit=0&endLimit=100&order=&sort=asc&search=&value=&id=2015' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY3VzdG9tZXIiLCJlbWFpbCI6Im1hbmRhbGJlYXV0eUB5YWhvby5jb20iLCJpYXQiOjE3NjUxNTgxOTUsImV4cCI6MTc2NTIxODE5NX0.GKmrJG-1M_QbG3amiPN1L1SmWePmwYBApMz5Y9YxepE' \
  -H 'Cache-Control: no-cache' \
  -H 'Referer: https://ebuuhia.mn/' \
  -H 'accept-language: mn' \
  -H 'Pragma: no-cache' \
  -H 'sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'Expires: 0' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36' \
  -H 'Accept: application/json, text/plain, */*'

response:

{"data":[{"created_at":"2025-12-03T18:39:06.000Z","name":"test","price":100,"end":0,"id":5068,"start":1,"quantity":-1,"user_id":2015,"shop_name":"Мандал онлайн шоп1"},{"created_at":"2025-11-23T04:15:01.000Z","name":"Лаан гацуур 3 хос суурьтайгаа","price":69000,"end":6,"id":5001,"start":0,"quantity":0,"user_id":2015,"shop_name":"Мандал онлайн шоп1"},{"created_at":"2025-04-11T03:08:36.000Z","name":"Car mirror","price":42900,"end":3,"id":2088,"start":0,"quantity":-2,"user_id":2015,"shop_name":"Мандал онлайн шоп1"},{"created_at":"2025-04-11T03:07:29.000Z","name":"Сарнай","price":39500,"end":6,"id":2087,"start":0,"quantity":-5,"user_id":2015,"shop_name":"Мандал онлайн шоп1"},{"created_at":"2025-04-11T03:06:24.000Z","name":"Саран гэрэл","price":33500,"end":8,"id":2086,"start":0,"quantity":-9,"user_id":2015,"shop_name":"Мандал онлайн шоп1"}],"pagination":5,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY3VzdG9tZXIiLCJlbWFpbCI6Im1hbmRhbGJlYXV0eUB5YWhvby5jb20iLCJpYXQiOjE3NjUyMTUzNjIsImV4cCI6MTc2NTI3NTM2Mn0.MBM_ppIwpm-sEps2P0ZrSfu8vzaQkNX4xgj8J8v0Vq8"}