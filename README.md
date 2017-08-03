# Distributed Object Protocol specification (Draft)

This protocol is designed to distribute [JSON](https://en.wikipedia.org/wiki/JSON) objects between nodes. Understanding a node as an entity that can store JSON objects and can comunicate with other nodes.

Those are the features and principles of this protocol:

- Unidirectional data-flow.
- Asynchronous.
- Lightweight, sending the minimum bytes possible.
- Remote Procedure Calls.
- Pub/Sub
- Transport agnostic.



## Terms
- **`Subscriber`** A subscriber is subscribed to an object.
- **`Owner`** Owner of a object that other nodes/subscribers are subscribed.
- **`Sender`** A sender always send a request and wait for a response. Sender can also send an abortion of a request.
- **`Receptor`** A receptor receive a request by a sender and must send the response back to the sender. Unless the request is aborted by the sender.
- **`Request`** A message that wait for a response.
- **`Response`** A message that is the response of a request.
- **`Resolve`** todo
- **`Reject`** todo



## Request format
```js
[<request_id>, <instruction>, <params...>]
```
1. **`<request_id>`** Always an integer greater than 0 that represent the ID of each request. Request_id is unique by the sender, which means a receptor can receive exactly the same request from different senders. A sender can not send two requests with the same request_id to the same receptor.

2. **`<instruction>`** Always the same integer that represent the type of instruction (subscribe, unsubscribe, call, broadcast, patch).

3. **`<params...>`** Multiples parameters can be passed on every request. The parameters are defined for the type of instruction described bellow.




## Response format
```js
[-<request_id>, <state>, <params...>]
```
1. **`<request_id>`** Always an integer lower than 0 that refers the request_id sent. It just the request_id in negative: `request_id * -1`.

2. **`<state>`** If state is `0` (Integer) means the request it has been resolved. Any other case means a rejection.

3. **`<params...>`** Multiples parameters can be passed on every response. The parameters are defined for the type of instruction described bellow.



<!--
## Abort request
Abort instruction is kind of a request but without response.
Requests only can be aborted by the sender. Receptor never abort a request, just reject if some error occurred. If receptor receive an abort instruction, receptor won't send any response.
If the request is aborted before is sent, sender do not send any data at all. 
```
[<request_id>]
```
1. **`<request_id>`** The request_id of the request sent that we want to abort.
-->



## Multi requests and responses
Is possible send multiple requests in one message, just wrapping it in an Array. But the order of the responses is not fixed. Which means the response of request_id2 could be resolved before request_id1.
```js
[[<request_id1>, <instruction>, <params...>], [<request_id2>, <instruction>, <params...>]]
```

The response of a multi request can be send in one or multiple message. But the order is not established. (i.e.):
```js
[[-<request_id2>, <state>, <params...>], [-<request_id1>, <status>, <params...>]]
```

Or in two messages:
```js
[-<request_id2>, <state>, <params...>]
[-<request_id1>, <state>, <params...>]
```

Requests and responses can be sent on the same message:
```
[[-<request_id1>, <state>, <params...>], [<request_id2>, <instruction>, <params...>]]
```



## Multi instructions by one request
Is possible send one request with multiple instructions. Responses must respect the order of the requests. Responses will not be sent until all the instructions are processed.
```js
[<request_id>, [<instruction1>, <params...>], [<instruction2>, <params...>]]
```
The response must be like:
```js
[-<request_id>, [<stateinstruction1>, <params...>], [<stateinstruction2>, <params...>]]
```




# Instructions

### Subscribe

* Instruction number: `1`
* Direction: `Subscriber -> Owner`

##### Format:

```js
// Request ->
[<request_id>, 1, <params...>]

// Response <-
[-<request_id>, <state>, <object_id>, <data_object>]
```

##### Example:

```js
// Request ->
[150, 1, "my@mail.com", "password1234"]

// Response <-
[-150, 0, 99, {_id:"a25d5", name:"John Doe", balance:"$3500", sendMoney:"~F"}]
```


### Unsubscribe

* Instruction number: `2`
* Direction: `Subscriber -> Owner`

##### Format:

```js
// Request ->
[<request_id>, 2, <object_id>]

// Response <-
[-<request_id>, <state>]
```

##### Example:

```js
// Request ->
[151, 2, 99]

// Response <-
[-151, 0]
```


### Call

A `call` is when a subscriber calls a function/method of a remote object.

* Instruction number: `3`
* Direction: `Subscriber -> Owner`

##### Format:

```js
// Request ->
[<request_id>, 3, <object_id>, <path>, [<params...>]]

// Response <-
[-<request_id>, 0, <response_value>]
```

##### Example:

```js
// Request ->
[152, 3, 99, ['sendMoney'], ["$100", "myfriend@email.com"]]

// Response <-
[-152, 0, {message:"Money has been sent to your friend successfully!", error:false}]
```


### Broadcast
A `broadcast` is very similar to a `call` but works in the opposite direction. The owner can call a function/method that has been defined on the subscriber object. 

* Instruction number: `4`
* Direction: `Owner -> Subscribers`

##### Format:

```js
// Request ->
[<request_id>, 4, <object_id>, <path>, [<params...>]]

// Response <-
[-<request_id>, 0, <response_value>]
```

##### Example:

```js
// Request ->
[153, 4, 99, ['notification'], ["We are under maintenance"]]

// Response <-
[-153, 0, {error:false}]
```



### Patch

Sends mutations to subscribers.

* Instruction number: `4`
* Direction: `Owner -> Subscribers`

##### Format:

```js
// Request ->
[<request_id>, 5, <object_id>, <version>, <patch>]

// Response <-
[-<request_id>, 0]
```



##### Example:

`version` is needed to guarantee the order of all the patches/mutations because requests are asynchronous. Is an int that increments on each patch. And is independent and unique for every subscriber.

```js
// Request ->
[154, 5, 99, 1, {balance:"$3400"}]

// Response <-
[-154, 0]
```



# Objects and patches

### Basic examples

The protocol is based on standard [JSON](https://en.wikipedia.org/wiki/JSON). But in order to allow mutations and RPC's we have to use special values.

### Delete
### Functions
### New object
### Splice array
### Swap array





