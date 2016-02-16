Object sync protocol specification (Draft)
=======
Object sync protocol is designed to synchronize two objects remotely. The format used to send data, is regular [JSON](https://en.wikipedia.org/wiki/JSON).
Those are the basic principles of OSP:
- Bidirectional.
- Asynchronous.
- Lightweight, sending the minimum bytes possible.
- Good performance when encoding and decoding a request. 



### Structure of request
```js
[<request_id>, <action>, <params...>]
```
1. **`<request_id>`** Always a number greater than 0.
2. **`<action>`** Type of the action (connect, sync, call, set...) see below.
3. **`<request_id>`** Always a number greater than 0.



### Structure of response

