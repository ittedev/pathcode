# Path/Code

An error system for Web application.

HTTP Response Status Codes cannot represent all the complex errors of an application.

Path/Code onsists of simple error codes and their location path.
Error **code** is no rule now other than sharing on the server side and the client side.
Location **Path** is a json key path chain of data sent from the client. If path is empty, the code will be for the root.

Path/Code has no message. The message should be provided in other ways depending on countries and regions.

The passcode is shared between the server and the client using json or text.

# Path/Code json format

## Example

```json
[
  {
    "path": "user.name",
  },
  {
    "path": "user.password",
    "code": "Not Matched"
  },
  {
    "path": "user.password",
    "code": "Temporarily Locked"
  }
]
```

Path section may not exist or is empty string.

```json
[
  {
    "path": "",
    "codes": ["Forbidden"]
  }
]
```

# Path/Code text format

@alpha

```
(Path/Code list) = (Path/Code pair)&(Path/Code pair)& ...
(Path/Code pair) = (Path section)/(Code section)
```

## Example

```
user.name/Not Found&user.password/Not Matched&user.password/Temporarily Locked
```

If 403 HTTP error only

```
Forbidden
```
