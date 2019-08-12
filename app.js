const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const promBundle = require("express-prom-bundle");
const initTracer = require("jaeger-client").initTracer;
const http = require("http");

const routes = require('./routes/index');
const users = require('./routes/users');
const events = require('./routes/events');

const app = express();

// INIT Prometheus metrics

const metricsMiddleware = promBundle({
	buckets: [0.002, 0.005, 0.01, 0.05, 0.1, 1],
	includeMethod: true,
	promClient: {
		collectDefaultMetrics: {
			timeout: 1000
		}
	},
});

// INIT Jaeger tracing

// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
const jaegerConfig = {
	serviceName: 'user-device-db',
	reporter: {
		// Provide the traces endpoint; this forces the client to connect directly to the Collector and send
		// spans over HTTP
		collectorEndpoint: 'http://localhost:14268/api/traces',
		// Provide username and password if authentication is enabled in the Collector
		// username: '',
		// password: '',
	},
};
const jaegerOptions = {
	tags: {
		'user-device-db': '1.0.0',
	},
	//metrics: metrics,
	logger: console,
};
const tracer = initTracer(jaegerConfig, jaegerOptions);

app.use(function (req, res, next) {
	const span = tracer.startSpan('http_request');
	const opts = {
		host : 'example.com',
		method: 'GET',
		port : '80',
		path: '/',
	};
	http.request(opts, res => {
		res.setEncoding('utf8');
		res.on('error', err => {
			// assuming no retries, mark the span as failed
			span.setTag(opentracing.Tags.ERROR, true);
			span.log({'event': 'error', 'error.object': err, 'message': err.message, 'stack': err.stack});
			span.finish();
		});
		res.on('data', chunk => {
			span.log({'event': 'data_received', 'chunk_length': chunk.length});
		});
		res.on('end', () => {
			span.log({'event': 'request_end'});
			span.finish();
		});
	}).end();
	console.log("** Span: %j", span);
	next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(metricsMiddleware);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header("Content-Type",'application/json');
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
