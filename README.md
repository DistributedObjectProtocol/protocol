Object sync protocol specification (Draft)
=======
Object sync protocol is designed to synchronize two objects remotely. 
Those are the basic principles of OSP:
- Bidirectional.
- Asynchronous.
- Lightweight, sending the minimum bytes possible.
- Good performance when encoding and decoding a request.
- The format used to send data must be regular [JSON](https://en.wikipedia.org/wiki/JSON).

The terms used on this protocol are based on [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)'s vocabulary.

In this documentation we will use the term **user** as **sender** and **server** as **receptor** to be more clear. But don't forget OSP is bidirectional, so user can be a receptor and server can be sender.

### Structure of request
```js
[<request_id>, <action>, <params...>]
```
1. **`<request_id>`** Always an integer greater than 0 that represent the ID of each request. request_id is unique by the user, which means a server can receive exactly the same request (request_id included) multiple times from different users. A user can not send two requests with the same request_id.
2. **`<action>`** Type of the action (connect, sync, call, set...). Always an integer greater than -1. See below for the action types.
3. **`<params...>`** Multiples parameters can be passed on every request. The parameters are defined for the type of action described bellow.



### Structure of response
```js
[-<request_id>, <status>, <params...>]
```
1. **`<request_id>`** Always an integer lower than 0 that refers the request_id sent. It just the request_id in negative: `request_id * -1`.
2. **`<action>`** If status is 0 (Integer) means the request it has been resolved. Any other case means a request rejected. Status can be a string with the reason of the fail. Or even a [JSON](https://en.wikipedia.org/wiki/JSON).
3. **`<params...>`** Multiples parameters can be passed on every response. The parameters are defined for the type of action described bellow.



### Abort
```js
[<request_id>]
```
The abort request is sent by the sender in order to cancel/abort a previus regular request. If the request is already responsed, the
1. **`<request_id>`** Must be the id of the request we want to abort.




