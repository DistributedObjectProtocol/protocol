Object sync protocol specification (Draft)
=======
Object sync protocol is designed to synchronize two objects remotely. 
Those are the basic principles of OSP:
- Bidirectional.
- Asynchronous.
- Lightweight, sending the minimum bytes possible.
- Good performance when encoding and decoding a request.
- The format used to send data must be regular [JSON](https://en.wikipedia.org/wiki/JSON).


### Terms
- **`sender`** A sender always send a request and wait for a response. Unless the request is aborted. 
- **`receptor`** A receptor receive a request by a sender and must send the response back to the sender. Unless the request is aborted by the sender.
- **`resolve`** todo
- **`reject`** todo 



### Structure of request
```js
[<request_id>, <action>, <params...>]
```
1. **`<request_id>`** Always an integer greater than 0 that represent the ID of each request. Request_id is unique by the sender, which means a receptor can receive exactly the same request from different senders. A sender can not send two requests with the same request_id to the same receptor.
2. **`<action>`** Type of the action (connect, sync, call, set...). Always an integer greater than -1. See below for the action types.
3. **`<params...>`** Multiples parameters can be passed on every request. The parameters are defined for the type of action described bellow.




### Structure of response
```js
[-<request_id>, <status>, <params...>]
```
1. **`<request_id>`** Always an integer lower than 0 that refers the request_id sent. It just the request_id in negative: `request_id * -1`.
2. **`<action>`** If status is 0 (Integer) means the request it has been resolved. Any other case means a request rejected. Status can be a string with the reason of the fail. Or even a [JSON](https://en.wikipedia.org/wiki/JSON).
3. **`<params...>`** Multiples parameters can be passed on every response. The parameters are defined for the type of action described bellow.




### Abort request
Abort instruction is kind of a request but without response.
Requests only can be aborted by the sender. Receptor never abort a request, just reject if some error occurred. If receptor receive an abort instruction, receptor won't send any response.
If the request is aborted before it sent, sender do not send any data at all. 
```js
[<request_id>]
```
1. **`<request_id>`** The request_id of the request sent that we want to abort.

