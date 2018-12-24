function getTimestamp() {
	var timestamp = Math.round(+new Date()/1000);
    return timestamp
}

module.exports.getTimestamp = getTimestamp