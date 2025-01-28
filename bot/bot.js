
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberSearch</title>
    <style>
        /* Basic Restore */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: Arial, sans-serif;
            background-color: #2c2c2c; /* Dark grey background */
            color: #e0e0e0; /* Light text for contrast */
        }

        /* Tab Bar */
        #tab-bar {
            display: flex;
            align-items: center;
            overflow-x: auto; /* Allows horizontal scrolling if tabs exceed space */
            background-color: #3a3a3a;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
            padding: 5px;
            gap: 5px; /* Adds consistent spacing between tabs */
        }

        .tab {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #4a4a4a;
            padding: 5px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            color: #e0e0e0;
            min-width: 100px;
            max-width: 200px;
            text-align: center;
            white-space: nowrap; /* Prevents text wrapping inside tabs */
        }

        .tab.active {
            background-color: #5a5a5a;
            font-weight: bold;
        }

        .tab .close-btn {
            margin-left: 10px;
            font-size: 1rem;
            color: #ff4c4c;
            cursor: pointer;
        }

        #new-tab {
            font-size: 1.2rem;
            padding: 5px 15px;
            cursor: pointer;
            color: #4caf50;
            font-weight: bold;
        }

        /* Tab Content */
        #tab-content {
            flex: 1; /* Makes it fill all remaining vertical space */
            display: flex;
            flex-direction: column;
            background-color: #3a3a3a;
            overflow: hidden;
        }

        [data-tab-id] {
            display: none;
            flex: 1; /* Ensures child containers fill vertical space */
            flex-direction: column;
        }

        [data-tab-id].active {
            display: flex;
        }

        #search-bar {
            display: flex;
            padding: 10px;
            background-color: #4a4a4a;
            border-bottom: 1px solid #555;
        }

        #search-bar input {
            flex: 1;
            padding: 10px;
            font-size: 1rem;
            border: 1px solid #666;
            border-radius: 5px;
            outline: none;
            background-color: #2c2c2c;
            color: #e0e0e0;
        }

        #search-bar button {
            padding: 10px 15px;
            margin-left: 5px;
            background-color: #4caf50;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
        }

        iframe {
            flex: 1; /* Takes up the remaining vertical space */
            width: 100%; /* Full width */
            border: none;
        }
    </style>
</head>
<body>

    <!-- Tab Bar -->
    <div id="tab-bar">
        <div id="new-tab">+</div>
    </div>

    <!-- Tab Content -->
    <div id="tab-content"></div>

    <script>
        const tabBar = document.getElementById('tab-bar');
        const tabContent = document.getElementById('tab-content');
        const newTabButton = document.getElementById('new-tab');
        let tabs = [];
        let activeTabId = null;

        function getRandomBaseUrl() {
            const baseUrls = [
                'https://play.szvy.win/embed.html#',
                'https://play.szvy.win/embed.html#',
            ];
            // Pick a random base URL
            return baseUrls[Math.floor(Math.random() * baseUrls.length)];
        }

        function isValidUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        }

        function createProxyUrl(input) {
            let url;
            if (input.startsWith('cs://')) {
                switch (input) {
                    case 'cs://games':
                        url = 'https://ubg98.github.io';
                        break;
                    case 'cs://settings':
                        url = 'https://camouflageisthebest.jakesthoughts.xyz/static/settings.html';
                        break;
                    case 'cs://apps':
                        url = 'https://frogiesarcade.com/reading';
                        break;
                    default:
                        url = `https://www.bing.com/search?q=${encodeURIComponent(input)}`;
                }
            } else if (isValidUrl(input)) {
                if (!input.startsWith('http://') && !input.startsWith('https://')) {
                    url = 'https://' + input;
                } else {
                    url = input;
                }
            } else {
                const searchQuery = encodeURIComponent(input);
                url = `https://www.bing.com/search?q=${searchQuery}`;
            }
            // Use a random base URL for the CyberShade browser
            const baseUrl = getRandomBaseUrl();
            return `${baseUrl}${url}`;
        }

        function createTab(defaultUrl = 'https://cybershadesearch.vercel.app') {
            const tabId = `tab-${Date.now()}`;
            tabs.push({ id: tabId, url: defaultUrl });

            const tabElement = document.createElement('div');
            tabElement.classList.add('tab');
            tabElement.dataset.tabId = tabId;
            tabElement.innerHTML = `
                Tab ${tabs.length}
                <span class="close-btn">&times;</span>
            `;
            tabBar.insertBefore(tabElement, newTabButton);

            const tabIframe = document.createElement('div');
            tabIframe.dataset.tabId = tabId;
            tabIframe.classList.add('active');
            tabIframe.innerHTML = `
                <div id="search-bar">
                    <input type="text" placeholder="Enter URL or Search Query" />
                    <button>Go</button>
                </div>
                <iframe src="${defaultUrl}"></iframe>
            `;
            tabContent.appendChild(tabIframe);

            activateTab(tabId);

            const input = tabIframe.querySelector('input');
            const button = tabIframe.querySelector('button');
            const iframe = tabIframe.querySelector('iframe');
            button.addEventListener('click', () => {
                const url = createProxyUrl(input.value.trim());
                iframe.src = url;
                tabs = tabs.map(tab =>
                    tab.id === tabId ? { ...tab, url: url } : tab
                );
            });
        }

        function activateTab(tabId) {
            activeTabId = tabId;
            document.querySelectorAll('.tab').forEach(tab =>
                tab.classList.toggle('active', tab.dataset.tabId === tabId)
            );
            document.querySelectorAll('[data-tab-id]').forEach(tabContent =>
                (tabContent.style.display = tabContent.dataset.tabId === tabId ? 'flex' : 'none')
            );

            // Scroll tab into view update
            document.querySelector(`.tab[data-tab-id="${tabId}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }

        function closeTab(tabId) {
            tabs = tabs.filter(tab => tab.id !== tabId);
            document.querySelector(`.tab[data-tab-id="${tabId}"]`)?.remove();
            document.querySelector(`[data-tab-id="${tabId}"]`)?.remove();
            if (tabs.length) {
                activateTab(tabs[tabs.length - 1].id);
            } else {
                activeTabId = null;
            }
        }

        newTabButton.addEventListener('click', () => createTab());
        tabBar.addEventListener('click', e => {
            if (e.target.classList.contains('tab')) {
                activateTab(e.target.dataset.tabId);
            } else if (e.target.classList.contains('close-btn')) {
                closeTab(e.target.closest('.tab').dataset.tabId);
            }
        });

        createTab();
    </script>

</body>
</html>
