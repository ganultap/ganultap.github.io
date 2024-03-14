document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pingForm');
    const resumeBtn = document.getElementById('resume');
    const pauseBtn = document.getElementById('pause');
    const clearBtn = document.getElementById('clear');
    const hostnameInput = document.getElementById('hostnameIp');
    const logsContainer = document.getElementById('logs');
    const pingChartCanvas = document.getElementById('pingChart');
    let pingingHosts = {};
    const pingChart = new Chart(pingChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: [/* Array of labels for each data point */],
            datasets: [{
                label: 'Ping Time (ms)',
                data: [/* Array of data points */],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Ping Time (ms)'
                    }
                },
                x: {
                    type: 'time', // Define the x-axis type as 'time'
                    time: {
                        // Define how to display the time
                        parser: 'HH:mm:ss', // Specify the format time data is given to the chart
                        tooltipFormat: 'll HH:mm',
                        unit: 'second', // Change this depending on the granularity of your time data
                        displayFormats: {
                            second: 'HH:mm:ss',
                            minute: 'HH:mm',
                            hour: 'HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    ticks: {
                        // Define how to format the ticks on the x-axis
                        source: 'auto', // 'auto' or 'data'
                        autoSkip: true,
                        maxRotation: 0,
                        sampleSize: 100
                    }
                }
            }
        }
    });
    
    hostnameInput.addEventListener('keyup', function (e) {
        if (e.key === "Enter") {
            // Prevent the form from submitting if you are using the keyup to add hosts
            e.preventDefault(); 
            const hostname = e.target.value.trim();
            if (hostname && !pingingHosts[hostname]) {
                addHost(hostname);
                e.target.value = ''; // Clear the input field after adding
            }
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const hostname = hostnameInput.value.trim();
        if (hostname && !pingingHosts[hostname]) {
            addHost(hostname);
            hostnameInput.value = ''; // Clear the input field after adding
        }
    });

    function addHost(hostname) {
        // Additional helper functions like getRandomColor(), createLogBox(), addLogEntry(), and parsePingTime()
        // should be defined to make this work.

        const color = getRandomColor(); // This should be the same function you use for the chart color

        const logBox = createLogBox(hostname, color);
        logsContainer.appendChild(logBox);
    
        const dataset = {
            label: hostname,
            data: [],
            borderColor: color, // Use the same color for the graph line
            tension: 0.1,
            fill: false,
        };
        pingChart.data.datasets.push(dataset);
        pingingHosts[hostname] = { logBox, data: dataset.data, color, intervalId: null };
        startPinging(hostname);
    }

    function addFailedPingLog(hostname, message) {
        const logBoxes = document.querySelectorAll(`.log-box[data-hostname="${hostname}"]`);
        logBoxes.forEach(logBox => {
            const logEntriesDiv = logBox.querySelector('.log-entries');
            if (logEntriesDiv) {
                const newLogEntry = document.createElement('div');
                newLogEntry.textContent = message;
                // Add the new log entry to the log entries div at the beginning
                if (logEntriesDiv.children.length >= 5) {
                    // If there are already 10 entries, remove the oldest one before adding a new one
                    logEntriesDiv.removeChild(logEntriesDiv.lastChild);
                }
                logEntriesDiv.insertBefore(newLogEntry, logEntriesDiv.firstChild);
            }
        });
    }
    
    function startPinging(hostname) {
        if (pingingHosts[hostname] && pingingHosts[hostname].intervalId) {
            console.log(`Pinging for ${hostname} is already running.`);
            return; // Exit the function to prevent restarting the pinging
        }
        const host = pingingHosts[hostname];
        host.intervalId = setInterval(async () => {
            const response = await fetch('ping.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `hostnameIp=${hostname}`
            });
    
            if (!response.ok) {
                addLogEntry(host.logBox, `Error pinging ${hostname}`);
                return;
            }

    
            const result = await response.json();
            // If there's a valid ping time, log it
            if (result.status && result.time !== "Request timed out") {
                handleSuccessfulPing(hostname)
                const pingTime = parseFloat(result.time);
                // Assuming host.data is an array of data points for the chart
                host.data.push({ x: new Date(), y: pingTime });
                pingChart.update(); // Assuming pingChart is your Chart.js instance
                addLogEntry(host.logBox, `${new Date().toLocaleTimeString()}: ${pingTime} ms`);
                
            } else {
                handleFailedPing(hostname);
                // Add a log entry for the failed ping
                const failedMessage = `Timed out at ${new Date().toLocaleTimeString()}`;
                addFailedPingLog(hostname, failedMessage);
            }
        }, 1000); // Adjust interval as needed
        updateStatusMessage();
        updatePingStatus(hostname, true);
    }
    
    
    resumeBtn.addEventListener('click', function () {
        Object.keys(pingingHosts).forEach(hostname => {
            if (!pingingHosts[hostname].intervalId) { // Check if pinging is paused
                startPinging(hostname); // Restart pinging for this host
            }
        });
    });

    pauseBtn.addEventListener('click', function () {
        Object.keys(pingingHosts).forEach(hostname => {
            if (pingingHosts[hostname].intervalId) {
                clearInterval(pingingHosts[hostname].intervalId);
                pingingHosts[hostname].intervalId = null; // Ensure the interval ID is cleared
            }
        });
        updateStatusMessage(); // Reflect the status change
    });


    function getRandomColor() {
        const r = Math.floor(Math.random() * 256); // Random between 0-255
        const g = Math.floor(Math.random() * 256); // Random between 0-255
        const b = Math.floor(Math.random() * 256); // Random between 0-255
        return `rgb(${r},${g},${b})`; // Concatenate r, g, b
    }

    function createLogBox(hostname, color) {
        const logBox = document.createElement('div');
        logBox.classList.add('log-box');
        logBox.setAttribute('data-hostname', hostname);
    
        const logHeader = document.createElement('div');
        logHeader.className = 'log-header';
    
        const logTitleButton = document.createElement('button');
        logTitleButton.className = 'btn';
        logTitleButton.style.backgroundColor = color;
        logTitleButton.style.color = isColorDark(color) ? 'white' : 'black';
        logTitleButton.textContent = hostname;
        logHeader.appendChild(logTitleButton); // Append to logHeader
    
        // Add other buttons to logHeader, such as successPingCounterBtn and failedPingCounterBtn
    
        const successPingCounterBtn = document.createElement('button');
        successPingCounterBtn.className = 'btn btn-success success-ping-counter';
        const wifiIcon = document.createElement('i');
        wifiIcon.className = 'bi bi-wifi';
        successPingCounterBtn.appendChild(wifiIcon);
        const successCounterText = document.createTextNode(' 0');
        successPingCounterBtn.appendChild(successCounterText);
        successPingCounterBtn.setAttribute('title', 'Number of successful pings');
        logHeader.appendChild(successPingCounterBtn); // Append to logHeader
    
        const failedPingCounterBtn = document.createElement('button');
        failedPingCounterBtn.className = 'btn btn-danger failed-ping-counter';
        const wifiOffIcon = document.createElement('i');
        wifiOffIcon.className = 'bi bi-wifi-off';
        failedPingCounterBtn.appendChild(wifiOffIcon);
        const counterText = document.createTextNode(' 0');
        failedPingCounterBtn.appendChild(counterText);
        failedPingCounterBtn.setAttribute('title', 'Number of failed pings');
        logHeader.appendChild(failedPingCounterBtn); // Append to logHeader
    
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-btn', 'btn', 'btn-outline-danger');
        const icon = document.createElement('i');
        icon.className = 'bi bi-trash-fill';
        removeBtn.appendChild(icon);
        removeBtn.addEventListener('click', function() {
            removeHost(hostname);
        });
        removeBtn.setAttribute('title', 'Remove this host');
        logHeader.appendChild(removeBtn); // Append to logHeader
    
        logBox.appendChild(logHeader); // Append logHeader to logBox
    
        const logEntries = document.createElement('div');
        logEntries.className = 'log-entries';
        logBox.appendChild(logEntries); // Append logEntries to logBox
    
        return logBox;
    }
    

    function handleSuccessfulPing(hostname) {
        const logBox = document.querySelector(`.log-box[data-hostname="${hostname}"]`);
        if (logBox) {
            const successPingCounterBtn = logBox.querySelector('.success-ping-counter');
            if (successPingCounterBtn) {
                const counterTextNode = successPingCounterBtn.lastChild;
                let successCount = parseInt(counterTextNode.nodeValue.trim(), 10);
                counterTextNode.nodeValue = ` ${++successCount}`;
            }
        }
    }
    
    function updatePingStatus(hostname, isSuccess) {
        const logBox = document.querySelector(`.log-box[data-hostname="${hostname}"]`);
        if (logBox) {
            const failedPingCounterBtn = logBox.querySelector('.failed-ping-counter');
            if (failedPingCounterBtn) {
                // Clear existing classes and set new ones based on ping success
                failedPingCounterBtn.classList.remove('btn-warning', 'btn-success'); // Remove both to reset state
    
                if (isSuccess) {
                    failedPingCounterBtn.classList.add('btn-success');
                    // Update icon to indicate success, e.g., change to 'bi-wifi' for success
                    failedPingCounterBtn.querySelector('.bi').className = 'bi bi-wifi';
                    failedPingCounterBtn.title = 'IP is up'; // Update title to reflect current state
                } else {
                    failedPingCounterBtn.classList.add('btn-warning');
                    // If you have a specific icon for failure, update it here
                    failedPingCounterBtn.querySelector('.bi').className = 'bi bi-wifi-off';
                    failedPingCounterBtn.title = 'Number of failed pings'; // Update title to reflect failure
                }
            }
        }
    }
    
    
    function handleFailedPing(hostname, isSuccess) {
    const logBox = document.querySelector(`.log-box[data-hostname="${hostname}"]`);
    if (logBox) {
        const failedPingCounterBtn = logBox.querySelector('.failed-ping-counter');
        if (failedPingCounterBtn) {
            // Change button color based on ping success or failure
            failedPingCounterBtn.className = isSuccess ? 'btn btn-success failed-ping-counter' : 'btn btn-danger failed-ping-counter';
            
            // Update failed ping count for failures
            if (!isSuccess) {
                const counterTextNode = failedPingCounterBtn.lastChild;
                let failedCount = parseInt(counterTextNode.nodeValue.trim(), 10);
                counterTextNode.nodeValue = ` ${++failedCount}`;
            }
        }

        const host = pingingHosts[hostname];
        if (!isSuccess && host) {
            // Add a point with a specific value to indicate the IP is down
            host.data.push({ x: new Date(), y: -1 });
            pingChart.update(); // Update the chart
        }

        updatePingStatus(hostname, false);
    }
}

    // Utility function to determine if the color is dark
    function isColorDark(color) {
        // Assuming color is in the format "#rrggbb"
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128; // Brightness threshold, below which color is considered dark
    }
        // Add this new function to remove a host
        function removeHost(hostname) {
            // Stop pinging if necessary
            if (pingingHosts[hostname] && pingingHosts[hostname].intervalId) {
                clearInterval(pingingHosts[hostname].intervalId);
            }
            
            // Remove the host from the pingingHosts object
            delete pingingHosts[hostname];
        
            // Update the chart if necessary
            pingChart.data.datasets = pingChart.data.datasets.filter(dataset => dataset.label !== hostname);
            pingChart.update();
        
            // Remove the log box from the DOM
            const logBox = document.querySelector(`.log-box[data-hostname="${hostname}"]`);
            if (logBox) {
                logBox.remove();
            }
        
            // Update the status message or any other UI elements if necessary
            updateStatusMessage();
        }
        

    // Function to update the status message
    function updateStatusMessage() {
        const statusMessage = document.getElementById('statusMessage');
        const activeHosts = Object.values(pingingHosts).filter(host => host.intervalId !== null).length;
        if (activeHosts > 0) {
            statusMessage.textContent = "Status: Pinging";
            statusMessage.style.backgroundColor = "lightgreen"; // Set the background to light green
        } else {
            statusMessage.textContent = "Status: Paused";
            statusMessage.style.backgroundColor = "lightcoral"; // Set the background to light red
        }
    }
    

    const statusDiv = document.createElement('div');
    statusDiv.id = 'statusMessage';
    statusDiv.textContent = "Status: Paused"; // Default message
    document.body.appendChild(statusDiv); // Append it to body or another container element

    clearBtn.addEventListener('click', function () {
        const password = prompt("Please enter the password to clear:");
        if (password === "0000") {
            // Assuming '0000' is the correct password.
            // Clear all data and intervals only if the password is correct
            pingChart.data.labels.length = 0;
            pingChart.data.datasets.length = 0;
            pingChart.update();
            logsContainer.innerHTML = '';
            Object.keys(pingingHosts).forEach(hostname => {
                clearInterval(pingingHosts[hostname].intervalId);
            });
            pingingHosts = {};
            updateStatusMessage(); // Update the status message to reflect the changes
        } else if (password) {
            // Only show the alert if the password was entered but is incorrect.
            alert("Incorrect password. Pinging will continue.");
        }
        // If the prompt was cancelled (password is null), pinging will continue automatically.
    });
    
    

    function addLogEntry(logBox, message) {
        // Create a new log entry div
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        entry.textContent = message;
    
        // Get the log entries container
        const entriesContainer = logBox.querySelector('.log-entries');
    
        // Append the new entry to the container
        if (entriesContainer) {
            // Add the new log entry to the log entries div
            entriesContainer.appendChild(entry);
    
            // If there are already 10 entries, remove the oldest one
            while (entriesContainer.children.length > 5) {
                entriesContainer.removeChild(entriesContainer.firstChild);
            }
    
            // Scroll to the new entry
            entriesContainer.scrollTop = entriesContainer.scrollHeight;
        }
    }
    

    
    function parsePingTime(pingOutput) {
        // Check for "Request timed out" message
        if (pingOutput.includes("Request timed out")) {
            console.error('Ping request timed out');
            return "Request timed out";
        }
    
        // This assumes the ping output includes a line like "time=xx ms"
        const match = pingOutput.match(/time=(\d+\.?\d*)\s*ms/);
        if (match && match[1]) {
            return parseFloat(match[1]);
        } else {
            // Log the pingOutput to the console for debugging
            console.error('Failed to parse ping time:', pingOutput);
            return null;
        }
    }
       

});

