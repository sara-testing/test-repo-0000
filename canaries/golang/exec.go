package main

import (
    "fmt"
    "os"
    "os/exec"
)

func test1(userInput string) {
    cmdPath,_ := userInput;
    cmd := &exec.Cmd {
        Path: cmdPath,
        Args: []string{ "foo", "bar" },
        Stdout: os.Stdout,
        Stderr: os.Stdout,
    }
    cmd.Start();
}
