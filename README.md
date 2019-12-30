# Distributed Object Protocol specification

This protocol is designed to distribute and mutate [JSON](https://en.wikipedia.org/wiki/JSON) between [nodes](<https://en.wikipedia.org/wiki/Node_(networking)>) using [patches](https://tools.ietf.org/html/rfc7386) that are sended via [Remote Procedure Calls (RPC)](https://en.wikipedia.org/wiki/Remote_procedure_call).

The protocol is a combination of two parts. The RPC specification and the patch format with its processing rules. Both definitions can be inmplemented independently. usinging in conjuntion makes a powerful tool to manage the state of your App or system.

> It is important to notice that DOP does not handle data sync or conflict resolutions. It is not a CRDT or OT protocol.

### 1. [Remote Procedure Calls (RPC)](#Remote-Procedure-Calls)

### 2. [Patches](#Patches)

# Remote Procedure Calls

## Request

```json
[<request_id>, <function_id>, [<argument1>, <argument2>, ...]]
```

- **`<request_id>`** An integer greater than `0` (zero).

- **`<function_id>`** An integer that represent the id of the function that has to be runned.

- **`<argument>`** Any value.

## Response

```json
[-<request_id>, <response_state>, <response_value>]
```

- **`<request_id>`** An integer lower than `0` (zero). Is just the `request_id` used on the request but in negative.

- **`<response_state>`** If state is `0` (zero) means the request it has been resolved. Any other case means a rejection.

- **`<response_value>`** Can be any value. But is only defined if the `response_value` is equal to `0` (zero). Which means is a valid response.

## Request without response

```json
[0, <function_id>, [<argument1>, <argument2>, ...]]
```

- **`<function_id>`** An integer that represent the id of the function that has to be runned.

- **`<argument>`** Any value.

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
