# devTinder APIs

## AuthRouter

- POST/signup
- POST/login
- POST/logout

## profileRouter

- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password ==> forgot/updatePassowrd

status: ignore/intrusted/ accepted/rejected

## connectionRequestRouter

- POST/request/send/intrusted/:userId
- POST/request/send/ignore/:userId

  ### we can make it dynamic

- POST/request/send/:status/:userId

- POST/request/review/accepted/:requestId
- POST/request/review/rejected/:requestId

## userRouter

- GET/user/connections
- GET/user/requests
- GET/user/feed - Gets you the profiles of the other user
