import subprocess
import sys

subprocess.call("grep -R {} .".format(sys.argv[1]), shell=True)
