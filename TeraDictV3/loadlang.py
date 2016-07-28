import re
import json
import requests as rq
from ratelimit import *

# from panlex_python_API
PANLEX_API_URL = "http://api.panlex.org"
MAX_ARRAY_SIZE = 10000

@rate_limited(2) #2 calls/sec
def query(ep, params):
    """Generic query function.
    ep: an endpoint of the PanLex API (e.g. "/ex")
    params: dict of parameters to pass in the HTTP request."""
    if re.search(r'^/', ep):
        url = PANLEX_API_URL + ep
    else:
        url = ep
    r = rq.post(url, data=json.dumps(params))
    if r.status_code != rq.codes.ok:
        if r.status_code == 409:
            raise PanLexError(r.json())
        else:
            r.raise_for_status()
    else:
        return r.json()

def queryAll(ep, params):
    """Generic query function for requests with more than 2000 reults
    ep: an endpoint of the PanLex API (e.g. "/lv")
    params: dict of parameters to pass in the HTTP request."""
    retVal = None
    params = dict.copy(params) # to avoid overwriting elements of caller's params dict
    if "offset" not in params:
        params["offset"] = 0
    while 1:
        r = query(ep, params)
        if not retVal:
            retVal = r
        else:
            retVal["result"].extend(r["result"])
            retVal["resultNum"] += r["resultNum"]
            if r["resultNum"] < r["resultMax"]:
                # there won't be any more results
                break
        params["offset"] += r["resultNum"]
    return retVal

class PanLexError(Exception):
    def __init__(self, body):
        self.code = body['code']
        self.message = body['message']

data = queryAll("lv", {})

with open('static/lvlist.json', 'w') as f:
    json.dump(data, f)
