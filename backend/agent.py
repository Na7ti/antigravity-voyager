import asyncio
from playwright.async_api import async_playwright

class TravelAgent:
    def __init__(self):
        self.browser = None
        self.context = None
        self.page = None

    async def start(self):
        self.playwright = await async_playwright().start()
        # Launch chromium in headless mode (sandbox disabled for docker reliability in some envs, 
        # but since we're in a proper container, standard launch usually works. 
        # Adding args just in case for stability inside container)
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        self.context = await self.browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        )
        self.page = await self.context.new_page()

    async def stop(self):
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def search_general(self, query: str):
        """
        Performs a Yahoo Japan search and returns top results.
        """
        if not self.page:
            await self.start()
        
        try:
            # Go to Yahoo JP
            await self.page.goto(f'https://search.yahoo.co.jp/search?p={query}')
            await self.page.wait_for_load_state('networkidle')

            # Extract search results
            results = await self.page.evaluate('''() => {
                const items = document.querySelectorAll('.sw-Card');
                const data = [];
                items.forEach(item => {
                    const titleEl = item.querySelector('.sw-Card__title > a');
                    const snippetEl = item.querySelector('.sw-Card__summary');
                    
                    if (titleEl) {
                        data.push({
                            title: titleEl.innerText,
                            link: titleEl.href,
                            snippet: snippetEl ? snippetEl.innerText : ''
                        });
                    }
                });
                return data.slice(0, 3); // Return top 3
            }''')
            
            return results
        except Exception as e:
            print(f"Error during search: {e}")
            # Attempt to restart browser on error
            await self.stop()
            await self.start()
            return [{"title": "Error", "snippet": str(e), "link": ""}]

travel_agent = TravelAgent()
