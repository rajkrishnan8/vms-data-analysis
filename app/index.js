var  PdfReader = require('pdfreader').PdfReader;

var msgArr = [];
var dataArr = [];

var readFile = (files, ind) => {
	msgArr = [];
	dataArr = [];
	new PdfReader().parseFileItems(files[ind], function(err, item) {
		if(!item){
			processMessages(files, ind);
		}
		else if(item && item.text)
				dataArr.push(item.text);
	});
}

var files = ["files/sample/main.pdf"];
readFile(files, 0);


var processMessages = function(files, ind) {	
	process.stdout.write("\n\n\nProcessing " + files[ind] + "...\n\n");
	var eventTime = "";
	var msg = "";
	var state  = 0;
	
	dataArr.forEach((m) => {
		if (state == 0 && m.startsWith("2017")) {
			eventTime = m;
			state = 1;
		} else if (state == 1) {
			if (m.startsWith("{")){
				msg = m;
				state = 2;
			} else {
				state = 0;
			}
		} else if (state == 2) {
			if (parseJSON(msg)) {
				msg = parseJSON(msg);
				msg.eventTime = eventTime;
				msgArr.unshift(msg);
				if(m.startsWith("2017")){
					eventTime = m;
					state = 1;
				} else {
					state = 0;
				}
			} else {
				msg += m;
				if (parseJSON(msg)) {
					msg = parseJSON(msg);
					msg.eventTime = eventTime;
					msgArr.unshift(msg);
					if(m.startsWith("2017")){
						eventTime = m;
						state = 1;
					} else {
						state = 0;
					}
				}
				
			}
		}
	});
	
	msgArr.reduce((e,m) => {
		if (!e)
			e = 0; 
		else 
			e = (new Date(m.eventTime)).getTime() - (new Date(e)).getTime();
				
		if (e)
			console.log("+" + (e/1000));
		
		process.stdout.write(":\t" + m.eventTime + ':\t' +  m.body.EventType + "\t");

		printEventBody(m.body);

		process.stdout.write('\n');
		return m.eventTime;
	}, 0);
	
	if(ind < files.length -1)
		readFile(files, ++ind);
}

function printEventBody(b) {
	if (b.EventType === "Work Order Updated" || b.EventType === "Work Order Created")
		printWODetails(b);
}

function printWODetails (b) {
	printWOBody(b, "WorkOrder", "Work Order")
	printWOBody(b, "RecordStatus", "Record Status")
	printWOBody(b, "LotLocation", "LL")
	printWOBody(b, "FLNDR", "FLNDR")
}

function printWOBody(b, prop, label) {
	if (b[prop])
		process.stdout.write(" " + label + ": " + b[prop] + ",");
}

function parseJSON(str) {
	var result = null;
	try {
		result = JSON.parse(str);
	} catch (e){
	}
	return result;
}