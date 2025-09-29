/**
 * Reference to the DOM element where MIDI data will be displayed.
 * @type {HTMLElement}
 */
const midiDataDiv = document.getElementById('midiData');

/**
 * Formats a MIDI byte into binary, decimal, and hexadecimal representations.
 * @param {number} byte - The MIDI byte to format.
 * @returns {string} The formatted string with binary, decimal, and hexadecimal values.
 */
const formatBin = function (dataIn) {
    // Convert the byte to binary, decimal, and hexadecimal formats for display

    // return byte.toString(2).padStart(8, '0')}  Dec: ${byte}  Hex: 0x${byte.toString(16).toUpperCase().padStart(2, '0')}`;
    return dataIn.toString(2).padStart(8, '0')
};



const formatHex = function (dataIn) {

    return dataIn.toString(16).toUpperCase().padStart(2, '0')
};

/**
 * Handles incoming MIDI messages and displays formatted data.
 * @param {MIDIMessageEvent} event - The MIDI message event containing data.
 */
const onMIDIMessage = function (event) {
    // Start building the output string with a timestamp
    let output = `MIDI Message (timestamp ${event.timeStamp.toFixed(2)}):\n`;
    let msgArray = Array(3);
    // Iterate through each byte of MIDI data and format it
    event.data.forEach(byte => {
        msgArray.push(byte)
    });
    output = `
        <table>
        <tr>
           <th>Binary</th>
            <th>Decimal</th>
            <th>Hexadecimal</th>
        </tr>
        <tr>
            <td>${formatBin(event.data[0])} ${formatBin(event.data[1])} ${formatBin(event.data[2])}</td>
            <td>${event.data[0]} ${event.data[1]} ${event.data[2]}</td>
            <td>${formatHex(event.data[0])} ${formatHex(event.data[1])} ${formatHex(event.data[2])}</td>
            
        </tr>
        
        </table>
    `

    // Update the text content of the display div with the formatted data
    midiDataDiv.innerHTML = output;
};

/**
 * Called when MIDI access is successfully obtained.
 * Attaches the MIDI message handler to all available MIDI inputs.
 * @param {MIDIAccess} midiAccess - The MIDI access object.
 */
const onMIDISuccess = function (midiAccess) {
    // Loop through all available MIDI input devices
    for (let input of midiAccess.inputs.values()) {
        // Assign the onMIDIMessage function as the handler for incoming MIDI messages
        input.onmidimessage = onMIDIMessage;
    }
};

/**
 * Called if accessing MIDI devices fails.
 * Displays an error message.
 */
const onMIDIFailure = function () {
    // Notify the user that MIDI access failed
    midiDataDiv.innerHTML = `<p>Failed to access MIDI devices.</p>`;
};

// Request access to MIDI devices from the browser's Web MIDI API
navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);