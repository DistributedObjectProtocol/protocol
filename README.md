Object sync protocol specification (Draft)
=======
Object sync protocol is designed to synchronize two objects remotely. 
Those are the basic principles of OSP:
- Bidirectional.
- Asynchronous.
- Lightweight, sending the minimum bytes possible.
- Good performance when encoding and decoding a request.
- The format used to send data must be regular [JSON](https://en.wikipedia.org/wiki/JSON).



### Structure of request
```js
[<request_id>, <action>, <params...>]
```
1. **`<request_id>`** Always an integer greater than 0 that represent the ID of each request. Unique by the sender.
2. **`<action>`** Type of the action (connect, sync, call, set...). Always an integer greater than -1. See below for the action types.
3. **`<params...>`** Multiples parameters can be passed on every request. The parameters are defined for the type of action described bellow.

`<request_id>` 



### Structure of response

