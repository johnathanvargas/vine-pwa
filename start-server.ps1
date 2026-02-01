# Simple PowerShell HTTP Server for Testing PWA
# Run this script to test the app locally

$port = 8000
$url = "http://localhost:$port"

Write-Host "Starting web server on $url" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("$url/")
$listener.Start()

Write-Host "Server started! Open your browser to:" -ForegroundColor Green
Write-Host "  $url" -ForegroundColor Cyan
Write-Host ""

# Open browser automatically
Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested file path
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        $filePath = Join-Path $PSScriptRoot $path.TrimStart('/')
        
        # Determine content type
        $contentType = "text/html"
        if ($path -match "\.js$") { $contentType = "application/javascript" }
        elseif ($path -match "\.css$") { $contentType = "text/css" }
        elseif ($path -match "\.json$") { $contentType = "application/json" }
        elseif ($path -match "\.png$") { $contentType = "image/png" }
        
        # Serve file
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "200 $($request.HttpMethod) $path" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            Write-Host "404 $($request.HttpMethod) $path" -ForegroundColor Red
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped" -ForegroundColor Yellow
}
