import flask

app = flask.Flask(__name__)


@app.route("/error")
def error(e):
    template = """{  extends "layout.html"  }
{  block body  }
    <div class="center-content error">
        <h1>Oops! That page doesn't exist.</h1>
        <h3>%s</h3>
    </div>
{  endblock  }
""".format(
        request.url
    )
    return flask.render_template_string(template), 404


@app.route("/error4")
def error4(e):
    template4 = """
{  extends "layout.html"  }
{  block body  }
    <div class="center-content error">
        <h1>Oops! That page doesn't exist.</h1>
        <h3>
"""
    template4 += request.url
    template4  +=    """
</h3>
</div>
{  endblock  }
"""
    rendered = flask.render_template_string(template4)
