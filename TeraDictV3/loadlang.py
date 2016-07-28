import json
import requests

# from panlex_python_API
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
