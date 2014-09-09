var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    request = require('request'),

    config = require('./config'),

    downloader = express();

downloader.set('views', path.join(__dirname, 'views'));
downloader.set('view engine', 'jade');

downloader.use(logger('dev'));
downloader.use(bodyParser.json());
downloader.use(bodyParser.urlencoded({ extended: false }));
downloader.use(session({
    name: 'downloader',
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}));

downloader.use('/download', express.static(config.downloadPath));
downloader.use(express.static(path.join(__dirname, 'public')));


downloader.get('/', function (req, res, next) {
    if (req.session.login) {
        listFile(function (err, files) {
            if (err) {
                res.render('error', { error: err });
                return false;
            } else {
                res.render('index', { files: files });
            }
        });
    } else {
        res.redirect('/login');
    }
});

downloader.get('/login', function (req, res, next) {
    if (req.session.login) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

downloader.post('/login', function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    if (username === config.username && password === config.password) {
        req.session.login = true;
        // getFileList(req, res, next);
        res.json({
            status: 1
        });
    } else {
        res.json({
            error: 'Password or username incorrect.'
        });
    }
});

downloader.get('/files', function (req, res, next) {
    getFileList(req, res, next);
});

downloader.post('/files', function (req, res, next) {
    var url = req.body.url,
        fileName = req.body.name,
        destDir = config.downloadPath + '/' + fileName;

    request(url, function (err) {
        if (err) {
            console.log(err);
            res.json({
                error: err
            });
        }
    }).pipe(fs.createWriteStream(destDir)).on('data', function (chunk) {
        console.log(chunk);
    }).on('end', function () {
        res.json({
            status: 1
        });
    }).on('error', function (err) {
        res.json({
            error: err
        });
    });
});

function getFileList(req, res, next) {
    if (req.session.login) {
        listFile(function (err, files) {
            if (err) {
                res.json({
                    status: 0,
                });
            } else {
                res.json({
                    files: files
                });
            }
        });
    } else {
        res.json({
            error: 'Permission denied. Please login.'
        });
    }
}

function listFile (callback) {
    var dir = config.downloadPath;

    fs.readdir(dir, function (err, files) {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.mkdir(dir, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(undefined, []);
                    }
                });
            }
        } else {
            callback(undefined, files);
        }
    });
}



var server = downloader.listen(config.port, function () {
    console.log('Downloader listen on ' + config.port);
});