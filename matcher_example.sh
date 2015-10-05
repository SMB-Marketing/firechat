#!
curl "https://firechat-test-smb.firebaseio.com/company1/room-messages.json?auth=YOUR-AUTH-KEY-HERE"|json_pp |egrep "amount|offertype|userId|timestamp"
