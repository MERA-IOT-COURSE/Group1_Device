function show_error(text) {
    /*  Show error message  */
    err_dialog = $("#error");
    err_dialog.html(text);
    err_dialog.dialog({
        height: 120,
        width: 350,
        modal: true,
        resizable: false,
        dialogClass: 'error-dialog'
    });
}

function show_success(text) {
    /*  Show error message  */
    err_dialog = $("#success");
    err_dialog.html(text);
    err_dialog.dialog({
        height: 120,
        width: 350,
        modal: true,
        resizable: false,
        dialogClass: 'success-dialog'
    });
}

function is_string(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

function parse_data(data) {
    /*  Parse JSON data  */
    console.log('Parsing data: ' + data);
    try {
        if (is_string(data)) {
            return JSON.parse(data);
        }
        else {
            return data;
        }
    } catch (e) {
        console.log('JSON parsing failed. Error: ' + e);
        show_error('JSON parsing failed');
        throw e;
    }
}

function Timer(fn, t) {
    /*  Timer object that is decorator of clearInterval function  */
    let timer_obj = null;

    this.stop = function() {
        if (timer_obj) {
            clearInterval(timer_obj);
            timer_obj = null;
        }
        return this;
    }

    this.start = function() {
        if (!timer_obj) {
            this.stop();
            timer_obj = setInterval(fn, t);
        }
        return this;
    }

    this.run_once = function() {
        if (!timer_obj) {
            this.stop();
            fn();
        }
        return this;
    }
}

function Device(id, sensors) {
    let _id = id;
    let _sensors = sensors;
    let _started = false;

    this.stop_refreshing = function() {
        console.log('Device "' + _id + '" STOPS refreshing')
        if (_sensors && _started) {
            _sensors.forEach(function(sensor, i, arr) {
                sensor.timer.stop();
            });
        }
        _started = false;
        return this;
    }

    this.start_refreshing = function() {
        console.log('Device "' + _id + '" STARTS refreshing')
        if (_sensors && !_started) {
            _sensors.forEach(function(sensor, i, arr) {
                sensor.timer.start();
            });
        }
        _started = true;
        return this;
    }

    this.refresh_once = function() {
        console.log('Device "' + _id + '" REFRESH ONCE')
        if (_started) {
            this.stop_refreshing();
        }
        if (_sensors) {
            _sensors.forEach(function(sensor, i, arr) {
                sensor.timer.run_once();
            });
        }
        return this;
    }
}
