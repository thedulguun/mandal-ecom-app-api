request:

curl 'https://api.ebuuhia.mn/api/v1/getReportWareByUser?startLimit=0&endLimit=100&order=&sort=asc&search=&value=&id=2015' \
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

{"data":[{"id":14299,"ware":"мандал онлайн шоп1","item":"Лаан гацуур 3 хос суурьтайгаа","type":1,"worker":"Мөнхгэрэл","quantity":6,"user_id":2015,"created_at":"2025-11-23T08:33:37.000Z","description":"11.23 Орлого"},{"id":9557,"ware":"мандал онлайн шоп1","item":"Сарнай","type":0,"worker":"Мөнхгэрэл","quantity":5,"user_id":2015,"created_at":"2025-09-24T07:47:44.000Z","description":"9.24 Буцаалт "},{"id":9556,"ware":"мандал онлайн шоп1","item":"Саран гэрэл","type":0,"worker":"Мөнхгэрэл","quantity":1,"user_id":2015,"created_at":"2025-09-24T07:46:44.000Z","description":"9.24 Буцаалт "},{"id":4426,"ware":"мандал онлайн шоп1","item":"Сарнай","type":1,"worker":"Наранцэцэг","quantity":6,"user_id":2015,"created_at":"2025-06-14T04:54:36.000Z","description":"6,13"},{"id":4425,"ware":"мандал онлайн шоп1","item":"Car mirror","type":1,"worker":"Наранцэцэг","quantity":1,"user_id":2015,"created_at":"2025-06-14T04:54:07.000Z","description":"6,13"}],"pagination":5}