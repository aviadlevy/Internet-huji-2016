Q1
    The hard thing was to start building the server, and figure out the way to do
    it. once I pass this stage and succeeded to initialize something, the rest
    handled smoothly.
Q2
    The fun thing about this exercise is the moment you finished this exercise.
Q3
    In order to make your server efficient I tried to handle requests in
    asynchronous manner. When a request arrived, the server send asynchronous
    command to read the file (using fs module) and when the file is ready (is in
    the memory) it writes to the pipe of the socket, meanwhile, other requests
    could be sent.
Q4
    to test the server i used 2 javascript files as instructed:
        1. load.js
            Inside loop of 600 iteration I call http.get to request a file
            (index.html) from my server. the server was able to mange those
            600 calls.
        2. test.js
            Compare response from server to the actual content of file, and
            test 404 and 403 errors.

    beside those tests, I enjoyed to just start the server and browse my
    website. try to go to pages with path that don't exists and see my 404
    page, etc.