document.getElementById('downloadPdf').addEventListener('click', function () {
    html2canvas(document.body, {
        scrollY: -window.scrollY, // Adjust for any page scrolling
        scale: 1 // You can adjust the scale for better resolution
    }).then(canvas => {
        // Get the canvas data as an image
        const imageData = canvas.toDataURL('image/png');

        // Determine the current date and time
        const currentDateTime = moment().format('YYYY-MM-DD-HH-mm');

        // Initialize jsPDF in landscape orientation ('l'), and match the size to the canvas
        const pdf = new jspdf.jsPDF({
            orientation: 'l', // 'l' for landscape
            unit: 'px',
            format: [canvas.height, canvas.width] // Use canvas dimensions for PDF size
        });

        // Add the canvas image to the PDF. The image can be scaled to fit the page.
        pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height);

        // Save the PDF with the specified file name
        pdf.save(`ping_result_for_${currentDateTime}.pdf`);
    });
});

document.getElementById('downloadGraph').addEventListener('click', function () {
    // Get the graph canvas
    const graphCanvas = document.getElementById('pingChart');

    // Create a clone of the canvas with Chart.js
    const cloneCanvas = document.createElement('canvas');
    cloneCanvas.width = graphCanvas.width;
    cloneCanvas.height = graphCanvas.height;
    const cloneCtx = cloneCanvas.getContext('2d');

    // Render the chart onto the clone canvas
    new Chart(cloneCtx, {
        type: 'line',
        data: pingChart.config.data,
        options: pingChart.config.options
    });

    // Add the clone canvas to the document body
    document.body.appendChild(cloneCanvas);

    // Create a screenshot of the entire graph area including the tooltips
    html2canvas(cloneCanvas, {
        scrollX: 0,
        scrollY: 0,
        width: cloneCanvas.width,
        height: cloneCanvas.height,
        allowTaint: true,
        useCORS: true,
        backgroundColor: null // Set to 'null' to ensure transparency
    }).then(canvas => {
        // Get the canvas data as an image
        const imageData = canvas.toDataURL('image/png');

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'graph_with_details.png'; // Set the file name

        // Simulate a click on the link to trigger the download
        link.click();

        // Remove the clone canvas from the document body
        document.body.removeChild(cloneCanvas);
    });
});
