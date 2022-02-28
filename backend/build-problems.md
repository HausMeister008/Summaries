The Build is working, however circular dependencies seem to block the built application from working

(!) Circular dependencies
node_modules/readable-stream/lib/_stream_readable.js -> node_modules/readable-stream/lib/_stream_duplex.js -> node_modules/readable-stream/lib/_stream_readable.js
node_modules/readable-stream/lib/_stream_readable.js -> node_modules/readable-stream/lib/_stream_duplex.js -> /home/timo/Projekte/spikes/Summaries/backend/node_modules/readable-stream/lib/_stream_readable.js?commonjs-proxy -> node_modules/readable-stream/lib/_stream_readable.js
node_modules/readable-stream/lib/_stream_duplex.js -> node_modules/readable-stream/lib/_stream_writable.js -> node_modules/readable-stream/lib/_stream_duplex.js
...and 3 more

Some references
- https://github.com/rollup/rollup-plugin-commonjs/issues/293
- https://github.com/nodejs/readable-stream/issues/348