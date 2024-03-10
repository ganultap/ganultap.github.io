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
                        <button type="button" class="btn btn-secondary" id="save">Save Logs</button>
                        <button class="btn btn-info" id="downloadPdf">Export as PDF</button>
                    </form>
                    <canvas id="pingChart" style="width: 100%; height: 400px;"></canvas>
                    <div id="logs" class="log-container"></div>
                </div>
            </div>
        </div>
    </header>
    <script src="https://cdn.jsdelivr.net/npm/date-fns@2.21.3/dist/date-fns.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@2.0.0/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-adapter-moment/1.0.0/chartjs-adapter-moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/0.5.7/chartjs-plugin-annotation.min.js"></script>
        <script src="script.js"></script>
        </div>
    </div>
</body>
<footer id="statusMessageFooter">
</footer>

</html>
