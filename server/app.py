from random import randint

from sanic import Sanic
from sanic.response import json
from sanic.request import Request
from sanic_cors import CORS



app = Sanic(__name__)
CORS(app)


@app.route("/play", methods=["POST"])
def bid(request: Request):
    body = request.json
    print("Bid called")
    print(body)
    turn, state = body["turn"], body["state"]
    
    tries = 00
    row, col = randint(0, 2), randint(0, 2)

    while (state[row][col] != '' and tries < 100):
      row = randint(0, 2)
      col = randint(0, 2)
      tries += 1

    return json({"row": row, "col": col})
    
    

DEBUG = True

if __name__ == "__main__":
    # Docker image should always listen in port 7000
    app.run(host="0.0.0.0", port=7777, debug=DEBUG, access_log=DEBUG)
