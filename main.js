const { Buffer } = require('buffer');
const CoinKey = require('coinkey');
const fs = require('fs');
const args = process.argv;
const Jetty = require("jetty");

const data = fs.readFileSync('progress.log',
    { encoding: 'utf8', flag: 'r' });
	 
let startF = data;//args[2];
var jetty = new Jetty(process.stdout);
main(startF);


function main(startFrom) {
    // Initialise big numbers with small numbers
	try {
		let count = BigInt(startFrom);
		const one = BigInt(1);
		// Create a buffer to pad our count to 32 bytes
		const padded = Buffer.alloc(32);
		
		// Clear the screen
		jetty.clear();
			
			
		// Loop forever because we're never going to hit the end anyway
		while (true) {
			
			// Increment our counter
			count ++;
			fs.writeFileSync('progress.log',"" + count);

			const countBytes = Buffer.from(count.toString(16), 'hex');
			countBytes.copy(padded, 32 - countBytes.length);
			var key1 = new CoinKey(padded);
			var KeyAddress = key1.toString();
			KeyAddress = KeyAddress.replace(" ","");
			var array = KeyAddress.split(":");
			let PrivateKey = array[0];
			let PublicAddress = array[1];
			
			//console.log(count + " -> "  + "," + PrivateKey + ","+PublicAddress);
			// write something
			jetty.text(count + " -> "  + "," + PrivateKey + ","+PublicAddress);
			jetty.moveTo([0,0]);
			process.stdout.cursorTo(0);
			if(PublicAddress == "1KTvsW5tg5gkJf9fyT2xsvjkv7dzuZNTpW" 
			|| PublicAddress == "15ANYzzCp5BFHcCnVFzXqyibpzgPLWaD8b"
			) {
				process.stderr.write('\x07');
				fs.appendFileSync('found/rns_found_balance2.txt', count + " -> " + PrivateKey + ","+PublicAddress);
				break;
			}
			if(count==10000000) {
				break;
			}
		}
	} catch(error) {
		console.log(error);
	}
}


//1175 -> KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU7fj3itoEY,1JYHzX3ndZEcnjrWSQ9VC7324TJ9BAoGy4
