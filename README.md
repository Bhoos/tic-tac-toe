# Tic Tac Toe (Sandbox)
Application is available https://bhoos.github.io/tic-tac-toe/

Make sure you run the bot server at http://localhost:7777/play

### Payload
The payload would be provided in the following format:
```json
{
  "turn": 3,
  "state": [
    [ "x", "o", ""],
    [ "" , "x", ""],
    [ "" , "" , ""]
  ]
}
```
Note that the even number turn (0, 2, 4, 8) is for `x` and odd number turn (1, 3, 5, 7) is for `o`.

### Response
The response is expected in the following format:
```json
{
  "row": 2,
  "col": 2
}
```