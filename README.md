# Distributed Object Protocol specification

This protocol is designed to distribute and mutate [JSON](https://en.wikipedia.org/wiki/JSON) between [nodes](<https://en.wikipedia.org/wiki/Node_(networking)>) using [patches](https://tools.ietf.org/html/rfc7386) that are sent via [Remote Procedure Calls (RPC)](https://en.wikipedia.org/wiki/Remote_procedure_call).

The protocol is a combination of two parts. The RPC specification and the patch format with its processing rules. Both definitions can be implemented independently. Using it in conjunction makes a powerful tool to manage the state of your App or system.

> It is important to point that DOP does not handle data sync or conflict resolutions. It is not a CRDT or OT protocol.

### 1. [Remote Procedure Calls](#Remote-Procedure-Calls)

### 2. [Patches](#Patches)

### 3. [Types](#Types)

# Remote Procedure Calls

## Request

```js
// Format
[<request_id>, <function_id>, [<argument1>, <argument2>, ...]]

// Example
[1, 1, ["user@mail.com", "password1234"]]
```

- **`<request_id>`** An integer greater than `0` (zero).

- **`<function_id>`** A number or string that represent the id of the function previously defined that has to be runned.

- **`<argument>`** Any value.

## Response

```js
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

```js
// Format
[0, <function_id>, [<argument1>, <argument2>, ...]]

// Example
[0, 1, ["NEW_USER_CONNECTED", { "nick":"Enzo", "at":"30 Nov 2019 14:18:31" }]]
```

- **`<function_id>`** An integer that represent the id of the function previously defined that has to be runned.

- **`<argument>`** Any value.

# Patches

A Patch describes changes to be made to a target JSON document using a syntax that closely mimics the document being modified. The implementation must follow all the rules defined in [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) specification.

There is one big difference between JSON Merge Patch and DOP. JSON Merge Patch uses `null` as an instruction to delete properties, while in DOP we leave it as normal `null` type.

Instead of using `null` to delete, DOP incorporates special types that can extend the basic instructions of JSON Merge Patch. For example in the case of `null`, if we want to delete properties we will use the `{ "$delete": 0 }` type.

Types are always defined as an Object with only one key and value. The key name must have the dollar character at the beginning to make it more standard.

Examples of valid types

```js
{ "$delete": 0 }

{ "$delete": { "more":"data" } }

{ "$replace": ["any", "JSON", "value"] }
```

Examples of invalid types

```js
{ "delete": 0 }

{ "$delete": 0, "more":"data" }
```

# Types

## Delete

Indicates the deletion of existing values in the target.

```js
{ "$delete": 0 }
```

**Examples**

This example from [JSON Merge Patch](https://tools.ietf.org/html/rfc7386)

```js
// Original
{ "a": "b" }

// Patch
{ "a": null }

// Result
{}
```

Becomes

```js
// Original
{ "a": "b" }

// Patch
{ "a": { "$delete": 0 } }

// Result
{}
```

```js
// Original
{
  "a": "b",
  "c": {
    "d": "e",
    "f": "g"
  }
}

// Patch
{
  "a": "z",
  "c": {
    "f": { "$delete": 0 }
  }
}

// Result
{
  "a": "z",
  "c": {
    "d": "e",
  }
}
```

## Function

It defines a remote function that can be used later to make a [remote procedure call](#Remote-Procedure-Calls).

```js
{ "$function": <function_id> }
```

**Examples**

```js
// Original
{}

// Patch
{ "loginUser": { "$function": 975 } }

// Result in Javascript
{ "loginUser": function(){} }
```

## Replace

The replace type replaces objects at the target location with a new object.

```js
{ "$replace": <new_object> }
```

**Examples**

```js
// Original
{ "data": { "a": 1, "b": 2 } }

// Patch
{ "data": { "$replace": { "c": 3 } } }

// Result
{ "data": { "c": 3 } }
```

## Escape

To do
