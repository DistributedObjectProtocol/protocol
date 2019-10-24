# Distributed Object Protocol specification (Draft)

This protocol is designed to distribute [JSON](https://en.wikipedia.org/wiki/JSON) objects between nodes via [Remote Procedure Calls (RPC)](https://en.wikipedia.org/wiki/Remote_procedure_call). Understanding a node as an entity that can store JSON objects and can comunicate with other nodes.

Those are the features and principles of this protocol:

-   State management
-   Unidirectional data-flow.
-   Asynchronous.
-   Lightweight, sending the minimum bytes possible.
-   Remote Procedure Calls.
-   Pub/Sub
-   Transport agnostic.

What is not or what does not do:

-   Consensus data protocol
-   Manage conflict resolution
-   Auth server/client protocol

# Terms

- **`Request`** A message that wait for a response.
- **`Response`** A message that is the response of a request.
- **`Push`** A message that does not wait for a response.
- **`Sender`** A sender always send a request and wait for a response. Sender can also send an abortion of a request. A sender can also send a push without response.
- **`Receptor`** A receptor receive a request by a sender and must send the response back to the sender.


# Remote Procedure Calls

### Request format
```html
[<request_id>, <function_id>, [<argument1>, <argument2>, ...]]
```

### Response format

```html
[-<request_id>, <response_state>, <response_value>]
```
---

- **`<request_id>`** 

    Always a number. `request_id` is unique by the sender, which means a receptor can receive exactly the same request from different senders. A sender can not send two requests with the same `request_id` to the same receptor.

    - Greater than `0` means is the id of the request. 
    - Lower than `0` means is a response. It just the `request_id` in negative: ``request_id` * -1`.
    - If is `0` means is a push and no response is required.


- **`<function_id>`** Represent the id of the function that has to be executed for the receptor.

- **`<response_state>`** If state is `0` (number) means the request it has been resolved. Any other case means a rejection.

- **`<argument|response_value>`** Any type.


# Patches

## Applying patches

To do... 

But for now this is a good entry point: 
https://github.com/DistributedObjectProtocol/dop/blob/master/test/merge.js
https://github.com/DistributedObjectProtocol/dop/blob/master/test/applyPatch.js


## Special instructions

This protocol uses [standard JSON](https://en.wikipedia.org/wiki/JSON#Data_types_and_syntax) but in order to add some behavior to the patches, like sending functions or deletions we are going to use our own implementation of the [EJSON](https://github.com/mongodb/specifications/blob/master/source/extended-json.rst) format.

### Function

Define a remote function (RPC)

```
// Format
{ <key>: { $function: <function_id> }}

// Example
{ "getUsers": { "$function": 1 }

```

### Delete

Removes a value from an object or array. If is an array and `<key>` exists as position, this will be declared as undefined/empty.

```
// Format
{ <key>: { $delete: true }}

// Example
{ "user_1": { "$delete": true }

// JavaScript proposal
{ user_1: undefined }
```



