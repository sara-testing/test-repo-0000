import flask
import json

app = flask.Flask(__name__)

@app.route("/route_param/<route_param>")
def route_param(route_param):
    return open("/tmp/" + route_param, "r").read()


@app.route("/route_param_ok/<route_param>")
def route_param_ok(route_param):
    return open("this is safe", "r").read()

@app.route("/subexpression", methods=["POST"])
def subexpression():
    param = "{}".format(flask.request.form["param"])
    return open("/tmp/" + param, "r").read()

@app.route("/subexpression2", methods=["POST"])
def subexpression2():
    param = "{}".format(flask.request.form["param"])
    return open("/tmp/" + param, "r").read()

@app.route("/")
def ok():
    return open("/tmp/FLAG.txt", "r").read()
