Object sync protocol specification (Draft)
=======
Object sync protocol is designed to synchronize two objects remotely. The format used to send data, is regular [JSON](https://en.wikipedia.org/wiki/JSON).
Those are the basic principles of OSP:
- Bidirectional.
- Lightweight, sending the minimum bytes possible.
- Good performance when encoding and decoding a request. 





### Structure of requests
```js
[<request_id>, <action>, <params...>]
```



