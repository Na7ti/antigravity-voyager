import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        print("Launching browser for screenshot...")
        # Frontend is available at http://frontend:3000 inside the docker network
        url = "http://frontend:3000"
        
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
        page = await browser.new_page()
        
        print(f"Navigating to {url}...")
        await page.goto(url)
        await page.wait_for_load_state('networkidle')
        
        # Take screenshot
        output_path = "screenshot.png"
        await page.screenshot(path=output_path)
        print(f"Screenshot saved to {output_path}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
