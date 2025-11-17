<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts (opsional) -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- ROUTES -->
        @routes

        <!-- VITE ASSETS -->
                <!-- VITE ASSETS -->
        @env('local')
            @viteReactRefresh
            @vite([
                'resources/css/app.css',      
                'resources/js/app.tsx'        
            ])
        @endenv
        
        @production
            @vite([
                'resources/css/app.css',      
                'resources/js/app.tsx'        
            ])
        @endproduction


        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-gray-50">
        @inertia
    </body>
</html>
