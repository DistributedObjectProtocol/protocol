# Distributed Object Protocol specification

This protocol is designed to distribute and mutate [JSON](https://en.wikipedia.org/wiki/JSON) between [nodes](<https://en.wikipedia.org/wiki/Node_(networking)>) using [patches](https://tools.ietf.org/html/rfc7386) that are sended via [Remote Procedure Calls (RPC)](https://en.wikipedia.org/wiki/Remote_procedure_call).

The protocol is a combination of two parts. The RPC specification and the patch format with its processing rules. Both definitions can be inmplemented independently. usinging in conjuntion makes a powerful tool to manage the state of your App or system.

> It is important to point that DOP does not handle data sync or conflict resolutions. It is not a CRDT or OT protocol.

### 1. [Remote Procedure Calls](#Remote-Procedure-Calls)

### 2. [Patches](#Patches)

# Remote Procedure Calls

## Request

```json
// Format
[<request_id>, <function_id>, [<argument1>, <argument2>, ...]]

// Example
[1, 1, ["user@mail.com", "password1234"]]
```

- **`<request_id>`** An integer greater than `0` (zero).

- **`<function_id>`** An integer that represent the id of the function previously defined that has to be runned.

- **`<argument>`** Any value.

## Response

```json
// Format
[-<request_id>, <response_state>, <response_value>]

// Resolve example
[-1, 0, { "name":"John Doe", "age":30 }]

// Reject example
[-1, "Invalid email"]
```

- **`<request_id>`** An integer lower than `0` (zero). Is just the `request_id` used on the request but in negative.

- **`<response_state>`** If state is `0` (zero) means the request it has been resolved. Any other case means a rejection.

- **`<response_value>`** Can be any value. But is only defined if the `response_value` is equal to `0` (zero). Which means is a valid response.

## Request without response

This is useful when it does not need a response. Like a push notification.

```json
// Format
[0, <function_id>, [<argument1>, <argument2>, ...]]

// Example
[0, 1, ["NEW_USER_CONNECTED", { "nick":"Enzo", "at":"30 Nov 2019 14:18:31" }]]
```

- **`<function_id>`** An integer that represent the id of the function previously defined that has to be runned.

- **`<argument>`** Any value.

# Patches

### Function

### Delete

### Replace
