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


function parse_data(data) {
    /*  Parse JSON data  */
    console.log('Parsing data: ' + data);
    try {
        return JSON.parse(data);
    } catch (e) {
        console.log('JSON parsing failed. Error: ' + e);
        show_error('JSON parsing failed');
        throw e;
    }
}