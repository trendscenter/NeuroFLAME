It would be nice to be able to see the status and events from the run in progress.
This could happen from the nodes reporting something
Polling the nodes is a possibility but I'm not sure we would want to do that.
We would like to know about events that happen inside the container. There could be an event emitter inside.
There may be events that don't come from an event emitter but are relevant to the run. A client crash or container crash. The provision step failing for some reason.
The launch failing for some reason.

reporting errors, status, and events from the containers for the server and sites
also handlers for different types of events
custom events emitted
