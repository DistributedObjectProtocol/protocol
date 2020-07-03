# Distributed Object Protocol specification

This protocol is designed to distribute and mutate [JSON](https://en.wikipedia.org/wiki/JSON) between [nodes](<https://en.wikipedia.org/wiki/Node_(networking)>) using [patches](https://tools.ietf.org/html/rfc7386) that are sent via [Remote Procedure Calls (RPC)](https://en.wikipedia.org/wiki/Remote_procedure_call).

It is a thin layer on top of your data network that helps you communicate nodes using RPCs. It is also a pattern that makes easy, update, mutate or even sync the state of your system.

> Is important to point out that DOP does not handle data sync or conflict resolutions. It is not a CRDT or OT protocol.

### 1. [Remote Procedure Calls](#Remote-Procedure-Calls)

### 2. [Patches](#Patches)

### 3. [Types](#Types)

# Remote Procedure Calls

## Request

```js
// Format
[<request_id>, <rpc_id>, [<argument1>, <argument2>, ...]]

// Example
[1, 1, ["user@mail.com", "password1234"]]
```

- **`<request_id>`** An integer greater than `0` (zero).

- **`<rpc_id>`** A number or string that represent the id of the rpc previously defined that has to be runned.

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

> If the request is rejected as `0` (zero) the implementation must convert it to `null`.

## Request without response

This is useful when it does not need a response. Like a push notification.

```js
// Format
[0, <rpc_id>, [<argument1>, <argument2>, ...]]

// Example
[0, 1, {event: "USER_CONNECTED", data: { "nick":"Enzo","at":"30 Nov 2019 14:18:31" }}]
```

- **`<rpc_id>`** An integer that represent the id of the rpc previously defined that has to be runned.

- **`<argument>`** Any value.

# Patches

A Patch describes changes to be made to a target JSON document using a syntax that closely mimics the document being modified.

### Examples

|         ORIGINAL          |              PATCH              |         RESULT         |
| :-----------------------: | :-----------------------------: | :--------------------: |
|        `{"a":"b"}`        |           `{"a":"c"}`           |      `{"a":"c"}`       |
|        `{"a":"b"}`        |           `{"b":"c"}`           |  `{"a":"b","b":"c"}`   |
|        `{"a":"b"}`        |        `{"a":{"$d":0}}`         |          `{}`          |
|    `{"a":"b","b":"c"}`    |        `{"a":{"$d":0}}`         |      `{"b":"c"}`       |
|       `{"a":["b"]}`       |           `{"a":"c"}`           |      `{"a":"c"}`       |
|        `{"a":"c"}`        |          `{"a":["b"]}`          |     `{"a":["b"]}`      |
|    `{"a": {"b":"c"}}`     | `{"a":{"b":"d","c":{"$d":0}}}`  |   `{"a": {"b":"d"}}`   |
|    `{"a":[{"b":"c"}]}`    |          `{"a": [1]}`           |      `{"a": [1]}`      |
|        `["a","b"]`        |           `["c","d"]`           |      `["c","d"]`       |
|        `{"a":"b"}`        |             `["c"]`             |        `["c"]`         |
|       `{"a":"foo"}`       |          `{"a":null}`           |      `{"a":null}`      |
|       `{"a":"foo"}`       |             `null`              |         `null`         |
|       `{"a":"foo"}`       |             `"bar"`             |        `"bar"`         |
|     `{"e":{"$d":0}}`      |            `{"a":1}`            | `{"e":{"$d":0},"a":1}` |
|        `"string"`         |    `{"a":"b","c":{"$d":0}}`     |      `{"a":"b"}`       |
|           `{}`            | `{"a":{"bb":{"ccc":{"$d":0}}}}` |   `{"a":{"bb":{}}}`    |
| `{"a":{"b":"c","d":"e"}}` |     `{"a":{"$e":{"f":"g"}}`     |    `{"a":{"f":"g"}`    |
|         `[1,2,3]`         |              `[4]`              |         `[4]`          |
|         `[1,2,3]`         |           `{"3": 4}`            |      `[1,2,3,4]`       |
|         `[1,2,3]`         |         `{"length": 1}`         |         `[1]`          |

# Types

<<<<<<< HEAD
## Rpc
=======
## Delete

##### KEY: `$d`

There is one big difference between [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) and DOP. [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) uses `null` as an instruction to delete properties, while in DOP we leave `null` as it is.
>>>>>>> 71a6ac1288bad09101f5310c5f729516c1c99cfd

##### KEY: `$r`

It defines a remote rpc that can be used later to make a [remote procedure call](#Remote-Procedure-Calls).

```js
{ "$r": <rpc_id> }
```

<<<<<<< HEAD
**Examples**

```js
// Original
{}

// Patch
{ "loginUser": { "$r": 975 } }

// Result in Javascript
{ "loginUser": function(){} }
```

## Delete

##### KEY: `$d`
=======
## Function

##### KEY: `$f`

It defines a remote function that can be used later to make a [remote procedure call](#Remote-Procedure-Calls).
>>>>>>> 71a6ac1288bad09101f5310c5f729516c1c99cfd

Removes a property from target.

**Examples**

```js
// Original
{ "a": "b" }

// Patch
{ "a": { "$d": 0 } }

// Result
{}
```

## Replace

<<<<<<< HEAD
##### KEY: `$e`

Replaces objects at the target location with a new object.
=======
##### KEY: `$r`

The replace type replaces objects at the target location with a new object.
>>>>>>> 71a6ac1288bad09101f5310c5f729516c1c99cfd

```js
{ "$e": <new_object> }
```

**Examples**

```js
// Original
{ "data": { "a": 1, "b": 2 } }

// Patch
{ "data": { "$e": { "c": 3 } } }

// Result
{ "data": { "c": 3 } }
```

## Splice

##### KEY: `$s`

<<<<<<< HEAD
## Swap

##### KEY: `$w`

## Multi

##### KEY: `$m`
=======
## Inner

##### KEY: `$i`
>>>>>>> 71a6ac1288bad09101f5310c5f729516c1c99cfd

## Valid types syntax

Types are always defined as an Object with only one key and value. The key name must have the dollar character at the beginning.

```js
{ "$clone": 0 }
```
<<<<<<< HEAD

```js
{ "$clone": { "more":"data" } }
```

=======
```js
{ "$clone": { "more":"data" } }
```
>>>>>>> 71a6ac1288bad09101f5310c5f729516c1c99cfd
```js
{ "$push": ["any", "JSON", "value"] }
```

## Invalid types syntax

```js
{ "mytype": 0 }
```
<<<<<<< HEAD

=======
>>>>>>> 71a6ac1288bad09101f5310c5f729516c1c99cfd
```js
{ "$clone": 0, "$more":"data" }
```

## Escape

To do
<<<<<<< HEAD
=======

>>>>>>> 71a6ac1288bad09101f5310c5f729516c1c99cfd
