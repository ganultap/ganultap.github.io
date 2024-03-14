<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ping Tool with Live Graph</title>
    <link rel="shortcut icon" href="../images/dpwh_logo.png" type="image/x-icon">
    <link href="../bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../bootstrap-icons/font/bootstrap-icons.min.css">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Poppins">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container-fluid">
            <div class="container-fluid card mt-2 mb-5">
                <div class="card-header text-center">
                    <h1>PING TOOL</h1>
                </div>
                <div class="card-body">
                    <form id="pingForm" class="input-group mb-3">
                    <input type="text" class="form-control" id="hostnameIp" placeholder="Hostname/IP" aria-label="Hostname or IP address">
                        <button type="submit" class="btn btn-primary" aria-label="Add Host">Add Host</button>
                        <button type="button" class="btn btn-success" id="resume">Resume</button>
                        <button type="button" class="btn btn-warning" id="pause">Pause</button>
                        <button type="button" class="btn btn-danger" id="clear">Clear</button>
                        <button class="btn btn-info" id="downloadPdf">Export as PDF</button>
                        <button class="btn btn-secondary" id="downloadGraph">Export Graph</button>

                    </form>
                    <canvas id="pingChart" style="width: 100%; height: 400px;"></canvas>
                    <div id="logs" class="log-container"></div>
                </div>
            </div>
        </div>
    </header>
    <script src="chartjs-adapter-date-fns.bundle.min.js"></script>
    <script src="chart.js"></script>
    <script src="html2canvas.min.js"></script>
    <script src="jspdf.umd.min.js"></script>
    <script src="moment.min.js"></script>
    <script src="chartjs-adapter-moment.min.js"></script>
    <script src="chartjs-plugin-annotation.min.js"></script>
        <script src="script.js"></script>
        <script>
            // Add the "Download Graph" button functionality
            document.getElementById('downloadGraph').addEventListener('click', function () {
                // Get the Chart.js instance of the pingChart canvas
                const chartInstance = Chart.getChart('pingChart');

                // Export the chart as an image
                const imageData = chartInstance.toBase64Image();

                // Create a temporary anchor element
                const anchor = document.createElement('a');

                // Get the current date and time
                const now = new Date();
                const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                // Set the download filename
                anchor.download = `graph_for_${formattedDate}.png`;

                // Set the image URL to the chart image data
                anchor.href = imageData;

                // Simulate a click on the anchor element to trigger the download
                anchor.click();
            });
        </script>
        </div>
    </div>
</body>
<footer id="statusMessageFooter">
</footer>

</html>
