var Dump = {
    process: function (text) {
        var lines = text.split('\n');
        var date;
        var threads = [];
        var thread = {};

        var state = {
            dateFound: false,
            processingThread: false
        };

        lines.forEach(function (line, i) {
            var match;

            if (!state.dateFound) {
                if (!isNaN(Date.parse(line))) {
                    state.dateFound = true;
                }
            } else {
                if (line.match('group=.*prio=.*tid=.*nid=.*')) {
                    if (!state.processingThread) {
                        state.processingThread = true;
                        thread.name = line;
                    } else {
                        throw new Error('Unexpected line: ' + line + ' ::' + (i+1));
                    }
                } else if (state.processingThread){
                    if (line.match('^\s*$')) {
                        state.processingThread = false;
                        threads.push(thread);
                        thread = {};
                    } else if (match = line.match('java.lang.Thread.State: ([A-Z_]+)')) {
                        thread.state = match[1];
                    }
                }
            }


        });

        return threads;
    }
};
